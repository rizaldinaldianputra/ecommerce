'use client';

import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle2, MapPin, Calendar, Clock, ChevronLeft, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const orderData = {
  id: 'SHK-20260322-001x',
  date: 'Mar 22, 2026',
  status: 'Shipped',
  eta: 'Mar 23, 2026',
  items: [
    { id: 1, name: 'Pastel Dream Hoodie', price: 49.99, quantity: 1, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=400', color: 'Pink', size: 'M' },
    { id: 3, name: 'Minimalist Rose Watch', price: 99.99, quantity: 1, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400', color: 'Gold' },
  ],
  shipping: {
    address: 'Jl. Fashion No. 10, Jakarta Selatan, 12345',
    method: 'Standard Delivery',
    tracking: 'JN-9023812239',
  },
  payment: {
    method: 'Credit Card (Visa)',
    total: 149.98,
  },
  timeline: [
    { label: 'Order Placed', time: '10:30 AM', date: 'Mar 22', completed: true },
    { label: 'Processing', time: '12:45 PM', date: 'Mar 22', completed: true },
    { label: 'Shipped', time: '04:20 PM', date: 'Mar 22', active: true },
    { label: 'Out for Delivery', time: 'Pending', date: 'Mar 23' },
    { label: 'Delivered', time: 'Pending', date: 'Mar 23' },
  ],
};

export default function OrderTrackingPage() {
  return (
    <div className="min-h-screen bg-neutral-50 py-20 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pink-100/30 blur-[120px] -z-10 rounded-full" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-100/20 blur-[100px] -z-10 rounded-full" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link href="/orders" className="inline-flex items-center gap-2 text-neutral-400 font-bold text-sm mb-4 hover:text-pink-500 transition-colors">
              <ChevronLeft size={16} /> My Orders
            </Link>
            <h1 className="text-3xl font-black text-neutral-900 tracking-tight">Order Details</h1>
            <p className="text-neutral-500 text-sm font-medium">#{orderData.id} · {orderData.date}</p>
          </div>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 bg-pink-500 text-white px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-pink-100"
          >
            <Truck size={14} /> Shipped
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Timeline & Summary */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Timeline Wrapper */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-neutral-100 shadow-xl shadow-black/5">
              <h2 className="text-xl font-black mb-10 flex items-center gap-3">
                Tracking Details <ExternalLink size={16} className="text-neutral-300" />
              </h2>
              
              <div className="relative pl-1 px-4">
                {/* Vertical Line */}
                <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-neutral-100" />
                
                <div className="space-y-12">
                  {orderData.timeline.map((step, idx) => (
                    <div key={idx} className="relative flex items-start gap-8 group">
                      <div className={`relative z-10 w-4 h-4 rounded-full mt-1.5 ring-4 ring-white ${step.completed || step.active ? 'bg-pink-500' : 'bg-neutral-200'}`}>
                        {step.completed && <div className="absolute inset-0 flex items-center justify-center text-[8px] text-white font-bold"><CheckCircle2 size={10} /></div>}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <p className={`font-black text-sm uppercase tracking-widest ${step.active ? 'text-pink-500' : step.completed ? 'text-neutral-900' : 'text-neutral-300'}`}>
                            {step.label}
                          </p>
                          <span className={`text-[10px] font-bold ${step.completed ? 'text-neutral-400' : 'text-neutral-200'}`}>
                            {step.date} · {step.time}
                          </span>
                        </div>
                        {step.active && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            className="mt-2 text-xs text-neutral-500 leading-relaxed italic"
                          >
                            Carrier has picked up your package and is currently in transit to your city.
                          </motion.div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Shipping Info Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-xl shadow-black/5">
                <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center mb-4">
                  <MapPin size={20} />
                </div>
                <h4 className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-2">Shipping Address</h4>
                <p className="text-sm font-bold text-neutral-900 leading-relaxed">{orderData.shipping.address}</p>
              </div>
              <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-xl shadow-black/5">
                <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center mb-4">
                  <Calendar size={20} />
                </div>
                <h4 className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-2">Estimated Delivery</h4>
                <p className="text-sm font-bold text-neutral-900">{orderData.eta}</p>
                <p className="text-[10px] text-neutral-400 mt-1 uppercase font-black">{orderData.shipping.method}</p>
              </div>
            </div>
          </div>

          {/* Items & Payment Summary */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-neutral-900 rounded-[2.5rem] p-8 text-white sticky top-24">
              <h2 className="text-lg font-black mb-8 border-b border-white/10 pb-4">Package Content</h2>
              <div className="space-y-6 mb-8">
                {orderData.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
                      <img src={item.image} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate">{item.name}</p>
                      <p className="text-[10px] text-neutral-500 font-bold group-hover:text-neutral-400 transition-colors">
                        {item.color} · {item.size || 'One Size'} · Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-black text-pink-400">${item.price}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-white/10">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500 font-bold uppercase text-[10px] tracking-widest">Subtotal</span>
                  <span className="font-bold">$149.98</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500 font-bold uppercase text-[10px] tracking-widest">Shipping</span>
                  <span className="font-black text-green-400 uppercase text-[10px] tracking-widest">Free</span>
                </div>
                <div className="pt-4 flex justify-between items-end">
                  <span className="text-neutral-400 text-sm font-bold">Total</span>
                  <span className="text-2xl font-black text-white">${orderData.payment.total}</span>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-white/10">
                <p className="text-[10px] font-black uppercase text-neutral-500 tracking-widest mb-1.5">Payment Method</p>
                <p className="text-sm font-bold text-white flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-green-500" /> {orderData.payment.method}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
