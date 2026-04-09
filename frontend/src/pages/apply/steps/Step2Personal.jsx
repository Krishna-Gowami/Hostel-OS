export default function Step2Personal({ formData, updateFormData, onNext, onPrev }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
          <input 
            required 
            type="text" 
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            value={formData.name}
            onChange={e => updateFormData({ name: e.target.value })}
            placeholder="As per official documents"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email Address *</label>
          <input 
            required 
            type="email" 
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            value={formData.email}
            onChange={e => updateFormData({ email: e.target.value })}
            placeholder="You will receive updates here"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number *</label>
          <input 
            required 
            type="tel" 
            pattern="[0-9]{10}"
            title="10 digit mobile number"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            value={formData.phone}
            onChange={e => updateFormData({ phone: e.target.value })}
            placeholder="10-digit number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth *</label>
          <input 
            required 
            type="date" 
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            value={formData.dob ? formData.dob.split('T')[0] : ''}
            onChange={e => updateFormData({ dob: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Gender *</label>
          <select 
            required 
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            value={formData.gender}
            onChange={e => updateFormData({ gender: e.target.value })}
          >
            <option value="" disabled>Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Category *</label>
          <select 
            required 
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
            value={formData.category}
            onChange={e => updateFormData({ category: e.target.value })}
          >
            <option value="general">General (GN)</option>
            <option value="obc">Other Backward Classes (OBC)</option>
            <option value="sc">Scheduled Caste (SC)</option>
            <option value="st">Scheduled Tribe (ST)</option>
          </select>
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
