import { AlertTriangle, Info } from 'lucide-react';

export default function Step1Policy({ formData, updateFormData, onNext }) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3">
        <Info className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-bold text-blue-900 mb-1">Dual Ranking System</h3>
          <p className="text-blue-800 text-sm leading-relaxed">
            Hostel seats are divided into two equal pools: <strong>50% for JEE percentile</strong> and <strong>50% for College Entrance Exams</strong>.
            You may apply using either or both. If you provide both scores, you will compete in both lists independently, maximizing your chances of allocation.
          </p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3">
        <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-bold text-amber-900 mb-1">NCR Proximity Check</h3>
          <p className="text-amber-800 text-sm leading-relaxed">
            Students whose permanent address falls within the <strong>National Capital Region (NCR)</strong> or within a <strong>25 km radius</strong> of the NCR boundary have lower priority for hostel accommodation.
            <br/><br/>
            <strong>Note:</strong> Your address will be geocoded and verified programmatically upon submission. Applications are categorized internally and manually allocated based on availability.
          </p>
        </div>
      </div>

      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
        <h3 className="font-bold text-slate-800 mb-3">General Rules & Regulations</h3>
        <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600">
          <li>Allocated rooms cannot be transferred or sublet.</li>
          <li>Possession or consumption of alcohol/narcotics is strictly prohibited.</li>
          <li>Outpass is required for overnight stays outside the hostel premises.</li>
          <li>The administration reserves the right to modify rules or re-allocate rooms based on administrative requirements.</li>
        </ul>
      </div>

      <div className="pt-4 flex items-start gap-3">
        <input 
          type="checkbox" 
          id="agreed"
          className="mt-1 w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
          checked={formData.agreedToPolicy}
          onChange={(e) => updateFormData({ agreedToPolicy: e.target.checked })}
        />
        <label htmlFor="agreed" className="text-sm font-medium text-slate-700 cursor-pointer select-none">
          I have read and fully understood the hostel allocation policies, the dual-ranking system, and the NCR proximity restriction. I agree to abide by all rules.
        </label>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={onNext}
          disabled={!formData.agreedToPolicy}
          className={`px-8 py-3 rounded-lg font-bold transition-all ${
            formData.agreedToPolicy 
              ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          Acknowledge & Continue
        </button>
      </div>
    </div>
  );
}
