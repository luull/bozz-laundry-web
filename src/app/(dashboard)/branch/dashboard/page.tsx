'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, ShoppingCart, Clock, CheckCircle } from "lucide-react"

export default function BranchDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Cabang</h1>
        <p className="text-muted-foreground">Ringkasan performa operasional cabang Anda hari ini.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Omzet Hari Ini</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp 850.000</div>
            <p className="text-xs text-muted-foreground">+12% dari kemarin</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Order Baru (Hari Ini)</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">2 tertunda</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sedang Diproses</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">Antrian cucian</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Siap Diambil</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Menunggu pelanggan</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Transaksi Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { inv: "INV-261009-A1B2", name: "Budi Santoso", status: "Received", amount: "Rp 45.000" },
                { inv: "INV-261009-C3D4", name: "Siti Aminah", status: "Washing", amount: "Rp 32.000" },
                { inv: "INV-261009-E5F6", name: "Anton Wijaya", status: "Ready", amount: "Rp 120.000" },
                { inv: "INV-261008-G7H8", name: "Linda", status: "Completed", amount: "Rp 65.000" },
              ].map((tx) => (
                <div key={tx.inv} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{tx.name}</p>
                    <p className="text-xs text-muted-foreground">{tx.inv}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">{tx.status}</span>
                    <span className="font-medium text-sm">{tx.amount}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Ringkasan Shift Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Kasir Aktif</span>
                <span className="font-medium">Kasir 1</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Waktu Mulai</span>
                <span className="font-medium">08:00 AM</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Saldo Awal</span>
                <span className="font-medium">Rp 200.000</span>
              </div>
              <div className="flex justify-between items-center text-sm border-t pt-4 mt-2">
                <span className="text-gray-900 font-semibold">Kas Masuk (Cash)</span>
                <span className="text-green-600 font-semibold">Rp 350.000</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
