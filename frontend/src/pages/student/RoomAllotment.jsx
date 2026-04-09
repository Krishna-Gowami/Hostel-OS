import { Building2, ArrowRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function RoomAllotment() {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const room = user?.room
  
  const roomDetails = room ? [
    { label: 'Room', value: room.roomNumber || 'N/A' },
    { label: 'Floor', value: room.floor || 'N/A' },
    { label: 'Building', value: room.building || 'N/A' },
    { label: 'Type', value: room.roomType || 'N/A' }
  ] : []

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-headline font-bold text-on-surface">Room Allotment</h1>
          <p className="text-on-surface-variant text-sm mt-1">Apply for room change or new allotment</p>
        </div>
        <button onClick={() => navigate('/rooms')} className="bg-primary-gradient text-white font-bold text-sm px-5 py-2.5 rounded-xl flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20">
          Request Reallocation <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      </div>

      {/* Info Card */}
      <div className="bg-primary-gradient text-white p-8 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="relative z-10">
          <h2 className="font-headline font-bold text-xl mb-2">Current Room Assignment</h2>
          {room ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-6">
              {roomDetails.map(item => (
                <div key={item.label}>
                  <p className="text-white/60 text-xs uppercase tracking-wider">{item.label}</p>
                  <p className="font-headline text-2xl font-extrabold mt-1 capitalize">{item.value}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 text-white/80">
              <p>You do not currently have a room assigned.</p>
              <button onClick={() => navigate('/rooms')} className="mt-4 bg-white text-primary font-bold px-4 py-2 rounded-lg text-sm transition-colors hover:bg-white/90">
                Browse Available Rooms
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-surface-container-lowest p-6 rounded-xl soft-shadow">
        <h3 className="font-headline font-bold text-lg text-on-surface mb-4">Room Allocation Guidelines</h3>
        <ul className="space-y-3 text-sm text-on-surface-variant">
          <li className="flex items-start gap-3"><span className="w-6 h-6 bg-primary-fixed rounded-full flex items-center justify-center text-primary text-xs font-bold shrink-0">1</span>Browse vacant rooms in the Room Management section and opt for your preferred room</li>
          <li className="flex items-start gap-3"><span className="w-6 h-6 bg-primary-fixed rounded-full flex items-center justify-center text-primary text-xs font-bold shrink-0">2</span>Submitting a request alerts the admin/warden to evaluate your application</li>
          <li className="flex items-start gap-3"><span className="w-6 h-6 bg-primary-fixed rounded-full flex items-center justify-center text-primary text-xs font-bold shrink-0">3</span>Room changes and allocations are subject to availability and Warden approval</li>
        </ul>
      </div>
    </div>
  )
}
