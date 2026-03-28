import { useState, useEffect } from 'react'
import api from '../../services/api'
import { toast } from 'react-toastify'
import StatusBadge from '../../components/ui/StatusBadge'
import { Eye, Check, X, Search, Clock, Phone, User, Download } from 'lucide-react'

export default function AdminVisitors() {
  const [visitors, setVisitors] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => { fetchVisitors() }, [])

  const fetchVisitors = async () => {
    try {
      setLoading(true)
      const res = await api.getAllVisitors()
      setVisitors(res.data?.visitors || [])
    } catch { setVisitors([]) }
    finally { setLoading(false) }
  }

  const handleApprove = async (id) => {
    try { await api.approveVisitor(id); toast.success('Approved'); fetchVisitors() }
    catch (err) { toast.error(err.response?.data?.message || 'Failed') }
  }

  const handleReject = async (id) => {
    try { await api.rejectVisitor(id, { reason: 'Rejected by admin' }); toast.success('Rejected'); fetchVisitors() }
    catch (err) { toast.error(err.response?.data?.message || 'Failed') }
  }

  const handleCheckout = async (id) => {
    try { await api.checkoutVisitor(id); toast.success('Checked out'); fetchVisitors() }
    catch (err) { toast.error(err.response?.data?.message || 'Failed') }
  }

  const filtered = visitors.filter(v => {
    const matchSearch = (v.visitorName || v.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = filterStatus === 'all' || v.status === filterStatus
    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-headline font-bold text-on-surface">Visitor Management</h1>
          <p className="text-on-surface-variant text-sm mt-1">Manage all hostel visitors</p>
        </div>
        <button className="bg-surface-container-lowest ghost-border text-on-surface-variant font-bold text-sm px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-surface-container transition-all">
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
          <input type="text" placeholder="Search visitors..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-11 pr-4 py-2.5 bg-surface-container border-none rounded-xl focus:ring-2 focus:ring-primary text-sm" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'pending', 'approved', 'checked_in', 'checked_out', 'rejected'].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${filterStatus === s ? 'bg-primary text-white shadow-md' : 'bg-surface-container-lowest text-on-surface-variant ghost-border'}`}>{s.replace('_', ' ')}</button>
          ))}
        </div>
      </div>

      {loading ? <div className="p-8 text-center text-on-surface-variant">Loading...</div> : (
        <div className="bg-surface-container-lowest rounded-2xl soft-shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="bg-surface-container-low text-on-surface-variant text-xs uppercase tracking-wider">
                <th className="px-5 py-3">Visitor</th><th className="px-5 py-3">Host</th><th className="px-5 py-3">Purpose</th>
                <th className="px-5 py-3">Date</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Actions</th>
              </tr></thead>
              <tbody className="divide-y divide-outline-variant/10">
                {filtered.map((v, i) => (
                  <tr key={v._id} className={`hover:bg-surface-container-high transition-colors ${i % 2 === 1 ? 'bg-surface-container-low' : ''}`}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-[10px]">
                          {(v.visitorName || v.name || '?').charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-medium">{v.visitorName || v.name}</div>
                          <div className="text-[10px] text-on-surface-variant">{v.visitorPhone || v.phoneNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm">{v.hostUser?.name || 'Unknown'}</td>
                    <td className="px-5 py-3 text-sm max-w-[150px] truncate">{v.purpose}</td>
                    <td className="px-5 py-3 text-xs text-on-surface-variant">{new Date(v.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-3"><StatusBadge status={v.status} /></td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {v.status === 'pending' && (<>
                          <button onClick={() => handleApprove(v._id)} className="p-1.5 bg-green-100 hover:bg-green-200 rounded-lg transition-colors"><Check className="w-3.5 h-3.5 text-green-700" /></button>
                          <button onClick={() => handleReject(v._id)} className="p-1.5 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"><X className="w-3.5 h-3.5 text-red-700" /></button>
                        </>)}
                        {(v.status === 'approved' || v.status === 'checked_in') && (
                          <button onClick={() => handleCheckout(v._id)} className="px-2 py-1 bg-amber-100 hover:bg-amber-200 rounded-lg text-[10px] font-bold text-amber-700 transition-colors">Check Out</button>
                        )}
                      </div>
                    </td>
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
