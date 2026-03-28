import { mockApplications } from '../../data/mockData'
import StatusBadge from '../../components/ui/StatusBadge'
import { ClipboardCheck, Check, X } from 'lucide-react'

export default function Applications() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-headline font-bold text-on-surface">Application Review Hub</h1>
        <p className="text-on-surface-variant text-sm mt-1">Review and manage student applications</p>
      </div>

      <div className="space-y-4">
        {mockApplications.map(app => (
          <div key={app._id} className="bg-surface-container-lowest p-6 rounded-xl soft-shadow card-3d">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-fixed rounded-xl flex items-center justify-center shrink-0">
                  <ClipboardCheck className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-on-surface">{app.type}</h3>
                  <p className="text-xs text-on-surface-variant mt-1">
                    {app.student.name} ({app.student.studentId})
                  </p>
                  <p className="text-xs text-on-surface-variant mt-1">{app.reason}</p>
                  {app.from && <p className="text-xs text-primary font-medium mt-2">Room {app.from} → {app.to}</p>}
                  {app.preferredFloor && <p className="text-xs text-primary font-medium mt-2">Preferred: Floor {app.preferredFloor}, {app.preferredType}</p>}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={app.status} />
                {app.status === 'pending' && (
                  <div className="flex gap-1">
                    <button className="p-2 bg-green-100 hover:bg-green-200 rounded-lg transition-colors"><Check className="w-4 h-4 text-green-700" /></button>
                    <button className="p-2 bg-error-container hover:bg-red-200 rounded-lg transition-colors"><X className="w-4 h-4 text-error" /></button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
