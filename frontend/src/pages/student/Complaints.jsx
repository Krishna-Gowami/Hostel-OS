import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import { toast } from 'react-toastify'
import StatusBadge from '../../components/ui/StatusBadge'
import Modal from '../../components/ui/Modal'
import { AlertTriangle, Plus, Search, MessageSquare, Clock } from 'lucide-react'

export default function StudentComplaints() {
  const { user } = useAuth()
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({ title: '', description: '', category: 'maintenance', priority: 'medium' })
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => { fetchComplaints() }, [])

  const fetchComplaints = async () => {
    try {
      setLoading(true)
      const res = await api.getAllComplaints({ user: user?._id || user?.id })
      setComplaints(res.data?.complaints || [])
    } catch { setComplaints([]) }
    finally { setLoading(false) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.description) { toast.error('Fill all fields'); return }
    try {
      await api.createComplaint(form)
      toast.success('Complaint submitted successfully!')
      setShowModal(false)
      setForm({ title: '', description: '', category: 'maintenance', priority: 'medium' })
      fetchComplaints()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit')
    }
  }

  const filtered = complaints.filter(c =>
    c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stats = {
    total: complaints.length,
    open: complaints.filter(c => c.status === 'open' || c.status === 'pending').length,
    inProgress: complaints.filter(c => c.status === 'in_progress' || c.status === 'in-progress').length,
    resolved: complaints.filter(c => c.status === 'resolved' || c.status === 'closed').length,
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-headline font-bold text-on-surface">My Complaints</h1>
          <p className="text-on-surface-variant text-sm mt-1">Submit and track your maintenance requests</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-primary-gradient text-white font-bold text-sm px-5 py-2.5 rounded-xl flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" /> New Complaint
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.total, color: 'primary' },
          { label: 'Open', value: stats.open, color: 'amber-600' },
          { label: 'In Progress', value: stats.inProgress, color: 'blue-600' },
          { label: 'Resolved', value: stats.resolved, color: 'green-600' },
        ].map(s => (
          <div key={s.label} className="bg-surface-container-lowest p-4 rounded-xl soft-shadow">
            <div className={`text-2xl font-headline font-extrabold text-${s.color}`}>{s.value}</div>
            <div className="text-xs text-on-surface-variant font-medium mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
        <input type="text" placeholder="Search complaints..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-11 pr-4 py-2.5 bg-surface-container border-none rounded-xl focus:ring-2 focus:ring-primary text-sm" />
      </div>

      {/* Complaints List */}
      {loading ? (
        <div className="p-8 text-center text-on-surface-variant">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-2xl soft-shadow p-8 text-center">
          <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-30 text-on-surface-variant" />
          <p className="font-medium text-on-surface-variant">No complaints found</p>
          <p className="text-xs text-on-surface-variant mt-1">Submit your first complaint using the button above</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(c => (
            <div key={c._id} className="bg-surface-container-lowest p-5 rounded-xl soft-shadow card-3d cursor-pointer hover:ring-2 ring-primary/20 transition-all" onClick={() => setSelected(c)}>
              <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    c.priority === 'urgent' || c.priority === 'high' ? 'bg-error-container/30 text-error' : 'bg-primary-fixed text-primary'
                  }`}>
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-on-surface">{c.title}</h3>
                    <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">{c.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-on-surface-variant">
                      <span className="capitalize">{c.category}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={c.status} />
                  {c.comments?.length > 0 && (
                    <span className="flex items-center gap-1 text-xs text-on-surface-variant"><MessageSquare className="w-3 h-3" />{c.comments.length}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Complaint Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Submit New Complaint">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-on-surface">Category</label>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full py-3 px-4 bg-surface-container border-none rounded-xl text-sm focus:ring-2 focus:ring-primary">
              <option value="maintenance">Maintenance</option>
              <option value="electrical">Electrical</option>
              <option value="plumbing">Plumbing</option>
              <option value="cleaning">Cleaning</option>
              <option value="security">Security</option>
              <option value="wifi">WiFi / Network</option>
              <option value="noise">Noise</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-on-surface">Priority</label>
            <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} className="w-full py-3 px-4 bg-surface-container border-none rounded-xl text-sm focus:ring-2 focus:ring-primary">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-on-surface">Title</label>
            <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Brief description of the issue" className="w-full py-3 px-4 bg-surface-container border-none rounded-xl text-sm focus:ring-2 focus:ring-primary" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-on-surface">Description</label>
            <textarea rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Provide detailed description..." className="w-full py-3 px-4 bg-surface-container border-none rounded-xl text-sm resize-none focus:ring-2 focus:ring-primary" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-xl border border-outline-variant/30 text-on-surface-variant font-semibold text-sm hover:bg-surface-container transition-colors">Cancel</button>
            <button type="submit" className="flex-1 py-3 bg-primary-gradient text-white font-bold text-sm rounded-xl hover:scale-[1.01] active:scale-95 transition-all">Submit Complaint</button>
          </div>
        </form>
      </Modal>

      {/* Complaint Detail Modal */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={selected?.title || 'Complaint Details'}>
        {selected && (
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <StatusBadge status={selected.status} />
              <span className="text-xs text-on-surface-variant">{new Date(selected.createdAt).toLocaleString()}</span>
            </div>
            <div className="p-4 bg-surface-container rounded-xl">
              <p className="text-sm text-on-surface">{selected.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-on-surface-variant text-xs">Category</span><p className="font-medium capitalize">{selected.category}</p></div>
              <div><span className="text-on-surface-variant text-xs">Priority</span><p className="font-medium capitalize">{selected.priority}</p></div>
              <div><span className="text-on-surface-variant text-xs">Assigned To</span><p className="font-medium">{selected.assignedTo?.name || 'Unassigned'}</p></div>
              <div><span className="text-on-surface-variant text-xs">Last Updated</span><p className="font-medium">{new Date(selected.updatedAt).toLocaleDateString()}</p></div>
            </div>
            {selected.comments?.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm text-on-surface mb-2">Comments</h4>
                <div className="space-y-2">
                  {selected.comments.map((cm, i) => (
                    <div key={i} className="p-3 bg-surface-container rounded-lg">
                      <p className="text-xs text-on-surface">{cm.message}</p>
                      <p className="text-[10px] text-on-surface-variant mt-1">{new Date(cm.createdAt).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
