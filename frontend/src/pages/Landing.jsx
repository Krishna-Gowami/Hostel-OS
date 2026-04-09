import { Link } from 'react-router-dom'
import { Building2, FileCheck, Target, Award, ListChecks, CheckCircle2, UserCheck } from 'lucide-react'

export default function Landing() {
  return (
    <div className="bg-white min-h-screen font-sans text-slate-800">
      {/* Navbar */}
      <header className="flex justify-between items-center px-8 py-5 sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 font-headline">HostelOS</span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Login</Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-8 py-16 md:py-24 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold tracking-wide border border-indigo-100">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            ADMISSIONS OPEN FOR 2025
          </div>
          <h1 className="text-5xl md:text-6xl font-headline font-extrabold text-slate-900 leading-[1.1]">
            Apply for Hostel <br/>
            <span className="text-indigo-600 relative">
              Accommodation
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-indigo-200" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="transparent" />
              </svg>
            </span>
          </h1>
          <p className="text-lg text-slate-500 max-w-md leading-relaxed">
            A fair, merit-based room allocation system for students. Apply seamlessly through our digital portal for the upcoming academic year.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link to="/apply" className="bg-indigo-600 text-white font-bold px-8 py-4 rounded-xl text-center hover:bg-indigo-700 hover:-translate-y-1 transition-all shadow-lg shadow-indigo-200">
              Apply for Hostel
            </Link>
            <Link to="/register" className="bg-white text-slate-700 font-bold px-8 py-4 rounded-xl text-center border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors">
              Sign Up
            </Link>
          </div>
          <p className="text-xs text-slate-400 mt-4">* Sign up only if you are already enrolled and assigned a room.</p>
        </div>
        
        <div className="flex-1 relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-50 to-purple-50 rounded-full blur-3xl opacity-70 -z-10"></div>
          <img 
            src="/isometric-hostel.png" 
            alt="Isometric Modern Hostel" 
            className="w-full max-w-lg mx-auto drop-shadow-2xl rounded-2xl object-cover transform hover:scale-[1.02] transition-transform duration-500"
            onError={(e) => {
              // Fallback to stylized box if img fails loading
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <div className="hidden w-full max-w-lg aspect-square mx-auto bg-gradient-to-tr from-indigo-100 to-indigo-50 rounded-[3rem] border border-indigo-200 shadow-xl items-center justify-center relative overflow-hidden">
             {/* Abstract Geometric Fallback */}
             <div className="absolute bottom-10 left-10 w-32 h-32 bg-indigo-300 rounded-xl opacity-50 transform rotate-12"></div>
             <div className="absolute top-10 right-10 w-24 h-48 bg-purple-200 rounded-xl opacity-50 transform -rotate-6"></div>
             <Building2 className="w-32 h-32 text-indigo-400 relative z-10" />
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="bg-slate-50 py-24 border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-headline text-slate-900 mb-4">Transparent & Merit-Based</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">We ensure equal opportunities for all applicants through a strict, policy-driven allocation engine.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: FileCheck, color: "text-blue-600", bg: "bg-blue-100", title: "Clear Policy Compliance", desc: "Automated geocoding ensures applicants residing within a 25km radius (NCR) are systematically filtered." },
              { icon: Award, color: "text-indigo-600", bg: "bg-indigo-100", title: "Fair Ranking Algorithm", desc: "Independent ranking lists generated dynamically focusing solely on verified academic merit metrics." },
              { icon: Target, color: "text-purple-600", bg: "bg-purple-100", title: "Equitable Allocation", desc: "Smart 50-50 seat distribution between JEE and College Entrance pools, balancing overall admissions." }
            ].map(f => (
              <div key={f.title} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${f.bg}`}>
                  <f.icon className={`w-6 h-6 ${f.color}`} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-8">
          <h2 className="text-3xl font-bold font-headline text-center text-slate-900 mb-16">How It Works</h2>
          
          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-indigo-100 via-indigo-200 to-indigo-100 -translate-y-1/2 rounded-full"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white border-4 border-indigo-100 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-indigo-100/50 relative">
                  <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold absolute -top-3 -right-3 border-4 border-white">1</div>
                  <ListChecks className="w-7 h-7 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Submit Application</h3>
                <p className="text-slate-500 text-sm">Fill out the multi-step application form with your personal, permanent address, and academic details.</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white border-4 border-indigo-100 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-indigo-100/50 relative">
                  <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold absolute -top-3 -right-3 border-4 border-white">2</div>
                  <UserCheck className="w-7 h-7 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Data Verification</h3>
                <p className="text-slate-500 text-sm">Our system automatically verifies your eligibility based on proximity to NCR and academic cut-offs.</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white border-4 border-indigo-100 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-indigo-100/50 relative">
                  <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold absolute -top-3 -right-3 border-4 border-white">3</div>
                  <CheckCircle2 className="w-7 h-7 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Automated Allocation</h3>
                <p className="text-slate-500 text-sm">Merit lists are generated by admins. If selected, you receive an instant email with your allocated room!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="bg-slate-900 pt-16 pb-8 px-8 border-t border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-col items-center justify-center gap-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="bg-indigo-600/10 p-3 rounded-2xl border border-indigo-500/20">
              <Building2 className="w-8 h-8 text-indigo-400" />
            </div>
            <div>
              <span className="text-2xl text-white font-headline font-bold block mb-1">HostelOS</span>
              <span className="text-slate-400 text-sm">Smart Hostel Management System</span>
            </div>
          </div>
          
          <div className="h-px w-full max-w-sm bg-slate-800 my-4"></div>
          
          <div className="flex flex-col md:flex-row justify-between w-full items-center gap-4 text-xs font-medium tracking-wide">
            <p className="text-slate-500">© 2025 HostelOS. All rights reserved.</p>
            <div className="flex gap-6 text-slate-400">
              <a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-indigo-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-indigo-400 transition-colors">Admissions Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
