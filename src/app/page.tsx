import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export const instant = false

export default async function Home() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role === 'superadmin') {
    redirect('/superadmin/dashboard')
  } else if (profile?.role === 'branch_admin') {
    redirect('/branch/dashboard')
  } else if (profile?.role === 'cashier') {
    redirect('/cashier/pos')
  }

  // Fallback if role is not found or invalid
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 text-center p-4">
      <div>
        <h1 className="text-2xl font-bold mb-2">Akses Ditolak</h1>
        <p className="text-gray-600 mb-4">Anda belum memiliki role yang valid di sistem ini.</p>
        <form action="/auth/signout" method="post">
          <button type="submit" className="text-blue-500 hover:underline">Keluar</button>
        </form>
      </div>
    </div>
  )
}
