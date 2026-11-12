import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, CheckCircle2, XCircle, RefreshCw, ArrowLeft } from 'lucide-react';

export default function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const status = searchParams.get('status');
  const message = searchParams.get('message');

  const [processing, setProcessing] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      if (status === 'error') {
        setProcessing(false);
        setErrorMessage(message ? decodeURIComponent(message) : 'Authentication failed with GitHub');
        return;
      }

      if (status === 'success') {
        try {
          await refreshUser();
          setProcessing(false);
          // Redirect to home or dashboard after brief confirmation
          setTimeout(() => {
            navigate('/');
          }, 1200);
        } catch {
          setProcessing(false);
          setErrorMessage('Failed to initialize session after GitHub login');
        }
      } else {
        setProcessing(false);
        setErrorMessage('Invalid authentication callback parameters');
      }
    };

    handleCallback();
  }, [status, message, refreshUser, navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full p-8 rounded-2xl bg-background-subtle border border-background-surface shadow-2xl text-center space-y-6">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-400 mx-auto flex items-center justify-center shadow-lg shadow-primary-500/20">
          <Activity className="h-6 w-6 text-white" />
        </div>

        {processing ? (
          <div className="space-y-3">
            <RefreshCw className="h-7 w-7 text-primary-400 animate-spin mx-auto" />
            <h2 className="text-lg font-bold text-white">Completing Authentication</h2>
            <p className="text-xs text-slate-400">
              Verifying security tokens and establishing your session...
            </p>
          </div>
        ) : errorMessage ? (
          <div className="space-y-4">
            <XCircle className="h-10 w-10 text-accent-rose mx-auto" />
            <h2 className="text-lg font-bold text-white">Authentication Failed</h2>
            <p className="text-xs text-accent-rose bg-accent-rose/10 p-3 rounded-lg border border-accent-rose/20">
              {errorMessage}
            </p>
            <div className="pt-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-primary-600 hover:bg-primary-500 text-white transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Try Again
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <CheckCircle2 className="h-10 w-10 text-accent-emerald mx-auto" />
            <h2 className="text-lg font-bold text-white">Signed in Successfully</h2>
            <p className="text-xs text-slate-400">
              Your session is active. Redirecting you to DevPulse...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
