import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Activity,
  GitPullRequest,
  ShieldCheck,
  ArrowLeft,
  Lock,
  UserCheck,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export default function LoginPage() {
  const { devSimulateLogin, isAuthenticated, user } = useAuth();
  const [simulating, setSimulating] = useState(false);
  const [simError, setSimError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleGitHubLogin = () => {
    // Navigates directly to the backend OAuth initiation endpoint
    window.location.href = '/api/auth/github';
  };

  const handleSimulate = async (username: string) => {
    setSimulating(true);
    setSimError(null);
    try {
      await devSimulateLogin(username);
      navigate('/');
    } catch (err: unknown) {
      setSimError(err instanceof Error ? err.message : 'Simulation failed');
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 sm:p-6 selection:bg-primary-500 selection:text-white">
      {/* Return button */}
      <div className="absolute top-6 left-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>

      <div className="max-w-md w-full space-y-6">
        {/* Logo and Header */}
        <div className="text-center space-y-2">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-400 mx-auto flex items-center justify-center shadow-lg shadow-primary-500/30">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Sign In to DevPulse</h1>
          <p className="text-xs text-slate-400">
            Smart Developer Productivity & Team Analytics Platform
          </p>
        </div>

        {/* Login Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-background-subtle border border-background-surface shadow-xl space-y-6">
          {isAuthenticated && user ? (
            <div className="p-4 rounded-xl bg-accent-emerald/10 border border-accent-emerald/20 text-center space-y-3">
              <UserCheck className="h-6 w-6 text-accent-emerald mx-auto" />
              <p className="text-xs text-slate-300">
                You are currently signed in as <strong className="text-white">{user.name || user.username}</strong>
              </p>
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-primary-600 text-white hover:bg-primary-500 transition-colors"
              >
                Go to Landing Page
              </Link>
            </div>
          ) : (
            <>
              {/* Primary OAuth Button */}
              <button
                onClick={handleGitHubLogin}
                className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-xl text-sm font-semibold bg-white text-slate-900 hover:bg-slate-100 transition-all shadow-md hover:scale-[1.01]"
              >
                <GitPullRequest className="h-5 w-5 text-slate-900" />
                Continue with GitHub
              </button>

              {/* Minimal Scopes Disclosure */}
              <div className="p-4 rounded-xl bg-background border border-background-surface space-y-2.5 text-xs">
                <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                  <ShieldCheck className="h-4 w-4 text-accent-emerald flex-shrink-0" />
                  <span>Minimal Permissions Required:</span>
                </div>
                <ul className="text-[11px] text-slate-400 space-y-1.5 pl-5 list-disc">
                  <li>
                    <strong className="text-slate-300">read:user</strong> &bull; Profile identity and username
                  </li>
                  <li>
                    <strong className="text-slate-300">user:email</strong> &bull; Verified email to match commit authorship
                  </li>
                </ul>
                <p className="text-[10px] text-slate-500 pt-1">
                  Access tokens are encrypted at rest with AES-256-GCM. We never write to your repositories.
                </p>
              </div>

              {/* Dev Simulation Fallback for local testing */}
              <div className="pt-2 border-t border-background-surface space-y-3">
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                  <Sparkles className="h-3.5 w-3.5 text-primary-400" />
                  <span>Local Development Quick Testing:</span>
                </div>

                {simError && (
                  <div className="p-2.5 rounded-lg bg-accent-rose/10 border border-accent-rose/20 text-accent-rose text-[11px] flex items-center gap-2">
                    <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                    <span>{simError}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleSimulate('sarah-lead')}
                    disabled={simulating}
                    className="p-2.5 rounded-lg text-xs font-medium bg-background-surface hover:bg-background-hover border border-slate-700 text-slate-300 transition-colors disabled:opacity-50 text-left"
                  >
                    <div className="font-semibold text-white">Sarah M.</div>
                    <div className="text-[10px] text-slate-400">Team Lead Demo</div>
                  </button>

                  <button
                    onClick={() => handleSimulate('alex-dev')}
                    disabled={simulating}
                    className="p-2.5 rounded-lg text-xs font-medium bg-background-surface hover:bg-background-hover border border-slate-700 text-slate-300 transition-colors disabled:opacity-50 text-left"
                  >
                    <div className="font-semibold text-white">Alex C.</div>
                    <div className="text-[10px] text-slate-400">Developer Demo</div>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Security commit notice */}
        <div className="text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
          <Lock className="h-3.5 w-3.5 text-slate-500" />
          <span>HTTP-Only Session Cookies &bull; CSRF State Validation</span>
        </div>
      </div>
    </div>
  );
}
