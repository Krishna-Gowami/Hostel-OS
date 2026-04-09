import React, { useState, useEffect } from 'react'
import {
  Users, CheckCircle, XCircle, Save, 
  Settings, Search, Eye, Mail, Send
} from 'lucide-react'
import { toast } from 'react-toastify'
import api from '../../services/api'
import { format } from 'date-fns'

export default function HostelApplications() {
  const [activeTab, setActiveTab] = useState('waiting') // config, waiting, rejected, allocated, finalize
  const [applications, setApplications] = useState([])
  const [config, setConfig] = useState({
    totalSeats: 100,
    applicationDeadline: '',
    genderRatio: { male: 60, female: 40 },
    applicationYear: new Date().getFullYear(),
    rejectionEmailTemplate: 'Your application for hostel accommodation has been reviewed. Unfortunately, you have not been selected for room allocation at this time.',
    selectionEmailTemplate: 'Congratulations! Your hostel application has been approved. Below are your login credentials for the portal:',
    isFinalized: false
  })
  const [loading, setLoading] = useState(true)
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedApp, setSelectedApp] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [appRes, configRes] = await Promise.all([
        api.getHostelApplications({ year: config.applicationYear }),
        api.getHostelConfig()
      ])
      
      setApplications(appRes.data?.data || [])
      if (configRes.data?.config) {
        setConfig(configRes.data.config)
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to load hostel applications data')
    } finally {
      setLoading(false)
    }
  }

  const handleConfigSave = async (e) => {
    e.preventDefault()
    try {
      await api.updateHostelConfig(config)
      toast.success('Configuration saved successfully')
    } catch (err) {
      toast.error('Failed to save configuration')
    }
  }

  const handleAllocate = async (id) => {
    if (config.isFinalized) return toast.error('Process is finalized. Cannot allocate.')
    try {
      await api.allocateHostelApplication(id)
      toast.success('Allocated successfully')
      fetchData()
    } catch(err) {
      toast.error(err.response?.data?.message || 'Error allocating')
    }
  }

  const handleUnallocate = async (id) => {
    if (config.isFinalized) return toast.error('Process is finalized. Cannot unallocate.')
    try {
      await api.unallocateHostelApplication(id)
      toast.success('Unallocated successfully')
      fetchData()
    } catch(err) {
      toast.error(err.response?.data?.message || 'Error unallocating')
    }
  }

  const handleFinalize = async () => {
    if(!window.confirm('Are you sure you want to finalize allocations? You will NOT be able to change allocations after this.')) return
    try {
      await api.finalizeHostelApplications()
      toast.success('Process finalized')
      fetchData()
    } catch(err) {
      toast.error(err.response?.data?.message || 'Error finalize')
    }
  }

  const handleSendNotifications = async () => {
    if(!window.confirm('Send emails to all applicants now? This will create student login accounts.')) return
    try {
      await api.sendHostelNotifications()
      toast.success('Notifications deployed successfully')
      fetchData()
    } catch(err) {
      toast.error(err.response?.data?.message || 'Error sending notifications')
    }
  }

  // Lists
  const waitingList = applications.filter(a => a.status === 'pending' && a.eligible).sort((a,b) => Math.max(b.jeePercentile||0, b.entranceMarks||0) - Math.max(a.jeePercentile||0, a.entranceMarks||0))
  const rejectedList = applications.filter(a => a.status === 'rejected' || !a.eligible).sort((a,b) => Math.max(b.jeePercentile||0, b.entranceMarks||0) - Math.max(a.jeePercentile||0, a.entranceMarks||0))
  const allocatedList = applications.filter(a => a.status === 'allocated')

  const getFiltered = (list) => list.filter(app => 
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    app.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const renderTable = (list, type) => (
    <div className="overflow-x-auto border border-slate-200 rounded-lg">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="py-3 px-4 text-sm font-semibold text-slate-700">Applicant</th>
            <th className="py-3 px-4 text-sm font-semibold text-slate-700">Gender</th>
            <th className="py-3 px-4 text-sm font-semibold text-slate-700">JEE %</th>
            <th className="py-3 px-4 text-sm font-semibold text-slate-700">Entrance Marks</th>
            <th className="py-3 px-4 text-sm font-semibold text-slate-700 text-center">Status</th>
            <th className="py-3 px-4 text-sm font-semibold text-slate-700 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {getFiltered(list).length === 0 ? (
            <tr>
              <td colSpan="6" className="py-8 text-center text-slate-500">No applications found in this view.</td>
            </tr>
          ) : getFiltered(list).map(app => (
            <tr key={app._id} className="border-b border-slate-100 hover:bg-slate-50">
              <td className="py-3 px-4">
                <div className="font-medium text-slate-800">{app.name}</div>
                <div className="text-xs text-slate-500">{app.email}</div>
              </td>
              <td className="py-3 px-4 text-slate-600 capitalize">{app.gender}</td>
              <td className="py-3 px-4">
                {app.hasJEE ? <span className="text-slate-800 font-medium">{app.jeePercentile}</span> : <span className="text-slate-400">NA</span>}
              </td>
              <td className="py-3 px-4">
                {app.hasEntrance ? <span className="text-slate-800 font-medium">{app.entranceMarks}</span> : <span className="text-slate-400">NA</span>}
              </td>
              <td className="py-3 px-4 text-center">
                <span className={`px-2 py-1 rounded-full text-xs font-medium 
                  ${app.status === 'allocated' ? 'bg-green-100 text-green-700' : 
                    app.status === 'rejected' || !app.eligible ? 'bg-red-100 text-red-700' : 
                    'bg-yellow-100 text-yellow-700'}`}>
                  {app.status === 'allocated' ? 'Allocated' : app.status === 'rejected' || !app.eligible ? 'Rejected / Not Eligible' : 'Waiting List'}
                </span>
              </td>
              <td className="py-3 px-4 flex justify-end gap-2 text-right items-center">
                <button onClick={() => setSelectedApp(app)} className="text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded text-sm flex items-center gap-1 border border-slate-200">
                  <Eye className="w-4 h-4" /> View
                </button>
                {type === 'allocated' ? (
                   <button disabled={config.isFinalized} onClick={() => handleUnallocate(app._id)} className="text-red-600 hover:bg-red-50 px-2 py-1 rounded text-sm font-medium border border-red-200 disabled:opacity-50">Undo</button>
                ) : (
                   <button disabled={config.isFinalized} onClick={() => handleAllocate(app._id)} className="text-green-600 hover:bg-green-50 px-2 py-1 rounded text-sm font-medium border border-green-200 disabled:opacity-50">Allocate</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Hostel Applications</h1>
          <p className="text-slate-500">Manage manual allocations and applicant tracking</p>
        </div>
      </div>

      <div className="flex bg-white rounded-lg p-1 shadow-sm border border-slate-200 mb-6 w-full overflow-x-auto">
        <button onClick={() => setActiveTab('waiting')} className={`flex-1 min-w-[max-content] py-2 px-4 text-sm font-medium rounded-md transition-colors ${activeTab === 'waiting' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}>Waiting List ({waitingList.length})</button>
        <button onClick={() => setActiveTab('rejected')} className={`flex-1 min-w-[max-content] py-2 px-4 text-sm font-medium rounded-md transition-colors ${activeTab === 'rejected' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}>Rejected / NCR ({rejectedList.length})</button>
        <button onClick={() => setActiveTab('allocated')} className={`flex-1 min-w-[max-content] py-2 px-4 text-sm font-medium rounded-md transition-colors ${activeTab === 'allocated' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}>Allocated ({allocatedList.length}/{config.totalSeats})</button>
        <button onClick={() => setActiveTab('finalize')} className={`flex-1 min-w-[max-content] py-2 px-4 text-sm font-medium rounded-md transition-colors ${activeTab === 'finalize' ? 'bg-purple-50 text-purple-700' : 'text-slate-600 hover:bg-slate-50'}`}>Finalize & Notify</button>
        <button onClick={() => setActiveTab('config')} className={`flex-1 min-w-[max-content] py-2 px-4 text-sm font-medium rounded-md transition-colors ${activeTab === 'config' ? 'bg-slate-200 text-slate-800' : 'text-slate-600 hover:bg-slate-50'}`}><Settings className="w-4 h-4 inline-block -mt-0.5"/> Config</button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          
          {(activeTab === 'waiting' || activeTab === 'rejected' || activeTab === 'allocated') && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex mb-6">
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              {activeTab === 'waiting' && renderTable(waitingList, 'pending')}
              {activeTab === 'rejected' && renderTable(rejectedList, 'pending')}
              {activeTab === 'allocated' && renderTable(allocatedList, 'allocated')}
            </div>
          )}

          {activeTab === 'config' && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm max-w-2xl">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><Settings className="w-5 h-5 text-slate-400" /> Administrative Config</h2>
              <form onSubmit={handleConfigSave} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Total Hostel Seats</label>
                  <input type="number" required min="1" className="w-full px-3 py-2 border border-slate-300 rounded-lg" value={config.totalSeats} onChange={(e) => setConfig({...config, totalSeats: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Application Year</label>
                  <input type="number" required className="w-full px-3 py-2 border border-slate-300 rounded-lg" value={config.applicationYear} onChange={(e) => setConfig({...config, applicationYear: Number(e.target.value)})} />
                </div>
                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button type="submit" disabled={config.isFinalized} className="px-4 py-2 bg-slate-800 text-white rounded-lg flex items-center gap-2 hover:bg-slate-900 disabled:opacity-50">
                    <Save className="w-4 h-4" /> Save Configuration
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'finalize' && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm max-w-3xl">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Finalize Allocation & Communications</h2>
              
              <div className="space-y-6">
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-100 mb-4">
                  <h3 className="font-bold text-blue-900 mb-2">Configure Emails</h3>
                  <p className="text-sm text-blue-800 mb-4">Set the message paragraphs that will be embedded into the automated HTML emails.</p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-slate-700">Selection Email Custom Message</label>
                      <textarea
                        className="w-full border border-slate-300 rounded p-3 text-sm focus:ring-2 focus:ring-indigo-500"
                        rows="3"
                        disabled={config.isFinalized}
                        value={config.selectionEmailTemplate || ''}
                        onChange={(e) => setConfig({ ...config, selectionEmailTemplate: e.target.value })}
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-slate-700">Rejection Email Custom Message</label>
                      <textarea
                        className="w-full border border-slate-300 rounded p-3 text-sm focus:ring-2 focus:ring-indigo-500"
                        rows="3"
                        disabled={config.isFinalized}
                        value={config.rejectionEmailTemplate || ''}
                        onChange={(e) => setConfig({ ...config, rejectionEmailTemplate: e.target.value })}
                      ></textarea>
                    </div>
                  </div>
                  
                  {!config.isFinalized && (
                     <div className="mt-4 flex justify-end">
                        <button onClick={handleConfigSave} className="bg-slate-800 text-white px-4 py-2 rounded text-sm hover:bg-slate-900">Save Emails</button>
                     </div>
                  )}
                </div>

                <div className="border-t border-slate-200 pt-6">
                   <h3 className="font-bold text-slate-800 mb-4">Step 1: Lock Allocations</h3>
                   <div className="flex items-center gap-4">
                     <button
                       onClick={handleFinalize}
                       disabled={config.isFinalized}
                       className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg shadow disabled:opacity-50 flex items-center gap-2"
                     >
                        <CheckCircle className="w-5 h-5" />
                        {config.isFinalized ? 'Allocations Finalized' : 'Finalize Allocations'}
                     </button>
                     <p className="text-sm text-slate-600">Once finalized, you cannot manually allocate or undo seats.</p>
                   </div>
                </div>

                <div className="border-t border-slate-200 pt-6">
                   <h3 className="font-bold text-slate-800 mb-4">Step 2: Deploy Notifications</h3>
                   <div className="flex items-center gap-4">
                     <button
                       onClick={handleSendNotifications}
                       disabled={!config.isFinalized}
                       className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow disabled:opacity-50 flex items-center gap-2"
                     >
                        <Send className="w-5 h-5" />
                        Send Emails & Create Accounts
                     </button>
                     <p className="text-sm text-slate-600">Sends out all decision emails and creates student login accounts.</p>
                   </div>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800">Application Details</h3>
              <button onClick={() => setSelectedApp(null)} className="text-slate-400 hover:text-slate-600"><XCircle className="w-6 h-6" /></button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-sm text-slate-500">Full Name</p><p className="font-medium">{selectedApp.name}</p></div>
                <div><p className="text-sm text-slate-500">Email</p><p className="font-medium">{selectedApp.email}</p></div>
                <div><p className="text-sm text-slate-500">Phone</p><p className="font-medium">{selectedApp.phone}</p></div>
                <div><p className="text-sm text-slate-500">DOB</p><p className="font-medium">{format(new Date(selectedApp.dob), 'dd MMM yyyy')}</p></div>
                <div><p className="text-sm text-slate-500">Gender</p><p className="font-medium capitalize">{selectedApp.gender}</p></div>
                <div><p className="text-sm text-slate-500">Category</p><p className="font-medium capitalize">{selectedApp.category}</p></div>
                <div><p className="text-sm text-slate-500">Status</p>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium ${selectedApp.status === 'allocated' ? 'bg-green-100 text-green-700' : selectedApp.status === 'rejected' || !selectedApp.eligible ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {selectedApp.status === 'allocated' ? 'Allocated' : selectedApp.status === 'rejected' || !selectedApp.eligible ? 'Rejected / Not Eligible' : 'Waiting List'}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                 <h4 className="font-medium mb-3 text-slate-800">Location Rules (NCR)</h4>
                 <div><p className="text-sm text-slate-500">Ncr Eligible</p><p className={`font-medium ${selectedApp.eligible ? 'text-green-600' : 'text-red-500'}`}>{selectedApp.eligible ? 'Yes' : 'No (Inside NCR)'}</p></div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h4 className="font-medium mb-3 text-slate-800">Academic Scores</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-sm text-slate-500">JEE Percentile</p><p className="font-medium">{selectedApp.hasJEE ? selectedApp.jeePercentile : 'NA'}</p></div>
                  <div><p className="text-sm text-slate-500">Entrance Marks</p><p className="font-medium">{selectedApp.hasEntrance ? selectedApp.entranceMarks : 'NA'}</p></div>
                  <div><p className="text-sm text-slate-500">10th %</p><p className="font-medium">{selectedApp.class10Percent || 'N/A'}</p></div>
                  <div><p className="text-sm text-slate-500">12th %</p><p className="font-medium">{selectedApp.class12Percent || 'N/A'}</p></div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h4 className="font-medium mb-3 text-slate-800">Permanent Address</h4>
                <p className="text-sm text-slate-700">
                  {selectedApp.address?.line1}<br/>
                  {selectedApp.address?.line2 && <>{selectedApp.address.line2}<br/></>}
                  {selectedApp.address?.city}, {selectedApp.address?.state} - {selectedApp.address?.pin}<br/>
                  {selectedApp.address?.country}
                </p>
              </div>

            </div>
            
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button onClick={() => setSelectedApp(null)} className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-white bg-slate-50 font-medium border-solid">Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
