'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Package, Truck, CheckCircle2, 
  XCircle, Clock, ChevronRight, ArrowLeft, 
  Calendar, CreditCard, MapPin, ExternalLink,
  MessageSquare, Star
} from 'lucide-react';
import Link from 'next/link';
import { STYLE_CONFIG } from '@/services/style.config';
import { Order, OrderItem, OrderStatus, OrderTab } from '@/types/order';
import { authService, AuthUser } from '@/services/auth.service';
import { useEffect } from 'react';

const orderTabs: OrderTab[] = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'To Pay' },
  { id: 'processing', label: 'Processing' },
  { id: 'shipping', label: 'Shipping' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
];

const mockOrders: Order[] = [
  {
    id: 'SHZ-9921',
    date: 'Oct 24, 2023',
    status: 'completed',
    total: 161.98,
    items: [
      { id: 'item-1', name: 'Pastel Dream Hoodie', qty: 1, price: 49.99, img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=200' },
      { id: 'item-2', name: 'Minimal Watch', qty: 1, price: 99.99, img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=200' },
    ],
    courier: 'JNE YES',
    deliveryDate: 'Oct 25, 2023',
  },
  {
    id: 'SHZ-8842',
    date: 'Oct 23, 2023',
    status: 'shipping',
    total: 89.00,
    items: [
      { id: 'item-3', name: 'Aesthetic Tote Bag', qty: 2, price: 44.50, img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=200' },
    ],
    courier: 'Gojek Instant',
    deliveryDate: 'Arriving Today',
  },
  {
    id: 'SHZ-7710',
    date: 'Oct 22, 2023',
    status: 'pending',
    total: 120.00,
    items: [
      { id: 'item-4', name: 'Abstract Wall Art', qty: 1, price: 120.00, img: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=200' },
    ],
  },
];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<OrderStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(authService.getUser());
  }, []);

  const filteredOrders = mockOrders.filter(order => {
    const matchesTab = activeTab === 'all' || order.status === activeTab;
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 min-h-screen">
      
      {/* Detail Overlay */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="bg-neutral-900 p-8 text-white flex justify-between items-center">
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">Order Details</p>
                    <h3 className="text-2xl font-black">{selectedOrder.id}</h3>
                 </div>
                 <button onClick={() => setSelectedOrder(null)} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all">
                    <XCircle size={20} />
                 </button>
              </div>

              <div className="p-8 max-h-[70vh] overflow-y-auto space-y-8">
                 {/* Status Hero */}
                 <div className="flex items-center gap-4 p-6 bg-neutral-50 rounded-[2rem] border border-neutral-100">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
                      selectedOrder.status === 'completed' ? 'bg-green-500 text-white' : 
                      selectedOrder.status === 'shipping' ? 'bg-blue-500 text-white' : 'bg-amber-500 text-white'
                    }`}>
                       {selectedOrder.status === 'completed' ? <CheckCircle2 size={32} /> : 
                        selectedOrder.status === 'shipping' ? <Truck size={32} /> : <Clock size={32} />}
                    </div>
                    <div>
                       <h4 className="text-xl font-black capitalize text-neutral-900">{selectedOrder.status}</h4>
                       <p className="text-xs text-neutral-500 font-medium">Updated on {selectedOrder.date}</p>
                    </div>
                    {selectedOrder.status === 'completed' && (
                       <Link href={`/orders/${selectedOrder.id.replace('SHZ-', '')}/complete`} className="ml-auto px-6 py-2.5 bg-neutral-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all">
                          Rate Items
                       </Link>
                    )}
                 </div>

                 {/* Items */}
                 <div className="space-y-4">
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-neutral-400 pl-4">Order Items</h5>
                    {selectedOrder.items.map((item: OrderItem, i: number) => (
                      <div key={i} className="flex items-center gap-4 p-4 border border-neutral-100 rounded-2xl">
                         <img src={item.img} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                         <div className="flex-1">
                            <p className="text-sm font-black text-neutral-900">{item.name}</p>
                            <p className="text-xs text-neutral-400">Qty: {item.qty} · ${item.price}</p>
                         </div>
                         <p className="font-black">${(item.qty * item.price).toFixed(2)}</p>
                      </div>
                    ))}
                 </div>

                 {/* Shipping Info */}
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-neutral-50 rounded-[2rem] border border-neutral-100">
                       <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-4">Shipping Address</p>
                       <p className="text-xs font-bold text-neutral-800 leading-relaxed">
                          {user?.fullName || 'User name'}<br/>Jl. Melati No. 45<br/>Jakarta Barat, 11530
                       </p>
                    </div>
                    <div className="p-6 bg-neutral-50 rounded-[2rem] border border-neutral-100">
                       <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-4">Payment Info</p>
                       <div className="flex items-center gap-2 mb-2">
                          <CreditCard size={14} className="text-neutral-400" />
                          <span className="text-xs font-black">Bank Transfer</span>
                       </div>
                       <p className="text-xs font-bold text-neutral-500 italic">Paid successfully</p>
                    </div>
                 </div>

                 {/* Summary */}
                 <div className="pt-6 border-t border-neutral-100 flex justify-between items-end">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">Grand Total</p>
                        <p className="text-3xl font-black text-pink-500">${selectedOrder.total.toFixed(2)}</p>
                    </div>
                    <button className="px-8 py-4 bg-neutral-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2">
                       <MessageSquare size={16} /> Chat Seller
                    </button>
                 </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-neutral-900 tracking-tight mb-2">Order History</h1>
          <p className="text-neutral-500 font-medium">Manage and track your recent stylistic acquisitions.</p>
        </div>
        
        {/* Search */}
        <div className="relative w-full md:w-80 group">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-pink-500 transition-colors" />
          <input 
            type="text"
            placeholder="Search Order ID or Product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-neutral-100 rounded-2xl outline-none focus:ring-2 ring-pink-400 shadow-xl shadow-black/5 transition-all text-sm font-bold"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto pb-4 gap-2 mb-8 no-scrollbar">
        {orderTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${
              activeTab === tab.id 
                ? 'bg-neutral-900 text-white shadow-xl shadow-black/20' 
                : 'bg-white text-neutral-400 hover:text-neutral-900 border border-neutral-100 hover:border-neutral-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Order List */}
      <div className="space-y-6">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group bg-white rounded-[2.5rem] border border-neutral-100 p-8 shadow-xl shadow-black/5 hover:shadow-black/10 transition-all"
            >
              <div className="flex flex-col lg:flex-row justify-between gap-8 lg:items-center">
                
                {/* Visual Summary */}
                <div className="flex items-center gap-6">
                   <div className="relative">
                      <img src={order.items[0].img} alt="Product" className="w-20 h-24 rounded-2xl object-cover shadow-lg" />
                      {order.items.length > 1 && (
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-neutral-900 text-white rounded-full flex items-center justify-center text-[10px] font-black border-4 border-white">
                           +{order.items.length - 1}
                        </div>
                      )}
                   </div>
                   <div>
                      <div className="flex items-center gap-3 mb-1">
                         <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{order.id}</span>
                         <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border ${
                           order.status === 'completed' ? 'text-green-500 border-green-100 bg-green-50' :
                           order.status === 'shipping' ? 'text-blue-500 border-blue-100 bg-blue-50' : 'text-amber-500 border-amber-100 bg-amber-50'
                         }`}>
                           {order.status}
                         </span>
                      </div>
                      <h3 className="text-xl font-black text-neutral-900 mb-1 leading-tight">{order.items[0].name}</h3>
                      <p className="text-xs text-neutral-500 font-medium">Placed on {order.date}</p>
                   </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center justify-between lg:justify-end gap-12 pt-6 lg:pt-0 border-t lg:border-t-0 border-neutral-50">
                   <div className="text-left lg:text-right">
                      <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">Amount</p>
                      <p className="text-xl font-black text-neutral-900">${order.total.toFixed(2)}</p>
                   </div>
                   <button 
                    onClick={() => setSelectedOrder(order)}
                    className="flex items-center gap-2 px-8 py-4 bg-neutral-50 hover:bg-neutral-900 text-neutral-900 hover:text-white rounded-2xl transition-all font-black uppercase tracking-widest text-xs active:scale-95 border border-neutral-100 group-hover:border-neutral-900"
                   >
                     View Detail <ChevronRight size={16} />
                   </button>
                </div>

              </div>
            </motion.div>
          ))
        ) : (
          <div className="py-24 text-center">
             <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package size={32} className="text-neutral-300" />
             </div>
             <h3 className="text-xl font-black text-neutral-900 mb-2">No orders found</h3>
             <p className="text-neutral-500 max-w-xs mx-auto text-sm font-medium">Try adjusting your filters or search query to find what you're looking for.</p>
          </div>
        )}
      </div>

    </div>
  );
}
