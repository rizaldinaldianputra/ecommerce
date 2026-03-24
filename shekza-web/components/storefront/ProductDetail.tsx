'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, Star, ChevronLeft, ChevronRight, ShieldCheck, Truck, RotateCcw, Share2, Plus, Minus } from 'lucide-react';

interface ProductDetailProps {
  product: {
    id: number;
    name: string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviews: number;
    description: string;
    images: string[];
    colors: string[];
    sizes: string[];
    stock: number;
    features: string[];
  };
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    setTimeout(() => setIsAdding(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-neutral-100 group">
            <AnimatePresence mode="wait">
              <motion.img
                key={selectedImage}
                src={product.images[selectedImage]}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>
            
            <button 
              onClick={() => setSelectedImage((prev) => (prev > 0 ? prev - 1 : product.images.length - 1))}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={() => setSelectedImage((prev) => (prev < product.images.length - 1 ? prev + 1 : 0))}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight size={20} />
            </button>

            <button 
              onClick={() => setIsWishlisted(!isWishlisted)}
              className="absolute top-4 right-4 w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg"
            >
              <Heart size={24} className={isWishlisted ? 'fill-pink-500 text-pink-500' : 'text-neutral-400'} />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${selectedImage === idx ? 'border-pink-500 ring-2 ring-pink-100' : 'border-transparent'}`}
              >
                <img src={img} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-pink-500 font-bold text-sm uppercase tracking-widest mb-1">
              <Star size={14} className="fill-pink-500" /> Best Seller
            </div>
            <h1 className="text-4xl font-black text-neutral-900 tracking-tight mb-4">{product.name}</h1>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-full">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className={i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-neutral-200'} />
                  ))}
                </div>
                <span className="text-sm font-bold text-amber-900">{product.rating}</span>
              </div>
              <span className="text-neutral-400 text-sm font-medium">{product.reviews} customer reviews</span>
            </div>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-black text-neutral-900">${product.price}</span>
              {product.originalPrice && (
                <span className="text-xl text-neutral-400 line-through mb-1">${product.originalPrice}</span>
              )}
            </div>
          </div>

          <p className="text-neutral-600 leading-relaxed mb-8">{product.description}</p>

          {/* Variants */}
          <div className="space-y-8 mb-10">
            {/* Colors */}
            <div>
              <p className="text-sm font-bold text-neutral-900 mb-3">Color: <span className="text-neutral-500">{selectedColor}</span></p>
              <div className="flex gap-3">
                {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-full border-2 p-0.5 transition-all ${selectedColor === color ? 'border-pink-500 scale-110 shadow-lg shadow-pink-100' : 'border-neutral-200'}`}
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
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-bold text-neutral-900">Size: <span className="text-neutral-500">{selectedSize}</span></p>
                <button className="text-xs font-bold text-pink-500 hover:underline">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[3rem] h-11 px-4 rounded-xl text-sm font-bold border-2 transition-all ${selectedSize === size ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mb-10">
            <div className="w-32 h-14 bg-neutral-100 rounded-2xl flex items-center justify-between px-4">
              <button disabled={quantity <= 1} onClick={() => setQuantity(q => q - 1)} className="p-1 hover:text-pink-500 disabled:opacity-30 transition-colors">
                <Minus size={18} />
              </button>
              <span className="font-black text-neutral-900 tabular-nums">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} className="p-1 hover:text-pink-500 transition-colors">
                <Plus size={18} />
              </button>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              className={`flex-1 h-14 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl transition-all ${isAdding ? 'bg-green-500 shadow-green-200' : 'bg-pink-500 hover:bg-pink-600 shadow-pink-200'} text-white`}
            >
              <ShoppingCart size={20} />
              {isAdding ? 'Success!' : 'Add to Cart'}
            </motion.button>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-4 border-t border-neutral-100 pt-8">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center"><Truck size={20} /></div>
              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Free Delivery</p>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center"><RotateCcw size={20} /></div>
              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">30-Day Returns</p>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 bg-green-50 text-green-500 rounded-full flex items-center justify-center"><ShieldCheck size={20} /></div>
              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Secure Payment</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
