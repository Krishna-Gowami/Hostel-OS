import { useState, useEffect } from 'react'
import api from '../../services/api'
import { toast } from 'react-toastify'
import StatusBadge from '../../components/ui/StatusBadge'
import Modal from '../../components/ui/Modal'
import { Search, BedDouble, Wifi, Wind, Bath, Plus } from 'lucide-react'

export default function AdminRooms() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('grid')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [form, setForm] = useState({ roomNumber: '', building: 'Block A', floor: 0, capacity: 2, monthlyRent: 5000, securityDeposit: 10000, roomType: 'double' })

  useEffect(() => { fetchRooms() }, [])

  const fetchRooms = async () => {
    try {
      setLoading(true)
      const res = await api.getAllRooms()
      setRooms(res.data?.rooms || [])
    } catch { setRooms([]) }
    finally { setLoading(false) }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await api.createRoom(form)
      toast.success('Room created!')
      setShowCreateModal(false)
      setForm({ roomNumber: '', building: 'Block A', floor: 0, capacity: 2, monthlyRent: 5000, securityDeposit: 10000, roomType: 'double' })
      fetchRooms()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create room')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this room?')) return
    try {
      await api.deleteRoom(id)
      toast.success('Room deleted')
      fetchRooms()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed')
    }
  }

  const getStatus = (room) => {
    if (room.currentOccupancy > 0) return 'occupied'
    if (room.isAvailable) return 'vacant'
    return 'maintenance'
  }

  const filtered = rooms.filter(r => {
    const status = getStatus(r)
    return filterStatus === 'all' || status === filterStatus
  })

  const stats = {
    total: rooms.length,
    occupied: rooms.filter(r => r.currentOccupancy > 0).length,
    vacant: rooms.filter(r => r.isAvailable && r.currentOccupancy === 0).length,
    maintenance: rooms.filter(r => !r.isAvailable && r.currentOccupancy === 0).length,
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-headline font-bold text-on-surface">Room Management</h1>
          <p className="text-on-surface-variant text-sm mt-1">Manage all hostel rooms and allocations</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowCreateModal(true)} className="bg-primary-gradient text-white font-bold text-sm px-5 py-2.5 rounded-xl flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20">
            <Plus className="w-4 h-4" /> Add Room
          </button>
          <button onClick={() => setView('grid')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === 'grid' ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant'}`}>Grid</button>
          <button onClick={() => setView('list')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === 'list' ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant'}`}>List</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Rooms', value: stats.total, color: 'primary' },
          { label: 'Occupied', value: stats.occupied, color: 'blue-600' },
          { label: 'Vacant', value: stats.vacant, color: 'green-600' },
          { label: 'Maintenance', value: stats.maintenance, color: 'error' },
        ].map(s => (
          <div key={s.label} className="bg-surface-container-lowest p-4 rounded-xl soft-shadow">
            <div className={`text-2xl font-headline font-extrabold text-${s.color}`}>{loading ? '...' : s.value}</div>
            <div className="text-xs text-on-surface-variant font-medium mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'occupied', 'vacant', 'maintenance'].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)} className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
            filterStatus === s ? 'bg-primary text-white' : 'bg-surface-container-lowest text-on-surface-variant ghost-border hover:bg-surface-container'
          }`}>{s}</button>
        ))}
      </div>

      {/* Room Grid/List */}
      {loading ? (
        <div className="p-8 text-center text-on-surface-variant">Loading rooms...</div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map(room => {
            const status = getStatus(room)
            return (
              <div key={room._id} className={`p-4 rounded-xl card-3d cursor-pointer ${
                status === 'occupied' ? 'bg-primary/5 ghost-border' :
                status === 'vacant' ? 'bg-green-50 border border-green-200' :
                'bg-error/5 border border-error/20'
              }`}>
                <div className="flex justify-between items-start mb-3">
                  <span className="font-headline font-bold text-lg">{room.roomNumber}</span>
                  <StatusBadge status={status} />
                </div>
                <div className="text-xs text-on-surface-variant space-y-1">
                  <p>Floor {room.floor} • {room.building}</p>
                  <p className="capitalize">{room.roomType} • {room.currentOccupancy}/{room.capacity}</p>
                  <p className="font-medium">₹{(room.monthlyRent || 0).toLocaleString()}/mo</p>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-2xl soft-shadow overflow-hidden">
          <table className="w-full text-left">
            <thead><tr className="bg-surface-container-low text-on-surface-variant text-xs uppercase tracking-wider">
              <th className="px-6 py-4">Room</th><th className="px-6 py-4">Floor</th><th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Occupancy</th><th className="px-6 py-4">Status</th><th className="px-6 py-4">Rent</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr></thead>
            <tbody className="divide-y divide-outline-variant/10">
              {filtered.map((room, i) => (
                <tr key={room._id} className={`hover:bg-surface-container-high transition-colors ${i % 2 === 1 ? 'bg-surface-container-low' : ''}`}>
                  <td className="px-6 py-4 font-bold text-sm">{room.roomNumber}</td>
                  <td className="px-6 py-4 text-sm">Floor {room.floor}</td>
                  <td className="px-6 py-4 text-sm capitalize">{room.roomType}</td>
                  <td className="px-6 py-4 text-sm">{room.currentOccupancy}/{room.capacity}</td>
                  <td className="px-6 py-4"><StatusBadge status={getStatus(room)} /></td>
                  <td className="px-6 py-4 text-sm font-medium">₹{(room.monthlyRent || 0).toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(room._id)} className="text-xs text-error hover:text-error/80 font-medium">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Room Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Add New Room">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-on-surface">Room Number</label>
              <input type="text" value={form.roomNumber} onChange={e => setForm({...form, roomNumber: e.target.value})} className="w-full py-3 px-4 bg-surface-container border-none rounded-xl text-sm focus:ring-2 focus:ring-primary" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-on-surface">Building</label>
              <input type="text" value={form.building} onChange={e => setForm({...form, building: e.target.value})} className="w-full py-3 px-4 bg-surface-container border-none rounded-xl text-sm focus:ring-2 focus:ring-primary" required />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-on-surface">Floor</label>
              <input type="number" min="0" value={form.floor} onChange={e => setForm({...form, floor: parseInt(e.target.value)})} className="w-full py-3 px-4 bg-surface-container border-none rounded-xl text-sm focus:ring-2 focus:ring-primary" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-on-surface">Capacity</label>
              <select value={form.capacity} onChange={e => setForm({...form, capacity: parseInt(e.target.value)})} className="w-full py-3 px-4 bg-surface-container border-none rounded-xl text-sm focus:ring-2 focus:ring-primary">
                <option value={1}>1</option><option value={2}>2</option><option value={3}>3</option><option value={4}>4</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-on-surface">Type</label>
              <select value={form.roomType} onChange={e => setForm({...form, roomType: e.target.value})} className="w-full py-3 px-4 bg-surface-container border-none rounded-xl text-sm focus:ring-2 focus:ring-primary">
                <option value="single">Single</option><option value="double">Double</option><option value="triple">Triple</option><option value="quad">Quad</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-on-surface">Monthly Rent (₹)</label>
              <input type="number" min="0" value={form.monthlyRent} onChange={e => setForm({...form, monthlyRent: parseInt(e.target.value)})} className="w-full py-3 px-4 bg-surface-container border-none rounded-xl text-sm focus:ring-2 focus:ring-primary" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-on-surface">Security Deposit (₹)</label>
              <input type="number" min="0" value={form.securityDeposit} onChange={e => setForm({...form, securityDeposit: parseInt(e.target.value)})} className="w-full py-3 px-4 bg-surface-container border-none rounded-xl text-sm focus:ring-2 focus:ring-primary" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 py-3 rounded-xl border border-outline-variant/30 text-on-surface-variant font-semibold text-sm">Cancel</button>
            <button type="submit" className="flex-1 py-3 bg-primary-gradient text-white font-bold text-sm rounded-xl hover:scale-[1.01] active:scale-95 transition-all">Create Room</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
