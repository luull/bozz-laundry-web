'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Plus, Trash2, Printer, Save, UserPlus, ShoppingCart } from 'lucide-react'

// Dummy data for initial UI build
const dummyServices = [
  { id: '1', code: 'CK-01', name: 'Cuci Kering', price: 6000, unit: 'kg' },
  { id: '2', code: 'CS-01', name: 'Cuci Setrika', price: 8000, unit: 'kg' },
  { id: '3', code: 'ST-01', name: 'Setrika Saja', price: 5000, unit: 'kg' },
  { id: '4', code: 'EXP-01', name: 'Express 6 Jam', price: 15000, unit: 'kg' },
  { id: '5', code: 'SPT-01', name: 'Laundry Sepatu', price: 35000, unit: 'item' },
]

export default function POSPage() {
  const [customerSearch, setCustomerSearch] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState<{name: string, phone: string} | null>(null)
  
  const [cart, setCart] = useState<any[]>([])
  const [discount, setDiscount] = useState<number>(0)
  const [paymentAmount, setPaymentAmount] = useState<number>(0)
  const [paymentMethod, setPaymentMethod] = useState<'cash'|'transfer'|'qris'>('cash')

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  const total = Math.max(0, subtotal - discount)
  const remaining = Math.max(0, total - paymentAmount)

  const handleAddToCart = (service: any) => {
    setCart([...cart, { ...service, cartId: Math.random().toString(), quantity: 1 }])
  }

  const handleRemoveFromCart = (cartId: string) => {
    setCart(cart.filter(item => item.cartId !== cartId))
  }

  const handleUpdateQuantity = (cartId: string, qty: number) => {
    setCart(cart.map(item => item.cartId === cartId ? { ...item, quantity: qty } : item))
  }

  return (
    <div className="flex flex-1 h-full bg-gray-100 overflow-hidden">
      {/* Left side: Services & Selection */}
      <div className="flex-1 flex flex-col p-4 overflow-y-auto">
        <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Cari Pelanggan (Nama / WA)</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Masukkan nama atau nomor WA..." 
                    className="pl-9"
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                  />
                </div>
                <Button variant="outline" className="gap-2">
                  <UserPlus className="h-4 w-4" /> Baru
                </Button>
              </div>
            </div>
            {selectedCustomer && (
              <div className="bg-green-50 border border-green-200 px-4 py-2 rounded-lg min-w-[200px]">
                <p className="text-xs text-green-700 font-semibold">Pelanggan Terpilih</p>
                <p className="font-medium text-gray-900">{selectedCustomer.name}</p>
                <p className="text-sm text-gray-600">{selectedCustomer.phone}</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {dummyServices.map(service => (
            <div 
              key={service.id} 
              className="bg-white p-4 rounded-xl shadow-sm border border-transparent hover:border-primary cursor-pointer transition-all active:scale-95"
              onClick={() => handleAddToCart(service)}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">{service.code}</span>
                <span className="text-xs text-gray-500">per {service.unit}</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-1 line-clamp-2 min-h-[2.5rem]">{service.name}</h3>
              <p className="text-lg font-bold text-gray-900">Rp {service.price.toLocaleString('id-ID')}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right side: Cart & Checkout */}
      <div className="w-[400px] bg-white border-l shadow-xl flex flex-col z-10 shrink-0">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="font-bold text-lg text-gray-900">Detail Pesanan</h2>
          <p className="text-xs text-gray-500">INV-TerbuatOtomatis</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <ShoppingCart className="h-12 w-12 mb-2 opacity-20" />
              <p>Belum ada layanan dipilih</p>
            </div>
          ) : (
            cart.map((item, index) => (
              <div key={item.cartId} className="flex gap-3 bg-gray-50 p-3 rounded-lg border">
                <div className="flex-1">
                  <p className="font-semibold text-sm">{item.name}</p>
                  <p className="text-xs text-gray-500">Rp {item.price.toLocaleString('id-ID')} / {item.unit}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    <Input 
                      type="number" 
                      value={item.quantity} 
                      onChange={(e) => handleUpdateQuantity(item.cartId, parseFloat(e.target.value) || 0)}
                      className="w-16 h-8 text-right p-1"
                      step={item.unit === 'kg' ? "0.1" : "1"}
                    />
                    <span className="text-xs font-medium w-6">{item.unit}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                    <button onClick={() => handleRemoveFromCart(item.cartId)} className="text-red-500 p-1 hover:bg-red-50 rounded">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t bg-white p-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-semibold">Rp {subtotal.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between text-sm items-center">
            <span className="text-gray-600">Diskon (Rp)</span>
            <Input 
              type="number" 
              value={discount || ''} 
              onChange={(e) => setDiscount(parseInt(e.target.value) || 0)}
              className="w-32 h-8 text-right"
              placeholder="0"
            />
          </div>
          <div className="flex justify-between items-end border-t pt-2">
            <span className="text-gray-900 font-bold">Total Pembayaran</span>
            <span className="text-2xl font-bold text-primary">Rp {total.toLocaleString('id-ID')}</span>
          </div>
          
          <div className="pt-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">Metode Pembayaran</label>
            <div className="grid grid-cols-3 gap-2 mb-3">
              <Button type="button" variant={paymentMethod === 'cash' ? 'default' : 'outline'} size="sm" onClick={() => setPaymentMethod('cash')}>Cash</Button>
              <Button type="button" variant={paymentMethod === 'transfer' ? 'default' : 'outline'} size="sm" onClick={() => setPaymentMethod('transfer')}>Transfer</Button>
              <Button type="button" variant={paymentMethod === 'qris' ? 'default' : 'outline'} size="sm" onClick={() => setPaymentMethod('qris')}>QRIS</Button>
            </div>
            
            <div className="flex justify-between text-sm items-center mb-1">
              <span className="text-gray-600">Uang Diterima</span>
              <Input 
                type="number" 
                value={paymentAmount || ''} 
                onChange={(e) => setPaymentAmount(parseInt(e.target.value) || 0)}
                className="w-32 h-8 text-right font-medium"
                placeholder="0"
              />
            </div>
            {paymentAmount > 0 && (
              <div className="flex justify-between text-xs items-center text-gray-500">
                <span>{paymentAmount >= total ? 'Kembalian' : 'Sisa Tagihan'}</span>
                <span className={paymentAmount >= total ? 'text-green-600 font-bold' : 'text-orange-600 font-bold'}>
                  Rp {Math.abs(total - paymentAmount).toLocaleString('id-ID')}
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <Button variant="outline" className="w-full gap-2" disabled={cart.length === 0}>
              <Save className="h-4 w-4" /> Simpan
            </Button>
            <Button className="w-full gap-2" disabled={cart.length === 0}>
              <Printer className="h-4 w-4" /> Cetak Struk
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
