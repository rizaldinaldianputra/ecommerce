'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ChevronLeft, MapPin, CreditCard, ShieldCheck, CheckCircle2, ArrowRight, Truck, Wallet, Landmark } from 'lucide-react';
import { authService, AuthUser } from '@/services/auth.service';
import { CheckoutStep, Courier, PaymentMethod } from '@/types/checkout';
import { Address } from '@/types/address';

const steps: CheckoutStep[] = [
  { id: 'shipping', label: 'Shipping', icon: MapPin },
  { id: 'payment', label: 'Payment', icon: CreditCard },
  { id: 'review', label: 'Review', icon: ShieldCheck },
];

export default function CheckoutPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('bank');
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(authService.getUser());
  }, []);

  // New: Shipping & Courier State
  const [addressMode, setAddressMode] = useState<'saved' | 'new'>('saved');
  const [selectedAddressId, setSelectedAddressId] = useState<number | string>(1);
  const [selectedCourier, setSelectedCourier] = useState('jne-reg');

  const savedAddresses: Partial<Address>[] = [
    { id: 1, label: 'Home', name: user?.fullName || 'User', phone: '+62 812 3456 789', address: 'Jl. Melati No. 45, Kebon Jeruk, Jakarta Barat, 11530' },
    { id: 2, label: 'Office', name: user?.fullName || 'User', phone: '+62 812 3456 789', address: 'SCBD District 8, Treasury Tower Lt. 42, Jakarta Selatan, 12190' },
  ];

  const couriers: Courier[] = [
    { id: 'jne-reg', name: 'JNE Regular', price: 12.0, speed: '2-3 Days', icon: Truck },
    { id: 'jne-yes', name: 'JNE YES (Next Day)', price: 25.0, speed: '1 Day', icon: Truck },
    { id: 'pos-kilat', name: 'POS Kilat Khusus', price: 10.0, speed: '3-5 Days', icon: Truck },
    { id: 'gojek-instant', name: 'Gojek Instant', price: 45.0, speed: '1-3 Hours', icon: Truck },
  ];

  const currentCourier = couriers.find(c => c.id === selectedCourier);
  const subtotal = 149.98;
  const shippingCost = currentCourier?.price || 0;
  const total = subtotal + shippingCost;

  // Auth Guard
  useEffect(() => {
    if (!authService.isLoggedIn()) {
      // In a real app, we'd save the return URL
      router.push('/login?redirect=/checkout');
    }
  }, [router]);

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 12, stiffness: 200 }}
          className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-green-200"
        >
          <CheckCircle2 size={48} className="text-white" />
        </motion.div>
        <h1 className="text-4xl font-black text-neutral-900 mb-4 tracking-tight">Order Placed! 🎉</h1>
        <p className="text-neutral-500 mb-10 max-w-sm">Thank you for your purchase. We've sent a confirmation email to your account.</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/orders">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-neutral-900 text-white px-8 py-4 rounded-2xl font-black shadow-xl">
              Track My Order
            </motion.button>
          </Link>
          <Link href="/">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-white text-neutral-900 border border-neutral-200 px-8 py-4 rounded-2xl font-black shadow-lg">
              Return Home
            </motion.button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

        {/* Left: Forms */}
        <div className="lg:col-span-2">
          {/* Header */}
          <div className="mb-10">
            <Link href="/cart" className="inline-flex items-center gap-2 text-neutral-400 font-bold text-sm mb-4 hover:text-pink-500 transition-colors">
              <ChevronLeft size={16} /> Back to Cart
            </Link>
            <h1 className="text-3xl font-black text-neutral-900 tracking-tight">Checkout</h1>
          </div>

          {/* Stepper */}
          <div className="flex items-center justify-between mb-12 relative px-4">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-neutral-100 -translate-y-1/2 -z-10" />
            <motion.div
              className="absolute top-1/2 left-0 h-0.5 bg-pink-500 -translate-y-1/2 -z-10 origin-left"
              animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            />
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = idx === currentStep;
              const isCompleted = idx < currentStep;
              return (
                <div key={step.id} className="flex flex-col items-center">
                  <motion.div
                    animate={{
                      backgroundColor: isActive || isCompleted ? '#ec4899' : '#f5f5f5',
                      color: isActive || isCompleted ? '#fff' : '#a3a3a3',
                      scale: isActive ? 1.2 : 1
                    }}
                    className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg relative bg-neutral-100"
                  >
                    {isCompleted ? <CheckCircle2 size={20} /> : <Icon size={20} />}
                  </motion.div>
                  <span className={`text-[10px] uppercase tracking-widest font-black mt-3 ${isActive ? 'text-pink-500' : 'text-neutral-400'}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Step Content */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl p-8 border border-neutral-100 shadow-xl shadow-black/5"
          >
            {currentStep === 0 && (
              <div className="space-y-8">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-black">Shipping Address</h2>
                  <div className="flex bg-neutral-100 p-1 rounded-xl">
                    <button
                      onClick={() => setAddressMode('saved')}
                      className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${addressMode === 'saved' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-400'}`}
                    >
                      Saved
                    </button>
                    <button
                      onClick={() => setAddressMode('new')}
                      className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${addressMode === 'new' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-400'}`}
                    >
                      New
                    </button>
                  </div>
                </div>

                {addressMode === 'saved' ? (
                  <div className="space-y-4">
                    {savedAddresses.map((addr) => (
                      <button
                        key={addr.id}
                        onClick={() => addr.id !== undefined && setSelectedAddressId(addr.id)}
                        className={`w-full p-6 rounded-2xl border-2 text-left transition-all ${selectedAddressId === addr.id ? 'border-pink-500 bg-pink-50/30' : 'border-neutral-100'}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-white border border-neutral-100 rounded-md text-neutral-500">{addr.label}</span>
                          {selectedAddressId === addr.id && <CheckCircle2 size={16} className="text-pink-500" />}
                        </div>
                        <p className="font-black text-neutral-900 mb-1">{addr.name}</p>
                        <p className="text-xs text-neutral-500 font-medium mb-2">{addr.phone}</p>
                        <p className="text-sm text-neutral-600 font-bold leading-relaxed">{addr.address}</p>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input placeholder="First Name" className="p-4 bg-neutral-50 rounded-2xl border border-transparent focus:bg-white focus:border-pink-500 outline-none transition-all text-sm font-bold" />
                      <input placeholder="Last Name" className="p-4 bg-neutral-50 rounded-2xl border border-transparent focus:bg-white focus:border-pink-500 outline-none transition-all text-sm font-bold" />
                    </div>
                    <input placeholder="Phone Number" className="w-full p-4 bg-neutral-50 rounded-2xl border border-transparent focus:bg-white focus:border-pink-500 outline-none transition-all text-sm font-bold" />
                    <textarea placeholder="Full Address" rows={3} className="w-full p-4 bg-neutral-50 rounded-2xl border border-transparent focus:bg-white focus:border-pink-500 outline-none transition-all text-sm font-bold" />
                  </div>
                )}

                <div className="pt-8 border-t border-neutral-100">
                  <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-6 pl-2">Select Courier</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {couriers.map((courier) => (
                      <button
                        key={courier.id}
                        onClick={() => setSelectedCourier(courier.id)}
                        className={`p-4 rounded-2xl border-2 text-left transition-all flex items-center gap-4 ${selectedCourier === courier.id ? 'border-pink-500 bg-pink-50/30' : 'border-neutral-100 hover:border-neutral-200'}`}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedCourier === courier.id ? 'bg-pink-500 text-white' : 'bg-neutral-100 text-neutral-400'}`}>
                          <courier.icon size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-black text-neutral-900 truncate">{courier.name}</p>
                          <p className="text-[10px] text-neutral-500 font-black">{courier.speed}</p>
                        </div>
                        <p className="font-black text-sm text-pink-500">${courier.price.toFixed(2)}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-black mb-6">Payment Method</h2>
                <div className="space-y-3">
                  {[
                    { id: 'bank', name: 'Bank Transfer', icon: Landmark, desc: 'BCA, Mandiri, BNI, BRI' },
                    { id: 'wallet', name: 'E-Wallet', icon: Wallet, desc: 'GoPay, OVO, Dana, LinkAja' },
                    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, desc: 'Visa, Mastercard, JCB' },
                  ].map((method: PaymentMethod) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPayment(method.id)}
                      className={`w-full p-5 rounded-2xl border-2 flex items-center gap-4 transition-all ${selectedPayment === method.id ? 'border-pink-500 bg-pink-50' : 'border-neutral-100 hover:border-neutral-200'}`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedPayment === method.id ? 'bg-pink-500 text-white' : 'bg-neutral-100 text-neutral-400'}`}>
                        <method.icon size={24} />
                      </div>
                      <div className="text-left">
                        <p className={`font-bold ${selectedPayment === method.id ? 'text-pink-900' : 'text-neutral-900'}`}>{method.name}</p>
                        <p className="text-xs text-neutral-500">{method.desc}</p>
                      </div>
                      <div className={`ml-auto w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedPayment === method.id ? 'border-pink-500' : 'border-neutral-200'}`}>
                        {selectedPayment === method.id && <div className="w-3 h-3 bg-pink-500 rounded-full" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-8">
                <h2 className="text-xl font-black">Review Order</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                    <Truck size={24} className="text-pink-500" />
                    <div>
                      <p className="text-sm font-bold">{currentCourier?.name}</p>
                      <p className="text-xs text-neutral-500 italic">Expected arrival: {currentCourier?.speed}</p>
                    </div>
                    <span className="ml-auto font-black text-pink-500 text-sm">${shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                    <div className="w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center">
                      {selectedPayment === 'bank' ? <Landmark size={24} /> : selectedPayment === 'wallet' ? <Wallet size={24} /> : <CreditCard size={24} />}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{selectedPayment === 'bank' ? 'Bank Transfer' : selectedPayment === 'wallet' ? 'E-Wallet' : 'Credit Card'}</p>
                      <p className="text-xs text-neutral-500">Secure transaction protected by shekza</p>
                    </div>
                  </div>
                </div>
                <div className="bg-amber-50 rounded-2xl p-4 flex gap-3">
                  <ShieldCheck size={20} className="text-amber-600 flex-shrink-0" />
                  <p className="text-[11px] text-amber-900 leading-relaxed font-medium">
                    By clicking "Place Order", you agree to shekza's Terms of Use and Sale. We'll send your receipt and tracking info via email.
                  </p>
                </div>
              </div>
            )}

            {/* Nav Buttons */}
            <div className="flex justify-between mt-10">
              {currentStep > 0 ? (
                <button onClick={prevStep} className="px-8 py-3.5 rounded-2xl font-black text-neutral-500 hover:text-neutral-900 transition-colors">
                  Back
                </button>
              ) : <div />}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={currentStep === steps.length - 1 ? handlePlaceOrder : nextStep}
                disabled={isProcessing}
                className={`px-10 py-3.5 rounded-2xl font-black text-white shadow-xl flex items-center gap-2 ${currentStep === steps.length - 1 ? 'bg-pink-500 shadow-pink-200' : 'bg-neutral-900 shadow-neutral-200'}`}
              >
                {isProcessing ? 'Processing...' : currentStep === steps.length - 1 ? 'Place Order' : 'Continue'}
                {!isProcessing && <ArrowRight size={18} />}
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Right: Overview */}
        <div className="lg:col-span-1">
          <div className="bg-neutral-50 rounded-3xl p-8 border border-neutral-100 sticky top-24">
            <h2 className="text-lg font-black text-neutral-900 mb-6">Order Overview</h2>
            <div className="space-y-4 mb-6">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-16 bg-white rounded-lg border border-neutral-100 overflow-hidden flex-shrink-0">
                  <img src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-neutral-900 truncate">Pastel Dream Hoodie</p>
                  <p className="text-xs text-neutral-400">Pink · M · Qty: 1</p>
                </div>
                <span className="font-bold text-sm">$49.99</span>
              </div>
              <div className="flex gap-4 items-center">
                <div className="w-12 h-16 bg-white rounded-lg border border-neutral-100 overflow-hidden flex-shrink-0">
                  <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-neutral-900 truncate">Minimal Watch</p>
                  <p className="text-xs text-neutral-400">Gold · Qty: 1</p>
                </div>
                <span className="font-bold text-sm">$99.99</span>
              </div>
            </div>

            <div className="pt-6 border-t border-neutral-200 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Subtotal</span>
                <span className="font-bold text-neutral-900">$149.98</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Shipping</span>
                <span className={`font-bold ${shippingCost === 0 ? 'text-green-500' : 'text-neutral-900'}`}>
                  {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Taxes</span>
                <span className="font-bold text-neutral-900">$0.00</span>
              </div>
              <div className="pt-3 border-t border-neutral-200 flex justify-between items-end">
                <span className="font-bold">Total Amount</span>
                <span className="text-2xl font-black text-pink-500">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-center gap-2 text-neutral-400 grayscale opacity-50">
              <span className="text-[10px] font-black uppercase tracking-tighter">Powered by Midtrans</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
