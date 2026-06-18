import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logo from '../assets/logo/Primary-logo-light.png';

const Navigation: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="bg-black max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('/')} className="cursor-pointer group">
          <img src={logo} alt="GigaFix" className="h-10 sm:h-12 w-auto group-hover:scale-105 transition-transform duration-300" />
        </button>

        <div className="hidden md:flex items-center space-x-6 lg:space-x-8 text-sm font-medium text-slate-300">
          <button onClick={() => navigate('/')} className="text-white font-semibold hover:text-green-400 transition-colors relative group">
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 group-hover:w-full transition-all duration-300"></span>
          </button>
          <a href="#" className="hover:text-green-400 transition-colors relative group">
            How it Works
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 group-hover:w-full transition-all duration-300"></span>
          </a>
          <a href="#" className="hover:text-green-400 transition-colors relative group">
            Categories
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 group-hover:w-full transition-all duration-300"></span>
          </a>
          <button onClick={() => navigate('/support')} className="hover:text-green-400 transition-colors relative group">
            Support
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 group-hover:w-full transition-all duration-300"></span>
          </button>
        </div>

        <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
          <button onClick={() => navigate('/auth')} className="text-sm font-medium text-slate-300 hover:text-green-400 px-4 lg:px-5 py-2.5 rounded-xl hover:bg-white/10 transition-all duration-300">
            Login
          </button>
          <button onClick={() => navigate('/auth')} className="text-sm font-semibold bg-gradient-to-r from-green-600 to-green-700 text-white px-4 lg:px-6 py-2.5 rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg shadow-green-600/30 hover:shadow-xl hover:shadow-green-600/40 hover:-translate-y-0.5">
            Sign Up
          </button>
        </div>

        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 rounded-lg hover:bg-white/10 text-white transition-colors">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-white/10 pt-4">
          <div className="flex flex-col space-y-4">
            <button onClick={() => { navigate('/'); setIsMobileMenuOpen(false); }} className="text-white font-medium hover:text-green-400 transition-colors text-left py-2">Home</button>
            <a href="#" className="text-slate-300 hover:text-green-400 transition-colors py-2">How it Works</a>
            <a href="#" className="text-slate-300 hover:text-green-400 transition-colors py-2">Categories</a>
            <button onClick={() => { navigate('/support'); setIsMobileMenuOpen(false); }} className="text-slate-300 hover:text-green-400 transition-colors text-left py-2">Support</button>
            <div className="flex flex-col space-y-3 pt-4 border-t border-white/10">
              <button onClick={() => { navigate('/auth'); setIsMobileMenuOpen(false); }} className="text-sm font-medium text-slate-300 hover:text-green-400 px-4 py-2.5 rounded-xl hover:bg-white/10 transition-all text-left">Login</button>
              <button onClick={() => { navigate('/auth'); setIsMobileMenuOpen(false); }} className="text-sm font-semibold bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2.5 rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg text-center">Sign Up</button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
