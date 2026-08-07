import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  FileText,
  CheckCircle,
  Brain,
  Code2,
  Mic,
  TrendingUp,
  Award,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  Zap,
  Users,
  Download,
  BookOpen,
  Bell
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Home() {
  const [activeFaq, setActiveFaq] = useState(null);

  const stats = [
    { value: '10K+', label: 'Students' },
    { value: '50K+', label: 'Resumes Created' },
    { value: '95%', label: 'Satisfaction Rate' },
  ];

  const features = [
    {
      icon: FileText,
      title: 'AI Resume Builder',
      desc: 'Create job-tailored, ATS-compliant resumes with smart AI content generation in minutes.',
      link: '/resume-builder',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: CheckCircle,
      title: 'ATS Resume Checker',
      desc: 'Instant keyword matching, formatting check, and AI actionable suggestions to pass ATS filters.',
      link: '/ats-checker',
      color: 'from-purple-500 to-indigo-500'
    },
    {
      icon: Award,
      title: 'Resume Templates',
      desc: 'Choose from professionally designed, ATS-friendly templates curated for modern tech companies.',
      link: '/templates',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      icon: Sparkles,
      title: 'AI Resume Suggestions',
      desc: 'Get real-time AI bullet enhancements for projects, achievements, and career summaries.',
      link: '/resume-builder',
      color: 'from-amber-500 to-orange-500'
    },
    {
      icon: Download,
      title: 'PDF Export & Share',
      desc: 'Download your high-resolution resume in clean vector PDF format ready for job applications.',
      link: '/resume-builder',
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: BookOpen,
      title: 'Resume Management',
      desc: 'Store, update, and manage multiple customized versions of your resume for different job roles.',
      link: '/dashboard',
      color: 'from-indigo-500 to-blue-600'
    },
    {
      icon: Code2,
      title: 'Coding Practice',
      desc: 'Solve programming problems in Java, Python, C++, and SQL with live code execution and test cases.',
      link: '/placement-prep/technical',
      color: 'from-blue-600 to-purple-600'
    },
    {
      icon: Zap,
      title: 'Technical Interview Prep',
      desc: 'Stage-wise MCQ quizzes and coding challenges designed for technical round selection.',
      link: '/placement-prep/technical',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      icon: Mic,
      title: 'AI HR Interview Simulator',
      desc: 'Practice common and profile-based HR questions with instant AI feedback on communication and confidence.',
      link: '/placement-prep/hr-interview',
      color: 'from-purple-600 to-pink-600'
    },
    {
      icon: TrendingUp,
      title: 'Placement Dashboard',
      desc: 'Track your resume score, aptitude readiness, technical index, and HR confidence score in one place.',
      link: '/dashboard',
      color: 'from-emerald-500 to-green-600'
    },
    {
      icon: ShieldCheck,
      title: 'Progress Analytics',
      desc: 'Detailed weekly activity graphs, skill spider breakdown, and test attempt history.',
      link: '/my-progress',
      color: 'from-violet-500 to-purple-600'
    },
    {
      icon: Bell,
      title: 'Real-time Notifications',
      desc: 'Stay informed on upcoming goal milestones, streak reminders, and placement readiness tips.',
      link: '/dashboard',
      color: 'from-amber-500 to-yellow-500'
    }
  ];

  const templates = [
    { name: 'Modern', tag: 'Most Popular', bg: 'bg-blue-50 border-blue-200' },
    { name: 'Professional', tag: 'Executive', bg: 'bg-purple-50 border-purple-200' },
    { name: 'Minimal', tag: 'Clean & Sleek', bg: 'bg-emerald-50 border-emerald-200' },
    { name: 'Creative', tag: 'Designers & Devs', bg: 'bg-amber-50 border-amber-200' }
  ];

  const testimonials = [
    {
      name: 'Namya Shah',
      college: 'Gujarat Technological University',
      company: 'Placed at TCS Digital (8.5 LPA)',
      review: 'PlacementAI changed my placement preparation! The ATS score checker helped me fix missing keywords, and the AI HR mock interview boosted my interview confidence immensely.'
    },
    {
      name: 'Rohan Sharma',
      college: 'IIT Delhi',
      company: 'Placed at Infosys Specialist Programmer',
      review: 'The coding questions with real-time test case feedback and aptitude stage learning made technical prep super structured. Highly recommend to all engineering students!'
    },
    {
      name: 'Priya Patel',
      college: 'Nirma University',
      company: 'Placed at Accenture (6.5 LPA)',
      review: 'I created my resume using the AI Resume Builder in under 10 minutes. The formatting passed ATS seamlessly, and I received interview calls within 2 weeks!'
    }
  ];

  const faqs = [
    {
      q: 'What is PlacementAI?',
      a: 'PlacementAI is an all-in-one AI companion for college students and job seekers. It provides an AI Resume Builder, ATS Resume Analysis, stage-wise Aptitude preparation, Technical coding practice, and AI HR interview simulation.'
    },
    {
      q: 'Is the AI Resume Builder ATS-friendly?',
      a: 'Yes! All resume templates offered in PlacementAI follow strict ATS compliance guidelines—using standard section titles, single-column parsable layouts, and optimal font sizing.'
    },
    {
      q: 'How does the ATS Resume Checker work?',
      a: 'Simply upload your PDF or TXT resume. Our AI scanner parses the document to match keywords against job descriptions, checks formatting structure, detects missing skills, and calculates a comprehensive ATS score out of 100.'
    },
    {
      q: 'Can I practice coding and Aptitude tests for specific companies?',
      a: 'Absolutely! Our Company Preparation module provides company-specific test patterns, weightage pie charts, and HR questions for companies like TCS, Infosys, Wipro, Accenture, and Capgemini.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 lg:pt-16 lg:pb-32 overflow-hidden">
        {/* Glowing Background Gradients */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Column */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-6 space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Next-Gen Placement Preparation</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight font-outfit">
                Your AI Companion for <span className="gradient-text">Resume Building</span> & Placement Success
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed font-normal">
                Create ATS-friendly resumes in minutes, practice aptitude, technical & HR interviews, and track your placement readiness—all in one place.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/35 transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  Get Started Free <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-xl text-base font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all duration-200"
                >
                  Explore Features
                </a>
              </div>

              {/* Live Statistics Counters */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-200/80">
                {stats.map((stat, idx) => (
                  <div key={idx} className="space-y-1">
                    <span className="text-2xl sm:text-3xl font-extrabold text-blue-600 font-outfit block">
                      {stat.value}
                    </span>
                    <span className="text-xs sm:text-sm text-slate-500 font-medium">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Hero Column: Illustration matching UI Reference Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-6 relative"
            >
              <div className="relative mx-auto max-w-lg lg:max-w-none">
                {/* Backdrop Soft Glow Card */}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 rounded-3xl blur-2xl transform rotate-2"></div>
                
                {/* Main Illustration Card */}
                <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/90 overflow-hidden">
                  
                  {/* Floating ATS Score Card (Matches Reference Screen) */}
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-6 left-6 z-20 bg-white rounded-2xl p-4 shadow-xl border border-slate-100 flex items-center gap-4"
                  >
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-extrabold text-lg">
                      85
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">ATS Score</div>
                      <div className="text-sm font-bold text-slate-800">85 / 100 (Excellent)</div>
                    </div>
                  </motion.div>

                  {/* Floating AI Assistant Badge Top Right */}
                  <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                    className="absolute top-6 right-6 z-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl px-3.5 py-2 shadow-lg flex items-center gap-2 text-xs font-bold"
                  >
                    <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" />
                    <span>AI Assistant Active</span>
                  </motion.div>

                  {/* Central Student Avatar Graphic */}
                  <div className="pt-16 pb-8 flex flex-col items-center justify-center">
                    <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-tr from-blue-100 via-purple-100 to-indigo-100 p-2 flex items-center justify-center shadow-inner">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"
                        alt="Student with laptop"
                        className="w-full h-full object-cover rounded-full shadow-lg ring-4 ring-white"
                      />
                    </div>
                    <div className="mt-4 text-center">
                      <h4 className="text-lg font-bold text-slate-900">Namya Shah</h4>
                      <p className="text-xs font-medium text-purple-600">Software Developer Candidate</p>
                    </div>
                  </div>

                  {/* Bottom Stats Preview Bar */}
                  <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-center">
                    <div className="p-3 bg-blue-50/80 rounded-xl">
                      <div className="text-xs text-slate-500 font-semibold">Aptitude</div>
                      <div className="text-base font-bold text-blue-700">72%</div>
                    </div>
                    <div className="p-3 bg-purple-50/80 rounded-xl">
                      <div className="text-xs text-slate-500 font-semibold">Technical</div>
                      <div className="text-base font-bold text-purple-700">80%</div>
                    </div>
                    <div className="p-3 bg-emerald-50/80 rounded-xl">
                      <div className="text-xs text-slate-500 font-semibold">Readiness</div>
                      <div className="text-base font-bold text-emerald-700">78%</div>
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 1. FEATURES SECTION */}
      <section id="features" className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Complete Placement Suite
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-outfit">
              Everything You Need to Get <span className="gradient-text">Hired Fast</span>
            </h2>
            <p className="text-slate-600 text-base">
              Integrated AI tools designed to build your resume, optimize ATS scores, master aptitude tests, and ace technical interviews.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="group p-6 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200/80 hover:border-blue-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${item.color} text-white flex items-center justify-center shadow-md`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition font-outfit">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  <div className="pt-6">
                    <Link
                      to={item.link}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 group-hover:text-blue-700 hover:underline"
                    >
                      Learn More <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. RESUME TEMPLATES PREVIEW */}
      <section className="py-20 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                ATS-Optimized Designs
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-3 font-outfit">
                Professional Resume Templates
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Handcrafted layouts tested to pass ATS scanners at top fortune 500 tech companies.
              </p>
            </div>
            <Link
              to="/templates"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition"
            >
              View All Templates <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {templates.map((tpl, idx) => (
              <div
                key={idx}
                className="group bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className={`h-48 rounded-xl ${tpl.bg} border p-4 flex flex-col justify-between relative overflow-hidden group-hover:scale-102 transition`}>
                    <div className="w-full h-3 bg-slate-300 rounded mb-2"></div>
                    <div className="w-3/4 h-2 bg-slate-200 rounded mb-4"></div>
                    <div className="space-y-1.5">
                      <div className="w-full h-2 bg-slate-200 rounded"></div>
                      <div className="w-5/6 h-2 bg-slate-200 rounded"></div>
                      <div className="w-4/6 h-2 bg-slate-200 rounded"></div>
                    </div>
                    <span className="self-start text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-white text-slate-700 shadow-sm">
                      {tpl.tag}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 font-outfit text-lg">{tpl.name} Template</h4>
                    <p className="text-xs text-slate-500">ATS Compliant Layout</p>
                  </div>
                </div>
                <div className="pt-4">
                  <Link
                    to="/resume-builder"
                    className="w-full py-2.5 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white font-semibold text-xs transition text-center block"
                  >
                    Use Template
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. ATS CHECKER PREVIEW WIDGET */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider">
                  Real-time Scan Engine
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold font-outfit leading-tight">
                  Check Your Resume ATS Score Before Applying
                </h2>
                <p className="text-blue-200 text-base">
                  Upload your resume to receive an instant ATS score out of 100, keyword match breakdown, and AI improvement suggestions.
                </p>
                <div className="pt-2">
                  <Link
                    to="/ats-checker"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-blue-900 font-bold text-sm hover:bg-blue-50 transition shadow-lg"
                  >
                    <CheckCircle className="w-4 h-4 text-blue-600" /> Upload & Analyze Resume
                  </Link>
                </div>
              </div>

              {/* Demo ATS Metric Card */}
              <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-200">Sample Scan Result</span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">Good Match</span>
                </div>
                <div className="flex items-center gap-6 mb-4">
                  <div className="w-20 h-20 rounded-full border-4 border-emerald-400 flex items-center justify-center text-2xl font-extrabold font-outfit text-white">
                    84/100
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-semibold text-white">Keyword Match: 88%</div>
                    <div className="text-xs text-blue-200">Readability: High</div>
                    <div className="text-xs text-blue-200">Formatting: Clean</div>
                  </div>
                </div>
                <div className="text-xs text-blue-100 bg-white/10 rounded-xl p-3">
                  💡 <span className="font-semibold text-white">AI Suggestion:</span> Add missing keywords: <code className="bg-black/30 px-1 rounded">REST API</code>, <code className="bg-black/30 px-1 rounded">Git</code>.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TESTIMONIALS SECTION */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              Success Stories
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 font-outfit">Loved by 10,000+ Students</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition space-y-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {'★'.repeat(5)}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed italic">
                  "{t.review}"
                </p>
                <div className="pt-2 border-t border-slate-100 flex flex-col">
                  <span className="font-bold text-slate-900 text-sm font-outfit">{t.name}</span>
                  <span className="text-xs text-slate-500">{t.college}</span>
                  <span className="text-xs font-semibold text-emerald-600 mt-1">{t.company}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FAQ ACCORDION */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 font-outfit">Frequently Asked Questions</h2>
            <p className="text-slate-600 text-sm">Have questions about PlacementAI? We've got answers.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-slate-200 rounded-2xl overflow-hidden transition"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-5 text-left font-bold text-slate-900 flex items-center justify-between bg-slate-50/50 hover:bg-slate-100/50 transition font-outfit"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${activeFaq === idx ? 'rotate-180 text-blue-600' : ''}`} />
                </button>
                {activeFaq === idx && (
                  <div className="p-5 text-sm text-slate-600 bg-white border-t border-slate-100 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CTA BANNER */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-outfit">Ready to Start Your Placement Journey?</h2>
          <p className="text-blue-100 text-base max-w-xl mx-auto">
            Join thousands of engineering and IT students preparing for campus placements with AI.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/resume-builder"
              className="px-8 py-3.5 rounded-xl bg-white text-blue-600 font-bold text-sm hover:bg-blue-50 transition shadow-lg"
            >
              Create Resume Now
            </Link>
            <Link
              to="/signup"
              className="px-8 py-3.5 rounded-xl bg-blue-700/60 hover:bg-blue-700 text-white font-bold text-sm border border-white/20 transition"
            >
              Sign Up Free
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
