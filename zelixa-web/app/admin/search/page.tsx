'use client';

import { useEffect, useState } from 'react';
import { BarChart3, Search, TrendingUp, Sparkles, MapPin, MousePointer2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export default function SearchAnalyticsPage() {
  const [trending, setTrending] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const mockData = [
    { id: 1, keyword: 'Iphone 15 Pro Max', count: 1250, trend: 'up' },
    { id: 2, keyword: 'Sepatu Lari Nike', count: 840, trend: 'up' },
    { id: 3, keyword: 'Kaos Oversized Black', count: 720, trend: 'steady' },
    { id: 4, keyword: 'Mechanical Keyboard Blue Switch', count: 580, trend: 'up' },
    { id: 5, keyword: 'Smartwatch Gen 6', count: 420, trend: 'down' },
    { id: 6, keyword: 'SSD NVMe 1TB', count: 390, trend: 'up' },
    { id: 7, keyword: 'Laptop Gaming RTX 4060', count: 310, trend: 'up' },
    { id: 8, keyword: 'Headset Wireless 7.1', count: 280, trend: 'steady' },
  ];

  useEffect(() => {
    // Simulate API fetch for trending searches
    setTimeout(() => {
      setTrending(mockData);
      setIsLoading(false);
    }, 800);
  }, []);

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-3xl bg-pink-500/10 flex items-center justify-center text-pink-500 shadow-inner">
             <Search className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 uppercase tracking-tight">Search Insights</h1>
            <p className="text-slate-500 text-sm font-bold italic">Monitor what your customers are searching for in real-time.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Trending List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-xl shadow-slate-100/50 p-8">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-pink-500" />
                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Trending Keywords</h3>
                </div>
                <Badge variant="outline" className="rounded-full px-3 py-1 text-[10px] uppercase font-black bg-slate-50 border-slate-200">Last 7 Days</Badge>
            </div>

            <div className="space-y-4">
               {trending.map((item, index) => (
                 <div key={item.id} className="group flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-slate-200 dark:hover:border-white/10">
                   <div className="flex items-center gap-6">
                     <span className="text-2xl font-black text-slate-200 group-hover:text-pink-500 transition-colors w-8">#{index + 1}</span>
                     <div className="flex flex-col">
                       <span className="text-md font-bold text-slate-800 dark:text-slate-100 uppercase tracking-tight transition-all group-hover:translate-x-1">{item.keyword}</span>
                       <span className="text-xs text-slate-400 font-bold">{item.count.toLocaleString()} unique searches</span>
                     </div>
                   </div>
                   <div className="flex items-center gap-4">
                      {item.trend === 'up' && <Badge className="bg-emerald-500/10 text-emerald-600 border-none rounded-full h-8 w-8 p-0 flex items-center justify-center shadow-none"><TrendingUp className="h-4 w-4" /></Badge>}
                      {item.trend === 'steady' && <Badge className="bg-slate-500/10 text-slate-500 border-none rounded-full h-8 w-8 p-0 flex items-center justify-center shadow-none"><MousePointer2 className="h-4 w-4 rotate-45" /></Badge>}
                      {item.trend === 'down' && <Badge className="bg-rose-500/10 text-rose-500 border-none rounded-full h-8 w-8 p-0 flex items-center justify-center shadow-none rotate-180"><TrendingUp className="h-4 w-4" /></Badge>}
                   </div>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Right Column: Mini Stats */}
        <div className="space-y-8">
           <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-pink-500/20 relative overflow-hidden group">
              <Sparkles className="absolute top-4 right-4 h-24 w-24 opacity-10 group-hover:rotate-12 group-hover:scale-125 transition-transform duration-700" />
              <h4 className="text-xs font-black uppercase tracking-widest opacity-80 mb-6">Top Converting Keyword</h4>
              <p className="text-xl font-bold uppercase mb-2">Mechanical Keyboard</p>
              <div className="flex items-baseline gap-2">
                 <span className="text-4xl font-black">28.4%</span>
                 <span className="text-xs font-bold opacity-80 uppercase tracking-tighter decoration-pink-300 underline underline-offset-4">Conversion Rate</span>
              </div>
           </div>

           <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-white/5 p-8 space-y-6">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Search Distribution</h4>
              
              <div className="space-y-6">
                <div className="space-y-2">
                   <div className="flex justify-between text-[10px] font-bold uppercase tracking-tight text-slate-500">
                     <span>Mobile App</span>
                     <span>82%</span>
                   </div>
                   <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                     <div className="h-full bg-pink-500 rounded-full" style={{ width: '82%' }}></div>
                   </div>
                </div>

                <div className="space-y-2">
                   <div className="flex justify-between text-[10px] font-bold uppercase tracking-tight text-slate-500">
                     <span>Web Desktop</span>
                     <span>18%</span>
                   </div>
                   <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                     <div className="h-full bg-slate-400 rounded-full" style={{ width: '18%' }}></div>
                   </div>
                </div>
              </div>
           </div>

           <div className="bg-slate-50 dark:bg-white/5 rounded-[2rem] p-6 border border-slate-200 dark:border-white/10 flex items-start gap-4">
              <Info className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-slate-500 font-bold leading-relaxed lg:leading-[1.6]">
                  This insights page is <span className="text-pink-600">READ-ONLY</span>. For keyword-based promotions, use the <strong>Banner Management</strong> or <strong>Flash Sale</strong> modules to target high-frequency terms.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
