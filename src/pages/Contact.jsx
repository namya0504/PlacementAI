import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h1 className="text-4xl font-extrabold text-slate-900 font-outfit">Contact Us</h1>
          <p className="text-slate-600 text-sm">Have questions or need help with placement preparation? We are here for you.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Contact Info */}
          <div className="lg:col-span-5 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 text-white space-y-8 shadow-xl">
            <h3 className="text-2xl font-bold font-outfit">Get in Touch</h3>
            <p className="text-blue-100 text-xs leading-relaxed">Our support team is available 24/7 to answer your queries about resumes, ATS scanner, and interview modules.</p>

            <div className="space-y-4 text-xs">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-yellow-300" />
                <span>support@placementai.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-yellow-300" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-yellow-300" />
                <span>Surat, Gujarat, India</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
            {submitted && (
              <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Message sent successfully! We will get back to you shortly.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Your Name</label>
                  <input required type="text" className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600" placeholder="e.g. John Doe" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address</label>
                  <input required type="email" className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600" placeholder="e.g. user@example.com" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Message</label>
                <textarea required rows={4} className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600" placeholder="Write your message here..."></textarea>
              </div>

              <button type="submit" className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-xs shadow hover:bg-blue-700 transition flex items-center justify-center gap-2">
                <Send className="w-4 h-4" /> Send Message
              </button>
            </form>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
