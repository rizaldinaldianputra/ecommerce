'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquarePlus, User, Loader2 } from 'lucide-react';
import { ReviewService } from '@/services/review.service';
import { Review } from '@/types/review';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authService } from '@/services/auth.service';

interface ProductReviewsProps {
  productId: number;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [userName, setUserName] = useState('');

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const res = await ReviewService.getByProductId(productId);
      setReviews(res.content || []);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authService.isLoggedIn()) {
      toast({ title: 'Login Required', description: 'Please login to leave a review.', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    try {
      await ReviewService.create({
        productId,
        rating,
        comment,
        userName: userName || authService.getUser()?.fullName || 'Anonymous'
      } as any);
      
      toast({ 
        title: 'Review Submitted!', 
        description: 'Thank you for your feedback. Your review will be visible after moderation.',
      });
      
      setShowForm(false);
      setComment('');
      setRating(5);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to submit review.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const avgRating = reviews.length > 0 
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length 
    : 0;

  return (
    <div className="py-12 border-t border-neutral-100">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
        <div>
          <h2 className="text-3xl font-black text-neutral-900 tracking-tight mb-2">Customer Reviews</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={18} 
                  className={i < Math.floor(avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-200'}
                />
              ))}
            </div>
            <span className="text-sm font-bold text-neutral-500">
              {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
            </span>
          </div>
        </div>

        <Button
          onClick={() => setShowForm(!showForm)}
          className="rounded-2xl h-12 px-6 bg-neutral-900 hover:bg-neutral-800 text-white font-bold flex gap-2"
        >
          <MessageSquarePlus size={20} />
          {showForm ? 'Cancel Review' : 'Write a Review'}
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-12"
          >
            <form onSubmit={handleSubmit} className="bg-neutral-50 rounded-[2rem] p-8 space-y-6 max-w-2xl mx-auto shadow-sm">
              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-700">How would you rate this product?</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star 
                        size={32} 
                        className={s <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-300'}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-700">Your Name (Optional)</label>
                <Input 
                  placeholder="e.g. John Doe"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="rounded-xl h-12 bg-white border-neutral-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-700">Your Feedback</label>
                <textarea
                  required
                  placeholder="What did you think of the product?"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full min-h-[120px] rounded-2xl border border-neutral-200 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-2xl h-14 bg-pink-500 hover:bg-pink-600 text-white font-black text-lg gap-3"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : 'Submit Review'}
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-8">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-neutral-300" size={32} />
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 bg-neutral-50 rounded-[2.5rem] border border-dashed border-neutral-200">
            <p className="text-neutral-400 font-medium">No public reviews yet. Be the first to review!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reviews.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-white border border-neutral-100 p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-pink-500 font-bold">
                      <User size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-neutral-900">{review.userName || 'Anonymous User'}</h4>
                      <p className="text-xs text-neutral-400 font-medium">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={14} 
                        className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-100'}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-neutral-600 leading-relaxed italic text-sm">
                  "{review.comment}"
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
