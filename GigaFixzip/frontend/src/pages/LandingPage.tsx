import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2, MapPin, Search, Star, Zap, Droplets, Paintbrush, Video,
  Sun, Hammer, Flame, Users, FileText, CheckSquare, Shield, Clock,
  DollarSign, Headphones, Award
} from 'lucide-react';
import heroImage from '../assets/person-landing.png';
import backgroundImage from '../assets/landing-hero.png';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      <Navigation />

      {/* Hero Section */}
      <main
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative overflow-hidden"
        style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.6) 70%, rgba(255,255,255,0) 100%)' }} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                <CheckCircle2 className="w-4 h-4" />
                <span>Trusted by 5,000+ Kenyans</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-slate-900 tracking-tight">
                Find trusted<br />professionals for<br />
                <span className="text-green-600 relative inline-block">
                  any job
                  <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8" fill="none">
                    <path d="M0 4Q50 8 100 4T200 4" stroke="#22c55e" strokeWidth="3" fill="none" strokeLinecap="round"/>
                  </svg>
                </span>
              </h1>
              <p className="text-sm sm:text-base text-slate-600 max-w-lg leading-relaxed">
                Connect with verified and rated artisans near you. Fast, reliable, and affordable service at your fingertips.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-2 flex flex-col sm:flex-row shadow-2xl shadow-green-900/10 gap-2 border border-slate-100">
              <div className="flex-1 flex items-center px-6 py-4">
                <Search className="w-6 h-6 text-slate-400 mr-4" />
                <input type="text" placeholder="What service do you need?" className="w-full bg-transparent border-none focus:ring-0 text-base outline-none text-slate-700 placeholder:text-slate-400" />
              </div>
              <div className="hidden sm:block w-px bg-slate-200 my-4" />
              <div className="flex-1 flex items-center px-6 py-4">
                <MapPin className="w-6 h-6 text-slate-400 mr-4" />
                <input type="text" defaultValue="Nairobi, Kenya" className="w-full bg-transparent border-none focus:ring-0 text-base outline-none text-slate-700" />
              </div>
              <button className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-2xl font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-lg shadow-green-600/30 hover:shadow-xl w-full sm:w-auto">
                Search
              </button>
            </div>
          </div>

          <div className="relative h-[250px] sm:h-[300px] lg:h-[350px]">
            <img src={heroImage} alt="Professional Worker" className="absolute bottom-0 left-0 w-full h-[280px] sm:h-[330px] lg:h-[380px] object-contain object-bottom z-10 -mb-8 sm:-mb-12 lg:-mb-16 drop-shadow-2xl" />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-4 text-xs sm:text-sm text-slate-600 font-medium relative z-10">
          {['Trusted Professionals', 'Secure Payments', 'Satisfaction Guarantee'].map(item => (
            <div key={item} className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </main>

      {/* Popular Services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Zap className="w-4 h-4" /><span>Popular Categories</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-slate-900">Find the right professional</h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-base sm:text-lg">Browse our most popular service categories</p>
        </div>
        <div className="overflow-hidden">
          <div className="flex gap-4 sm:gap-6" style={{ animation: 'scroll 30s linear infinite', width: 'max-content' }}>
            {[
              { icon: <Zap className="w-9 h-9 text-blue-600" />, label: 'Electricians', count: '500+' },
              { icon: <Droplets className="w-9 h-9 text-blue-500" />, label: 'Plumbers', count: '450+' },
              { icon: <Paintbrush className="w-9 h-9 text-orange-500" />, label: 'Painters', count: '320+' },
              { icon: <Video className="w-9 h-9 text-slate-700" />, label: 'CCTV Installers', count: '180+' },
              { icon: <Sun className="w-9 h-9 text-yellow-500" />, label: 'Solar Installers', count: '250+' },
              { icon: <Hammer className="w-9 h-9 text-amber-700" />, label: 'Carpenters', count: '380+' },
              { icon: <Flame className="w-9 h-9 text-red-500" />, label: 'Welders', count: '290+' },
              { icon: <Users className="w-9 h-9 text-purple-600" />, label: 'Cleaners', count: '420+' },
              { icon: <Zap className="w-9 h-9 text-blue-600" />, label: 'Electricians', count: '500+' },
              { icon: <Droplets className="w-9 h-9 text-blue-500" />, label: 'Plumbers', count: '450+' },
              { icon: <Paintbrush className="w-9 h-9 text-orange-500" />, label: 'Painters', count: '320+' },
              { icon: <Video className="w-9 h-9 text-slate-700" />, label: 'CCTV Installers', count: '180+' },
              { icon: <Sun className="w-9 h-9 text-yellow-500" />, label: 'Solar Installers', count: '250+' },
              { icon: <Hammer className="w-9 h-9 text-amber-700" />, label: 'Carpenters', count: '380+' },
              { icon: <Flame className="w-9 h-9 text-red-500" />, label: 'Welders', count: '290+' },
              { icon: <Users className="w-9 h-9 text-purple-600" />, label: 'Cleaners', count: '420+' },
            ].map((service, index) => (
              <div key={index} className="group relative bg-white p-4 sm:p-6 lg:p-7 rounded-2xl sm:rounded-3xl border border-slate-200 hover:shadow-2xl hover:-translate-y-2 hover:border-green-300 transition-all duration-300 cursor-pointer overflow-hidden min-w-[140px] sm:min-w-[160px] lg:min-w-[180px]">
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="mb-3 sm:mb-5 group-hover:scale-110 transition-transform duration-300">{service.icon}</div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-800 text-center block mb-1">{service.label}</span>
                  <span className="text-xs text-slate-500">{service.count} pros</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <style>{`@keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
      </section>

      {/* How It Works */}
      <section className="bg-gradient-to-br from-slate-50 via-white to-green-50 py-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Search className="w-4 h-4" /><span>Simple Process</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-slate-900">How It Works</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-base sm:text-lg">Get your job done in 4 simple steps</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative">
            <div className="hidden lg:block absolute top-24 left-[12%] right-[12%] h-1 bg-gradient-to-r from-green-200 via-green-400 to-green-200 -z-10 rounded-full" />
            {[
              { icon: <Search className="w-8 h-8 text-white" />, step: '01', title: 'Search', desc: 'Find the service you need from our wide range of categories', color: 'from-blue-500 to-blue-600' },
              { icon: <Users className="w-8 h-8 text-white" />, step: '02', title: 'Connect', desc: 'Connect with verified professionals in your area', color: 'from-purple-500 to-purple-600' },
              { icon: <FileText className="w-8 h-8 text-white" />, step: '03', title: 'Get Quote', desc: 'Receive and compare quotes from multiple professionals', color: 'from-orange-500 to-orange-600' },
              { icon: <CheckSquare className="w-8 h-8 text-white" />, step: '04', title: 'Get It Done', desc: 'Hire the best professional and get your job done', color: 'from-green-500 to-green-600' },
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center text-center group">
                <div className={`w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br ${item.color} rounded-2xl sm:rounded-3xl flex items-center justify-center mb-3 sm:mb-4 shadow-xl group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-300`}>
                  {item.icon}
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-slate-200 mb-1 opacity-50">{item.step}</div>
                <h3 className="font-bold text-base sm:text-lg mb-1 sm:mb-2 text-slate-900 group-hover:text-green-600 transition-colors">{item.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 px-2 sm:px-4 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gradient-to-br from-slate-50 via-white to-green-50 py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Award className="w-4 h-4" /><span>Why GigaFix</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-slate-900">Why Choose GigaFix</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-base sm:text-lg">We make finding reliable professionals easy, safe, and affordable</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              { icon: <CheckCircle2 className="w-10 h-10 text-white" />, title: 'Verified Professionals', desc: 'All professionals are vetted and verified for your peace of mind', color: 'from-green-50 to-green-100', iconBg: 'bg-green-500' },
              { icon: <Shield className="w-10 h-10 text-white" />, title: 'Secure Payments', desc: 'Your money is protected until the job is completed to your satisfaction', color: 'from-blue-50 to-blue-100', iconBg: 'bg-blue-500' },
              { icon: <Clock className="w-10 h-10 text-white" />, title: 'Quick Response', desc: 'Get responses from professionals within minutes of posting your job', color: 'from-purple-50 to-purple-100', iconBg: 'bg-purple-500' },
              { icon: <DollarSign className="w-10 h-10 text-white" />, title: 'Fair Pricing', desc: 'Compare quotes from multiple professionals to get the best price', color: 'from-orange-50 to-orange-100', iconBg: 'bg-orange-500' },
              { icon: <Headphones className="w-10 h-10 text-white" />, title: '24/7 Support', desc: 'Our support team is always available to help you with any issues', color: 'from-pink-50 to-pink-100', iconBg: 'bg-pink-500' },
              { icon: <Award className="w-10 h-10 text-white" />, title: 'Satisfaction Guarantee', desc: "If you're not satisfied, we'll work to make it right", color: 'from-teal-50 to-teal-100', iconBg: 'bg-teal-500' },
            ].map((feature, index) => (
              <div key={index} className={`group bg-gradient-to-br ${feature.color} p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`${feature.iconBg} p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>{feature.icon}</div>
                  <h3 className="font-bold text-lg text-slate-900">{feature.title}</h3>
                </div>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Star className="w-4 h-4" /><span>Customer Reviews</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-slate-900">What Our Customers Say</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[
            { name: 'Sarah Mwangi', role: 'Homeowner', rating: 5, text: 'Found an amazing electrician within minutes. The job was done perfectly and at a fair price. Highly recommend GigaFix!', avatar: 'SM', color: 'from-green-500 to-green-600' },
            { name: 'James Ochieng', role: 'Business Owner', rating: 5, text: 'As a business owner, I need reliable contractors. GigaFix has been a game-changer for finding quality professionals quickly.', avatar: 'JO', color: 'from-blue-500 to-blue-600' },
            { name: 'Grace Wanjiku', role: 'Property Manager', rating: 5, text: 'Managing multiple properties is easier now. I can find trusted professionals for any maintenance job in no time.', avatar: 'GW', color: 'from-purple-500 to-purple-600' },
          ].map((t, index) => (
            <div key={index} className="group relative bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-lg border border-slate-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="absolute -top-4 left-8">
                <div className={`w-12 h-12 bg-gradient-to-br ${t.color} rounded-2xl flex items-center justify-center text-white font-bold shadow-lg`}>{t.avatar}</div>
              </div>
              <div className="flex items-center gap-1 mb-6 pt-4">
                {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />)}
              </div>
              <p className="text-slate-600 mb-6 leading-relaxed text-sm">"{t.text}"</p>
              <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                <div>
                  <div className="font-semibold text-slate-900">{t.name}</div>
                  <div className="text-sm text-slate-500">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-400 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-green-500/20">
            <Zap className="w-4 h-4" /><span>Get Started Today</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-white">Ready to Get Started?</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-base sm:text-lg mb-8">Join thousands of Kenyans who have found their perfect professionals through GigaFix</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('/auth')} className="bg-green-600 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-green-500 transition-all shadow-xl">Sign Up Now</button>
            <button onClick={() => navigate('/auth')} className="bg-slate-800 border border-slate-700 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-slate-700 transition-all">Learn More</button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
