'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, MapPin, Phone, User, Home, 
  Briefcase, MoreVertical, Edit2, Trash2, 
  CheckCircle2, ArrowLeft, X, Save,
  Search, Globe, Building2
} from 'lucide-react';
import Link from 'next/link';
import { Address } from '@/types/address';
import { authService } from '@/services/auth.service';
import { AddressService } from '@/services/address.service';
import { ShippingService, LocationItem } from '@/services/shipping.service';
import { toast } from 'sonner';

export default function AddressPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form State
  const [label, setLabel] = useState('Home');
  const [recipientName, setRecipientName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  // Rajaongkir Location States
  const [provinces, setProvinces] = useState<LocationItem[]>([]);
  const [cities, setCities] = useState<LocationItem[]>([]);
  const [districts, setDistricts] = useState<LocationItem[]>([]);
  const [subdistricts, setSubdistricts] = useState<LocationItem[]>([]);
  
  const [selectedProv, setSelectedProv] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDist, setSelectedDist] = useState('');
  const [selectedSub, setSelectedSub] = useState('');

  useEffect(() => {
    loadAddresses();
    ShippingService.getProvinces().then(setProvinces);
  }, []);

  const loadAddresses = async () => {
    setIsLoading(true);
    try {
      const data = await AddressService.getAll();
      setAddresses(data);
    } catch (error) {
      toast.error('Failed to load addresses');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProv) {
      ShippingService.getCities(selectedProv).then(setCities);
    } else {
      setCities([]);
    }
    if (!editingAddress || selectedProv !== editingAddress.provinceId) {
       setSelectedCity('');
    }
  }, [selectedProv]);

  useEffect(() => {
    if (selectedCity) {
      ShippingService.getDistricts(selectedCity).then(setDistricts);
    } else {
      setDistricts([]);
    }
    if (!editingAddress || selectedCity !== editingAddress.cityId) {
       setSelectedDist('');
    }
  }, [selectedCity]);

  useEffect(() => {
    if (selectedDist) {
      ShippingService.getSubdistricts(selectedDist).then(setSubdistricts);
    } else {
      setSubdistricts([]);
    }
    if (!editingAddress || selectedDist !== editingAddress.districtId) {
       setSelectedSub('');
    }
  }, [selectedDist]);

  const handleOpenForm = (addr: Address | null = null) => {
    if (addr) {
      setEditingAddress(addr);
      setLabel(addr.label);
      setRecipientName(addr.recipientName);
      setPhoneNumber(addr.phoneNumber);
      setAddressLine(addr.addressLine);
      setPostalCode(addr.postalCode);
      setIsDefault(addr.isDefault);
      setSelectedProv(addr.provinceId);
      // City, District, and Sub will be set by their respective useEffects after lists load
      setTimeout(() => setSelectedCity(addr.cityId), 500);
      setTimeout(() => setSelectedDist(addr.districtId), 1000);
      setTimeout(() => setSelectedSub(addr.subdistrictId), 1500);
    } else {
      setEditingAddress(null);
      setLabel('Home');
      setRecipientName('');
      setPhoneNumber('');
      setAddressLine('');
      setPostalCode('');
      setIsDefault(false);
      setSelectedProv('');
      setSelectedCity('');
      setSelectedDist('');
      setSelectedSub('');
    }
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) {
      toast.error('Please complete the 4-tier location selection');
      return;
    }

    const provName = provinces.find(p => (p.id || p.province_id) === selectedProv)?.name || provinces.find(p => (p.id || p.province_id) === selectedProv)?.province || '';
    const cityData = cities.find(c => (c.id || c.city_id) === selectedCity);
    const cityName = cityData ? `${cityData.type} ${cityData.name || cityData.city_name || cityData.city}` : '';
    const distName = districts.find(d => (d.id || d.district_id) === selectedDist)?.name || districts.find(d => (d.id || d.district_id) === selectedDist)?.district_name || '';
    const subName = subdistricts.find(s => (s.id || s.subdistrict_id) === selectedSub)?.name || subdistricts.find(s => (s.id || s.subdistrict_id) === selectedSub)?.subdistrict_name || '';

    const payload: Partial<Address> = {
      label,
      recipientName,
      phoneNumber,
      addressLine,
      postalCode,
      isDefault,
      provinceId: selectedProv,
      provinceName: provName,
      cityId: selectedCity,
      cityName: cityName,
      districtId: selectedDist,
      districtName: distName,
      subdistrictId: selectedSub,
      subdistrictName: subName
    };

    try {
      if (editingAddress) {
        await AddressService.update(editingAddress.id, payload);
        toast.success('Address updated');
      } else {
        await AddressService.create(payload);
        toast.success('Address added');
      }
      setShowForm(false);
      loadAddresses();
    } catch (error) {
      toast.error('Failed to save address');
    }
  };

  const handleSetDefault = async (id: number | string) => {
    try {
      await AddressService.setDefault(id);
      toast.success('Default address updated');
      loadAddresses();
    } catch (error) {
      toast.error('Failed to set default');
    }
  };

  const handleDelete = async (id: number | string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    try {
      await AddressService.delete(id);
      toast.success('Address deleted');
      loadAddresses();
    } catch (error) {
      toast.error('Failed to delete address');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 min-h-screen">
      
      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl relative my-8"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-8 md:p-12">
                 <div className="flex items-center justify-between mb-10">
                    <h3 className="text-3xl font-black text-neutral-900 tracking-tight">
                       {editingAddress ? 'Edit Address' : 'New Address'}
                    </h3>
                    <button onClick={() => setShowForm(false)} className="w-12 h-12 bg-neutral-50 rounded-full flex items-center justify-center hover:bg-neutral-100 transition-all">
                       <X size={24} className="text-neutral-400" />
                    </button>
                 </div>

                 <form className="space-y-8" onSubmit={handleSubmit}>
                    <div className="grid md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-neutral-400 tracking-widest pl-2">Label</label>
                          <select 
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                            className="w-full px-4 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl outline-none focus:ring-2 ring-pink-400 font-bold text-sm"
                          >
                            <option value="Home">Home</option>
                            <option value="Office">Office</option>
                            <option value="Other">Other</option>
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-neutral-400 tracking-widest pl-2">Recipient Name</label>
                          <div className="relative">
                             <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300" />
                             <input 
                               type="text" 
                               value={recipientName}
                               onChange={(e) => setRecipientName(e.target.value)}
                               placeholder="e.g. John Doe" 
                               required
                               className="w-full pl-12 pr-4 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl outline-none focus:ring-2 ring-pink-400 font-bold text-sm" 
                             />
                          </div>
                       </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-neutral-400 tracking-widest pl-2">Phone Number</label>
                          <div className="relative">
                             <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300" />
                             <input 
                               type="text" 
                               value={phoneNumber}
                               onChange={(e) => setPhoneNumber(e.target.value)}
                               placeholder="+62 8..." 
                               required
                               className="w-full pl-12 pr-4 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl outline-none focus:ring-2 ring-pink-400 font-bold text-sm" 
                             />
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-neutral-400 tracking-widest pl-2">Province</label>
                          <select 
                            value={selectedProv}
                            onChange={(e) => setSelectedProv(e.target.value)}
                            required
                            className="w-full px-4 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl outline-none focus:ring-2 ring-pink-400 font-bold text-sm"
                          >
                             <option value="">Select Province</option>
                             {provinces.map(p => <option key={p.id || p.province_id} value={p.id || p.province_id}>{p.name || p.province}</option>)}
                          </select>
                       </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-neutral-400 tracking-widest pl-2">City</label>
                          <select 
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
                            disabled={!selectedProv}
                            required
                            className="w-full px-4 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl outline-none focus:ring-2 ring-pink-400 font-bold text-sm"
                          >
                             <option value="">Select City</option>
                             {cities.map(c => <option key={c.id || c.city_id} value={c.id || c.city_id}>{c.type} {c.name || c.city_name || c.city}</option>)}
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-neutral-400 tracking-widest pl-2">District</label>
                          <select 
                            value={selectedDist}
                            onChange={(e) => setSelectedDist(e.target.value)}
                            disabled={!selectedCity}
                            required
                            className="w-full px-4 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl outline-none focus:ring-2 ring-pink-400 font-bold text-sm"
                          >
                             <option value="">Select District</option>
                             {districts.map(d => <option key={d.id || d.district_id} value={d.id || d.district_id}>{d.name || d.district_name}</option>)}
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-neutral-400 tracking-widest pl-2">Subdistrict</label>
                          <select 
                            value={selectedSub}
                            onChange={(e) => setSelectedSub(e.target.value)}
                            disabled={!selectedDist}
                            required
                            className="w-full px-4 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl outline-none focus:ring-2 ring-pink-400 font-bold text-sm"
                          >
                             <option value="">Select Subdistrict</option>
                             {subdistricts.map(s => <option key={s.id || s.subdistrict_id} value={s.id || s.subdistrict_id}>{s.name || s.subdistrict_name}</option>)}
                          </select>
                       </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase text-neutral-400 tracking-widest pl-2">Postal Code</label>
                         <input 
                           type="text" 
                           value={postalCode}
                           onChange={(e) => setPostalCode(e.target.value)}
                           placeholder="11530" 
                           className="w-full px-4 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl outline-none focus:ring-2 ring-pink-400 font-bold text-sm" 
                         />
                      </div>
                      <div className="flex items-center gap-3 pt-6">
                        <input 
                          type="checkbox" 
                          id="default" 
                          checked={isDefault}
                          onChange={(e) => setIsDefault(e.target.checked)}
                          className="w-5 h-5 rounded-lg border-neutral-300 text-pink-500 focus:ring-pink-400" 
                        />
                        <label htmlFor="default" className="text-xs font-black text-neutral-600 uppercase tracking-widest cursor-pointer">Set as Default</label>
                      </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-neutral-400 tracking-widest pl-2">Full Address Details</label>
                       <textarea 
                        rows={3} 
                        value={addressLine}
                        onChange={(e) => setAddressLine(e.target.value)}
                        placeholder="Street name, Building No, Floor..." 
                        required
                        className="w-full px-4 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl outline-none focus:ring-2 ring-pink-400 font-bold text-sm resize-none"
                       ></textarea>
                    </div>

                    <button className="w-full py-5 bg-neutral-900 text-white rounded-[2rem] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-black/20 hover:bg-neutral-800 transition-all active:scale-95">
                       <Save size={18} /> Save Address
                    </button>
                 </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
        <div>
           <Link href="/profile" className="inline-flex items-center gap-2 text-neutral-400 font-bold text-xs uppercase tracking-widest mb-4 hover:text-neutral-900 transition-colors">
              <ArrowLeft size={14} /> Back to Profile
           </Link>
           <h1 className="text-5xl font-black text-neutral-900 tracking-tight">Shipping <span className="text-pink-500 italic">Destinations</span></h1>
        </div>
        <button 
           onClick={() => handleOpenForm(null)}
           className="px-8 py-4 bg-neutral-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-xl shadow-black/10 active:scale-95 transition-all"
        >
           <Plus size={18} /> Add New Address
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        </div>
      ) : addresses.length === 0 ? (
        <div className="bg-neutral-50 rounded-[3rem] p-20 text-center border-2 border-dashed border-neutral-200">
           <MapPin size={48} className="mx-auto text-neutral-300 mb-6" />
           <h3 className="text-2xl font-black text-neutral-900 mb-2">No addresses found</h3>
           <p className="text-neutral-500">Add your first shipping destination to start shopping!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {addresses.map((addr) => (
            <motion.div 
              key={addr.id}
              layout
              className={`relative group bg-white p-10 rounded-[3rem] border-2 transition-all ${addr.isDefault ? 'border-neutral-900 shadow-2xl shadow-black/5' : 'border-neutral-100 hover:border-neutral-300 shadow-sm'}`}
            >
              {addr.isDefault && (
                <div className="absolute -top-3 left-10 px-4 py-1.5 bg-neutral-900 text-white text-[9px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5 shadow-lg">
                  <CheckCircle2 size={12} className="text-pink-400" /> Primary Destination
                </div>
              )}

              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-3">
                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${addr.label === 'Home' ? 'bg-pink-50 text-pink-500' : 'bg-blue-50 text-blue-500'}`}>
                      {addr.label === 'Home' ? <Home size={24} /> : <Briefcase size={24} />}
                   </div>
                   <div>
                      <h3 className="text-xl font-black text-neutral-900">{addr.label}</h3>
                      <div className="flex items-center gap-1.5 text-neutral-400">
                         <Globe size={10} />
                         <span className="text-[10px] font-black uppercase tracking-widest">{addr.cityName}</span>
                      </div>
                   </div>
                </div>
                <div className="flex gap-1 opacity-10 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                   <button onClick={() => handleOpenForm(addr)} className="p-3 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-50 rounded-xl"><Edit2 size={18} /></button>
                   <button onClick={() => handleDelete(addr.id)} className="p-3 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-xl"><Trash2 size={18} /></button>
                </div>
              </div>

              <div className="space-y-6">
                 <div className="flex items-start gap-4">
                    <User size={18} className="text-neutral-300 mt-1" />
                    <div>
                       <p className="text-sm font-black text-neutral-900">{addr.recipientName}</p>
                       <p className="text-xs text-neutral-500 font-medium">{addr.phoneNumber}</p>
                    </div>
                 </div>

                 <div className="flex items-start gap-4">
                    <MapPin size={18} className="text-neutral-300 mt-1" />
                    <div className="flex-1">
                       <p className="text-sm font-bold text-neutral-700 leading-relaxed mb-1">{addr.addressLine}</p>
                       <p className="text-[10px] text-neutral-400 font-black uppercase tracking-widest leading-relaxed">
                          {addr.subdistrictName}, {addr.districtName},<br />
                          {addr.cityName}, {addr.provinceName} {addr.postalCode}
                       </p>
                    </div>
                 </div>
              </div>

              <div className="mt-10 pt-8 border-t border-neutral-50 flex items-center justify-between">
                 {!addr.isDefault && (
                   <button 
                     onClick={() => handleSetDefault(addr.id)}
                     className="text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-pink-500 transition-colors flex items-center gap-2"
                   >
                     Set as Default
                   </button>
                 )}
                 <div className="ml-auto w-10 h-1.5 rounded-full bg-neutral-50 group-hover:bg-pink-100 transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>
      )}

    </div>
  );
}
