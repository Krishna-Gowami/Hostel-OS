import { useAuth } from '../../context/AuthContext'
import { mockUsers } from '../../data/mockData'
import { User, Mail, Phone, BookOpen, Building2, Calendar, Shield, Edit } from 'lucide-react'

export default function Profile() {
  const { user: authUser } = useAuth()
  const user = authUser || mockUsers.student

  const fields = [
    { icon: User, label: 'Full Name', value: user.name },
    { icon: Mail, label: 'Email', value: user.email },
    { icon: Phone, label: 'Phone', value: user.phone || '+91 98765 43210' },
    { icon: BookOpen, label: 'Branch', value: user.branch || 'Computer Science' },
    { icon: Calendar, label: 'Year', value: user.year || '3rd Year' },
    { icon: Building2, label: 'Room', value: user.room || '302' },
    { icon: Shield, label: 'Role', value: user.role || 'student' },
  ]

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header Card */}
      <div className="bg-primary-gradient rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-headline font-extrabold backdrop-blur-sm">
            {user.name?.split(' ').map(n => n[0]).join('') || 'U'}
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-headline font-bold">{user.name}</h1>
            <p className="text-white/80 text-sm mt-1">{user.email}</p>
            <p className="text-white/60 text-xs mt-1 uppercase tracking-wider">{user.studentId || user.role}</p>
          </div>
          <button className="sm:ml-auto bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors backdrop-blur-sm">
            <Edit className="w-4 h-4" /> Edit Profile
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="bg-surface-container-lowest rounded-2xl soft-shadow p-6">
        <h2 className="font-headline font-bold text-lg text-on-surface mb-6">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map(field => (
            <div key={field.label} className="flex items-center gap-4 p-4 bg-surface-container rounded-xl">
              <div className="w-10 h-10 bg-primary-fixed rounded-lg flex items-center justify-center shrink-0">
                <field.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-on-surface-variant font-medium">{field.label}</p>
                <p className="text-sm font-semibold text-on-surface capitalize">{field.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
