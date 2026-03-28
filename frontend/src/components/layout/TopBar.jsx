import { Bell, Menu } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function TopBar({ onMenuClick }) {
  const { user } = useAuth()

  const getInitials = (name) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <header className="sticky top-0 z-40 glass-panel flex justify-between items-center px-4 sm:px-8 py-4 border-b border-outline-variant/10">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="lg:hidden p-2 hover:bg-indigo-50 rounded-full transition-colors">
          <Menu className="w-5 h-5 text-on-surface-variant" />
        </button>
        <h1 className="font-headline text-xl sm:text-2xl font-bold text-primary tracking-tight">Management Console</h1>
      </div>
      <div className="flex items-center gap-4 sm:gap-6">
        <div className="relative group cursor-pointer p-2 hover:bg-indigo-50 rounded-full transition-colors">
          <Bell className="w-5 h-5 text-on-surface-variant group-active:scale-95 transition-transform" />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-primary border-2 border-white rounded-full" />
        </div>
        <div className="flex items-center gap-3 bg-secondary-container/20 py-1.5 pl-1.5 pr-4 rounded-full border border-outline-variant/20">
          <div className="w-8 h-8 rounded-full bg-primary-fixed-dim flex items-center justify-center text-primary text-xs font-bold">
            {getInitials(user?.name)}
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-xs font-bold text-on-secondary-container leading-none">{user?.name || 'User'}</span>
            <span className="text-[10px] text-on-surface-variant leading-none mt-0.5 capitalize">{user?.role || 'student'}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
