'use client'

import { Sidebar } from '@/components/layout/Sidebar'
import { LayoutDashboard, ShoppingCart, Users, Layers, Wallet, Clock, FileText, Settings } from 'lucide-react'

const branchNavItems = [
  { title: 'Dashboard', href: '/branch/dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
  { title: 'Transaksi', href: '/branch/transactions', icon: <ShoppingCart className="h-4 w-4" /> },
  { title: 'Pelanggan', href: '/branch/customers', icon: <Users className="h-4 w-4" /> },
  { title: 'Layanan', href: '/branch/services', icon: <Layers className="h-4 w-4" /> },
  { title: 'Kasir & Shift', href: '/branch/shifts', icon: <Clock className="h-4 w-4" /> },
  { title: 'Pengeluaran', href: '/branch/expenses', icon: <Wallet className="h-4 w-4" /> },
  { title: 'Laporan', href: '/branch/reports', icon: <FileText className="h-4 w-4" /> },
  { title: 'Pengaturan', href: '/branch/settings', icon: <Settings className="h-4 w-4" /> },
]

export default function BranchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // In a real app, you would fetch the branch name for the subtitle
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50/50">
      <Sidebar items={branchNavItems} title="Bozz Laundry" subtitle="Branch Admin" />
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  )
}
