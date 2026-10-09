'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Shirt, ShoppingCart, List, Clock, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const cashierNavItems = [
  { title: 'POS Baru', href: '/cashier/pos', icon: <ShoppingCart className="h-5 w-5" /> },
  { title: 'Daftar Transaksi', href: '/cashier/transactions', icon: <List className="h-5 w-5" /> },
  { title: 'Shift Kasir', href: '/cashier/shifts', icon: <Clock className="h-5 w-5" /> },
]

export default function CashierLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-100">
      {/* Top Navbar for POS */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b bg-white px-6 shadow-sm z-10">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Shirt className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Bozz Laundry</h1>
            <p className="text-xs text-muted-foreground">POS Kasir - Cabang Utama</p>
          </div>
        </div>

        <nav className="flex items-center gap-2">
          {cashierNavItems.map((item, index) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
                  isActive ? "bg-primary text-primary-foreground shadow-sm" : "text-gray-600 hover:bg-gray-100"
                )}
              >
                {item.icon}
                {item.title}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium">Kasir 1</p>
            <p className="text-xs text-green-600">Shift Aktif</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center p-2 rounded-full text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
            title="Keluar"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-hidden flex flex-col">
        {children}
      </main>
    </div>
  )
}
