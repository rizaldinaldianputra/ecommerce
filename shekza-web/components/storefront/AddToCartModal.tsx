'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Star, Plus, Minus, CheckCircle2 } from 'lucide-react';

interface AddToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
    colors: string[];
    sizes: string[];
  };
}

export default function AddToCartModal({ isOpen, onClose, product }: AddToCartModalProps) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleConfirm = () => {
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-neutral-900/40 backdrop-blur-md"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20"
        >
          {isSuccess ? (
            <div className="p-12 text-center flex flex-col items-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-green-100"
              >
                <CheckCircle2 size={40} className="text-white" />
              </motion.div>
              <h3 className="text-2xl font-black text-neutral-900 mb-2">Added to Cart!</h3>
              <p className="text-neutral-500">Redirecting you in a moment...</p>
            </div>
          ) : (
            <>
              <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-neutral-100 transition-colors z-10">
                <X size={20} className="text-neutral-400" />
              </button>

              <div className="flex flex-col sm:flex-row h-full">
                {/* Image Section */}
                <div className="w-full sm:w-1/2 aspect-square p-4">
                  <div className="w-full h-full rounded-2xl overflow-hidden bg-neutral-50">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                </div>

                {/* Details Section */}
                <div className="w-full sm:w-1/2 p-6 sm:pl-2">
                  <div className="mb-6">
                    <h2 className="text-xl font-black text-neutral-900 tracking-tight leading-tight mb-2">{product.name}</h2>
                    <p className="text-2xl font-black text-pink-500">${product.price}</p>
                  </div>

                  {/* Colors */}
                  <div className="mb-6">
                    <p className="text-[10px] font-black uppercase text-neutral-400 tracking-widest mb-3">Color</p>
                    <div className="flex gap-2">
                      {product.colors.map(color => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`w-8 h-8 rounded-full border-2 p-0.5 transition-all ${selectedColor === color ? 'border-neutral-900' : 'border-transparent'}`}
                        >
                          <div 
                            className="w-full h-full rounded-full" 
                            style={{ backgroundColor: color.toLowerCase() === 'black' ? '#000' : color.toLowerCase() === 'white' ? '#fff' : color.toLowerCase() === 'pink' ? '#ff85a2' : '#e5e5e5' }} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sizes */}
                  <div className="mb-8">
                    <p className="text-[10px] font-black uppercase text-neutral-400 tracking-widest mb-3">Size</p>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map(size => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all ${selectedSize === size ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-100 text-neutral-500 hover:border-neutral-300'}`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity & Add */}
                  <div className="flex flex-col gap-4 pt-4 border-t border-neutral-100">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">Quantity</p>
                      <div className="flex items-center gap-4 bg-neutral-50 px-3 py-1.5 rounded-xl">
                        <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-1 hover:text-pink-500 transition-colors">
                          <Minus size={14} />
                        </button>
                        <span className="text-sm font-black text-neutral-900 tabular-nums">{quantity}</span>
                        <button onClick={() => setQuantity(q => q + 1)} className="p-1 hover:text-pink-500 transition-colors">
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleConfirm}
                      className="w-full bg-gradient-to-r from-pink-500 to-rose-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl shadow-pink-100"
                    >
                      <ShoppingCart size={18} /> Add to Cart
                    </motion.button>
                  </div>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
