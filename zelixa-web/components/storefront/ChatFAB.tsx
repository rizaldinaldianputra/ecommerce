'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, MessageSquare, Send } from 'lucide-react';

export default function ChatFAB() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  return (
    <div className="fixed bottom-6 right-6 z-[90] flex flex-col items-end gap-4">
      {/* Chat window dummy */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="w-[350px] md:w-[400px] h-[500px] bg-white/80 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl shadow-black/10 border border-white/50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white relative">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                  <Sparkles size={20} className="text-white fill-white" />
                </div>
                <div>
                  <h4 className="font-black text-sm tracking-tight">zelixa AI Assistant</h4>
                  <p className="text-[10px] opacity-80 font-bold uppercase tracking-widest leading-none">Always here to help ✨</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 p-2 bg-black/10 hover:bg-black/20 rounded-full transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content (Dummy) */}
            <div className="flex-grow p-6 space-y-4 overflow-y-auto">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center shrink-0">
                  <Sparkles size={14} className="text-purple-500" />
                </div>
                <div className="bg-neutral-100 p-4 rounded-2xl rounded-tl-none">
                  <p className="text-xs font-bold text-neutral-700 leading-relaxed">
                    Hello! I'm zelixa's AI assistant. How can I help you today? 🌸
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-2xl rounded-tr-none text-white shadow-lg shadow-indigo-100">
                  <p className="text-xs font-bold leading-relaxed">
                    Coming soon! I'm currently being trained to help you better. ✨
                  </p>
                </div>
                <p className="text-[10px] font-black text-neutral-300 uppercase tracking-widest pr-1">zelixa AI</p>
              </div>
            </div>

            {/* Input (Dummy) */}
            <div className="p-4 bg-neutral-50 border-t border-neutral-100">
              <div className="relative flex items-center bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden px-4">
                <input
                  type="text"
                  placeholder="Ask me anything..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full py-3 bg-transparent text-xs font-bold text-neutral-800 outline-none"
                />
                <button className="p-2 text-indigo-500 hover:text-indigo-600 transition-colors">
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB Button */}
      <motion.button
        whileHover={{ scale: 1.05, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl relative overflow-hidden group transition-all duration-300 ${isOpen ? 'bg-neutral-900' : 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500'}`}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X size={24} className="text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              className="flex items-center justify-center"
            >
              <Sparkles size={24} className="text-white fill-white" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Glow effect */}
        {!isOpen && (
          <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </motion.button>
    </div>
  );
}
