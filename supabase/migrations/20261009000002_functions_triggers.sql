-- Supabase RPC Functions for Bozz Laundry

-- 1. Create Order Function (Atomic Transaction)
CREATE OR REPLACE FUNCTION create_new_order(
  p_branch_id UUID,
  p_customer_id UUID,
  p_notes TEXT,
  p_estimated_completion_date TIMESTAMPTZ,
  p_items JSONB, -- Array of {service_id, price_per_unit, quantity, unit_type, service_snapshot_name}
  p_payment_method payment_method,
  p_payment_amount NUMERIC
) RETURNS UUID AS $$
DECLARE
  v_cashier_id UUID := auth.uid();
  v_order_id UUID;
  v_invoice_number TEXT;
  v_subtotal NUMERIC := 0;
  v_discount NUMERIC := 0;
  v_total NUMERIC := 0;
  v_item JSONB;
  v_item_total NUMERIC;
BEGIN
  -- Generate Invoice Number (Format: INV-YYMMDD-XXXX)
  -- For simplicity in this SQL, we'll use a random hex or simple prefix + unix timestamp.
  -- A better approach in production is a sequence per branch.
  v_invoice_number := 'INV-' || to_char(NOW(), 'YYMMDD') || '-' || upper(substring(md5(random()::text) from 1 for 4));

  -- Verify user belongs to branch
  IF NOT user_in_branch(p_branch_id) AND get_user_role() != 'superadmin' THEN
    RAISE EXCEPTION 'User does not have access to this branch';
  END IF;

  -- Create Order Header first (with 0 totals)
  INSERT INTO orders (
    invoice_number, branch_id, customer_id, cashier_id, status, payment_status, 
    subtotal, discount, total, total_paid, estimated_completion_date, notes
  ) VALUES (
    v_invoice_number, p_branch_id, p_customer_id, v_cashier_id, 'received', 'unpaid',
    0, 0, 0, 0, p_estimated_completion_date, p_notes
  ) RETURNING id INTO v_order_id;

  -- Insert Items and calculate subtotal
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_item_total := (v_item->>'price_per_unit')::NUMERIC * (v_item->>'quantity')::NUMERIC;
    v_subtotal := v_subtotal + v_item_total;

    INSERT INTO order_items (
      order_id, service_id, service_snapshot_name, unit_type, price_per_unit, quantity, total_price
    ) VALUES (
      v_order_id, 
      (v_item->>'service_id')::UUID, 
      v_item->>'service_snapshot_name', 
      (v_item->>'unit_type')::service_unit_type, 
      (v_item->>'price_per_unit')::NUMERIC, 
      (v_item->>'quantity')::NUMERIC, 
      v_item_total
    );
  END LOOP;

  v_total := v_subtotal - v_discount;
  IF v_total < 0 THEN
    v_total := 0;
  END IF;

  -- Update Order Totals
  UPDATE orders SET subtotal = v_subtotal, total = v_total WHERE id = v_order_id;

  -- Handle Initial Payment if provided
  IF p_payment_amount > 0 THEN
    INSERT INTO payments (
      order_id, amount, payment_method, cashier_id
    ) VALUES (
      v_order_id, p_payment_amount, p_payment_method, v_cashier_id
    );

    -- Update Order Payment Status
    IF p_payment_amount >= v_total THEN
      UPDATE orders SET total_paid = p_payment_amount, payment_status = 'paid' WHERE id = v_order_id;
    ELSE
      UPDATE orders SET total_paid = p_payment_amount, payment_status = 'partially_paid' WHERE id = v_order_id;
    END IF;
  END IF;

  -- Record Status History
  INSERT INTO order_status_history (
    order_id, old_status, new_status, changed_by, notes
  ) VALUES (
    v_order_id, NULL, 'received', v_cashier_id, 'Order created'
  );

  RETURN v_order_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
