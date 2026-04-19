'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Script from 'next/script';
import { ChevronLeft, MapPin, ShieldCheck, CheckCircle2, ArrowRight, Truck } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { AuthUser } from '@/types/auth';
import { OrderService } from '@/services/order.service';
import { useCart } from '@/contexts/CartContext';
import { CheckoutStep, Courier } from '@/types/checkout';
import { Address } from '@/types/address';
import { toast } from 'sonner';
import { ShippingService, LocationItem } from '@/services/shipping.service';
import { formatImageUrl } from '@/lib/url-utils';

declare global {
  interface Window {
    snap: any;
  }
}

const steps: CheckoutStep[] = [
  { id: 'shipping', label: 'Shipping', icon: MapPin },
  { id: 'review', label: 'Review & Pay', icon: ShieldCheck },
];

export default function CheckoutPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(authService.getUser());
  }, []);

  const [addressMode, setAddressMode] = useState<'saved' | 'new'>('saved');
  const [selectedAddressId, setSelectedAddressId] = useState<number | string>(1);
  const [selectedCourier, setSelectedCourier] = useState('');

  // Rajaongkir location states
  const [provinces, setProvinces] = useState<LocationItem[]>([]);
  const [cities, setCities] = useState<LocationItem[]>([]);
  const [districts, setDistricts] = useState<LocationItem[]>([]);
  const [subdistricts, setSubdistricts] = useState<LocationItem[]>([]);
  const [selectedProv, setSelectedProv] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDist, setSelectedDist] = useState('');
  const [selectedSub, setSelectedSub] = useState('');
  
  const [isFetchingCouriers, setIsFetchingCouriers] = useState(false);
  const [couriers, setCouriers] = useState<Courier[]>([]);

  const savedAddresses: Partial<Address>[] = [
    { id: 1, label: 'Home', recipientName: user?.fullName || 'User', phoneNumber: '+62 812 3456 789', addressLine: 'Jl. Melati No. 45, Kebon Jeruk', subdistrictName: 'Kebon Jeruk', subdistrictId: '152' },
    { id: 2, label: 'Office', recipientName: user?.fullName || 'User', phoneNumber: '+62 812 3456 789', addressLine: 'SCBD District 8, Treasury Tower Lt. 42', subdistrictName: 'Senayan', subdistrictId: '153' },
  ];

  const activeSubdistrictId = addressMode === 'saved' 
    ? savedAddresses.find(a => a.id === selectedAddressId)?.subdistrictId 
    : selectedSub;

  useEffect(() => {
    ShippingService.getProvinces().then(setProvinces);
  }, []);

  useEffect(() => {
    if (selectedProv) {
      ShippingService.getCities(selectedProv).then(setCities);
    } else {
      setCities([]);
    }
    setSelectedCity('');
  }, [selectedProv]);

  useEffect(() => {
    if (selectedCity) {
      ShippingService.getDistricts(selectedCity).then(setDistricts);
    } else {
      setDistricts([]);
    }
    setSelectedDist('');
  }, [selectedCity]);

  useEffect(() => {
    if (selectedDist) {
      ShippingService.getSubdistricts(selectedDist).then(setSubdistricts);
    } else {
      setSubdistricts([]);
    }
    setSelectedSub('');
  }, [selectedDist]);

  useEffect(() => {
    if (!activeSubdistrictId) {
      setCouriers([]);
      setSelectedCourier('');
      return;
    }

    const fetchC = async () => {
      setIsFetchingCouriers(true);
      try {
        const res = await ShippingService.calculateCost({
          origin: '1391', // Default origin (Kebon Jeruk / Jakarta Barat)
          destination: activeSubdistrictId as string,
          weight: 1000,
          courier: 'jne:sicepat:jnt:tiki:anteraja:pos' 
        });
        
        if (Array.isArray(res)) {
          const newCouriers: Courier[] = res.map(cr => ({
            id: `${cr.code}-${cr.service}`.toLowerCase(),
            name: `${cr.name} (${cr.service})`,
            price: cr.cost,
            speed: cr.etd || '2-4 Days',
            icon: Truck
          }));
          setCouriers(newCouriers);
          if (newCouriers.length > 0) setSelectedCourier(newCouriers[0].id);
        }
      } catch (e) {
        console.error('Courier fetch error', e);
      } finally {
        setIsFetchingCouriers(false);
      }
    };
    
    fetchC();
  }, [activeSubdistrictId]);

  const currentCourier = couriers.find(c => c.id === selectedCourier);
  const { cartItems, totalAmount: cartTotalAmount } = useCart();
  const subtotal = cartTotalAmount;
  const shippingCost = currentCourier?.price || 0;
  const total = subtotal + shippingCost;

  useEffect(() => {
    if (!authService.isLoggedIn()) {
      router.push('/login?redirect=/checkout');
    }
  }, [router]);

  const nextStep = () => {
    if (currentStep === 0 && !activeSubdistrictId) {
       toast.error("Please select a valid destination to fetch couriers.");
       return;
    }
    if (currentStep === 0 && !selectedCourier) {
       toast.error("Please select a courier.");
       return;
    }
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  };
  
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsProcessing(true);
    try {
      const activeAddressStr = addressMode === 'saved' 
        ? savedAddresses.find(a => a.id === selectedAddressId)?.addressLine 
        : 'New Address';

      const response = await OrderService.checkout({
        shippingService: currentCourier?.name,
        destinationSubdistrictId: activeSubdistrictId as string,
        shippingAmount: shippingCost,
        addressLine: activeAddressStr,
      });

      if (response.paymentToken) {
        window.snap.pay(response.paymentToken, {
          onSuccess: function (result: any) {
            setIsProcessing(false);
            setIsSuccess(true);
          },
          onPending: function (result: any) {
            setIsProcessing(false);
            router.push('/orders');
          },
          onError: function (result: any) {
            setIsProcessing(false);
            toast.error('Payment failed. Please try again.');
          },
          onClose: function () {
            setIsProcessing(false);
            toast.info('Payment popup closed. You can pay later in Order History.');
            router.push('/orders');
          }
        });
      } else {
        setIsProcessing(false);
        setIsSuccess(true);
      }
    } catch (error: any) {
      setIsProcessing(false);
      toast.error(error.message || 'Checkout failed');
    }
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
        <p className="text-neutral-500 mb-10 max-w-sm">Thank you for your purchase. Please complete your payment or track your order.</p>
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
    <>
      <Script 
        src={process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true' 
          ? 'https://app.midtrans.com/snap/snap.js' 
          : 'https://app.sandbox.midtrans.com/snap/snap.js'}
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="afterInteractive"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

        <div className="lg:col-span-2">
          <div className="mb-10">
            <Link href="/cart" className="inline-flex items-center gap-2 text-neutral-400 font-bold text-sm mb-4 hover:text-pink-500 transition-colors">
              <ChevronLeft size={16} /> Back to Cart
            </Link>
            <h1 className="text-3xl font-black text-neutral-900 tracking-tight">Checkout</h1>
          </div>

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
                        <p className="font-black text-neutral-900 mb-1">{addr.recipientName}</p>
                        <p className="text-xs text-neutral-500 font-medium mb-2">{addr.phoneNumber}</p>
                        <p className="text-sm text-neutral-600 font-bold leading-relaxed">{addr.addressLine}</p>
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
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <select 
                        value={selectedProv} 
                        onChange={(e) => setSelectedProv(e.target.value)}
                        className="p-4 bg-neutral-50 rounded-2xl border border-transparent focus:bg-white focus:border-pink-500 outline-none transition-all text-sm font-bold w-full"
                      >
                        <option value="">Province...</option>
                        {provinces.map(p => (
                          <option key={p.id || p.province_id} value={p.id || p.province_id}>{p.name || p.province}</option>
                        ))}
                      </select>

                      <select 
                        value={selectedCity} 
                        onChange={(e) => setSelectedCity(e.target.value)}
                        disabled={!selectedProv}
                        className="p-4 bg-neutral-50 rounded-2xl border border-transparent focus:bg-white focus:border-pink-500 outline-none transition-all text-sm font-bold w-full"
                      >
                        <option value="">City...</option>
                        {cities.map(c => (
                          <option key={c.id || c.city_id} value={c.id || c.city_id}>{c.type} {c.name || c.city_name || c.city}</option>
                        ))}
                      </select>

                      <select 
                        value={selectedDist} 
                        onChange={(e) => setSelectedDist(e.target.value)}
                        disabled={!selectedCity}
                        className="p-4 bg-neutral-50 rounded-2xl border border-transparent focus:bg-white focus:border-pink-500 outline-none transition-all text-sm font-bold w-full"
                      >
                        <option value="">District...</option>
                        {districts.map(d => (
                          <option key={d.id || d.district_id} value={d.id || d.district_id}>{d.name || d.district_name}</option>
                        ))}
                      </select>

                      <select 
                        value={selectedSub} 
                        onChange={(e) => setSelectedSub(e.target.value)}
                        disabled={!selectedDist}
                        className="p-4 bg-neutral-50 rounded-2xl border border-transparent focus:bg-white focus:border-pink-500 outline-none transition-all text-sm font-bold w-full"
                      >
                        <option value="">Subdistrict...</option>
                        {subdistricts.map(s => (
                          <option key={s.id || s.subdistrict_id} value={s.id || s.subdistrict_id}>{s.name || s.subdistrict_name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                <div className="pt-8 border-t border-neutral-100">
                  <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-6 pl-2">Select Courier</h3>
                  
                  {isFetchingCouriers ? (
                    <div className="flex justify-center p-8">
                       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                    </div>
                  ) : couriers.length === 0 ? (
                    <p className="text-sm text-neutral-500 italic pl-2">Please select a valid destination to see available couriers.</p>
                  ) : (
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
                          <p className="font-black text-sm text-pink-500">Rp {courier.price.toLocaleString('id-ID')}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-8">
                <h2 className="text-xl font-black">Review Order & Pay</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                    <Truck size={24} className="text-pink-500" />
                    <div>
                      <p className="text-sm font-bold">{currentCourier?.name}</p>
                      <p className="text-xs text-neutral-500 italic">Expected arrival: {currentCourier?.speed}</p>
                    </div>
                    <span className="ml-auto font-black text-pink-500 text-sm">Rp {shippingCost.toLocaleString('id-ID')}</span>
                  </div>
                </div>
                <div className="bg-amber-50 rounded-2xl p-4 flex gap-3">
                  <ShieldCheck size={20} className="text-amber-600 flex-shrink-0" />
                  <p className="text-[11px] text-amber-900 leading-relaxed font-medium">
                    By clicking "Pay with Midtrans", you'll be securely redirected to Midtrans to complete your payment via Bank Transfer, E-Wallet or Card!
                  </p>
                </div>
              </div>
            )}

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
                disabled={isProcessing || (currentStep === 0 && !selectedCourier)}
                className={`px-10 py-3.5 rounded-2xl font-black text-white shadow-xl flex items-center gap-2 ${currentStep === steps.length - 1 ? 'bg-pink-500 shadow-pink-200' : 'bg-neutral-900 shadow-neutral-200'} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isProcessing ? 'Processing...' : currentStep === steps.length - 1 ? 'Pay with Midtrans' : 'Continue'}
                {!isProcessing && <ArrowRight size={18} />}
              </motion.button>
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-neutral-50 rounded-3xl p-8 border border-neutral-100 sticky top-24">
            <h2 className="text-lg font-black text-neutral-900 mb-6">Order Overview</h2>
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="w-12 h-16 bg-white rounded-lg border border-neutral-100 overflow-hidden flex-shrink-0">
                    <img src={formatImageUrl(item.imageUrl)} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-neutral-900 truncate">{item.productName}</p>
                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-0.5">
                      {item.groupName && <span className="text-pink-500">{item.groupName}</span>}
                      {item.groupName && ' · '}
                      {item.color} {item.size ? `· ${item.size}` : ''}
                    </p>
                    <p className="text-[10px] text-neutral-400">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-bold text-sm">Rp {((item.discountPrice || item.price) * item.quantity).toLocaleString('id-ID')}</span>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-neutral-200 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Subtotal</span>
                <span className="font-bold text-neutral-900">Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Shipping</span>
                <span className={`font-bold ${shippingCost === 0 ? 'text-green-500' : 'text-neutral-900'}`}>
                  {shippingCost === 0 ? 'FREE' : `Rp ${shippingCost.toLocaleString('id-ID')}`}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Taxes</span>
                <span className="font-bold text-neutral-900">Rp 0</span>
              </div>
              <div className="pt-3 border-t border-neutral-200 flex justify-between items-end">
                <span className="font-bold">Total Amount</span>
                <span className="text-2xl font-black text-pink-500">Rp {total.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-center gap-2 text-neutral-400 grayscale opacity-50">
              <span className="text-[10px] font-black uppercase tracking-tighter">Powered by Midtrans</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
