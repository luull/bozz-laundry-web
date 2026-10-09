'use client'

import { Sidebar } from '@/components/layout/Sidebar'
import { LayoutDashboard, Store, Users, FileText, Settings, Layers } from 'lucide-react'

const superadminNavItems = [
  { title: 'Dashboard', href: '/superadmin/dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
  { title: 'Cabang', href: '/superadmin/branches', icon: <Store className="h-4 w-4" /> },
  { title: 'Pengguna', href: '/superadmin/users', icon: <Users className="h-4 w-4" /> },
  { title: 'Layanan', href: '/superadmin/services', icon: <Layers className="h-4 w-4" /> },
  { title: 'Laporan', href: '/superadmin/reports', icon: <FileText className="h-4 w-4" /> },
  { title: 'Pengaturan', href: '/superadmin/settings', icon: <Settings className="h-4 w-4" /> },
]

export default function SuperadminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50/50">
      <Sidebar items={superadminNavItems} title="Bozz Laundry" subtitle="Superadmin Panel" />
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  )
}
