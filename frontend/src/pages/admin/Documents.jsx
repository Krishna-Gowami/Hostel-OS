import { mockDocuments } from '../../data/mockData'
import { FileText, Download, Search, FolderOpen, Eye } from 'lucide-react'
import { useState } from 'react'

const categoryColors = {
  rules: 'bg-primary-fixed text-primary',
  finance: 'bg-tertiary-fixed text-tertiary',
  policy: 'bg-secondary-fixed text-secondary',
  mess: 'bg-green-100 text-green-700',
  emergency: 'bg-error-container text-error',
  forms: 'bg-surface-variant text-on-surface-variant',
}

export default function Documents() {
  const [docs] = useState(mockDocuments)
  const [searchTerm, setSearchTerm] = useState('')

  const filtered = docs.filter(d => d.title.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-headline font-bold text-on-surface">Documents Repository</h1>
          <p className="text-on-surface-variant text-sm mt-1">Access hostel documents and forms</p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
        <input type="text" placeholder="Search documents..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-11 pr-4 py-2.5 bg-surface-container border-none rounded-xl focus:ring-2 focus:ring-primary text-sm" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(doc => (
          <div key={doc._id} className="bg-surface-container-lowest p-6 rounded-xl soft-shadow card-3d group">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-lg ${categoryColors[doc.category] || categoryColors.forms}`}>
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider px-2 py-1 bg-surface-container rounded-full">{doc.type}</span>
            </div>
            <h3 className="font-bold text-sm text-on-surface mb-1 group-hover:text-primary transition-colors">{doc.title}</h3>
            <p className="text-xs text-on-surface-variant">{doc.size} • Uploaded {doc.uploadDate}</p>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-outline-variant/10">
              <span className="text-xs text-on-surface-variant">{doc.downloads} downloads</span>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-surface-container rounded-lg transition-colors"><Eye className="w-4 h-4 text-on-surface-variant" /></button>
                <button className="p-2 hover:bg-primary-fixed rounded-lg transition-colors"><Download className="w-4 h-4 text-primary" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
