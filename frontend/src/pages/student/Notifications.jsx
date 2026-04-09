import { useEffect, useState } from 'react'
import api from '../../services/api'
import { Bell, Clock, Megaphone } from 'lucide-react'

export default function StudentNotifications() {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnnouncementsAndMarkRead = async () => {
      try {
        setLoading(true)
        const res = await api.getAnnouncements()
        setNotices(res.data?.announcements || [])
        // Mark read
        await api.post('/announcements/mark-read')
      } catch (error) {
        console.error("Failed to fetch notices", error)
      } finally {
        setLoading(false)
      }
    }
    fetchAnnouncementsAndMarkRead()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-headline font-bold text-on-surface">Notifications</h1>
        <p className="text-on-surface-variant text-sm mt-1">Stay updated with hostel announcements</p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-on-surface-variant">Loading notifications...</div>
      ) : (
        <div className="space-y-3">
          {notices.map(notice => (
            <div key={notice._id} className="bg-surface-container-lowest p-5 rounded-xl soft-shadow card-3d flex items-start gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                notice.priority === 'urgent' ? 'bg-error-container/30 text-error' :
                notice.priority === 'info' ? 'bg-secondary-fixed text-secondary' :
                'bg-primary-fixed text-primary'
              }`}>
                <Megaphone className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-on-surface">{notice.title}</h4>
                <p className="text-xs text-on-surface-variant mt-1">{notice.message}</p>
                <p className="text-[10px] font-bold text-primary mt-2 flex items-center gap-1">
                  <Clock className="w-3 h-3" />{new Date(notice.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && notices.length === 0 && (
        <div className="bg-surface-container-lowest rounded-2xl soft-shadow p-8 text-center">
          <Bell className="w-12 h-12 mx-auto mb-3 opacity-30 text-on-surface-variant" />
          <p className="font-medium text-on-surface-variant">No notifications</p>
          <p className="text-xs text-on-surface-variant mt-1">You're all caught up!</p>
        </div>
      )}
    </div>
  )
}
