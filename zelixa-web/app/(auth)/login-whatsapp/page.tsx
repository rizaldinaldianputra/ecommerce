'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, ArrowLeft, Loader2, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/services/auth.service';
import { STYLE_CONFIG } from '@/services/style.config';

export default function WhatsappLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) {
      toast({ title: 'Error', description: 'Silakan masukkan nomor WhatsApp Anda', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      await authService.requestOtp(phoneNumber);
      setStep('OTP');
      setCountdown(60);
      toast({ 
        title: 'OTP Terkirim!', 
        description: 'Silakan cek pesan WhatsApp Anda untuk kode verifikasi.',
      });
    } catch (err: any) {
      toast({ 
        title: 'Gagal Mengirim OTP', 
        description: err?.response?.data?.message || 'Pastikan nomor WhatsApp Anda benar.',
        variant: 'destructive' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length < 6) {
      toast({ title: 'Error', description: 'Masukkan 6 digit kode OTP', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.loginWithOtp(phoneNumber, otpCode);
      toast({ title: 'Berhasil!', description: `Selamat datang kembali, ${res.fullName}` });
      
      if (res.roles.includes('ROLE_ADMIN')) {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      toast({ 
        title: 'Verifikasi Gagal', 
        description: err?.response?.data?.message || 'Kode OTP salah atau sudah kedaluwarsa.',
        variant: 'destructive' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50 dark:bg-slate-950 font-outfit">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-50">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-lg mx-auto flex flex-col justify-center p-6 md:p-12">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link 
            href="/login" 
            className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-white dark:bg-white/5 flex items-center justify-center border border-slate-200 dark:border-white/10 group-hover:scale-110 transition-transform shadow-sm">
              <ArrowLeft size={18} />
            </div>
            <span className="text-sm font-bold uppercase tracking-widest hidden sm:inline">Kembali</span>
          </Link>

          <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                <MessageCircle size={18} fill="currentColor" />
             </div>
             <span className="text-xl font-black italic uppercase tracking-tighter">zelixa</span>
          </div>
        </div>

        {/* Card Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border border-white dark:border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-emerald-500/5"
        >
          <AnimatePresence mode="wait">
            {step === 'PHONE' ? (
              <motion.div
                key="phone-step"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                <div>
                  <h1 className="text-3xl font-black tracking-tight mb-2">WhatsApp Login</h1>
                  <p className="text-slate-500 text-sm font-medium">Cara tercepat dan paling aman untuk masuk ke akun Zelixa Anda.</p>
                </div>

                <form onSubmit={handleRequestOtp} className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Nomor WhatsApp</label>
                    <div className="relative group">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-slate-200 dark:border-white/10 pr-3">
                         <span className="text-lg font-bold text-slate-400">+</span>
                      </div>
                      <Input 
                        placeholder="628123456789"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
                        className="pl-16 h-16 rounded-2xl bg-slate-50/50 dark:bg-white/5 border-slate-100 dark:border-white/5 focus:ring-2 focus:ring-emerald-500/20 text-lg font-bold transition-all"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit"
                    className="w-full h-16 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-emerald-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="animate-spin" /> : (
                      <>
                        <Zap size={20} fill="currentColor" />
                        Lanjutkan ke Verifikasi
                      </>
                    )}
                  </Button>
                </form>

                <div className="grid grid-cols-2 gap-4">
                   {[
                     { icon: ShieldCheck, text: 'Ultra Secure' },
                     { icon: CheckCircle2, text: 'Zero Passwords' }
                   ].map((item, id) => (
                     <div key={id} className="flex items-center gap-2 text-slate-400">
                        <item.icon size={16} className="text-emerald-500" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">{item.text}</span>
                     </div>
                   ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="otp-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                 <div>
                  <h1 className="text-3xl font-black tracking-tight mb-2">Verifikasi OTP</h1>
                  <p className="text-slate-500 text-sm font-medium">Kami telah mengirimkan kode 6-digit ke WhatsApp nomor <span className="text-emerald-500 font-bold">+{phoneNumber}</span></p>
                </div>

                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Kode Verifikasi</label>
                    <Input 
                      placeholder="000000"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                      maxLength={6}
                      className="h-20 text-center text-4xl font-black tracking-[0.4em] rounded-2xl bg-slate-50/50 dark:bg-white/5 border-slate-100 dark:border-white/5 focus:ring-2 focus:ring-emerald-500/20 transition-all uppercase placeholder:opacity-20 flex items-center justify-center"
                      disabled={isLoading}
                      autoFocus
                    />
                  </div>

                  <Button 
                    type="submit"
                    className="w-full h-16 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-emerald-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="animate-spin" /> : 'Verifikasi Akun'}
                  </Button>
                </form>

                <div className="text-center space-y-4">
                  <div className="text-xs font-bold text-slate-400">
                    Tidak menerima kode?{' '}
                    {countdown > 0 ? (
                      <span className="text-emerald-500">Kirim ulang dalam {countdown}s</span>
                    ) : (
                      <button 
                        onClick={handleRequestOtp} 
                        className="text-emerald-500 hover:underline transition-all"
                        disabled={isLoading}
                      >
                        Kirim Ulang
                      </button>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => setStep('PHONE')}
                    className="text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-pink-500 transition-colors"
                  >
                    Ganti nomor telepon
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs font-bold text-slate-400">
          Belum punya akun?{' '}
          <Link href="/register" className="text-pink-500 hover:underline uppercase tracking-widest">Daftar Sekarang</Link>
        </p>
      </div>
    </div>
  );
}
