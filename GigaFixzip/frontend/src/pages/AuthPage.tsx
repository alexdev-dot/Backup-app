import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SignUpForm from '../components/auth/SignUpForm';
import SignInForm from '../components/auth/SignInForm';
import authImage from '../assets/auth.jpg';
import logo from '../assets/logo/Primary-logo-light.png';

interface AuthPageProps {
  onLogin: (token: string, user: any) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-green-50 p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-72 h-72 bg-green-500 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
      </div>
      <div className="w-full max-w-6xl relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
          <div className="grid grid-cols-1 lg:grid-cols-5">

            {/* Left Side - Branding */}
            <div
              className="hidden lg:block p-12 text-white relative lg:col-span-3"
              style={{ backgroundImage: `url(${authImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-900/90 via-green-800/85 to-green-900/90 backdrop-blur-sm" />
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <button onClick={() => navigate('/')} className="flex items-center gap-2 mb-8 text-white/80 hover:text-white transition-colors group">
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">Back to home</span>
                  </button>
                  <div className="mb-8 cursor-pointer" onClick={() => navigate('/')}>
                    <img src={logo} alt="GigaFix" className="h-14 w-auto" />
                  </div>
                  <h1 className="text-5xl font-bold mb-6 leading-tight">
                    {isSignUp ? 'Join thousands of Kenyans' : 'Welcome back!'}
                  </h1>
                  <p className="text-green-100 text-lg mb-12 leading-relaxed max-w-md">
                    {isSignUp ? 'Connect with verified professionals for any job. Fast, reliable, and affordable.' : 'Sign in to continue connecting with trusted professionals.'}
                  </p>
                </div>
                <div className="space-y-5">
                  {['Verified Professionals', 'Secure Payments', 'Satisfaction Guarantee'].map(item => (
                    <div key={item} className="flex items-center gap-4 bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
                      <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shadow-lg">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-white font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="p-8 lg:p-12 lg:col-span-2 bg-gradient-to-br from-white to-slate-50">
              <div className="lg:hidden flex justify-between items-center mb-8">
                <button onClick={() => navigate('/')} className="text-sm text-gray-600 hover:text-green-600 flex items-center gap-1 font-medium">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <img src={logo} alt="GigaFix" className="h-10 w-auto" />
              </div>

              {isSignUp ? (
                <SignUpForm onLogin={onLogin} onSwitchToSignIn={() => setIsSignUp(false)} />
              ) : (
                <SignInForm onLogin={onLogin} onSwitchToSignUp={() => setIsSignUp(true)} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
