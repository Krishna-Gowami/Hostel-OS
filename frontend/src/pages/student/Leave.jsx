import { mockLeaveRequests } from '../../data/mockData'
import StatusBadge from '../../components/ui/StatusBadge'
import { useState } from 'react'
import Modal from '../../components/ui/Modal'
import { ArrowLeftRight, Plus, Calendar, Clock } from 'lucide-react'

export default function Leave() {
  const [requests] = useState(mockLeaveRequests)
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-headline font-bold text-on-surface">Leave Management</h1>
          <p className="text-on-surface-variant text-sm mt-1">Apply for leave and track your requests</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-primary-gradient text-white font-bold text-sm px-5 py-2.5 rounded-xl flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" /> Apply Leave
        </button>
      </div>

      <div className="space-y-4">
        {requests.map(req => (
          <div key={req._id} className="bg-surface-container-lowest p-6 rounded-xl soft-shadow card-3d">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-fixed rounded-xl flex items-center justify-center shrink-0">
                  <ArrowLeftRight className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-on-surface">{req.type}</h3>
                  <p className="text-xs text-on-surface-variant mt-1">{req.reason}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-on-surface-variant">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {req.from} → {req.to}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Applied: {req.appliedOn}</span>
                  </div>
                </div>
              </div>
              <StatusBadge status={req.status} />
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Apply for Leave">
        <form className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-on-surface">Leave Type</label>
            <select className="w-full py-3 px-4 bg-surface-container border-none rounded-xl text-sm focus:ring-2 focus:ring-primary">
              <option>Home Visit</option><option>Medical</option><option>Personal</option><option>Emergency</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><label className="text-sm font-semibold text-on-surface">From</label><input type="date" className="w-full py-3 px-4 bg-surface-container border-none rounded-xl text-sm focus:ring-2 focus:ring-primary" /></div>
            <div className="space-y-2"><label className="text-sm font-semibold text-on-surface">To</label><input type="date" className="w-full py-3 px-4 bg-surface-container border-none rounded-xl text-sm focus:ring-2 focus:ring-primary" /></div>
          </div>
          <div className="space-y-2"><label className="text-sm font-semibold text-on-surface">Reason</label><textarea rows={3} className="w-full py-3 px-4 bg-surface-container border-none rounded-xl text-sm resize-none focus:ring-2 focus:ring-primary" /></div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-xl border border-outline-variant/30 text-on-surface-variant font-semibold text-sm">Cancel</button>
            <button type="submit" className="flex-1 py-3 bg-primary-gradient text-white font-bold text-sm rounded-xl">Submit</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
