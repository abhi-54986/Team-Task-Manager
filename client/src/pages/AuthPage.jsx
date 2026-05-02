import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, ClipboardCheck, FolderKanban, LayoutDashboard, ShieldCheck, Users2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { errorMessage } from '../utils/formatters.js';

const highlights = [
  'Role-aware project control',
  'Assigned task visibility',
  'Live dashboard metrics'
];

const previewStats = [
  { label: 'Open tasks', value: '24' },
  { label: 'Completed', value: '68%' },
  { label: 'Overdue', value: '3' }
];

export const AuthPage = ({ mode }) => {
  const isSignup = mode === 'signup';
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login, signup } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Member'
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (isSignup) {
        await signup(form);
      } else {
        await login({ email: form.email, password: form.password });
      }

      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="grid min-h-screen bg-slate-50 text-ink lg:grid-cols-[minmax(0,1.1fr)_minmax(440px,0.9fr)]">
      <section className="relative flex min-h-[540px] overflow-hidden bg-slate-950 px-6 py-10 text-white sm:px-10 lg:min-h-screen lg:px-14">
        <div className="absolute inset-x-0 bottom-0 h-56 bg-[linear-gradient(180deg,rgba(15,23,42,0),rgba(16,185,129,0.12))]" />
        <div className="relative z-10 flex w-full flex-col justify-between gap-10">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-950/30">
                <FolderKanban className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Team Task Manager</p>
                <p className="text-xs text-slate-400">Work orchestration suite</p>
              </div>
            </div>
            <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 sm:inline-flex">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />
              Secure access
            </div>
          </div>

          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-300">Production workflow</p>
            <h1 className="mt-5 max-w-2xl text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
              Keep projects, people, and deadlines in sync.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              A focused workspace for assigning tasks, tracking delivery, and giving every team member a clear view of what needs attention.
            </p>

            <div className="mt-8 grid gap-3 text-sm text-slate-200 sm:grid-cols-3">
              {highlights.map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-300" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-4 shadow-2xl shadow-slate-950/40 backdrop-blur md:max-w-3xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <p className="text-sm font-semibold text-white">Sprint overview</p>
                <p className="mt-1 text-xs text-slate-400">Website redesign project</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200 ring-1 ring-emerald-300/20">
                <LayoutDashboard className="h-3.5 w-3.5" />
                Live metrics
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {previewStats.map((stat) => (
                <div key={stat.label} className="rounded-lg bg-white px-4 py-3 text-slate-900">
                  <p className="text-xs font-medium text-slate-500">{stat.label}</p>
                  <p className="mt-1 text-2xl font-semibold">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-3">
              <div className="flex items-center justify-between rounded-lg bg-slate-900/80 px-4 py-3 ring-1 ring-white/10">
                <div className="flex items-center gap-3">
                  <ClipboardCheck className="h-5 w-5 text-emerald-300" />
                  <div>
                    <p className="text-sm font-medium text-white">Create mobile wireframes</p>
                    <p className="text-xs text-slate-400">Assigned to Priya Sharma</p>
                  </div>
                </div>
                <span className="rounded bg-amber-300/10 px-2 py-1 text-xs font-semibold text-amber-200">In Progress</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-slate-900/80 px-4 py-3 ring-1 ring-white/10">
                <div className="flex items-center gap-3">
                  <Users2 className="h-5 w-5 text-sky-300" />
                  <div>
                    <p className="text-sm font-medium text-white">Review project access</p>
                    <p className="text-xs text-slate-400">Admin-controlled team members</p>
                  </div>
                </div>
                <span className="rounded bg-emerald-300/10 px-2 py-1 text-xs font-semibold text-emerald-200">Done</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="flex items-center px-6 py-10 sm:px-10 lg:px-14">
        <form onSubmit={submit} className="mx-auto grid w-full max-w-md gap-5 rounded-2xl border border-line bg-white p-6 shadow-xl shadow-slate-200/70 sm:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
              {isSignup ? 'Get started' : 'Account access'}
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink">
              {isSignup ? 'Create your workspace account' : 'Welcome back'}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {isSignup ? 'Choose your role and join the team workspace.' : 'Sign in to manage your projects and assigned tasks.'}
            </p>
          </div>

          {error && <div className="rounded border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>}

          {isSignup && (
            <div>
              <label className="text-sm font-medium text-slate-700" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                className="focus-ring mt-1 w-full rounded border border-line px-3 py-2"
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                required
              />
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-slate-700" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="focus-ring mt-1 w-full rounded border border-line px-3 py-2"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              minLength={8}
              className="focus-ring mt-1 w-full rounded border border-line px-3 py-2"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              required
            />
            {isSignup && <p className="mt-1 text-xs text-slate-500">Use at least 8 characters.</p>}
          </div>

          {isSignup && (
            <div>
              <label className="text-sm font-medium text-slate-700" htmlFor="role">
                Role
              </label>
              <select
                id="role"
                className="focus-ring mt-1 w-full rounded border border-line px-3 py-2"
                value={form.role}
                onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}
              >
                <option>Member</option>
                <option>Admin</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="focus-ring rounded-lg bg-emerald-600 px-4 py-3 font-semibold text-white shadow-lg shadow-emerald-900/10 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Please wait...' : isSignup ? 'Sign up' : 'Log in'}
          </button>

          <p className="text-center text-sm text-slate-600">
            {isSignup ? 'Already have an account?' : 'Need an account?'}{' '}
            <Link className="font-semibold text-emerald-700 hover:text-emerald-800" to={isSignup ? '/login' : '/signup'}>
              {isSignup ? 'Log in' : 'Sign up'}
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
};
