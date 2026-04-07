import { useState, useEffect, useCallback } from 'react'
import api from '../../services/api'
import { toast } from 'react-toastify'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { CreditCard, TrendingUp, Users, BedDouble, Plus, Search, Filter, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import StatusBadge from '../../components/ui/StatusBadge'
import Modal from '../../components/ui/Modal'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function PaymentManagement() {
  const [payments, setPayments] = useState([])
  const [stats, setStats] = useState(null)
  const [dashStats, setDashStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [search, setSearch] = useState('')
  const [showManualModal, setShowManualModal] = useState(false)
  const [manualForm, setManualForm] = useState({ userId: '', amount: '', paymentType: 'monthly_rent', description: '' })
  const [page, setPage] = useState(1)

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true)
      const [pRes, sRes, dRes] = await Promise.all([
        api.getAllPayments({ page, limit: 20, status: filterStatus !== 'all' ? filterStatus : undefined }),
        api.getPaymentStats().catch(() => ({ data: null })),
        api.getDashboardStats().catch(() => ({ data: null }))
      ])
      setPayments(pRes.data?.payments || [])
      setStats(sRes.data || sRes.data?.stats || null)
      setDashStats(dRes.data?.stats || null)
    } catch { setPayments([]) }
    finally { setLoading(false) }
  }, [filterStatus, page])

  useEffect(() => { fetchAll() }, [fetchAll])

  const handleManualPayment = async e => {
    e.preventDefault()
    try {
      await api.createManualPayment(manualForm)
      toast.success('Manual payment recorded!')
      setShowManualModal(false)
      setManualForm({ userId: '', amount: '', paymentType: 'monthly_rent', description: '' })
      fetchAll()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed') }
  }

  // Build revenue trend for chart
  const revenueTrend = stats?.monthlyRevenue?.map((amt, i) => ({ month: MONTHS[i], revenue: amt })) ||
    (dashStats?.payments ? [
      { month: 'Collected', revenue: dashStats.payments.completedAmount || 0 },
      { month: 'Pending', revenue: dashStats.payments.pendingAmount || 0 },
    ] : [])

  const totalCollections = dashStats?.payments?.completedAmount || stats?.completedAmount || 0
  const pendingDues = dashStats?.payments?.pendingAmount || stats?.pendingAmount || 0
  const activeStudents = dashStats?.users?.students || 0
  const availableBeds = (dashStats?.rooms?.totalCapacity || 0) - (dashStats?.rooms?.totalOccupants || 0)

  const kpis = [
    { label: 'Total Collections', value: `₹${totalCollections.toLocaleString()}`, sub: 'All time collected', icon: CheckCircle, color: 'green-600' },
    { label: 'Pending Dues', value: `₹${pendingDues.toLocaleString()}`, sub: 'Outstanding amount', icon: Clock, color: 'amber-600' },
    { label: 'Active Students', value: activeStudents, sub: 'Enrolled students', icon: Users, color: 'primary' },
    { label: 'Available Beds', value: availableBeds, sub: 'Unoccupied beds', icon: BedDouble, color: 'blue-600' },
  ]

  const filtered = payments.filter(p => {
    const matchSearch = search === '' ||
      (p.user?.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.user?.studentId || '').toLowerCase().includes(search.toLowerCase())
    return matchSearch
  })

  const statusIcon = { completed: CheckCircle, pending: Clock, failed: AlertCircle, refunded: TrendingUp }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-headline font-bold text-on-surface">Payment Management</h1>
          <p className="text-on-surface-variant text-sm mt-1">Track collections, dues, and payment history</p>
        </div>
        <button onClick={() => setShowManualModal(true)} className="bg-primary-gradient text-white font-bold text-sm px-5 py-2.5 rounded-xl flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" /> Record Payment
        </button>
      </div>

      {/* KPI Cards — matching Stitch design */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(kpi => (
          <div key={kpi.label} className="bg-surface-container-lowest p-5 rounded-xl soft-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg bg-${kpi.color}/10`}><kpi.icon className={`w-5 h-5 text-${kpi.color}`} /></div>
              <TrendingUp className="w-4 h-4 text-green-600 opacity-50" />
            </div>
            <div className={`font-headline text-2xl font-extrabold text-${kpi.color}`}>{loading ? '...' : kpi.value}</div>
            <p className="text-sm font-semibold text-on-surface mt-0.5">{kpi.label}</p>
            <p className="text-xs text-on-surface-variant">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Revenue Growth Chart */}
      {revenueTrend.length > 0 && (
        <div className="bg-surface-container-lowest p-6 rounded-xl soft-shadow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-headline font-bold text-on-surface">Revenue Growth</h3>
              <p className="text-xs text-on-surface-variant">Monthly fee collections overview</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueTrend}>
              <defs>
                <linearGradient id="revGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
              <Tooltip formatter={v => [`₹${Number(v).toLocaleString()}`, 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke="#22c55e" fill="url(#revGrad2)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
          <input type="text" placeholder="Search student..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-11 pr-4 py-2.5 bg-surface-container border-none rounded-xl focus:ring-2 focus:ring-primary text-sm" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'pending', 'completed', 'failed', 'refunded'].map(s => (
            <button key={s} onClick={() => { setFilterStatus(s); setPage(1) }}
              className={`px-3 py-2 rounded-xl text-xs font-bold capitalize transition-all ${filterStatus === s ? 'bg-primary text-white shadow-md' : 'bg-surface-container-lowest text-on-surface-variant ghost-border'}`}>{s}</button>
          ))}
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-surface-container-lowest rounded-2xl soft-shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-outline-variant/10">
          <h3 className="font-headline font-bold text-on-surface">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead><tr className="bg-surface-container-low text-on-surface-variant text-xs uppercase tracking-wider">
              <th className="px-6 py-3">Student Name</th>
              <th className="px-6 py-3">Room No</th>
              <th className="px-6 py-3">Payment Type</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Status</th>
            </tr></thead>
            <tbody className="divide-y divide-outline-variant/10">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-8 text-on-surface-variant">Loading payments...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-on-surface-variant text-sm">No payments found</td></tr>
              ) : filtered.map((p, i) => {
                const SIcon = statusIcon[p.status] || Clock
                return (
                  <tr key={p._id} className={`hover:bg-surface-container-high transition-colors ${i % 2 === 1 ? 'bg-surface-container-low' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-[10px]">{(p.user?.name || '?').charAt(0)}</div>
                        <div>
                          <div className="text-sm font-medium">{p.user?.name || '—'}</div>
                          <div className="text-[10px] text-on-surface-variant">{p.user?.studentId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">{p.user?.room?.roomNumber || p.roomNumber || '—'}</td>
                    <td className="px-6 py-4 text-sm capitalize">{p.paymentType || '—'}</td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">{new Date(p.createdAt).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'2-digit' })}</td>
                    <td className="px-6 py-4 text-sm font-bold">₹{(p.finalAmount || p.amount || 0).toLocaleString()}</td>
                    <td className="px-6 py-4"><StatusBadge status={p.status} /></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Payment Modal */}
      <Modal isOpen={showManualModal} onClose={() => setShowManualModal(false)} title="Record Manual Payment">
        <form onSubmit={handleManualPayment} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-on-surface">Student User ID</label>
            <input type="text" value={manualForm.userId} onChange={e => setManualForm(f=>({...f, userId: e.target.value}))}
              placeholder="MongoDB user _id..." className="w-full py-3 px-4 bg-surface-container border-none rounded-xl text-sm focus:ring-2 focus:ring-primary" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-on-surface">Amount (₹)</label>
              <input type="number" min="1" value={manualForm.amount} onChange={e => setManualForm(f=>({...f, amount: e.target.value}))}
                className="w-full py-3 px-4 bg-surface-container border-none rounded-xl text-sm focus:ring-2 focus:ring-primary" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-on-surface">Payment Type</label>
              <select value={manualForm.paymentType} onChange={e => setManualForm(f=>({...f, paymentType: e.target.value}))} className="w-full py-3 px-4 bg-surface-container border-none rounded-xl text-sm focus:ring-2 focus:ring-primary">
                <option value="monthly_rent">Monthly Rent</option>
                <option value="full_month">Full Month</option>
                <option value="security_deposit">Security Deposit</option>
                <option value="mess_fee">Mess Fee</option>
                <option value="maintenance">Maintenance</option>
                <option value="fine">Fine</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-on-surface">Description (optional)</label>
            <input type="text" value={manualForm.description} onChange={e => setManualForm(f=>({...f, description: e.target.value}))}
              placeholder="e.g. Cash payment for March rent..." className="w-full py-3 px-4 bg-surface-container border-none rounded-xl text-sm focus:ring-2 focus:ring-primary" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowManualModal(false)} className="flex-1 py-3 rounded-xl border border-outline-variant/30 text-on-surface-variant font-semibold text-sm">Cancel</button>
            <button type="submit" className="flex-1 py-3 bg-primary-gradient text-white font-bold text-sm rounded-xl">Record Payment</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
