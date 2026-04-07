import { useState, useEffect, useCallback } from 'react'
import api from '../../services/api'
import { toast } from 'react-toastify'
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { BedDouble, CreditCard, Users, AlertTriangle, TrendingUp } from 'lucide-react'

const COLORS = ['#6366f1', '#22c55e', '#ef4444', '#f59e0b']
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function AdminAnalytics() {
  const [stats, setStats] = useState(null)
  const [payStats, setPayStats] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      const [sRes, pRes] = await Promise.all([
        api.getDashboardStats(),
        api.getPaymentStats().catch(() => ({ data: null }))
      ])
      setStats(sRes.data?.stats || null)
      setPayStats(pRes.data || null)
    } catch {}
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  // Build room distribution for pie chart
  const roomPieData = stats ? [
    { name: 'Occupied', value: stats.rooms?.totalOccupants || 0 },
    { name: 'Available', value: (stats.rooms?.totalCapacity || 0) - (stats.rooms?.totalOccupants || 0) - (stats.rooms?.maintenanceRooms || 0) },
    { name: 'Maintenance', value: stats.rooms?.maintenanceRooms || 0 },
  ].filter(d => d.value > 0) : []

  // Build complaint data for bar chart
  const complaintData = stats ? [
    { name: 'Open', count: stats.complaints?.openComplaints || 0, fill: '#f59e0b' },
    { name: 'In Progress', count: stats.complaints?.inProgressComplaints || 0, fill: '#6366f1' },
    { name: 'Resolved', count: stats.complaints?.resolvedComplaints || 0, fill: '#22c55e' },
    { name: 'Urgent', count: stats.complaints?.urgentComplaints || 0, fill: '#ef4444' },
  ] : []

  // Revenue trend — use actual if available else use payment completed amount as single point
  const revenueTrend = payStats?.monthlyRevenue?.map((amt, i) => ({ month: MONTHS[i], revenue: amt })) ||
    (stats?.payments ? [{ month: 'Current', revenue: stats.payments.completedAmount || 0 }] : [])

  const kpis = [
    { label: 'Occupancy Rate', value: stats ? `${Number(stats.rooms?.occupancyRate || 0).toFixed(1)}%` : '—', icon: BedDouble, color: 'primary' },
    { label: 'Total Revenue', value: stats ? `₹${((stats.payments?.completedAmount || 0)/1000).toFixed(1)}K` : '—', icon: CreditCard, color: 'green-600' },
    { label: 'Active Users', value: stats?.users?.activeUsers ?? '—', icon: Users, color: 'blue-600' },
    { label: 'Open Complaints', value: stats?.complaints?.openComplaints ?? '—', icon: AlertTriangle, color: 'amber-600' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-headline font-bold text-on-surface">Analytics Dashboard</h1>
        <p className="text-on-surface-variant text-sm mt-1">System-wide analytics and insights</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(kpi => (
          <div key={kpi.label} className="bg-surface-container-lowest p-5 rounded-xl soft-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg bg-${kpi.color}/10`}><kpi.icon className={`w-5 h-5 text-${kpi.color}`} /></div>
              <TrendingUp className="w-4 h-4 text-green-600 opacity-50" />
            </div>
            <div className={`font-headline text-2xl font-extrabold text-${kpi.color}`}>{loading ? '...' : kpi.value}</div>
            <p className="text-xs text-on-surface-variant font-medium mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-surface-container-lowest p-6 rounded-xl soft-shadow">
          <h3 className="font-headline font-bold text-sm text-on-surface mb-4">Revenue Trend</h3>
          {loading ? <div className="h-56 flex items-center justify-center text-on-surface-variant text-sm">Loading...</div> :
            revenueTrend.length === 0 ? <div className="h-56 flex items-center justify-center text-on-surface-variant text-sm">No data yet</div> : (
            <ResponsiveContainer width="100%" height={224}>
              <AreaChart data={revenueTrend}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
                <Tooltip formatter={v => [`₹${v.toLocaleString()}`, 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" fill="url(#revGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Room Distribution Pie */}
        <div className="bg-surface-container-lowest p-6 rounded-xl soft-shadow">
          <h3 className="font-headline font-bold text-sm text-on-surface mb-4">Room Distribution</h3>
          {loading ? <div className="h-56 flex items-center justify-center text-on-surface-variant text-sm">Loading...</div> :
            roomPieData.length === 0 ? <div className="h-56 flex items-center justify-center text-on-surface-variant text-sm">No room data yet</div> : (
            <ResponsiveContainer width="100%" height={224}>
              <PieChart>
                <Pie data={roomPieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                  {roomPieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Complaint Stats Bar */}
        <div className="bg-surface-container-lowest p-6 rounded-xl soft-shadow">
          <h3 className="font-headline font-bold text-sm text-on-surface mb-4">Complaint Breakdown</h3>
          {loading ? <div className="h-56 flex items-center justify-center text-on-surface-variant text-sm">Loading...</div> : (
            <ResponsiveContainer width="100%" height={224}>
              <BarChart data={complaintData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" radius={[4,4,0,0]}>
                  {complaintData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* User Stats */}
        <div className="bg-surface-container-lowest p-6 rounded-xl soft-shadow">
          <h3 className="font-headline font-bold text-sm text-on-surface mb-4">User Overview</h3>
          {loading ? <div className="h-56 flex items-center justify-center text-on-surface-variant text-sm">Loading...</div> : (
            <div className="space-y-4 mt-4">
              {[
                { label: 'Total Users', value: stats?.users?.totalUsers || 0, max: stats?.users?.totalUsers || 1, color: '#6366f1' },
                { label: 'Active Users', value: stats?.users?.activeUsers || 0, max: stats?.users?.totalUsers || 1, color: '#22c55e' },
                { label: 'Students', value: stats?.users?.students || 0, max: stats?.users?.totalUsers || 1, color: '#f59e0b' },
                { label: 'With Rooms', value: stats?.users?.usersWithRooms || 0, max: stats?.users?.totalUsers || 1, color: '#3b82f6' },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-on-surface-variant">{item.label}</span>
                    <span className="font-bold text-on-surface">{item.value}</span>
                  </div>
                  <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${item.max > 0 ? (item.value/item.max)*100 : 0}%`, background: item.color }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
