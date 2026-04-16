'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Star, Plus, Minus, CheckCircle2, Loader2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Product, ProductVariant, AddToCartModalProps } from '@/types/product';
import { toast } from 'sonner';

export default function AddToCartModal({ isOpen, onClose, product }: AddToCartModalProps) {
  const { addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product.variants?.[0]?.color
  );
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.variants?.[0]?.size
  );
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Extract unique styles, colors, and sizes
  const uniqueGroups = Array.from(new Set(product.variants?.map(v => v.groupName).filter(Boolean))) as string[];
  
  // Find current selection group
  const currentVariant = product.variants?.find(v => v.color === selectedColor && v.size === selectedSize);
  const currentGroupName = currentVariant?.groupName || uniqueGroups[0] || '';

  const availableColors = useMemo(() => {
    const groupVariants = currentGroupName ? product.variants?.filter(v => v.groupName === currentGroupName) : product.variants;
    const uniqueColors = new Set(groupVariants?.map(v => v.color).filter(Boolean));
    return Array.from(uniqueColors) as string[];
  }, [product.variants, currentGroupName]);

  const availableSizes = useMemo(() => {
    const groupVariants = currentGroupName ? product.variants?.filter(v => v.groupName === currentGroupName) : product.variants;
    const colorVariants = selectedColor ? groupVariants?.filter(v => v.color === selectedColor) : groupVariants;
    const uniqueSizes = new Set(colorVariants?.map(v => v.size).filter(Boolean));
    return Array.from(uniqueSizes) as string[];
  }, [product.variants, currentGroupName, selectedColor]);

  // Update selected variant price
  const displayPrice = currentVariant?.price || product.price || 0;

  const handleConfirm = async () => {
    if (!currentVariant) {
      toast.error('Selected combination is not available');
      return;
    }

    setIsSubmitting(true);
    try {
      await addToCart({
        productVariantId: currentVariant.id,
        quantity: quantity
      });
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1500);
    } catch (error) {
      // Error handled by context
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-neutral-900/60 backdrop-blur-xl"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-white/20"
        >
          {isSuccess ? (
            <div className="p-16 text-center flex flex-col items-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-emerald-100"
              >
                <CheckCircle2 size={48} className="text-white" />
              </motion.div>
              <h3 className="text-3xl font-black text-neutral-900 mb-2">Cool! Added to Bag.</h3>
              <p className="text-neutral-500 font-bold uppercase tracking-widest text-xs">Ready for checkout soon</p>
            </div>
          ) : (
            <>
              <button onClick={onClose} className="absolute top-8 right-8 p-3 rounded-2xl hover:bg-neutral-100 transition-all z-20 group">
                <X size={20} className="text-neutral-400 group-hover:text-neutral-900" />
              </button>

              <div className="flex flex-col md:flex-row h-full">
                {/* Image Section */}
                <div className="w-full md:w-5/12 aspect-square p-6">
                  <div className="w-full h-full rounded-[2rem] overflow-hidden bg-neutral-100 group shadow-inner">
                    <img 
                      src={currentVariant?.imageUrl || product.imageUrl || product.img} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                  </div>
                </div>
  
                {/* Details Section */}
                <div className="w-full md:w-7/12 p-8 md:pl-4 overflow-y-auto max-h-[80vh] flex flex-col">
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-3">
                      {product.isBestSeller && <span className="px-2 py-0.5 bg-pink-500 text-[8px] font-black text-white rounded-lg uppercase tracking-widest">Best Seller</span>}
                    </div>
                    <h2 className="text-2xl font-black text-neutral-900 tracking-tight leading-tight mb-2">{product.name}</h2>
                    <p className="text-3xl font-black text-neutral-900">Rp {displayPrice.toLocaleString('id-ID')}</p>
                  </div>

                  <div className="space-y-8 flex-1">
                    {/* Styles */}
                    {uniqueGroups.length > 1 && (
                      <div>
                        <p className="text-[10px] font-black uppercase text-neutral-400 tracking-[0.2em] mb-4">Style</p>
                        <div className="flex flex-wrap gap-2">
                          {uniqueGroups.map(group => (
                            <button
                              key={group}
                              onClick={() => {
                                const firstInGroup = product.variants?.find(v => v.groupName === group);
                                if (firstInGroup) {
                                  setSelectedColor(firstInGroup.color);
                                  setSelectedSize(firstInGroup.size);
                                }
                              }}
                              className={`px-4 py-2 rounded-xl text-xs font-black border-2 transition-all ${currentGroupName === group ? 'border-neutral-900 bg-neutral-900 text-white shadow-lg shadow-neutral-100' : 'border-neutral-100 text-neutral-400 hover:border-neutral-200'}`}
                            >
                              {group}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
  
                    {/* Colors */}
                    {availableColors.length > 0 && (
                      <div>
                        <p className="text-[10px] font-black uppercase text-neutral-400 tracking-[0.2em] mb-4">Color: <span className="text-pink-500">{selectedColor}</span></p>
                        <div className="flex flex-wrap gap-3">
                          {availableColors.map(color => {
                            const variant = product.variants?.find(v => v.color === color && v.groupName === currentGroupName);
                            return (
                              <button
                                key={color}
                                onClick={() => setSelectedColor(color)}
                                className={`w-10 h-10 rounded-full border-2 p-0.5 transition-all flex items-center justify-center ${selectedColor === color ? 'border-pink-500 shadow-lg shadow-pink-100' : 'border-transparent hover:border-neutral-200'}`}
                              >
                                {variant?.hexColor ? (
                                  <div 
                                    className="w-full h-full rounded-full border border-neutral-100" 
                                    style={{ backgroundColor: variant.hexColor }} 
                                  />
                                ) : (
                                  <div className="w-full h-full rounded-full bg-neutral-200" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
  
                    {/* Sizes */}
                    {availableSizes.length > 0 && (
                      <div>
                        <p className="text-[10px] font-black uppercase text-neutral-400 tracking-[0.2em] mb-4">Size: <span className="text-pink-500">{selectedSize}</span></p>
                        <div className="flex flex-wrap gap-2">
                          {availableSizes.map(size => (
                            <button
                              key={size}
                              onClick={() => setSelectedSize(size)}
                              className={`min-w-[3.5rem] h-11 flex items-center justify-center rounded-xl text-xs font-black border-2 transition-all ${selectedSize === size ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-100 text-neutral-400 hover:border-neutral-200'}`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
  
                  {/* Quantity & Add */}
                  <div className="flex flex-col gap-5 pt-8 mt-4 border-t border-neutral-100">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-black uppercase text-neutral-400 tracking-[0.2em]">Quantity</p>
                      <div className="flex items-center gap-5 bg-neutral-100 px-4 py-2 rounded-2xl">
                        <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-1 hover:text-pink-500 transition-colors disabled:opacity-20" disabled={quantity <= 1}>
                          <Minus size={16} />
                        </button>
                        <span className="text-base font-black text-neutral-900 tabular-nums">{quantity}</span>
                        <button onClick={() => setQuantity(q => q + 1)} className="p-1 hover:text-pink-500 transition-colors">
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
  
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      disabled={isSubmitting || !currentVariant}
                      onClick={handleConfirm}
                      className={`w-full h-16 rounded-2xl font-black text-md flex items-center justify-center gap-3 shadow-2xl transition-all ${isSubmitting ? 'bg-neutral-100 text-neutral-400' : 'bg-pink-500 hover:bg-pink-600 text-white shadow-pink-200'} disabled:opacity-50 uppercase tracking-tight`}
                    >
                      {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <ShoppingCart size={20} />} 
                      {isSubmitting ? 'Adding...' : 'Confirm Selection'}
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
