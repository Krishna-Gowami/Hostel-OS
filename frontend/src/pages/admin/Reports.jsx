import { BarChart3, FileText, Download } from 'lucide-react'

export default function AdminReports() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-headline font-bold text-on-surface">Reports</h1>
        <p className="text-on-surface-variant text-sm mt-1">Generate and download system reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: 'Occupancy Report', desc: 'Room occupancy rates and allocation stats', icon: BarChart3, color: 'primary' },
          { title: 'Financial Report', desc: 'Revenue, payments, and outstanding dues', icon: FileText, color: 'green-600' },
          { title: 'Complaint Report', desc: 'Issue tracking and resolution metrics', icon: FileText, color: 'amber-600' },
          { title: 'Visitor Log Report', desc: 'All visitor entry/exit records', icon: FileText, color: 'blue-600' },
          { title: 'User Activity Report', desc: 'Login history and user engagement', icon: FileText, color: 'purple-600' },
          { title: 'Monthly Summary', desc: 'Complete monthly operations overview', icon: BarChart3, color: 'teal-600' },
        ].map(report => (
          <div key={report.title} className="bg-surface-container-lowest p-6 rounded-xl soft-shadow card-3d group">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-lg bg-${report.color}/10`}>
                <report.icon className={`w-5 h-5 text-${report.color}`} />
              </div>
            </div>
            <h3 className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors">{report.title}</h3>
            <p className="text-xs text-on-surface-variant mt-1 mb-4">{report.desc}</p>
            <button className="flex items-center gap-2 text-xs font-bold text-primary hover:text-primary/80 transition-colors">
              <Download className="w-4 h-4" /> Generate Report
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
