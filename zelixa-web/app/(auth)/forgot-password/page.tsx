'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, ChevronLeft, ShieldCheck, KeyRound, CheckCircle2 } from 'lucide-react';
import { STYLE_CONFIG } from '@/services/style.config';

type Step = 'email' | 'otp' | 'new-password' | 'success';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleNextStep = (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      if (step === 'email') setStep('otp');
      else if (step === 'otp') setStep('new-password');
      else if (step === 'new-password') setStep('success');
    }, 1500);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const containerVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <div className="min-h-screen w-full flex overflow-hidden bg-white font-sans">
      {/* Left Side: Brand Visuals (Consistent with Login) */}
      <div 
        className="hidden lg:flex w-1/2 relative items-center justify-center p-12 overflow-hidden"
        style={{ background: STYLE_CONFIG.gradients.primary }}
      >
        <div className="absolute inset-0 opacity-20 text-white pointer-events-none">
           <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        </div>
        
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute -top-20 -left-20 w-96 h-96 bg-white/10 blur-[100px] rounded-full"
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
            transition={{ duration: 25, repeat: Infinity }}
            className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 blur-[100px] rounded-full"
          />
        </div>

        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative z-10 text-center text-white"
        >
          <div className="flex items-center justify-center gap-4 mb-8">
             <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 shadow-2xl">
                <ShieldCheck size={40} className="text-white fill-white/20" />
             </div>
             <h1 className="text-7xl font-black tracking-tighter uppercase italic">Secure</h1>
          </div>
          <h2 className="text-2xl font-black tracking-tight mb-4 opacity-90">Account Recovery</h2>
          <p className="max-w-md mx-auto text-white/70 font-bold leading-relaxed">
            Your security is our priority. Follow the simple steps to recover your access and get back to your aesthetic journey.
          </p>
        </motion.div>
      </div>

      {/* Right Side: Step-by-Step Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 lg:p-24 relative overflow-y-auto">
        {/* Back Link */}
        <div className="absolute top-8 left-8 lg:left-12">
            <Link href="/login" className="flex items-center gap-2 text-neutral-400 hover:text-neutral-900 transition-colors group">
              <div className="w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center group-hover:bg-neutral-100 transition-all shadow-sm">
                <ChevronLeft size={16} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest">Back to Login</span>
            </Link>
        </div>

        <AnimatePresence mode="wait">
          {step === 'email' && (
            <motion.div 
              key="email"
              variants={containerVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full max-w-md"
            >
              <div className="mb-10 text-center lg:text-left">
                <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center mb-6 mx-auto lg:mx-0">
                  <Mail size={24} className="text-pink-500" />
                </div>
                <h1 className="text-4xl font-black text-neutral-900 tracking-tight mb-3">Forgot Password?</h1>
                <p className="text-neutral-500 font-medium italic">No worries! Just enter your email and we'll send you a recovery code.</p>
              </div>

              <form onSubmit={handleNextStep} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 pl-2">Email Address</label>
                  <div className="relative group">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-pink-500 transition-colors" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-12 pr-4 py-4 bg-neutral-50 border border-neutral-100 rounded-3xl outline-none focus:ring-2 ring-pink-400 focus:bg-white transition-all text-sm font-bold shadow-sm"
                    />
                  </div>
                </div>

                <button
                  disabled={isLoading}
                  type="submit"
                  className="w-full py-4 rounded-3xl text-white font-black uppercase tracking-widest shadow-xl shadow-pink-100 hover:shadow-pink-200 active:scale-95 transition-all flex items-center justify-center gap-2 group overflow-hidden"
                  style={{ background: `linear-gradient(45deg, ${STYLE_CONFIG.primary}, ${STYLE_CONFIG.accent})` }}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Send Recovery Code <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {step === 'otp' && (
            <motion.div 
              key="otp"
              variants={containerVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full max-w-md text-center lg:text-left"
            >
              <div className="mb-10">
                <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center mb-6 mx-auto lg:mx-0">
                  <ShieldCheck size={24} className="text-pink-500" />
                </div>
                <h1 className="text-4xl font-black text-neutral-900 tracking-tight mb-3">Check Your Email</h1>
                <p className="text-neutral-500 font-medium">
                  We've sent a 6-digit verification code to <span className="text-neutral-900 font-black italic">{email}</span>.
                </p>
              </div>

              <form onSubmit={handleNextStep} className="space-y-8">
                <div className="flex justify-between gap-2 sm:gap-4">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      className="w-12 h-14 sm:w-14 sm:h-16 text-center text-xl font-black bg-neutral-50 border border-neutral-100 rounded-2xl outline-none focus:ring-2 ring-pink-400 focus:bg-white transition-all shadow-sm"
                    />
                  ))}
                </div>

                <button
                  disabled={isLoading}
                  type="submit"
                  className="w-full py-4 rounded-3xl text-white font-black uppercase tracking-widest shadow-xl shadow-pink-100 hover:shadow-pink-200 active:scale-95 transition-all flex items-center justify-center gap-2 group overflow-hidden"
                  style={{ background: `linear-gradient(45deg, ${STYLE_CONFIG.primary}, ${STYLE_CONFIG.accent})` }}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Verify Code <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                <p className="text-sm font-medium text-neutral-500 text-center">
                  Didn't receive the code?{' '}
                  <button type="button" className="text-pink-500 font-black uppercase tracking-widest text-xs hover:underline">
                    Resend OTP
                  </button>
                </p>
              </form>
            </motion.div>
          )}

          {step === 'new-password' && (
            <motion.div 
              key="new-password"
              variants={containerVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full max-w-md"
            >
              <div className="mb-10 text-center lg:text-left">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 mx-auto lg:mx-0">
                  <KeyRound size={24} className="text-indigo-500" />
                </div>
                <h1 className="text-4xl font-black text-neutral-900 tracking-tight mb-3">Set New Password</h1>
                <p className="text-neutral-500 font-medium">Almost there! Choose a strong password for your account.</p>
              </div>

              <form onSubmit={handleNextStep} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 pl-2">New Password</label>
                  <div className="relative group">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-pink-500 transition-colors" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      className="w-full pl-12 pr-12 py-4 bg-neutral-50 border border-neutral-100 rounded-3xl outline-none focus:ring-2 ring-pink-400 focus:bg-white transition-all text-sm font-bold shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-900"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 pl-2">Confirm New Password</label>
                  <div className="relative group">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-pink-500 transition-colors" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      className="w-full pl-12 pr-12 py-4 bg-neutral-50 border border-neutral-100 rounded-3xl outline-none focus:ring-2 ring-pink-400 focus:bg-white transition-all text-sm font-bold shadow-sm"
                    />
                  </div>
                </div>

                <button
                  disabled={isLoading}
                  type="submit"
                  className="w-full py-4 rounded-3xl text-white font-black uppercase tracking-widest shadow-xl shadow-pink-100 hover:shadow-pink-200 active:scale-95 transition-all flex items-center justify-center gap-2 group overflow-hidden"
                  style={{ background: `linear-gradient(45deg, ${STYLE_CONFIG.primary}, ${STYLE_CONFIG.accent})` }}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Reset Password <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div 
              key="success"
              variants={containerVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full max-w-md text-center"
            >
              <div className="mb-10">
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-8 mx-auto">
                  <CheckCircle2 size={48} className="text-green-500" />
                </div>
                <h1 className="text-4xl font-black text-neutral-900 tracking-tight mb-3">All Set! 🎉</h1>
                <p className="text-neutral-500 font-medium">Your password has been successfully reset. You can now log in with your new credentials.</p>
              </div>

              <Link href="/login">
                <button
                  className="w-full py-4 rounded-3xl text-white font-black uppercase tracking-widest shadow-xl shadow-neutral-100 hover:shadow-neutral-200 active:scale-95 transition-all flex items-center justify-center gap-2 group overflow-hidden"
                  style={{ background: STYLE_CONFIG.gradients.primary }}
                >
                  Back to Login <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
