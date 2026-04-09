import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import Step1Policy from './steps/Step1Policy';
import Step2Personal from './steps/Step2Personal';
import Step3Address from './steps/Step3Address';
import Step4Academic from './steps/Step4Academic';
import Step5Other from './steps/Step5Other';
import Step6Review from './steps/Step6Review';
import api from '../../services/api';

const STEPS = [
  'Policy',
  'Personal Details',
  'Permanent Address',
  'Academic Details',
  'Other Details',
  'Review & Submit'
];

const INITIAL_DATA = {
  // Step 1: Policy
  agreedToPolicy: false,
  
  // Step 2: Personal
  name: '',
  email: '',
  phone: '',
  dob: '',
  gender: '',
  category: 'general',
  
  // Step 3: Address
  address: {
    line1: '',
    line2: '',
    city: '',
    state: '',
    pin: '',
    country: 'India'
  },
  
  // Step 4: Academic
  jeePercentile: '',
  entranceMarks: '',
  class10Percent: '',
  class12Percent: '',
  collegeName: '',
  course: '',
  yearOfStudy: '1',
  
  // Step 5: Other
  bloodGroup: '',
  medicalConditions: '',
  parentName: '',
  parentPhone: '',
  parentEmail: ''
};

export default function Apply() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(() => {
    const saved = sessionStorage.getItem('hostelApplicationDraft');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    sessionStorage.setItem('hostelApplicationDraft', JSON.stringify(formData));
  }, [formData]);

  const updateFormData = (newData) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const goToStep = (step) => {
    setCurrentStep(step);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await api.post('/hostel-applications/submit', formData);
      if (res.data.success) {
        toast.success(res.data.message || 'Application submitted successfully!');
        sessionStorage.removeItem('hostelApplicationDraft');
        navigate('/');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit application. Please try again.';
      toast.error(msg);
      // NCR rejection sets rejected flag; we do not auto redirect but let user see error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <Building2 className="w-6 h-6 text-indigo-600" />
          <span className="text-xl font-bold font-headline text-slate-900">HostelOS</span>
        </div>
        <button onClick={() => navigate('/')} className="text-sm font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Cancel & Return
        </button>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-end mb-2">
            <h1 className="text-2xl font-bold font-headline text-slate-900">Step {currentStep}: {STEPS[currentStep - 1]}</h1>
            <span className="text-sm font-medium text-slate-500">{currentStep} of {STEPS.length}</span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden flex">
            {STEPS.map((_, i) => (
              <div 
                key={i} 
                className={`flex-1 h-full border-r border-slate-50/20 transition-all ${
                  i < currentStep ? 'bg-indigo-600' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
          {currentStep === 1 && <Step1Policy formData={formData} updateFormData={updateFormData} onNext={nextStep} />}
          {currentStep === 2 && <Step2Personal formData={formData} updateFormData={updateFormData} onNext={nextStep} onPrev={prevStep} />}
          {currentStep === 3 && <Step3Address formData={formData} updateFormData={updateFormData} onNext={nextStep} onPrev={prevStep} />}
          {currentStep === 4 && <Step4Academic formData={formData} updateFormData={updateFormData} onNext={nextStep} onPrev={prevStep} />}
          {currentStep === 5 && <Step5Other formData={formData} updateFormData={updateFormData} onNext={nextStep} onPrev={prevStep} />}
          {currentStep === 6 && <Step6Review formData={formData} onPrev={prevStep} onSubmit={handleSubmit} isSubmitting={isSubmitting} goToStep={goToStep} />}
        </div>
      </main>
    </div>
  );
}
