import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MessageSquare, CheckCircle2, Send, Search, BookOpen, Users, CreditCard, Shield, Clock, ChevronRight, ChevronDown, ChevronUp, Headphones, Zap } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const SupportPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const quickLinks = [
    { icon: <BookOpen className="w-6 h-6" />, title: 'Getting Started', desc: 'Learn how to use GigaFix effectively', color: 'blue' },
    { icon: <Users className="w-6 h-6" />, title: 'Account Issues', desc: 'Manage your account settings', color: 'purple' },
    { icon: <CreditCard className="w-6 h-6" />, title: 'Payment Help', desc: 'Resolve payment problems', color: 'green' },
    { icon: <Shield className="w-6 h-6" />, title: 'Safety & Security', desc: 'Keep your account secure', color: 'red' },
  ];

  const faqCategories = [
    { icon: <Search className="w-5 h-5" />, title: 'Finding Professionals', count: 12 },
    { icon: <Users className="w-5 h-5" />, title: 'Account & Profile', count: 8 },
    { icon: <CreditCard className="w-5 h-5" />, title: 'Payments & Billing', count: 10 },
    { icon: <Shield className="w-5 h-5" />, title: 'Safety & Trust', count: 6 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50">
      <Navigation />

      <div className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
              <Headphones className="w-4 h-4" /><span>24/7 Support</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">How can we help you?</h1>
            <p className="text-green-100 text-lg max-w-2xl mx-auto mb-8">Search our knowledge base or browse topics below</p>
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
              <input
                type="text"
                placeholder="Search for help articles, FAQs, and more..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-5 rounded-2xl border-0 shadow-2xl focus:outline-none focus:ring-4 focus:ring-green-300 text-gray-800 text-lg"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-600 hover:text-green-600 mb-8 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </button>

        <div className="mb-20">
          <div className="flex items-center gap-2 mb-6">
            <Zap className="w-5 h-5 text-green-600" />
            <h2 className="text-3xl font-bold text-slate-900">Quick Links</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link, index) => (
              <div key={index} className="group bg-white p-7 rounded-3xl shadow-sm border border-slate-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 ${link.color === 'blue' ? 'bg-blue-50 text-blue-600' : link.color === 'purple' ? 'bg-purple-50 text-purple-600' : link.color === 'green' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                  {link.icon}
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-green-600 transition-colors">{link.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{link.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <Search className="w-5 h-5 text-green-600" />
              <h2 className="text-2xl font-bold text-slate-900">Browse by Topic</h2>
            </div>
            {faqCategories.map((category, index) => (
              <div key={index} className="group bg-white p-5 rounded-2xl border border-slate-200 hover:border-green-400 hover:shadow-lg transition-all duration-300 cursor-pointer flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 group-hover:text-green-600 transition-colors">{category.title}</h3>
                    <p className="text-xs text-slate-500">{category.count} articles</p>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-slate-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all duration-300" />
              </div>
            ))}

            <div className="bg-gradient-to-br from-green-600 to-green-700 p-8 rounded-3xl text-white mt-8 shadow-xl shadow-green-900/20">
              <div className="flex items-center gap-2 mb-4">
                <Headphones className="w-5 h-5" />
                <h3 className="font-bold text-xl">Still need help?</h3>
              </div>
              <p className="text-green-100 text-sm mb-8 leading-relaxed">Our support team is available 24/7 to assist you.</p>
              <div className="space-y-5">
                {[
                  { icon: <Mail className="w-6 h-6" />, label: 'Email', value: 'support@gigafix.com' },
                  { icon: <Phone className="w-6 h-6" />, label: 'Phone', value: '+254 700 000 000' },
                  { icon: <MessageSquare className="w-6 h-6" />, label: 'Live Chat', value: 'Available 24/7' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">{item.icon}</div>
                    <div>
                      <p className="text-sm font-semibold">{item.label}</p>
                      <p className="text-xs text-green-100">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <Send className="w-5 h-5 text-green-600" />
                  <h2 className="text-2xl font-bold text-slate-900">Send us a message</h2>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 px-4 py-2 rounded-full">
                  <Clock className="w-4 h-4" /><span>We respond within 24 hours</span>
                </div>
              </div>

              {submitted && (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-6 flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  <p className="text-green-800 font-medium">Message sent successfully! We'll get back to you soon.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your name" required className="w-full px-5 py-4 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" required className="w-full px-5 py-4 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Subject</label>
                  <select name="subject" value={formData.subject} onChange={handleChange} required className="w-full px-5 py-4 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all">
                    <option value="">Select a topic</option>
                    <option value="account">Account Issues</option>
                    <option value="booking">Booking Problems</option>
                    <option value="payment">Payment Issues</option>
                    <option value="professional">Professional Concerns</option>
                    <option value="technical">Technical Support</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                  <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Describe your issue..." required rows={6} className="w-full px-5 py-4 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all resize-none" />
                </div>
                <button type="submit" className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 rounded-2xl font-semibold transition-all shadow-lg flex items-center justify-center gap-2">
                  <Send className="w-5 h-5" />Send Message
                </button>
              </form>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-6">
                <BookOpen className="w-5 h-5 text-green-600" />
                <h2 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
              </div>
              <div className="space-y-3">
                {[
                  { q: 'How do I find a professional?', a: 'Simply search for the service you need, browse through verified professionals, compare quotes, and hire the one that best fits your requirements.' },
                  { q: 'Are all professionals verified?', a: 'Yes, all professionals on GigaFix go through a thorough verification process including identity verification, skills assessment, and background checks.' },
                  { q: 'How are payments handled?', a: 'Payments are securely held in escrow until the job is completed to your satisfaction. This protects both customers and professionals.' },
                  { q: "What if I'm not satisfied with the work?", a: "We offer a satisfaction guarantee. If you're not happy with the work, we'll work with you and the professional to resolve the issue or provide a refund." },
                ].map((faq, index) => (
                  <div key={index} className="border border-slate-200 rounded-2xl overflow-hidden">
                    <button onClick={() => setOpenFaq(openFaq === index ? null : index)} className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors">
                      <h3 className="font-semibold text-slate-900">{faq.q}</h3>
                      {openFaq === index ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                    </button>
                    {openFaq === index && (
                      <div className="px-5 pb-5 pt-0">
                        <p className="text-slate-600 text-sm leading-relaxed">{faq.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SupportPage;
