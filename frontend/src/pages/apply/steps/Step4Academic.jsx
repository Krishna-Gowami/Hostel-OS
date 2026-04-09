import { useState } from 'react';

export default function Step4Academic({ formData, updateFormData, onNext, onPrev }) {
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const jee = formData.jeePercentile === 'NA' || formData.jeePercentile === '' ? null : Number(formData.jeePercentile);
    const entrance = formData.entranceMarks === 'NA' || formData.entranceMarks === '' ? null : Number(formData.entranceMarks);

    if (jee === null && entrance === null) {
      setError('You must provide at least one valid score: JEE Percentile or College Entrance Marks. If not applicable, type NA in the other.');
      return;
    }

    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200 font-medium">
          {error}
        </div>
      )}

      <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 mb-6">
        <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wider">Competitive Exams</h3>
        <p className="text-xs text-slate-500 mb-4">Provide at least one score. Enter "NA" if you did not appear for an exam. You will be evaluated in the respective categories based on the scores provided.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">JEE Percentile</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.jeePercentile}
              onChange={e => updateFormData({ jeePercentile: e.target.value })}
              placeholder="e.g., 98.45 or NA"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">College Entrance Marks</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.entranceMarks}
              onChange={e => updateFormData({ entranceMarks: e.target.value })}
              placeholder="e.g., 85 or NA"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Class 10 Percentage *</label>
          <input 
            required 
            type="number" 
            step="0.01"
            min="0"
            max="100"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            value={formData.class10Percent}
            onChange={e => updateFormData({ class10Percent: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Class 12 Percentage *</label>
          <input 
            required 
            type="number" 
            step="0.01"
            min="0"
            max="100"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            value={formData.class12Percent}
            onChange={e => updateFormData({ class12Percent: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">College/Institution Name *</label>
          <input 
            required 
            type="text" 
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            value={formData.collegeName}
            onChange={e => updateFormData({ collegeName: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Course/Branch *</label>
          <input 
            required 
            type="text" 
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            value={formData.course}
            onChange={e => updateFormData({ course: e.target.value })}
            placeholder="e.g., B.Tech CSE"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Year of Study *</label>
          <select 
            required 
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
            value={formData.yearOfStudy}
            onChange={e => updateFormData({ yearOfStudy: e.target.value })}
          >
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
            <option value="5">5th Year</option>
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
