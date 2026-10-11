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
import Onboarding from '../pages/Onboarding';
import ProtectedRoute from '../components/ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />

      {/* Authenticated Pages */}
      <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/resume-builder" element={<ProtectedRoute><ResumeBuilder /></ProtectedRoute>} />
      <Route path="/templates" element={<ProtectedRoute><Templates /></ProtectedRoute>} />
      <Route path="/ats-checker" element={<ProtectedRoute><ATSChecker /></ProtectedRoute>} />
      <Route path="/placement-prep" element={<ProtectedRoute><Aptitude /></ProtectedRoute>} />
      <Route path="/placement-prep/aptitude" element={<ProtectedRoute><Aptitude /></ProtectedRoute>} />
      <Route path="/placement-prep/technical" element={<ProtectedRoute><Technical /></ProtectedRoute>} />
      <Route path="/placement-prep/hr-interview" element={<ProtectedRoute><HRInterview /></ProtectedRoute>} />
      <Route path="/placement-prep/company" element={<ProtectedRoute><CompanyPrep /></ProtectedRoute>} />
      <Route path="/my-progress" element={<ProtectedRoute><MyProgress /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
