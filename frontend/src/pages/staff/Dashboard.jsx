import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import { Users, BedDouble, AlertTriangle, Eye, CreditCard, ClipboardCheck, BarChart3, ArrowRight } from 'lucide-react'

export default function StaffDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({ totalStudents: 0, totalRooms: 0, occupancyRate: 0, openComplaints: 0, pendingVisitors: 0, pendingPayments: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await api.getDashboardStats()
      if (res.data) {
        setStats({
          totalStudents: res.data.users?.totalUsers || res.data.totalStudents || 0,
          totalRooms: res.data.rooms?.totalRooms || res.data.totalRooms || 0,
          occupancyRate: res.data.rooms?.occupancyRate || res.data.occupancyRate || 0,
          openComplaints: res.data.complaints?.openComplaints || res.data.openComplaints || 0,
          pendingVisitors: res.data.visitors?.pendingApprovals || 0,
          pendingPayments: res.data.payments?.pendingPayments || 0,
        })
      }
    } catch {
      // Use fallback
    } finally {
      setLoading(false)
    }
  }

  const quickActions = [
    { label: 'Room Allocation', icon: BedDouble, path: '/staff/rooms', color: 'primary', desc: 'Manage room assignments' },
    { label: 'Complaints', icon: AlertTriangle, path: '/staff/complaints', color: 'amber-600', desc: `${stats.openComplaints} open issues` },
    { label: 'Visitor Approval', icon: Eye, path: '/staff/visitors', color: 'green-600', desc: `${stats.pendingVisitors} pending` },
    { label: 'Payment Overview', icon: CreditCard, path: '/staff/payments', color: 'blue-600', desc: 'View all payments' },
    { label: 'Student Records', icon: Users, path: '/staff/students', color: 'purple-600', desc: 'View student info' },
    { label: 'Reports', icon: BarChart3, path: '/staff/reports', color: 'teal-600', desc: 'Occupancy & financial' },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="bg-primary-gradient text-white p-8 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="relative z-10">
          <h1 className="text-2xl font-headline font-bold">Welcome back, {user?.name || 'Warden'}!</h1>
          <p className="text-white/80 text-sm mt-1">Here's your hostel management overview</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Students', value: stats.totalStudents, icon: Users, color: 'primary' },
          { label: 'Room Occupancy', value: `${stats.occupancyRate}%`, icon: BedDouble, color: 'green-600' },
          { label: 'Open Complaints', value: stats.openComplaints, icon: AlertTriangle, color: 'amber-600' },
          { label: 'Pending Visitors', value: stats.pendingVisitors, icon: Eye, color: 'blue-600' },
        ].map(s => (
          <div key={s.label} className="bg-surface-container-lowest p-5 rounded-xl soft-shadow hover:-translate-y-1 transition-transform duration-300">
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-lg bg-${s.color}/10`}><s.icon className={`w-5 h-5 text-${s.color}`} /></div>
            </div>
            <div className={`font-headline text-2xl font-extrabold text-${s.color}`}>{loading ? '...' : s.value}</div>
            <p className="text-xs text-on-surface-variant font-medium mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="font-headline font-bold text-lg text-on-surface mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map(action => (
            <button key={action.label} onClick={() => navigate(action.path)} className="bg-surface-container-lowest p-5 rounded-xl soft-shadow card-3d text-left group hover:ring-2 ring-primary/20 transition-all">
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-lg bg-${action.color}/10`}>
                  <action.icon className={`w-5 h-5 text-${action.color}`} />
                </div>
                <ArrowRight className="w-4 h-4 text-on-surface-variant group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="font-bold text-sm text-on-surface mt-3 group-hover:text-primary transition-colors">{action.label}</h3>
              <p className="text-xs text-on-surface-variant mt-1">{action.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
