export default function Step5Other({ formData, updateFormData, onNext, onPrev }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      
      <div>
        <h3 className="font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">Medical Information</h3>
        <div className="grid grid-cols-1 gap-6">
          <div className="md:w-1/2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Blood Group *</label>
            <select 
              required 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              value={formData.bloodGroup}
              onChange={e => updateFormData({ bloodGroup: e.target.value })}
            >
              <option value="" disabled>Select Blood Group</option>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Medical Conditions / Allergies</label>
            <textarea 
              rows="3"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              value={formData.medicalConditions}
              onChange={e => updateFormData({ medicalConditions: e.target.value })}
              placeholder="Provide details if any, or type 'None'"
            ></textarea>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">Parent / Guardian Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Parent / Guardian Name *</label>
            <input 
              required 
              type="text" 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.parentName}
              onChange={e => updateFormData({ parentName: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Parent's Phone Number *</label>
            <input 
              required 
              type="tel" 
              pattern="[0-9]{10}"
              title="10 digit mobile number"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.parentPhone}
              onChange={e => updateFormData({ parentPhone: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Parent's Email Address</label>
            <input 
              type="email" 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.parentEmail}
              onChange={e => updateFormData({ parentEmail: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6 border-t border-slate-100">
        <button type="button" onClick={onPrev} className="px-6 py-2 rounded-lg font-medium text-slate-600 hover:bg-slate-100 transition-colors">
          Back
        </button>
        <button type="submit" className="px-8 py-2 rounded-lg font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all">
          Review Application
        </button>
      </div>
    </form>
  );
}
