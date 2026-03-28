import { PieChart, BarChart3, TrendingUp, Users, BedDouble, CreditCard, AlertTriangle } from 'lucide-react'

export default function AdminAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-headline font-bold text-on-surface">Analytics Dashboard</h1>
        <p className="text-on-surface-variant text-sm mt-1">System-wide analytics and insights</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Occupancy Rate', value: '94.7%', change: '+2.3%', icon: BedDouble, color: 'primary' },
          { label: 'Monthly Revenue', value: '₹1.85L', change: '+15.8%', icon: CreditCard, color: 'green-600' },
          { label: 'Active Users', value: '189', change: '+12', icon: Users, color: 'blue-600' },
          { label: 'Complaint Resolution', value: '2.5 days', change: '-0.3', icon: AlertTriangle, color: 'amber-600' },
        ].map(kpi => (
          <div key={kpi.label} className="bg-surface-container-lowest p-5 rounded-xl soft-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg bg-${kpi.color}/10`}>
                <kpi.icon className={`w-5 h-5 text-${kpi.color}`} />
              </div>
              <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />{kpi.change}
              </span>
            </div>
            <div className={`font-headline text-2xl font-extrabold text-${kpi.color}`}>{kpi.value}</div>
            <p className="text-xs text-on-surface-variant font-medium mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-xl soft-shadow">
          <h3 className="font-headline font-bold text-lg text-on-surface mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" /> Monthly Revenue Trend
          </h3>
          <div className="h-64 flex items-center justify-center bg-surface-container rounded-xl">
            <div className="text-center text-on-surface-variant">
              <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-medium">Revenue chart</p>
              <p className="text-xs">Data loads from API</p>
            </div>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl soft-shadow">
          <h3 className="font-headline font-bold text-lg text-on-surface mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-primary" /> Room Distribution
          </h3>
          <div className="h-64 flex items-center justify-center bg-surface-container rounded-xl">
            <div className="text-center text-on-surface-variant">
              <PieChart className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-medium">Distribution chart</p>
              <p className="text-xs">Occupied vs Vacant vs Maintenance</p>
            </div>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl soft-shadow">
          <h3 className="font-headline font-bold text-lg text-on-surface mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" /> Complaint Resolution
          </h3>
          <div className="h-64 flex items-center justify-center bg-surface-container rounded-xl">
            <div className="text-center text-on-surface-variant">
              <AlertTriangle className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-medium">Resolution metrics</p>
              <p className="text-xs">Avg resolution time by category</p>
            </div>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl soft-shadow">
          <h3 className="font-headline font-bold text-lg text-on-surface mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" /> User Growth
          </h3>
          <div className="h-64 flex items-center justify-center bg-surface-container rounded-xl">
            <div className="text-center text-on-surface-variant">
              <Users className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-medium">Growth chart</p>
              <p className="text-xs">New registrations trend</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
