import { 
  SalesOverviewChart, 
  CategoryDistributionChart, 
  PerformanceChart, 
  WeeklyActivityChart 
} from '@/components/admin/DashboardCharts';
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight 
} from 'lucide-react';

const stats = [
  {
    name: 'Total Revenue',
    value: 'Rp 145.2M',
    change: '+12.5%',
    trend: 'up',
    icon: DollarSign,
    color: 'from-pink-400 to-pink-600',
    lightColor: 'bg-pink-50 text-pink-600 dark:bg-pink-500/10'
  },
  {
    name: 'Total Orders',
    value: '1,248',
    change: '+8.2%',
    trend: 'up',
    icon: ShoppingCart,
    color: 'from-rose-400 to-rose-600',
    lightColor: 'bg-rose-50 text-rose-600 dark:bg-rose-500/10'
  },
  {
    name: 'Active Customers',
    value: '842',
    change: '-2.4%',
    trend: 'down',
    icon: Users,
    color: 'from-blue-400 to-blue-600',
    lightColor: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10'
  },
  {
    name: 'Conversion Rate',
    value: '3.64%',
    change: '+1.2%',
    trend: 'up',
    icon: TrendingUp,
    color: 'from-rose-400 to-rose-600',
    lightColor: 'bg-rose-50 text-rose-600 dark:bg-rose-500/10'
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Here's what's happening with your store today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="relative overflow-hidden rounded-2xl border border-white/40 bg-white/60 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-black/40 group hover:shadow-md transition-all">
            <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${stat.color} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`} />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.name}</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</h3>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.lightColor}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${stat.trend === 'up' ? 'text-pink-700 bg-pink-100/50 dark:text-pink-400 dark:bg-pink-900/30' : 'text-rose-700 bg-rose-100/50 dark:text-rose-400 dark:bg-rose-900/30'}`}>
                {stat.trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {stat.change}
              </span>
              <span className="text-xs text-slate-500">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-white/40 bg-white/60 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-black/40">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Sales & Revenue</h3>
            <p className="text-xs text-slate-500">Overview of your earnings and gross sales</p>
          </div>
          <div className="h-[300px] w-full">
            <SalesOverviewChart />
          </div>
        </div>
        
        <div className="rounded-2xl border border-white/40 bg-white/60 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-black/40">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Sales Categories</h3>
            <p className="text-xs text-slate-500">Distribution of products sold</p>
          </div>
          <div className="h-[300px] w-full">
            <CategoryDistributionChart />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-white/40 bg-white/60 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-black/40">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Weekly Performance</h3>
            <p className="text-xs text-slate-500">Goal progression tracking</p>
          </div>
          <div className="h-[300px] w-full">
            <WeeklyActivityChart />
          </div>
        </div>
        
        <div className="lg:col-span-2 rounded-2xl border border-white/40 bg-white/60 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-black/40">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Acquisition Channels</h3>
            <p className="text-xs text-slate-500">Traffic performance metrics</p>
          </div>
          <div className="h-[300px] w-full">
            <PerformanceChart />
          </div>
        </div>
      </div>
    </div>
  );
}
