import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import AppRoutes from './routes/AppRoutes';
import PwaInstallBanner from './components/PwaInstallBanner';
import EmailVerificationBanner from './components/EmailVerificationBanner';
import CompleteProfileModal from './components/CompleteProfileModal';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastProvider>
          <EmailVerificationBanner />
          <CompleteProfileModal />
          <AppRoutes />
          <PwaInstallBanner />
        </ToastProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}
