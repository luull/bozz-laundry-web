-- Supabase RLS Policies for Bozz Laundry

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE branch_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE branch_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE cashier_shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Utility Function to get user's global role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- Utility Function to check if user belongs to a branch
CREATE OR REPLACE FUNCTION user_in_branch(check_branch_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM branch_memberships 
    WHERE user_id = auth.uid() AND branch_id = check_branch_id
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- 1. Profiles
-- Everyone can read their own profile
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);
-- Superadmin can view all profiles
CREATE POLICY "Superadmin can view all profiles" ON profiles
    FOR SELECT USING (get_user_role() = 'superadmin');
-- Users can update their own non-role fields (handled via RPC or specific triggers if needed, but for now simple update)
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- 2. Branches
-- Superadmin can do all
CREATE POLICY "Superadmin all branches" ON branches
    FOR ALL USING (get_user_role() = 'superadmin');
-- Others can only see branches they belong to
CREATE POLICY "Users view assigned branches" ON branches
    FOR SELECT USING (user_in_branch(id));

-- 3. Branch Memberships
-- Superadmin can do all
CREATE POLICY "Superadmin all memberships" ON branch_memberships
    FOR ALL USING (get_user_role() = 'superadmin');
-- Users can see memberships for branches they are in
CREATE POLICY "Users view memberships of their branches" ON branch_memberships
    FOR SELECT USING (user_in_branch(branch_id));

-- 4. Customers
-- Superadmin can do all
CREATE POLICY "Superadmin all customers" ON customers
    FOR ALL USING (get_user_role() = 'superadmin');
-- Branch admins & Cashiers can see all customers (or maybe limit by branch, but we allow cross-branch lookup by phone)
CREATE POLICY "Authenticated users can see active customers" ON customers
    FOR SELECT USING (auth.role() = 'authenticated');
-- Anyone authenticated can insert a customer
CREATE POLICY "Authenticated users can insert customers" ON customers
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
-- Only superadmin can update/delete for now (or branch admin)
CREATE POLICY "Superadmin update customers" ON customers
    FOR UPDATE USING (get_user_role() = 'superadmin');

-- 5. Services (Global)
-- Everyone can read
CREATE POLICY "Anyone can read active services" ON services
    FOR SELECT USING (is_active = TRUE OR get_user_role() = 'superadmin');
-- Only superadmin can manage
CREATE POLICY "Superadmin manage services" ON services
    FOR ALL USING (get_user_role() = 'superadmin');

-- 6. Branch Services
-- Superadmin can do all
CREATE POLICY "Superadmin manage branch services" ON branch_services
    FOR ALL USING (get_user_role() = 'superadmin');
-- Branch Admin can manage their own branch services
CREATE POLICY "Branch admin manage branch services" ON branch_services
    FOR ALL USING (
        user_in_branch(branch_id) 
        AND EXISTS (SELECT 1 FROM branch_memberships WHERE user_id = auth.uid() AND branch_id = branch_services.branch_id AND role = 'branch_admin')
    );
-- Cashiers can only read for their branch
CREATE POLICY "Cashiers read branch services" ON branch_services
    FOR SELECT USING (user_in_branch(branch_id));

-- 7. Orders
-- Superadmin can do all
CREATE POLICY "Superadmin all orders" ON orders
    FOR ALL USING (get_user_role() = 'superadmin');
-- Branch users can read, insert, update orders in their branch
CREATE POLICY "Branch users manage orders" ON orders
    FOR ALL USING (user_in_branch(branch_id));

-- 8. Order Items
-- Superadmin can do all
CREATE POLICY "Superadmin all order items" ON order_items
    FOR ALL USING (get_user_role() = 'superadmin');
-- Branch users can manage items for orders in their branch
CREATE POLICY "Branch users manage order items" ON order_items
    FOR ALL USING (
        EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND user_in_branch(orders.branch_id))
    );

-- 9. Payments
-- Superadmin can do all
CREATE POLICY "Superadmin all payments" ON payments
    FOR ALL USING (get_user_role() = 'superadmin');
-- Branch users can manage payments in their branch
CREATE POLICY "Branch users manage payments" ON payments
    FOR ALL USING (
        EXISTS (SELECT 1 FROM orders WHERE orders.id = payments.order_id AND user_in_branch(orders.branch_id))
    );

-- 10. Cashier Shifts
-- Superadmin can do all
CREATE POLICY "Superadmin all shifts" ON cashier_shifts
    FOR ALL USING (get_user_role() = 'superadmin');
-- Branch users can manage shifts in their branch
CREATE POLICY "Branch users manage shifts" ON cashier_shifts
    FOR ALL USING (user_in_branch(branch_id));

-- 11. Expenses
-- Superadmin can do all
CREATE POLICY "Superadmin all expenses" ON expenses
    FOR ALL USING (get_user_role() = 'superadmin');
-- Branch admins can manage expenses in their branch
CREATE POLICY "Branch admins manage expenses" ON expenses
    FOR ALL USING (
        user_in_branch(branch_id)
        AND EXISTS (SELECT 1 FROM branch_memberships WHERE user_id = auth.uid() AND branch_id = expenses.branch_id AND role = 'branch_admin')
    );
