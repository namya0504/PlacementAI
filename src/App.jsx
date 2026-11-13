import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { SidebarProvider } from './context/SidebarContext';
import AppRoutes from './routes/AppRoutes';
import PwaInstallBanner from './components/PwaInstallBanner';
import EmailVerificationBanner from './components/EmailVerificationBanner';
import CompleteProfileModal from './components/CompleteProfileModal';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastProvider>
          <SidebarProvider>
            <EmailVerificationBanner />
            <CompleteProfileModal />
            <AppRoutes />
            <PwaInstallBanner />
          </SidebarProvider>
        </ToastProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}
