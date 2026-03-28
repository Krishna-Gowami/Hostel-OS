import { Settings as SettingsIcon, Bell, Shield, Database, Globe, Mail } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'react-toastify'

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    autoApproveVisitors: false,
    maintenanceMode: false,
    maxVisitorDuration: 4,
    lateFeePerDay: 50,
    maxRoomCapacity: 4,
  })

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
    toast.success('Setting updated')
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-headline font-bold text-on-surface">System Settings</h1>
        <p className="text-on-surface-variant text-sm mt-1">Configure system-wide settings</p>
      </div>

      {/* Notification Settings */}
      <div className="bg-surface-container-lowest p-6 rounded-xl soft-shadow">
        <h3 className="font-headline font-bold text-sm text-on-surface mb-4 flex items-center gap-2">
          <Bell className="w-4 h-4 text-primary" /> Notifications
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-on-surface">Email Notifications</p>
              <p className="text-xs text-on-surface-variant">Send email alerts for new complaints and visitors</p>
            </div>
            <button onClick={() => handleToggle('emailNotifications')}
              className={`w-12 h-6 rounded-full transition-all ${settings.emailNotifications ? 'bg-primary' : 'bg-gray-300'}`}>
              <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${settings.emailNotifications ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Visitor Settings */}
      <div className="bg-surface-container-lowest p-6 rounded-xl soft-shadow">
        <h3 className="font-headline font-bold text-sm text-on-surface mb-4 flex items-center gap-2">
          <Globe className="w-4 h-4 text-primary" /> Visitor Policy
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-on-surface">Auto-Approve Visitors</p>
              <p className="text-xs text-on-surface-variant">Automatically approve visitor requests</p>
            </div>
            <button onClick={() => handleToggle('autoApproveVisitors')}
              className={`w-12 h-6 rounded-full transition-all ${settings.autoApproveVisitors ? 'bg-primary' : 'bg-gray-300'}`}>
              <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${settings.autoApproveVisitors ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-on-surface">Max Visitor Duration</p>
              <p className="text-xs text-on-surface-variant">Maximum hours for a visitor stay</p>
            </div>
            <input type="number" value={settings.maxVisitorDuration} onChange={e => setSettings(prev => ({ ...prev, maxVisitorDuration: parseInt(e.target.value) || 0 }))}
              className="w-20 py-2 px-3 bg-surface-container border-none rounded-xl text-sm text-right focus:ring-2 focus:ring-primary" />
          </div>
        </div>
      </div>

      {/* Payment Settings */}
      <div className="bg-surface-container-lowest p-6 rounded-xl soft-shadow">
        <h3 className="font-headline font-bold text-sm text-on-surface mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" /> Payment Policy
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-on-surface">Late Fee Per Day (₹)</p>
              <p className="text-xs text-on-surface-variant">Penalty for overdue payments</p>
            </div>
            <input type="number" value={settings.lateFeePerDay} onChange={e => setSettings(prev => ({ ...prev, lateFeePerDay: parseInt(e.target.value) || 0 }))}
              className="w-24 py-2 px-3 bg-surface-container border-none rounded-xl text-sm text-right focus:ring-2 focus:ring-primary" />
          </div>
        </div>
      </div>

      {/* System */}
      <div className="bg-surface-container-lowest p-6 rounded-xl soft-shadow">
        <h3 className="font-headline font-bold text-sm text-on-surface mb-4 flex items-center gap-2">
          <Database className="w-4 h-4 text-primary" /> System
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-on-surface">Maintenance Mode</p>
              <p className="text-xs text-on-surface-variant">Disable student access temporarily</p>
            </div>
            <button onClick={() => handleToggle('maintenanceMode')}
              className={`w-12 h-6 rounded-full transition-all ${settings.maintenanceMode ? 'bg-error' : 'bg-gray-300'}`}>
              <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${settings.maintenanceMode ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>
        </div>
      </div>

      <button className="bg-primary-gradient text-white font-bold text-sm px-6 py-3 rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20">
        Save All Settings
      </button>
    </div>
  )
}
