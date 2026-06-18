import React from 'react';
import logoDark from '../assets/logo/Primary-logo-dark.png';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-500 rounded-full blur-3xl" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          <div>
            <div className="mb-4 sm:mb-6">
              <img src={logoDark} alt="GigaFix" className="h-10 sm:h-12 w-auto" />
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-4 sm:mb-6">
              Connect with verified and rated professionals for all your home and business needs. Fast, reliable, and affordable.
            </p>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-6">Quick Links</h3>
            <ul className="space-y-3 sm:space-y-4">
              {['Home', 'How it Works', 'Categories', 'For Professionals', 'Blog'].map(item => (
                <li key={item}><a href="#" className="text-slate-400 hover:text-green-400 transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full group-hover:scale-125 transition-transform"></span>
                  {item}
                </a></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-6">Services</h3>
            <ul className="space-y-3 sm:space-y-4">
              {['Electricians', 'Plumbers', 'Painters', 'Carpenters', 'Welders'].map(item => (
                <li key={item}><a href="#" className="text-slate-400 hover:text-green-400 transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full group-hover:scale-125 transition-transform"></span>
                  {item}
                </a></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-6">Contact Us</h3>
            <ul className="space-y-3 sm:space-y-4">
              <li className="text-slate-400 text-sm">
                <span className="block font-semibold text-white mb-1">Email</span>
                <a href="mailto:support@gigafix.com" className="hover:text-green-400 transition-colors">support@gigafix.com</a>
              </li>
              <li className="text-slate-400 text-sm">
                <span className="block font-semibold text-white mb-1">Phone</span>
                <a href="tel:+254700000000" className="hover:text-green-400 transition-colors">+254 700 000 000</a>
              </li>
              <li className="text-slate-400 text-sm">
                <span className="block font-semibold text-white mb-1">Location</span>
                <span>Nairobi, Kenya</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-12 sm:mt-16 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-xs sm:text-sm">© 2026 GigaFix. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
            <a href="#" className="text-slate-400 hover:text-green-400 transition-colors text-xs sm:text-sm">Privacy Policy</a>
            <a href="#" className="text-slate-400 hover:text-green-400 transition-colors text-xs sm:text-sm">Terms of Service</a>
            <a href="#" className="text-slate-400 hover:text-green-400 transition-colors text-xs sm:text-sm">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
