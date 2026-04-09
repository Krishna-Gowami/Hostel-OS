import { Edit2, AlertCircle } from 'lucide-react';

export default function Step6Review({ formData, onPrev, onSubmit, isSubmitting, goToStep }) {
  
  const SectionHeader = ({ title, step }) => (
    <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
      <h3 className="font-bold text-slate-800">{title}</h3>
      <button 
        onClick={() => goToStep(step)} 
        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 px-2 py-1 rounded"
      >
        <Edit2 className="w-3 h-3" /> Edit
      </button>
    </div>
  );

  const DataRow = ({ label, value }) => (
    <div className="grid grid-cols-3 gap-2 mb-2 text-sm">
      <div className="text-slate-500 font-medium">{label}</div>
      <div className="col-span-2 text-slate-900">{value || <span className="text-slate-400 italic">Not provided</span>}</div>
    </div>
  );

  return (
    <div className="space-y-8">
      
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl flex gap-3">
        <AlertCircle className="w-6 h-6 text-yellow-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-bold text-yellow-900 mb-1">Final Review</h3>
          <p className="text-yellow-800 text-sm">
            Please verify all details carefully. Once submitted, applications cannot be edited. 
            Ensure your competitive scores and permanent address are absolutely correct.
          </p>
        </div>
      </div>

      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-6">
        
        <div>
          <SectionHeader title="Personal Details" step={2} />
          <DataRow label="Full Name" value={formData.name} />
          <DataRow label="Email" value={formData.email} />
          <DataRow label="Phone" value={formData.phone} />
          <DataRow label="Date of Birth" value={formData.dob} />
          <DataRow label="Gender" value={<span className="capitalize">{formData.gender}</span>} />
          <DataRow label="Category" value={<span className="uppercase">{formData.category}</span>} />
        </div>

        <div>
          <SectionHeader title="Permanent Address" step={3} />
          <DataRow label="Address" value={`${formData.address.line1}${formData.address.line2 ? `, ${formData.address.line2}` : ''}`} />
          <DataRow label="Location" value={`${formData.address.city}, ${formData.address.state} - ${formData.address.pin}`} />
          <DataRow label="Country" value={formData.address.country} />
        </div>

        <div>
          <SectionHeader title="Academic Details" step={4} />
          <div className="bg-white p-3 rounded-lg border border-slate-200 mb-4 grid grid-cols-2 text-sm text-center">
            <div className="border-r border-slate-100">
              <span className="block text-slate-500 font-medium mb-1">JEE Percentile</span>
              <span className="font-bold text-slate-900 text-lg">{formData.jeePercentile || 'NA'}</span>
            </div>
            <div>
              <span className="block text-slate-500 font-medium mb-1">Entrance Marks</span>
              <span className="font-bold text-slate-900 text-lg">{formData.entranceMarks || 'NA'}</span>
            </div>
          </div>
          <DataRow label="Class 10 / 12" value={`${formData.class10Percent}% / ${formData.class12Percent}%`} />
          <DataRow label="College" value={formData.collegeName} />
          <DataRow label="Course & Year" value={`${formData.course} (Year ${formData.yearOfStudy})`} />
        </div>

        <div>
          <SectionHeader title="Other Details" step={5} />
          <DataRow label="Blood Group" value={formData.bloodGroup} />
          <DataRow label="Medical/Allergies" value={formData.medicalConditions || 'None'} />
          <DataRow label="Parent Name" value={formData.parentName} />
          <DataRow label="Parent Contact" value={`${formData.parentPhone} / ${formData.parentEmail || 'N/A'}`} />
        </div>

      </div>

      <div className="flex justify-between pt-6 border-t border-slate-100 text-center">
        <button 
          onClick={onPrev} 
          disabled={isSubmitting}
          className="px-6 py-2 rounded-lg font-medium text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
        >
          Back
        </button>
        <button 
          onClick={onSubmit} 
          disabled={isSubmitting}
          className="px-8 py-3 rounded-xl font-bold bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-200 transition-all disabled:opacity-70 flex gap-2 items-center"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Submitting...
            </>
          ) : 'Submit Application'}
        </button>
      </div>
    </div>
  );
}
