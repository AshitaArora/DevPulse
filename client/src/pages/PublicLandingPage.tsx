import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Activity,
  ArrowRight,
  ShieldCheck,
  GitPullRequest,
  Users,
  Eye,
  CheckCircle2,
  Sparkles,
  GitCommit,
  GitFork,
  HeartHandshake,
  LogOut,
  User as UserIcon,
} from 'lucide-react';

export default function PublicLandingPage() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background text-slate-100 flex flex-col justify-between selection:bg-primary-500 selection:text-white">
      {/* Top Navbar */}
      <nav className="border-b border-background-surface bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-400 flex items-center justify-center shadow-md shadow-primary-500/20">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">DevPulse</span>
            <span className="hidden sm:inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-full bg-primary-500/10 text-primary-400 border border-primary-500/20">
              v1.0 MVP
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8 text-xs font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#portals" className="hover:text-white transition-colors">
              Role Portals
            </a>
            <Link
              to="/dev/health"
              className="hover:text-primary-400 transition-colors flex items-center gap-1.5"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-accent-emerald animate-pulse" />
              Dev Health
            </Link>
          </div>

          <div className="flex items-center space-x-3">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background-surface border border-slate-700">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.username}
                      className="h-5 w-5 rounded-full"
                    />
                  ) : (
                    <UserIcon className="h-4 w-4 text-primary-400" />
                  )}
                  <span className="text-xs font-medium text-white">{user.name || user.username}</span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 rounded-lg bg-background-surface hover:bg-background-hover text-slate-400 hover:text-white transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-600/20 transition-all hover:scale-[1.02]"
              >
                Sign In with GitHub
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary-600/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-xs font-medium text-primary-300">
            <Sparkles className="h-3.5 w-3.5 text-primary-400" />
            <span>Ethical Engineering Intelligence & Team Analytics</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-tight">
            Developer Productivity Teams{' '}
            <span className="bg-gradient-to-r from-primary-400 via-indigo-300 to-accent-cyan bg-clip-text text-transparent">
              Actually Love
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
            Centralize your engineering activities in one intuitive dashboard. Eliminate review
            bottlenecks, celebrate peer unblocking, and track team delivery patterns—
            <strong className="text-slate-200">without surveillance or vanity commit metrics</strong>.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white shadow-xl shadow-primary-600/30 transition-all hover:scale-[1.02]"
            >
              <GitPullRequest className="h-4 w-4" />
              Get Started with GitHub
            </Link>
            <Link
              to="/dev/health"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-medium bg-background-surface hover:bg-background-hover border border-slate-700 text-slate-300 transition-colors"
            >
              <Activity className="h-4 w-4 text-accent-emerald" />
              Live Technical Health
            </Link>
          </div>

          {/* Social Proof & Commitment */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-accent-emerald" />
              No Single Commit Rankings
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-accent-emerald" />
              Transparent Calculation Formulas
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-accent-emerald" />
              AES-256 Token Encryption
            </span>
          </div>

          {/* Interactive UI Mockup Preview */}
          <div className="pt-10 max-w-5xl mx-auto">
            <div className="rounded-2xl border border-background-surface bg-background-subtle/80 backdrop-blur-xl p-4 sm:p-6 shadow-2xl text-left space-y-6">
              {/* Window controls */}
              <div className="flex items-center justify-between pb-4 border-b border-background-surface text-xs text-slate-400">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-3 font-mono text-[11px] text-slate-500">
                    devpulse.app/lead/dashboard
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-background-surface text-slate-300 text-[11px]">
                    Team: Core Platform
                  </span>
                  <span className="px-2.5 py-1 rounded bg-background-surface text-slate-300 text-[11px]">
                    Last 30 Days
                  </span>
                </div>
              </div>

              {/* Sample Metric Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 rounded-xl bg-background border border-background-surface">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Total Commits</span>
                    <GitCommit className="h-3.5 w-3.5 text-primary-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-white mt-2">1,482</div>
                  <p className="text-[11px] text-accent-emerald mt-1">↑ 14% vs last period</p>
                </div>

                <div className="p-4 rounded-xl bg-background border border-background-surface">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Merged PRs</span>
                    <GitPullRequest className="h-3.5 w-3.5 text-accent-emerald" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-white mt-2">164</div>
                  <p className="text-[11px] text-slate-400 mt-1">94% Merge Efficiency</p>
                </div>

                <div className="p-4 rounded-xl bg-background border border-background-surface">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Reviews Completed</span>
                    <HeartHandshake className="h-3.5 w-3.5 text-accent-cyan" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-white mt-2">328</div>
                  <p className="text-[11px] text-accent-emerald mt-1">2.0 Reviews per PR</p>
                </div>

                <div className="p-4 rounded-xl bg-background border border-background-surface">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Active Unblockers</span>
                    <Users className="h-3.5 w-3.5 text-accent-amber" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-white mt-2">14 devs</div>
                  <p className="text-[11px] text-slate-400 mt-1">Balanced workload</p>
                </div>
              </div>

              {/* Trend Preview Line */}
              <div className="p-5 rounded-xl bg-background border border-background-surface space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">Activity Trends & Collaboration Velocity</span>
                  <div className="flex items-center gap-4 text-[11px]">
                    <span className="flex items-center gap-1.5 text-primary-400">
                      <span className="h-2 w-2 rounded-full bg-primary-500" /> Commits
                    </span>
                    <span className="flex items-center gap-1.5 text-accent-emerald">
                      <span className="h-2 w-2 rounded-full bg-accent-emerald" /> Reviews Submitted
                    </span>
                  </div>
                </div>
                {/* SVG Visual Curve */}
                <div className="h-24 w-full flex items-end">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 500 80">
                    <path
                      d="M 0 60 Q 50 20, 100 45 T 200 30 T 300 15 T 400 40 T 500 10"
                      fill="none"
                      stroke="#6366F1"
                      strokeWidth="3"
                    />
                    <path
                      d="M 0 70 Q 50 40, 100 55 T 200 45 T 300 25 T 400 35 T 500 20"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="2.5"
                      strokeDasharray="4 4"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features / Pillars Section */}
      <section id="features" className="py-20 border-t border-background-surface bg-background-subtle/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-xs font-semibold text-primary-400 uppercase tracking-widest">
              Core Principles
            </h2>
            <p className="text-3xl font-bold text-white tracking-tight">
              Analytics Without Surveillance
            </p>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              Most developer tools turn into toxic stack-ranking surveillance. DevPulse was built with
              strict ethical guardrails.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-background border border-background-surface space-y-3">
              <div className="h-10 w-10 rounded-xl bg-primary-600/10 text-primary-400 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-white">Transparent Formulas</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every metric displayed in DevPulse is transparently defined. We never hide behind
                arbitrary "black box" productivity scores.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-background border border-background-surface space-y-3">
              <div className="h-10 w-10 rounded-xl bg-accent-emerald/10 text-accent-emerald flex items-center justify-center">
                <HeartHandshake className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-white">Celebrate Unblocking</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Code review is the unsung hero of software delivery. DevPulse actively highlights
                developers who unblock teammates through reviews.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-background border border-background-surface space-y-3">
              <div className="h-10 w-10 rounded-xl bg-accent-cyan/10 text-accent-cyan flex items-center justify-center">
                <Eye className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-white">Privacy-First Governance</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Role-based boundaries ensure individual developers are protected from intrusive
                peer comparisons while leads gain macro delivery visibility.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Role Portals Section */}
      <section id="portals" className="py-20 border-t border-background-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-xs font-semibold text-primary-400 uppercase tracking-widest">
              Tailored Portals
            </h2>
            <p className="text-3xl font-bold text-white tracking-tight">
              Built for Every Engineering Role
            </p>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              Dedicated, permission-gated spaces designed specifically for your responsibilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-background-subtle border border-background-surface hover:border-primary-500/40 transition-all space-y-4">
              <div className="text-xs font-bold px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20 w-fit">
                Organization Admin
              </div>
              <h3 className="text-xl font-bold text-white">Admin Portal</h3>
              <ul className="text-xs text-slate-400 space-y-2.5">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-accent-emerald flex-shrink-0" />
                  Organization-wide delivery health & throughput
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-accent-emerald flex-shrink-0" />
                  Multi-team and repository lifecycle management
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-accent-emerald flex-shrink-0" />
                  Privacy governance & audit controls
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-background-subtle border border-background-surface hover:border-primary-500/40 transition-all space-y-4">
              <div className="text-xs font-bold px-2.5 py-1 rounded-md bg-primary-500/10 text-primary-400 border border-primary-500/20 w-fit">
                Team Lead
              </div>
              <h3 className="text-xl font-bold text-white">Team Lead Portal</h3>
              <ul className="text-xs text-slate-400 space-y-2.5">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-accent-emerald flex-shrink-0" />
                  Real-time team delivery dashboard & trends
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-accent-emerald flex-shrink-0" />
                  PR turnaround & review bottleneck analysis
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-accent-emerald flex-shrink-0" />
                  Permitted member drilldown for coaching
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-background-subtle border border-background-surface hover:border-primary-500/40 transition-all space-y-4">
              <div className="text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 w-fit">
                Developer
              </div>
              <h3 className="text-xl font-bold text-white">Developer Portal</h3>
              <ul className="text-xs text-slate-400 space-y-2.5">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-accent-emerald flex-shrink-0" />
                  Personal contribution heatmap & commit timeline
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-accent-emerald flex-shrink-0" />
                  Activity Distribution (coding vs unblocking)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-accent-emerald flex-shrink-0" />
                  High-level aggregate team trends
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 border-t border-background-surface bg-background-subtle/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-xs font-semibold text-primary-400 uppercase tracking-widest">
              Simple Setup
            </h2>
            <p className="text-3xl font-bold text-white tracking-tight">
              Up and Running in 3 Steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="text-2xl font-black text-primary-400">01</div>
              <h3 className="text-base font-bold text-white">Connect with GitHub</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Sign in with GitHub OAuth requesting minimal read permissions. Tokens are encrypted
                with AES-256-GCM.
              </p>
            </div>

            <div className="space-y-3">
              <div className="text-2xl font-black text-primary-400">02</div>
              <h3 className="text-base font-bold text-white">Form Your Organization & Teams</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Create your engineering organization, establish teams, and invite developers using
                secure, expiring tokens.
              </p>
            </div>

            <div className="space-y-3">
              <div className="text-2xl font-black text-primary-400">03</div>
              <h3 className="text-base font-bold text-white">Track Delivery Patterns</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Track commits, PR lifecycles, and code reviews across teams to eliminate blockers and
                improve flow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 border-t border-background-surface bg-gradient-to-b from-background to-primary-950/20 text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <h2 className="text-3xl font-bold text-white">
            Ready to Gain Real Visibility into Your Engineering Flow?
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Get started with GitHub in seconds. No complex installations or invasive background daemons.
          </p>
          <div className="pt-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-semibold bg-primary-600 hover:bg-primary-500 text-white shadow-xl shadow-primary-600/30 transition-all hover:scale-[1.02]"
            >
              <GitFork className="h-4 w-4" />
              Sign In with GitHub
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-background-surface py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Activity className="h-4 w-4 text-primary-400" />
            <span className="font-semibold text-slate-300">DevPulse</span>
            <span>&bull; MERN Developer Productivity Platform</span>
          </div>

          <div className="flex items-center space-x-6">
            <Link to="/dev/health" className="hover:text-slate-300 transition-colors">
              Health Diagnostics
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-300 transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
