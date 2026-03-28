import { useState, useEffect } from 'react'
import api from '../../services/api'
import { toast } from 'react-toastify'
import StatusBadge from '../../components/ui/StatusBadge'
import { ArrowLeftRight, Check, X, Search, Clock } from 'lucide-react'

export default function StaffLeaveRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => { fetchRequests() }, [])

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const res = await api.getVacationRequests()
      setRequests(res.data?.vacationRequests || res.data?.requests || [])
    } catch { setRequests([]) }
    finally { setLoading(false) }
  }

  const handleApprove = async (id) => {
    try {
      await api.approveVacationRequest(id)
      toast.success('Leave approved')
      fetchRequests()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Approval failed')
    }
  }

  const handleReject = async (id) => {
    try {
      await api.rejectVacationRequest(id, { reason: 'Rejected by warden' })
      toast.success('Leave rejected')
      fetchRequests()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Rejection failed')
    }
  }

  const filtered = requests.filter(r => filterStatus === 'all' || r.status === filterStatus)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-headline font-bold text-on-surface">Leave Requests</h1>
        <p className="text-on-surface-variant text-sm mt-1">Review and approve student leave requests</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['all', 'pending', 'approved', 'rejected'].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
              filterStatus === s ? 'bg-primary text-white shadow-md' : 'bg-surface-container-lowest text-on-surface-variant ghost-border'
            }`}>{s}</button>
        ))}
      </div>

      {loading ? (
        <div className="p-8 text-center text-on-surface-variant">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-2xl soft-shadow p-8 text-center">
          <ArrowLeftRight className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium text-on-surface-variant">No leave requests</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(r => (
            <div key={r._id} className="bg-surface-container-lowest p-5 rounded-xl soft-shadow card-3d">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-10 h-10 bg-primary-fixed rounded-xl flex items-center justify-center shrink-0">
                    <ArrowLeftRight className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-on-surface">{r.user?.name || r.studentName || 'Student'}</h3>
                    <p className="text-xs text-on-surface-variant mt-1">{r.reason || r.type}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-on-surface-variant">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{r.startDate ? `${new Date(r.startDate).toLocaleDateString()} - ${new Date(r.endDate).toLocaleDateString()}` : 'Dates not specified'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={r.status} />
                  {r.status === 'pending' && (
                    <div className="flex gap-1">
                      <button onClick={() => handleApprove(r._id)} className="p-2 bg-green-100 hover:bg-green-200 rounded-lg transition-colors" title="Approve">
                        <Check className="w-4 h-4 text-green-700" />
                      </button>
                      <button onClick={() => handleReject(r._id)} className="p-2 bg-red-100 hover:bg-red-200 rounded-lg transition-colors" title="Reject">
                        <X className="w-4 h-4 text-red-700" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
