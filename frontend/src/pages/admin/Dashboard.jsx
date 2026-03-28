import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import { Users, BedDouble, AlertTriangle, CreditCard, Eye, Clock, ArrowRight, Bell, TrendingUp } from 'lucide-react'

export default function AdminDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchStats() }, [])

  const fetchStats = async () => {
    try {
      const res = await api.getDashboardStats()
      setStats(res.data)
    } catch {
      // Use fallback
      setStats({
        totalStudents: '—', totalRooms: '—', occupancyRate: '—',
        openComplaints: '—', pendingPayments: '—', pendingVisitors: '—',
        totalRevenue: '—',
      })
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { label: 'Total Users', value: stats?.users?.totalUsers || stats?.totalStudents || '—', icon: Users, color: 'primary', trend: '+12%', path: '/admin/users' },
    { label: 'Room Occupancy', value: `${stats?.rooms?.occupancyRate || stats?.occupancyRate || '—'}%`, icon: BedDouble, color: 'green-600', trend: '+2.3%', path: '/admin/rooms' },
    { label: 'Open Issues', value: stats?.complaints?.openComplaints || stats?.openComplaints || '—', icon: AlertTriangle, color: 'amber-600', trend: '-8%', path: '/admin/complaints' },
    { label: 'Revenue', value: `₹${((stats?.payments?.thisMonthRevenue || stats?.totalRevenue || 0) / 1000).toFixed(0)}K`, icon: CreditCard, color: 'blue-600', trend: '+15%', path: '/admin/payments' },
  ]

  const quickLinks = [
    { label: 'User Management', icon: Users, path: '/admin/users', desc: 'Manage all users' },
    { label: 'Room Management', icon: BedDouble, path: '/admin/rooms', desc: 'Room allocation' },
    { label: 'Complaints', icon: AlertTriangle, path: '/admin/complaints', desc: `${stats?.complaints?.openComplaints || 0} open` },
    { label: 'Visitors', icon: Eye, path: '/admin/visitors', desc: `${stats?.visitors?.pendingApprovals || 0} pending` },
    { label: 'Payments', icon: CreditCard, path: '/admin/payments', desc: 'Financial overview' },
    { label: 'Notifications', icon: Bell, path: '/admin/communication', desc: 'Send announcements' },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-primary-gradient text-white p-8 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -mr-24 -mt-24 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-12 -mb-12 blur-3xl" />
        <div className="relative z-10">
          <h1 className="text-2xl font-headline font-bold">Welcome back, {user?.name || 'Admin'}!</h1>
          <p className="text-white/80 text-sm mt-1">Smart Hostel Management System — Admin Control Panel</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(card => (
          <button key={card.label} onClick={() => navigate(card.path)}
            className="bg-surface-container-lowest p-5 rounded-xl soft-shadow text-left hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg bg-${card.color}/10`}><card.icon className={`w-5 h-5 text-${card.color}`} /></div>
              <span className="text-xs font-bold text-green-600 flex items-center gap-1 opacity-60 group-hover:opacity-100"><TrendingUp className="w-3 h-3" />{card.trend}</span>
            </div>
            <div className={`font-headline text-2xl font-extrabold text-${card.color}`}>{loading ? '...' : card.value}</div>
            <p className="text-xs text-on-surface-variant font-medium mt-1">{card.label}</p>
          </button>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="font-headline font-bold text-lg text-on-surface mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map(action => (
            <button key={action.label} onClick={() => navigate(action.path)}
              className="bg-surface-container-lowest p-5 rounded-xl soft-shadow card-3d text-left group hover:ring-2 ring-primary/20 transition-all">
              <div className="flex items-start justify-between">
                <div className="p-3 rounded-lg bg-primary-fixed">
                  <action.icon className="w-5 h-5 text-primary" />
                </div>
                <ArrowRight className="w-4 h-4 text-on-surface-variant group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="font-bold text-sm text-on-surface mt-3 group-hover:text-primary transition-colors">{action.label}</h3>
              <p className="text-xs text-on-surface-variant mt-1">{action.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-xl soft-shadow">
          <h3 className="font-headline font-bold text-sm text-on-surface mb-4">Room Summary</h3>
          <div className="space-y-3">
            {[
              { label: 'Total Rooms', value: stats?.rooms?.totalRooms || '—', color: 'primary' },
              { label: 'Occupied', value: stats?.rooms?.occupiedRooms || '—', color: 'blue-600' },
              { label: 'Available', value: stats?.rooms?.availableRooms || '—', color: 'green-600' },
              { label: 'Maintenance', value: stats?.rooms?.maintenanceRooms || '—', color: 'error' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between p-3 bg-surface-container rounded-lg">
                <span className="text-sm text-on-surface-variant">{item.label}</span>
                <span className={`font-bold text-sm text-${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl soft-shadow">
          <h3 className="font-headline font-bold text-sm text-on-surface mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { text: 'New student registration', time: '2 min ago', color: 'green-600' },
              { text: 'Complaint resolved #1045', time: '15 min ago', color: 'primary' },
              { text: 'Payment received ₹5,000', time: '1 hour ago', color: 'blue-600' },
              { text: 'Visitor checked in', time: '3 hours ago', color: 'amber-600' },
            ].map((activity, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-surface-container rounded-lg">
                <div className={`w-2 h-2 rounded-full bg-${activity.color} shrink-0`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-on-surface">{activity.text}</p>
                  <p className="text-[10px] text-on-surface-variant flex items-center gap-1"><Clock className="w-2.5 h-2.5" />{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
