"use client";

import { useEffect, useState, useCallback } from 'react';
import { wahaService } from '@/services/waha.service';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, RefreshCw, QrCode, LogOut, Loader2, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function WahaConfigPage() {
  const [status, setStatus] = useState<string>('LOADING');
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchStatus = useCallback(async () => {
    try {
      const data = await wahaService.getStatus();
      setStatus(data.status);
      
      if (data.status === 'SCANNING') {
        const url = await wahaService.fetchQrCodeBlob();
        setQrUrl(url);
      } else {
        setQrUrl(null);
      }
    } catch (error) {
      console.error('Failed to fetch WAHA status:', error);
      setStatus('DISCONNECTED');
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    // Poll status every 5 seconds if scanning, otherwise every 15s
    const interval = setInterval(() => {
      fetchStatus();
    }, status === 'SCANNING' ? 5000 : 15000);

    return () => clearInterval(interval);
  }, [fetchStatus, status]);

  const handleStart = async () => {
    setLoading(true);
    try {
      await wahaService.startSession();
      toast.success('Session start initiated');
      await fetchStatus();
    } catch (error) {
      toast.error('Failed to start session');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (!confirm('Are you sure you want to logout? This will disconnect WhatsApp.')) return;
    setLoading(true);
    try {
      await wahaService.logoutSession();
      toast.success('Logged out successfully');
      await fetchStatus();
    } catch (error) {
      toast.error('Failed to logout');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'CONNECTED':
        return <Badge className="bg-emerald-500 hover:bg-emerald-600 border-none"><CheckCircle2 className="w-3 h-3 mr-1" /> Connected</Badge>;
      case 'SCANNING':
        return <Badge className="bg-amber-500 hover:bg-amber-600 border-none"><QrCode className="w-3 h-3 mr-1" /> Ready to Scan</Badge>;
      case 'STARTING':
      case 'INITIALIZING':
        return <Badge className="bg-blue-500 hover:bg-blue-600 animate-pulse border-none text-white">Initializing...</Badge>;
      case 'DISCONNECTED':
      case 'STOPPED':
        return <Badge variant="destructive" className="border-none"><AlertCircle className="w-3 h-3 mr-1" /> Disconnected</Badge>;
      default:
        return <Badge variant="secondary" className="border-none">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
            WhatsApp Connectivity
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            Manage your WAHA session for OTP delivery and service notifications.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="lg" className="rounded-2xl border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition-all" onClick={() => fetchStatus()} disabled={loading}>
            <RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
            Refresh Status
          </Button>
          {status === 'CONNECTED' && (
            <Button variant="destructive" size="lg" className="rounded-2xl shadow-lg shadow-rose-500/20" onClick={handleLogout} disabled={loading}>
              <LogOut className="w-4 h-4 mr-2" />
              Terminate Session
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Connection Info Component */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-white/5 p-8 transition-all hover:shadow-emerald-500/5">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500">
                <MessageCircle className="w-5 h-5" />
              </div>
              Live Session Status
            </h2>
            {getStatusBadge()}
          </div>

          <div className="space-y-6">
            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Active Session</span>
                <span className="text-sm font-bold px-3 py-1 rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-white/5">default</span>
              </div>
              <div className="h-px bg-slate-200/50 dark:bg-white/5" />
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Engine Mode</span>
                <span className="text-sm font-bold flex items-center gap-2 text-emerald-500">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  WAHA Docker
                </span>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {['DISCONNECTED', 'STOPPED', 'UNKNOWN'].includes(status) ? (
                <motion.div 
                  key="disconnected"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <Button size="lg" className="w-full h-20 text-xl font-bold rounded-[1.5rem] bg-emerald-500 hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/30 border-none group" onClick={handleStart} disabled={loading}>
                    {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : (
                      <>
                        <QrCode className="w-8 h-8 mr-3 group-hover:scale-110 transition-transform" />
                        Initialize WhatsApp
                      </>
                    )}
                  </Button>
                  <p className="text-center text-sm text-slate-400 px-4">
                    Before starting, ensure your internet connection is stable and you have WhatsApp ready on your phone.
                  </p>
                </motion.div>
              ) : status === 'CONNECTED' ? (
                <motion.div 
                    key="connected"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-10 flex flex-col items-center justify-center space-y-6 text-center"
                >
                    <div className="relative">
                        <div className="absolute inset-0 bg-emerald-400 blur-2xl opacity-20 animate-pulse rounded-full" />
                        <div className="relative w-24 h-24 rounded-full bg-emerald-500 flex items-center justify-center shadow-2xl shadow-emerald-500/50">
                            <CheckCircle2 className="w-14 h-14 text-white" />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-extrabold text-2xl text-slate-800 dark:text-white">Active & Ready</h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-[250px] mx-auto text-base">
                            Zelixa system is successfully authenticated via WhatsApp.
                        </p>
                    </div>
                </motion.div>
              ) : (
                <div className="h-40 flex items-center justify-center">
                    <Loader2 className="w-10 h-10 text-emerald-500 animate-spin opacity-50" />
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* QR Code Container */}
        <AnimatePresence>
          {(status === 'SCANNING' || qrUrl) && (
            <motion.div
              initial={{ opacity: 0, x: 30, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 30, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-white/5 p-8 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500" />
              
              <div className="mb-8">
                <h2 className="text-xl font-extrabold flex items-center gap-3">
                    Authenticate via QR
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-base leading-relaxed">
                    Open WhatsApp {'>'} Settings {'>'} Linked Devices {'>'} Link a Device.
                </p>
              </div>

              <div className="flex flex-col items-center justify-center space-y-8">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-[2.5rem] blur opacity-10 group-hover:opacity-20 transition duration-500" />
                  <div className="relative p-6 bg-white dark:bg-slate-800 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-white/5 overflow-hidden">
                    {qrUrl ? (
                      <motion.img 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        src={qrUrl} 
                        alt="WhatsApp QR Code" 
                        className="w-64 h-64 md:w-80 md:h-80 select-none group-hover:scale-[1.02] transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-64 h-64 md:w-80 md:h-80 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/50 rounded-2xl">
                        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
                        <span className="mt-4 text-xs text-slate-400 font-bold tracking-widest uppercase">Fetching Secure Key...</span>
                      </div>
                    )}
                    
                    {/* QR Code Scan Animation Line */}
                    {qrUrl && (
                        <div className="absolute left-0 top-0 w-full h-1 bg-emerald-500/30 animate-[scan_2s_ease-in-out_infinite]" 
                             style={{ animation: 'scan 3s ease-in-out infinite' }} />
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center gap-2 text-sm font-bold text-amber-500 bg-amber-50 dark:bg-amber-500/10 px-6 py-3 rounded-2xl border border-amber-200/50 dark:border-amber-500/20">
                        <RefreshCw className="w-4 h-4 animate-spin-slow" />
                        CODE REFRESHES AUTOMATICALLY
                    </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        @keyframes scan {
          0%, 100% { top: 0% }
          50% { top: 100% }
        }
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
