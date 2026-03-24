'use client';

import { useState, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Star, MessageSquare, AlertCircle, Camera, ArrowLeft, Send, PackageCheck, Truck, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function OrderCompletePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showComplaint, setShowComplaint] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => router.push('/profile'), 3000);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-white">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-green-100"
        >
          <CheckCircle2 size={48} className="text-white" />
        </motion.div>
        <h1 className="text-4xl font-black text-neutral-900 mb-4 tracking-tight">Review Submitted!</h1>
        <p className="text-neutral-500 font-medium">Thank you for your feedback. Redirecting to your profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <Link href="/profile" className="inline-flex items-center gap-2 text-neutral-400 font-bold text-sm mb-12 hover:text-neutral-900 transition-colors">
        <ArrowLeft size={16} /> Back to My Orders
      </Link>

      <div className="bg-white rounded-[3rem] border border-neutral-100 shadow-2xl shadow-black/5 overflow-hidden">
        {/* Banner Section */}
        <div className="bg-neutral-900 p-8 md:p-12 text-white relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/20 blur-[100px] rounded-full -mr-32 -mt-32" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20">
                  <PackageCheck size={28} className="text-pink-400" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-pink-400">Order #SHZ-{resolvedParams.id || '9921'}</span>
              </div>
              <h1 className="text-4xl font-black tracking-tight mb-2">Order Completed</h1>
              <p className="text-neutral-400 font-medium">How was your experience with shekza?</p>
            </div>
            <button
              onClick={() => setShowComplaint(true)}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2"
            >
              <AlertCircle size={16} /> File a Complaint
            </button>
          </div>
        </div>

        {/* Rating Form */}
        <div className="p-8 md:p-12">
          {!showComplaint ? (
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-6">Overall Rating</p>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(0)}
                      className="transition-all active:scale-90"
                    >
                      <Star
                        size={48}
                        className={`${(hover || rating) >= star ? 'fill-amber-400 text-amber-400 scale-110' : 'text-neutral-200'} transition-all`}
                      />
                    </button>
                  ))}
                </div>
                <p className="mt-4 font-black text-neutral-900">
                  {rating === 1 && "Poor 😞"}
                  {rating === 2 && "Fair 😐"}
                  {rating === 3 && "Good 😊"}
                  {rating === 4 && "Very Good 😍"}
                  {rating === 5 && "Excellent! 🔥"}
                </p>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 pl-4">Tell us about the product</label>
                <div className="relative group">
                  <div className="absolute left-6 top-6 text-neutral-300 group-focus-within:text-pink-500 transition-colors">
                    <MessageSquare size={20} />
                  </div>
                  <textarea
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={5}
                    placeholder="The quality is amazing, the material is very soft..."
                    className="w-full pl-16 pr-6 pt-6 pb-6 bg-neutral-50 border border-neutral-100 rounded-[2rem] outline-none focus:ring-2 ring-pink-400 focus:bg-white transition-all font-bold text-sm text-neutral-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button type="button" className="aspect-square bg-neutral-50 border-2 border-dashed border-neutral-200 rounded-[2rem] flex flex-col items-center justify-center gap-2 text-neutral-400 hover:border-pink-300 hover:text-pink-500 transition-all">
                  <Camera size={24} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Add Photo</span>
                </button>
              </div>

              <button
                type="submit"
                disabled={rating === 0}
                className="w-full py-5 bg-neutral-900 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-2xl shadow-black/20 hover:bg-neutral-800 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:pointer-events-none"
              >
                Submit Review <Send size={18} />
              </button>
            </form>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center gap-4 p-8 bg-red-50 rounded-[2.5rem] border border-red-100">
                <div className="w-14 h-14 bg-red-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-red-200 flex-shrink-0">
                  <AlertCircle size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-red-900">Logistics Complaint</h3>
                  <p className="text-sm text-red-700 font-medium">Is your order delayed or damaged? We're here to help.</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { title: "Not Received Yet", icon: Clock, desc: "Estimated date has passed" },
                  { title: "Damaged Items", icon: AlertCircle, desc: "Order arrived in poor condition" },
                  { title: "Wrong Items", icon: PackageCheck, desc: "Received different products" },
                  { title: "Courier Issues", icon: Truck, desc: "Report staff behavior" },
                ].map(reason => (
                  <button key={reason.title} className="p-6 bg-neutral-50 border border-neutral-100 rounded-[2rem] text-left hover:border-neutral-900 hover:bg-white transition-all group">
                    <reason.icon size={24} className="text-neutral-300 group-hover:text-neutral-900 mb-4 transition-colors" />
                    <h4 className="font-black text-neutral-900">{reason.title}</h4>
                    <p className="text-xs text-neutral-500 font-medium">{reason.desc}</p>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowComplaint(false)}
                className="w-full py-5 bg-white border-2 border-neutral-100 rounded-[2rem] font-black uppercase tracking-widest text-neutral-500 hover:text-neutral-900 hover:border-neutral-900 transition-all"
              >
                Cancel & Go Back to Review
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
