import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  CheckCircle2,
  XCircle,
  Database,
  Server,
  RefreshCw,
  Clock,
  ShieldCheck,
  Radio,
  Layers,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';

interface HealthData {
  status: string;
  service: string;
  version: string;
  environment: string;
  uptimeSeconds: number;
  timestamp: string;
  database: {
    state: string;
    isConnected: boolean;
    host: string | null;
    name: string | null;
  };
}

export default function DevHealthPage() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);
    const start = performance.now();

    try {
      const response = await fetch('/api/health');
      const roundTrip = Math.round(performance.now() - start);
      setLatencyMs(roundTrip);

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}: ${response.statusText}`);
      }

      const data: HealthData = await response.json();
      setHealth(data);
      setLastChecked(new Date());
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown network error occurred while connecting to backend.');
      }
      setHealth(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const formatUptime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between p-4 sm:p-6 lg:p-10">
      <div className="max-w-6xl mx-auto w-full space-y-8">
        {/* Navigation & Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-background-surface gap-4">
          <div className="flex items-center space-x-3">
            <Link
              to="/"
              className="p-2 rounded-lg bg-background-surface hover:bg-background-hover text-slate-400 hover:text-white transition-colors"
              title="Return to Landing Page"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-400 flex items-center justify-center shadow-lg shadow-primary-500/20">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-white">DevPulse Diagnostics</h1>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-accent-amber/10 text-accent-amber border border-accent-amber/20">
                  /dev/health
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Internal Development Diagnostic & Baseline Connectivity Monitor
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-background-surface text-slate-300 border border-slate-700">
              <span className="h-2 w-2 rounded-full bg-accent-emerald animate-pulse" />
              Express + MongoDB Active
            </span>
            <button
              onClick={fetchHealth}
              disabled={loading}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-primary-600 hover:bg-primary-500 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-primary-600/20"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Pinging...' : 'Refresh Status'}
            </button>
          </div>
        </header>

        {/* Error Banner */}
        {error && (
          <div className="p-4 rounded-xl bg-accent-rose/10 border border-accent-rose/30 flex items-start gap-3">
            <XCircle className="h-5 w-5 text-accent-rose flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-sm">
              <p className="font-semibold text-accent-rose">Connection Error</p>
              <p className="text-slate-300 text-xs mt-1">{error}</p>
              <p className="text-slate-400 text-xs mt-2">
                Ensure the Express server is running on port 5000 and accessible from the Vite proxy.
              </p>
            </div>
          </div>
        )}

        {/* Status Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Express Server */}
          <div className="p-5 rounded-2xl bg-background-subtle border border-background-surface hover:border-slate-700 transition-all shadow-sm">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider">Backend API</span>
              <Server className="h-4 w-4 text-primary-400" />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div>
                <span className="text-xl font-bold text-white">
                  {health ? health.service : loading ? 'Checking...' : 'Offline'}
                </span>
                <p className="text-xs text-slate-400 mt-1">
                  Port: 5000 &bull; Node Express
                </p>
              </div>
              <div>
                {health?.status === 'healthy' ? (
                  <CheckCircle2 className="h-6 w-6 text-accent-emerald" />
                ) : (
                  <XCircle className="h-6 w-6 text-accent-rose" />
                )}
              </div>
            </div>
          </div>

          {/* Card 2: MongoDB Status */}
          <div className="p-5 rounded-2xl bg-background-subtle border border-background-surface hover:border-slate-700 transition-all shadow-sm">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider">Database</span>
              <Database className="h-4 w-4 text-accent-emerald" />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div>
                <span className="text-xl font-bold text-white capitalize">
                  {health?.database ? health.database.state : loading ? 'Checking...' : 'Disconnected'}
                </span>
                <p className="text-xs text-slate-400 mt-1 truncate max-w-[150px]">
                  {health?.database?.name ? `DB: ${health.database.name}` : 'Mongoose 8+'}
                </p>
              </div>
              <div>
                {health?.database?.isConnected ? (
                  <CheckCircle2 className="h-6 w-6 text-accent-emerald" />
                ) : (
                  <XCircle className="h-6 w-6 text-accent-amber" />
                )}
              </div>
            </div>
          </div>

          {/* Card 3: Ping Latency */}
          <div className="p-5 rounded-2xl bg-background-subtle border border-background-surface hover:border-slate-700 transition-all shadow-sm">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider">API Latency</span>
              <Radio className="h-4 w-4 text-accent-cyan" />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div>
                <span className="text-xl font-bold text-white">
                  {latencyMs !== null ? `${latencyMs} ms` : '--'}
                </span>
                <p className="text-xs text-slate-400 mt-1">
                  Local Round-trip Time
                </p>
              </div>
              <div className="h-2.5 w-2.5 rounded-full bg-accent-cyan animate-ping" />
            </div>
          </div>

          {/* Card 4: Uptime & Environment */}
          <div className="p-5 rounded-2xl bg-background-subtle border border-background-surface hover:border-slate-700 transition-all shadow-sm">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider">Uptime</span>
              <Clock className="h-4 w-4 text-accent-amber" />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div>
                <span className="text-xl font-bold text-white">
                  {health ? formatUptime(health.uptimeSeconds) : '--'}
                </span>
                <p className="text-xs text-slate-400 mt-1 capitalize">
                  Mode: {health?.environment || 'development'}
                </p>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-background-surface text-slate-300">
                v{health?.version || '1.0.0'}
              </span>
            </div>
          </div>
        </div>

        {/* Technical Diagnostics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-background-subtle border border-background-surface space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-accent-emerald" />
              <h2 className="text-base font-semibold text-white">Milestone 2 Identity Foundation</h2>
            </div>
            <p className="text-xs text-slate-400">
              GitHub OAuth 2.0 security controls, Mongoose identity models, and AES-256 token encryption.
            </p>

            <ul className="space-y-3 pt-2 text-xs">
              <li className="flex items-center gap-3 text-slate-300">
                <span className="h-5 w-5 rounded-full bg-accent-emerald/10 text-accent-emerald flex items-center justify-center">✓</span>
                <span><strong>OAuth CSRF Protection:</strong> 32-byte crypto state validation in secure cookies</span>
              </li>
              <li className="flex items-center gap-3 text-slate-300">
                <span className="h-5 w-5 rounded-full bg-accent-emerald/10 text-accent-emerald flex items-center justify-center">✓</span>
                <span><strong>AES-256-GCM Encryption:</strong> OAuth tokens encrypted at rest</span>
              </li>
              <li className="flex items-center gap-3 text-slate-300">
                <span className="h-5 w-5 rounded-full bg-accent-emerald/10 text-accent-emerald flex items-center justify-center">✓</span>
                <span><strong>Models Registered:</strong> User, Organization, and OrganizationMember</span>
              </li>
              <li className="flex items-center gap-3 text-slate-300">
                <span className="h-5 w-5 rounded-full bg-accent-emerald/10 text-accent-emerald flex items-center justify-center">✓</span>
                <span><strong>Public Landing Page:</strong> Premium SaaS UI mounted at <code className="text-primary-400">/</code></span>
              </li>
            </ul>

            <div className="pt-2">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-xs font-medium text-primary-400 hover:text-primary-300"
              >
                Go to Public Landing Page <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-background-subtle border border-background-surface space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary-400" />
                <h2 className="text-base font-semibold text-white">Live Health Check Payload</h2>
              </div>
              {lastChecked && (
                <span className="text-[11px] text-slate-400">
                  {lastChecked.toLocaleTimeString()}
                </span>
              )}
            </div>

            <pre className="p-4 rounded-xl bg-background border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-56">
              {health ? JSON.stringify(health, null, 2) : error ? `Error: ${error}` : 'Loading...'}
            </pre>
          </div>
        </div>
      </div>

      <footer className="max-w-6xl mx-auto w-full pt-8 text-center text-xs text-slate-500">
        DevPulse &bull; Diagnostic Testing Screen &bull; /dev/health
      </footer>
    </div>
  );
}
