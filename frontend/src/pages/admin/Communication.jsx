import { mockNotices } from '../../data/mockData'
import { MessageSquare, Send, Users, Bell, Clock } from 'lucide-react'
import { useState } from 'react'

export default function Communication() {
  const [message, setMessage] = useState('')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-headline font-bold text-on-surface">Communication Center</h1>
        <p className="text-on-surface-variant text-sm mt-1">Send announcements and notifications to residents</p>
      </div>

      {/* Compose */}
      <div className="bg-surface-container-lowest p-6 rounded-xl soft-shadow">
        <h3 className="font-headline font-bold text-sm text-on-surface mb-4">New Announcement</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-on-surface">Target Audience</label>
            <select className="w-full py-3 px-4 bg-surface-container border-none rounded-xl text-sm focus:ring-2 focus:ring-primary">
              <option>All Residents</option><option>Wing A</option><option>Wing B</option><option>Floor 1</option><option>Floor 2</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-on-surface">Title</label>
            <input type="text" placeholder="Announcement title..." className="w-full py-3 px-4 bg-surface-container border-none rounded-xl text-sm focus:ring-2 focus:ring-primary" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-on-surface">Message</label>
            <textarea rows={4} value={message} onChange={e => setMessage(e.target.value)} placeholder="Write your message..." className="w-full py-3 px-4 bg-surface-container border-none rounded-xl text-sm resize-none focus:ring-2 focus:ring-primary" />
          </div>
          <button className="bg-primary-gradient text-white font-bold text-sm px-6 py-3 rounded-xl flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20">
            <Send className="w-4 h-4" /> Send Announcement
          </button>
        </div>
      </div>

      {/* Recent */}
      <div>
        <h3 className="font-headline font-bold text-lg text-on-surface mb-4">Recent Announcements</h3>
        <div className="space-y-3">
          {mockNotices.map(notice => (
            <div key={notice._id} className="bg-surface-container-lowest p-5 rounded-xl soft-shadow card-3d flex items-start gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                notice.color === 'error' ? 'bg-error-container/30 text-error' :
                notice.color === 'secondary' ? 'bg-secondary-fixed text-secondary' :
                notice.color === 'tertiary' ? 'bg-tertiary-fixed text-tertiary' :
                'bg-primary-fixed text-primary'
              }`}>
                <Bell className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-on-surface">{notice.title}</h4>
                <p className="text-xs text-on-surface-variant mt-1">{notice.message}</p>
                <p className="text-[10px] font-bold text-primary mt-2 flex items-center gap-1"><Clock className="w-3 h-3" />{notice.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
