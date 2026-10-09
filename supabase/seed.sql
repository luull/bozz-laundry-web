-- Seed Data for Bozz Laundry

-- 1. Create a Superadmin Profile (Note: auth user must be created in Auth UI first)
-- You must manually link the ID from auth.users to this profile.
-- We'll just define the services for now.

-- 2. Insert Default Services
INSERT INTO services (code, name, unit_type, default_price, estimation_hours, description) VALUES
('CK-01', 'Cuci Kering', 'kg', 6000, 24, 'Cuci dan keringkan saja tanpa setrika'),
('CS-01', 'Cuci Setrika', 'kg', 8000, 48, 'Cuci, kering, dan setrika rapi'),
('ST-01', 'Setrika Saja', 'kg', 5000, 24, 'Hanya setrika pakaian bersih'),
('EXP-01', 'Express 6 Jam', 'kg', 15000, 6, 'Selesai dalam 6 jam (cuci setrika)'),
('SPT-01', 'Laundry Sepatu', 'item', 35000, 72, 'Cuci sepatu bersih mendalam'),
('BC-01', 'Bed Cover Besar', 'item', 25000, 48, 'Cuci bed cover ukuran queen/king')
ON CONFLICT (code) DO NOTHING;

-- 3. Insert Expense Categories
INSERT INTO expense_categories (name) VALUES
('Listrik & Air'),
('Deterjen & Pewangi'),
('Gaji Karyawan'),
('Internet & Telepon'),
('Perbaikan Mesin'),
('Lain-lain');

-- Note: Branches, Customers, and Branch_Services should be added via the application UI 
-- or after setting up the superadmin auth account.
