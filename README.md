# Bozz Laundry - Multi-Branch Management System

## Prerequisites

1. Node.js (v18+)
2. Akun Supabase (untuk database dan authentication)

## Instalasi

1. Install dependencies:
   ```bash
   npm install
   ```

2. Setup Environment Variables:
   Copy `.env.local.example` menjadi `.env.local` dan isi nilai dari project Supabase Anda.
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

3. Setup Supabase:
   - Buat project baru di Supabase.
   - Buka SQL Editor di Supabase Dashboard.
   - Jalankan script `supabase/migrations/20261009000000_init.sql` untuk membuat tabel.
   - Jalankan script `supabase/migrations/20261009000001_rls_policies.sql` untuk membuat aturan RLS.
   - Jalankan script `supabase/migrations/20261009000002_functions_triggers.sql` untuk membuat fungsi transaksi.
   - Jalankan script `supabase/seed.sql` untuk memasukkan data awal.

4. Setup Superadmin Pertama:
   - Buka menu Authentication > Users di Supabase, dan tambahkan user baru.
   - Ambil User UID dari dashboard.
   - Buka SQL Editor dan jalankan:
     ```sql
     INSERT INTO profiles (id, role, full_name, phone) 
     VALUES ('USER_UID_DISINI', 'superadmin', 'Nama Superadmin', '08123456789');
     ```

5. Jalankan aplikasi:
   ```bash
   npm run dev
   ```

## Struktur Aplikasi

Aplikasi memiliki 3 dashboard berbeda:
- `/superadmin/dashboard`
- `/branch/dashboard`
- `/cashier/pos`

Sistem otomatis mengarahkan (redirect) pengguna berdasarkan peran (role) yang tersimpan di tabel `profiles`.
