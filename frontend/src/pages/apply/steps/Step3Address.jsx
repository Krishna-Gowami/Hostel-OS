import { MapPin } from 'lucide-react';

export default function Step3Address({ formData, updateFormData, onNext, onPrev }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  const updateAddress = (field, value) => {
    updateFormData({
      address: { ...formData.address, [field]: value }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-3 mb-6">
        <MapPin className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-sm text-amber-800">
          <strong className="block mb-1">Important Geographic Validation</strong>
          This address will be automatically geocoded to calculate your distance from the National Capital Region (NCR). 
          Please provide your exact permanent residential address. Providing false information may lead to disciplinary action.
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Address Line 1 *</label>
          <input 
            required 
            type="text" 
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            value={formData.address.line1}
            onChange={e => updateAddress('line1', e.target.value)}
            placeholder="House/Flat No., Building Name, Street"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Address Line 2</label>
          <input 
            type="text" 
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            value={formData.address.line2}
            onChange={e => updateAddress('line2', e.target.value)}
            placeholder="Locality, Area, Landmark (Optional)"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">City/Town/Village *</label>
            <input 
              required 
              type="text" 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.address.city}
              onChange={e => updateAddress('city', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">State *</label>
            <input 
              required 
              type="text" 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.address.state}
              onChange={e => updateAddress('state', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">PIN / ZIP Code *</label>
            <input 
              required 
              type="text" 
              pattern="[0-9]{6}"
              title="6 digit PIN code"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.address.pin}
              onChange={e => updateAddress('pin', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Country *</label>
            <input 
              required 
              type="text" 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.address.country}
              onChange={e => updateAddress('country', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6 border-t border-slate-100">
        <button type="button" onClick={onPrev} className="px-6 py-2 rounded-lg font-medium text-slate-600 hover:bg-slate-100 transition-colors">
          Back
        </button>
        <button type="submit" className="px-8 py-2 rounded-lg font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all">
          Next Step
        </button>
      </div>
    </form>
  );
}
