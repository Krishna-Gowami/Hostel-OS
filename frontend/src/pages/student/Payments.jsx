import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import { toast } from 'react-toastify'
import { CreditCard, Receipt, Download, Clock, CheckCircle, AlertCircle, Plus } from 'lucide-react'
import StatusBadge from '../../components/ui/StatusBadge'
import Modal from '../../components/ui/Modal'

export default function StudentPayments() {
  const { user } = useAuth()
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showPayModal, setShowPayModal] = useState(false)
  const [paymentType, setPaymentType] = useState('monthly_rent')
  const [amount, setAmount] = useState('')

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      setLoading(true)
      const res = await api.getAllPayments({ user: user?._id || user?.id })
      setPayments(res.data?.payments || [])
    } catch (err) {
      console.error('Failed to fetch payments:', err)
      // Fallback to empty
      setPayments([])
    } finally {
      setLoading(false)
    }
  }

  const handleMakePayment = async (e) => {
    e.preventDefault()
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Enter a valid amount')
      return
    }
    try {
      const res = await api.createPaymentOrder({ amount: parseFloat(amount), paymentType })
      if (res.data?.order) {
        toast.success('Payment order created! Razorpay integration pending.')
        setShowPayModal(false)
        setAmount('')
        fetchPayments()
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed')
    }
  }

  const totalPaid = payments.filter(p => p.status === 'completed').reduce((s, p) => s + (p.amount || 0), 0)
  const totalPending = payments.filter(p => p.status === 'pending').reduce((s, p) => s + (p.amount || 0), 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-headline font-bold text-on-surface">Payments</h1>
          <p className="text-on-surface-variant text-sm mt-1">Manage your hostel fee payments</p>
        </div>
        <button onClick={() => setShowPayModal(true)} className="bg-primary-gradient text-white font-bold text-sm px-5 py-2.5 rounded-xl flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" /> Make Payment
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface-container-lowest p-5 rounded-xl soft-shadow flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-lg"><CheckCircle className="w-5 h-5 text-green-700" /></div>
          <div>
            <div className="font-headline text-2xl font-extrabold text-green-700">₹{totalPaid.toLocaleString()}</div>
            <p className="text-xs text-on-surface-variant">Total Paid</p>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-xl soft-shadow flex items-center gap-4">
          <div className="p-3 bg-amber-100 rounded-lg"><Clock className="w-5 h-5 text-amber-700" /></div>
          <div>
            <div className="font-headline text-2xl font-extrabold text-amber-700">₹{totalPending.toLocaleString()}</div>
            <p className="text-xs text-on-surface-variant">Pending Dues</p>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-xl soft-shadow flex items-center gap-4">
          <div className="p-3 bg-primary-fixed rounded-lg"><Receipt className="w-5 h-5 text-primary" /></div>
          <div>
            <div className="font-headline text-2xl font-extrabold text-primary">{payments.length}</div>
            <p className="text-xs text-on-surface-variant">Total Transactions</p>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-surface-container-lowest rounded-2xl soft-shadow overflow-hidden">
        <div className="p-5 border-b border-outline-variant/10">
          <h2 className="font-headline font-bold text-lg text-on-surface">Payment History</h2>
        </div>
        {loading ? (
          <div className="p-8 text-center text-on-surface-variant">Loading payments...</div>
        ) : payments.length === 0 ? (
          <div className="p-8 text-center text-on-surface-variant">
            <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No payment records found</p>
            <p className="text-xs mt-1">Your payment history will appear here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant text-xs uppercase tracking-wider">
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Method</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {payments.map((p, i) => (
                  <tr key={p._id} className={`hover:bg-surface-container-high transition-colors ${i % 2 === 1 ? 'bg-surface-container-low' : ''}`}>
                    <td className="px-6 py-4 text-sm">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm capitalize">{(p.paymentType || '').replace(/_/g, ' ')}</td>
                    <td className="px-6 py-4 text-sm font-semibold">₹{(p.amount || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm capitalize">{p.paymentMethod || '-'}</td>
                    <td className="px-6 py-4"><StatusBadge status={p.status} /></td>
                    <td className="px-6 py-4 text-right">
                      {p.status === 'completed' && (
                        <button className="p-2 hover:bg-primary-fixed rounded-lg transition-colors">
                          <Download className="w-4 h-4 text-primary" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      <Modal isOpen={showPayModal} onClose={() => setShowPayModal(false)} title="Make Payment">
        <form onSubmit={handleMakePayment} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-on-surface">Payment Type</label>
            <select value={paymentType} onChange={e => setPaymentType(e.target.value)} className="w-full py-3 px-4 bg-surface-container border-none rounded-xl text-sm focus:ring-2 focus:ring-primary">
              <option value="monthly_rent">Monthly Rent</option>
              <option value="security_deposit">Security Deposit</option>
              <option value="maintenance">Maintenance Fee</option>
              <option value="mess_fee">Mess Fee</option>
              <option value="laundry">Laundry</option>
              <option value="fine">Fine</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-on-surface">Amount (₹)</label>
            <input type="number" min="1" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Enter amount" className="w-full py-3 px-4 bg-surface-container border-none rounded-xl text-sm focus:ring-2 focus:ring-primary" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowPayModal(false)} className="flex-1 py-3 rounded-xl border border-outline-variant/30 text-on-surface-variant font-semibold text-sm hover:bg-surface-container transition-colors">Cancel</button>
            <button type="submit" className="flex-1 py-3 bg-primary-gradient text-white font-bold text-sm rounded-xl hover:scale-[1.01] active:scale-95 transition-all">Pay Now</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
