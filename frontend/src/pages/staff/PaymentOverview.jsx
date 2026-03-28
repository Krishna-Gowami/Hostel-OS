import { useState, useEffect } from 'react'
import api from '../../services/api'
import StatusBadge from '../../components/ui/StatusBadge'
import { CreditCard, Search, Download } from 'lucide-react'

export default function StaffPaymentOverview() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => { fetchPayments() }, [])

  const fetchPayments = async () => {
    try {
      setLoading(true)
      const res = await api.getAllPayments()
      setPayments(res.data?.payments || [])
    } catch { setPayments([]) }
    finally { setLoading(false) }
  }

  const filtered = payments.filter(p => {
    const matchSearch = (p.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.paymentType || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = filterStatus === 'all' || p.status === filterStatus
    return matchSearch && matchStatus
  })

  const totalCollected = payments.filter(p => p.status === 'completed').reduce((s, p) => s + (p.amount || 0), 0)
  const totalPending = payments.filter(p => p.status === 'pending').reduce((s, p) => s + (p.amount || 0), 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-headline font-bold text-on-surface">Payment Overview</h1>
          <p className="text-on-surface-variant text-sm mt-1">Track all hostel payments</p>
        </div>
        <button className="bg-surface-container-lowest ghost-border text-on-surface-variant font-bold text-sm px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-surface-container transition-all">
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface-container-lowest p-5 rounded-xl soft-shadow flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-lg"><CreditCard className="w-5 h-5 text-green-700" /></div>
          <div><div className="font-headline text-2xl font-extrabold text-green-700">₹{totalCollected.toLocaleString()}</div><p className="text-xs text-on-surface-variant">Collected</p></div>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-xl soft-shadow flex items-center gap-4">
          <div className="p-3 bg-amber-100 rounded-lg"><CreditCard className="w-5 h-5 text-amber-700" /></div>
          <div><div className="font-headline text-2xl font-extrabold text-amber-700">₹{totalPending.toLocaleString()}</div><p className="text-xs text-on-surface-variant">Pending</p></div>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-xl soft-shadow flex items-center gap-4">
          <div className="p-3 bg-primary-fixed rounded-lg"><CreditCard className="w-5 h-5 text-primary" /></div>
          <div><div className="font-headline text-2xl font-extrabold text-primary">{payments.length}</div><p className="text-xs text-on-surface-variant">Total Transactions</p></div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
          <input type="text" placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-11 pr-4 py-2.5 bg-surface-container border-none rounded-xl focus:ring-2 focus:ring-primary text-sm" />
        </div>
        <div className="flex gap-2">
          {['all', 'completed', 'pending', 'failed'].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
              filterStatus === s ? 'bg-primary text-white shadow-md' : 'bg-surface-container-lowest text-on-surface-variant ghost-border'
            }`}>{s}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="p-8 text-center text-on-surface-variant">Loading...</div>
      ) : (
        <div className="bg-surface-container-lowest rounded-2xl soft-shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant text-xs uppercase tracking-wider">
                  <th className="px-6 py-3">Student</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Method</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {filtered.map((p, i) => (
                  <tr key={p._id} className={`hover:bg-surface-container-high transition-colors ${i % 2 === 1 ? 'bg-surface-container-low' : ''}`}>
                    <td className="px-6 py-3 text-sm font-medium">{p.user?.name || 'Unknown'}</td>
                    <td className="px-6 py-3 text-sm capitalize">{(p.paymentType || '').replace(/_/g, ' ')}</td>
                    <td className="px-6 py-3 text-sm font-semibold">₹{(p.amount || 0).toLocaleString()}</td>
                    <td className="px-6 py-3 text-sm capitalize">{p.paymentMethod || '-'}</td>
                    <td className="px-6 py-3 text-xs text-on-surface-variant">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-3"><StatusBadge status={p.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
