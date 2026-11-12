import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PublicLandingPage from './pages/PublicLandingPage';
import LoginPage from './pages/LoginPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import DevHealthPage from './pages/DevHealthPage';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public SaaS Landing Page */}
          <Route path="/" element={<PublicLandingPage />} />

          {/* Authentication Pages */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />

          {/* Technical Diagnostics (Preserved from Milestone 1) */}
          <Route path="/dev/health" element={<DevHealthPage />} />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
