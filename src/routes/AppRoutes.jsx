import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Dashboard from '../pages/Dashboard';
import ResumeBuilder from '../pages/ResumeBuilder';
import Templates from '../pages/Templates';
import ATSChecker from '../pages/ATSChecker';
import Aptitude from '../pages/Aptitude';
import Technical from '../pages/Technical';
import HRInterview from '../pages/HRInterview';
import CompanyPrep from '../pages/CompanyPrep';
import MyProgress from '../pages/MyProgress';
import Profile from '../pages/Profile';
import Settings from '../pages/Settings';
import About from '../pages/About';
import Contact from '../pages/Contact';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/resume-builder" element={<ResumeBuilder />} />
      <Route path="/templates" element={<Templates />} />
      <Route path="/ats-checker" element={<ATSChecker />} />
      <Route path="/placement-prep" element={<Aptitude />} />
      <Route path="/placement-prep/aptitude" element={<Aptitude />} />
      <Route path="/placement-prep/technical" element={<Technical />} />
      <Route path="/placement-prep/hr-interview" element={<HRInterview />} />
      <Route path="/placement-prep/company" element={<CompanyPrep />} />
      <Route path="/my-progress" element={<MyProgress />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
