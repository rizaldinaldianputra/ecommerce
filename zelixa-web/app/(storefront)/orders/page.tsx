'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Package, Truck, CheckCircle2, 
  XCircle, Clock, ChevronRight, ArrowLeft, 
  Calendar, CreditCard, MapPin, ExternalLink,
  MessageSquare, Star, Loader2, Wallet
} from 'lucide-react';
import Link from 'next/link';
import Script from 'next/script';
import { toast } from 'sonner';
import { Order, OrderItem, OrderStatus, OrderTab } from '@/types/order';
import { authService } from '@/services/auth.service';
import { AuthUser } from '@/types/auth';
import { OrderService } from '@/services/order.service';

const orderTabs: OrderTab[] = [
  { id: 'all', label: 'All' },
  { id: 'PENDING', label: 'To Pay' },
  { id: 'PROCESSING', label: 'Processing' },
  { id: 'DELIVERING', label: 'Shipping' },
  { id: 'COMPLETED', label: 'Completed' },
  { id: 'CANCELLED', label: 'Cancelled' },
];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<OrderStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUser(authService.getUser());
    loadOrders();
    
    // Listen for auth changes to re-fetch if needed
    const handleAuthChange = () => {
      setUser(authService.getUser());
      loadOrders();
    };
    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, []);

  const loadOrders = async () => {
    if (!authService.isLoggedIn()) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      const data = await OrderService.getMyOrders();
      // Sort by date mostly handled by backend, but we can assure descending
      setOrders(data.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()));
    } catch (error) {
      console.error('Failed to load orders', error);
      toast.error('Failed to load your orders.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayNow = (order: Order) => {
    if (order.paymentToken && window.snap) {
      window.snap.pay(order.paymentToken, {
        onSuccess: function (result: any) {
          toast.success('Payment successful!');
          loadOrders(); 
          setSelectedOrder(null);
        },
        onPending: function (result: any) {
          toast.info('Payment is pending.');
          loadOrders();
        },
        onError: function (result: any) {
          toast.error('Payment failed. Please try again.');
        },
        onClose: function () {
          toast.info('Payment popup closed.');
        }
      });
    } else if (!window.snap) {
      toast.error('Payment system is still loading. Please wait a moment.');
    } else if (!order.paymentToken) {
      toast.error('Payment token is missing from this order.');
    }
  };

  // Safe string check wrapper
  const filteredOrders = orders.filter(order => {
    const matchesTab = activeTab === 'all' || order.status === activeTab;
    const matchesSearch = String(order.id).toLowerCase().includes(searchQuery.toLowerCase()) || 
                          order.items.some(item => (item.productName || '').toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  if (!user && !isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
         <Package size={48} className="text-neutral-300 mb-6" />
         <h2 className="text-2xl font-black mb-2">Please login to view orders</h2>
         <Link href="/login?redirect=/orders" className="text-pink-500 font-bold hover:underline">Log In</Link>
      </div>
    );
  }

  return (
    <>
      <Script 
        src={process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true' 
          ? 'https://app.midtrans.com/snap/snap.js' 
          : 'https://app.sandbox.midtrans.com/snap/snap.js'}
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="afterInteractive"
      />
      
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
                className="bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
                onClick={e => e.stopPropagation()}
              >
                <div className="bg-neutral-900 p-8 text-white flex justify-between items-center shrink-0">
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">Order Details</p>
                      <h3 className="text-2xl font-black">{selectedOrder.orderNumber || `SHZ-${selectedOrder.id}`}</h3>
                   </div>
                   <button onClick={() => setSelectedOrder(null)} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all">
                      <XCircle size={20} />
                   </button>
                </div>

                <div className="p-8 overflow-y-auto space-y-8 flex-1">
                   {/* Status Hero */}
                   <div className="flex items-center gap-4 p-6 bg-neutral-50 rounded-[2rem] border border-neutral-100">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
                        selectedOrder.status === 'COMPLETED' ? 'bg-green-500 text-white' : 
                        selectedOrder.status === 'DELIVERING' ? 'bg-blue-500 text-white' : 
                        selectedOrder.status === 'PENDING' ? 'bg-pink-500 text-white' : 'bg-amber-500 text-white'
                      }`}>
                         {selectedOrder.status === 'COMPLETED' ? <CheckCircle2 size={32} /> : 
                          selectedOrder.status === 'DELIVERING' ? <Truck size={32} /> : 
                          selectedOrder.status === 'PENDING' ? <Wallet size={32} /> : <Clock size={32} />}
                      </div>
                      <div>
                         <h4 className="text-xl font-black capitalize text-neutral-900">{selectedOrder.status.toLowerCase()}</h4>
                         <p className="text-xs text-neutral-500 font-medium">
                           {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleDateString() : ''}
                         </p>
                      </div>
                      
                      {selectedOrder.status === 'PENDING' && (
                         <button onClick={() => handlePayNow(selectedOrder)} className="ml-auto px-6 py-2.5 bg-pink-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-pink-200">
                            Pay Now
                         </button>
                      )}
                      {selectedOrder.status === 'COMPLETED' && (
                         <Link href={`/orders/${selectedOrder.id}/complete`} className="ml-auto px-6 py-2.5 bg-neutral-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all">
                            Rate Items
                         </Link>
                      )}
                   </div>

                   {/* Items */}
                   <div className="space-y-4">
                      <h5 className="text-[10px] font-black uppercase tracking-widest text-neutral-400 pl-4">Order Items</h5>
                      {selectedOrder.items.map((item: OrderItem, i: number) => (
                        <div key={i} className="flex items-center gap-4 p-4 border border-neutral-100 rounded-2xl">
                           <img src={item.imageUrl || item.img || '/placeholder.png'} alt={item.productName || item.name} className="w-16 h-16 rounded-xl object-cover bg-neutral-100" />
                           <div className="flex-1">
                              <p className="text-sm font-black text-neutral-900">{item.productName || item.name}</p>
                              <p className="text-xs text-neutral-400">Qty: {item.quantity || item.qty}</p>
                           </div>
                           <p className="font-black">Rp {((item.quantity || item.qty || 1) * item.price).toLocaleString()}</p>
                        </div>
                      ))}
                   </div>

                   {/* Shipping Info */}
                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-6 bg-neutral-50 rounded-[2rem] border border-neutral-100">
                         <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-4">Shipping Info</p>
                         <p className="text-xs font-bold text-neutral-800 leading-relaxed mb-2">
                            {user?.fullName || 'Customer'}
                         </p>
                         <div className="flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg inline-flex mb-2">
                           <Truck size={14} /> {selectedOrder.shippingService || selectedOrder.courier || 'Standard Shipping'}
                         </div>
                         {selectedOrder.trackingNumber && (
                           <div className="mt-2 text-[10px] font-black uppercase tracking-widest text-neutral-500">
                             Tracking: <span className="text-neutral-900">{selectedOrder.trackingNumber}</span>
                           </div>
                         )}
                      </div>
                      <div className="p-6 bg-neutral-50 rounded-[2rem] border border-neutral-100">
                         <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-4">Payment Info</p>
                         <div className="flex items-center gap-2 mb-2">
                            <CreditCard size={14} className="text-neutral-400" />
                            <span className="text-xs font-black">Midtrans Integration</span>
                         </div>
                         <p className={`text-xs font-bold italic ${selectedOrder.status === 'PENDING' ? 'text-amber-500' : 'text-green-500'}`}>
                           {selectedOrder.status === 'PENDING' ? 'Awaiting Payment' : 'Paid successfully'}
                         </p>
                      </div>
                   </div>

                   {/* Summary */}
                   <div className="pt-6 border-t border-neutral-100 flex justify-between items-end">
                      <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">Grand Total</p>
                          <p className="text-3xl font-black text-pink-500">Rp {(selectedOrder.totalAmount || selectedOrder.total || 0).toLocaleString()}</p>
                      </div>
                      <button className="px-8 py-4 bg-neutral-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2">
                         <MessageSquare size={16} /> Help
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
          {isLoading ? (
            <div className="py-24 flex items-center justify-center">
              <Loader2 className="animate-spin text-pink-500" size={32} />
            </div>
          ) : filteredOrders.length > 0 ? (
            filteredOrders.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.1, 0.5) }}
                className="group bg-white rounded-[2.5rem] border border-neutral-100 p-8 shadow-xl shadow-black/5 hover:shadow-black/10 transition-all"
              >
                <div className="flex flex-col lg:flex-row justify-between gap-8 lg:items-center">
                  
                  {/* Visual Summary */}
                  <div className="flex items-center gap-6">
                     <div className="relative">
                        <img 
                          src={order.items[0]?.imageUrl || order.items[0]?.img || '/placeholder.png'} 
                          alt="Product" 
                          className="w-20 h-24 rounded-2xl object-cover shadow-lg bg-neutral-100" 
                        />
                        {order.items.length > 1 && (
                          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-neutral-900 text-white rounded-full flex items-center justify-center text-[10px] font-black border-4 border-white">
                             +{order.items.length - 1}
                          </div>
                        )}
                     </div>
                     <div>
                        <div className="flex items-center gap-3 mb-1">
                           <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{order.orderNumber || `SHZ-${order.id}`}</span>
                           <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border ${
                             order.status === 'COMPLETED' ? 'text-green-500 border-green-100 bg-green-50' :
                             order.status === 'DELIVERING' ? 'text-blue-500 border-blue-100 bg-blue-50' : 
                             order.status === 'PENDING' ? 'text-pink-500 border-pink-100 bg-pink-50' : 'text-amber-500 border-amber-100 bg-amber-50'
                           }`}>
                             {order.status}
                           </span>
                        </div>
                        <h3 className="text-xl font-black text-neutral-900 mb-1 leading-tight truncate max-w-xs">{order.items[0]?.productName || order.items[0]?.name || 'Product'}</h3>
                        <p className="text-xs text-neutral-500 font-medium">Placed on {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''}</p>
                     </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center justify-between lg:justify-end gap-12 pt-6 lg:pt-0 border-t lg:border-t-0 border-neutral-50">
                     <div className="text-left lg:text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">Amount</p>
                        <p className="text-xl font-black text-neutral-900">Rp {(order.totalAmount || order.total || 0).toLocaleString()}</p>
                     </div>
                     
                     <div className="flex gap-2">
                       {order.status === 'PENDING' && (
                         <button 
                          onClick={() => handlePayNow(order)}
                          className="flex items-center gap-2 px-6 py-4 bg-pink-500 hover:bg-pink-600 text-white rounded-2xl transition-all font-black uppercase tracking-widest text-xs active:scale-95 shadow-lg shadow-pink-200"
                         >
                           Pay Now
                         </button>
                       )}
                       
                       <button 
                        onClick={() => setSelectedOrder(order)}
                        className="flex items-center gap-2 px-6 py-4 bg-neutral-50 hover:bg-neutral-900 text-neutral-900 hover:text-white rounded-2xl transition-all font-black uppercase tracking-widest text-xs active:scale-95 border border-neutral-100 group-hover:border-neutral-900"
                       >
                         View Detail <ChevronRight size={16} />
                       </button>
                     </div>
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
    </>
  );
}
