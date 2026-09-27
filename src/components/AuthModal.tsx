import React, { useState } from 'react';
import {
  Mail,
  Lock,
  User,
  ShieldCheck,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Modal } from './Modal';
import { MagneticButton } from './MagneticButton';

interface AuthModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const labelClass = 'mb-1 block text-[10px] font-bold uppercase tracking-[0.16em] text-ink-700';
const inputClass =
  'w-full rounded-lg border border-bone-300 bg-bone-50 py-2.5 pl-9 pr-3 text-xs font-medium text-ink-900 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30';

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSuccess }) => {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, demoLogin } = useAuth();
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const finish = () => {
    if (onSuccess) onSuccess();
    onClose();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (tab === 'signin') {
        await signInWithEmail(email, password);
      } else {
        if (!displayName.trim()) throw new Error('Please enter your full name.');
        await signUpWithEmail(email, password, displayName.trim());
      }
      finish();
    } catch (err) {
      console.error('Authentication error:', err);
      const raw = err instanceof Error ? err.message : '';
      let message = raw || 'Authentication failed. Please check your credentials.';
      if (message.includes('auth/invalid-credential') || message.includes('auth/user-not-found') || message.includes('auth/wrong-password')) {
        message = 'Invalid email or password. Try again, or use one-click demo access below.';
      } else if (message.includes('auth/email-already-in-use')) {
        message = 'An account with this email already exists. Please sign in instead.';
      } else if (message.includes('auth/weak-password')) {
        message = 'Password should be at least 6 characters.';
      } else if (message.includes('auth/invalid-email')) {
        message = 'Please enter a valid email address.';
      } else if (message.includes('auth/popup-blocked') || message.includes('auth/cancelled-popup-request')) {
        message = 'The Google sign-in popup was blocked or closed. Please allow popups and retry.';
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      finish();
    } catch (err) {
      console.error('Google sign-in error:', err);
      setError('Google sign-in was cancelled or unavailable. Please try email sign-in.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = async (role: 'buyer' | 'agent') => {
    setError(null);
    setLoading(true);
    try {
      await demoLogin(role);
      finish();
    } catch (err) {
      console.error('Demo login error:', err);
      setError('Could not start the demo session. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose} size="md" id="auth-modal-container">
      titleId="auth-title"
      {/* Branded header */}
      <div className="wash-ink relative px-6 pb-6 pt-7 text-bone-50">
        <div className="mb-3 flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-end justify-center gap-[3px] pb-1" aria-hidden="true">
            <span className="w-[3px] rounded-t-[2px] bg-gold-600" style={{ height: 12 }} />
            <span className="w-[3px] rounded-t-[2px] bg-gold-400" style={{ height: 20 }} />
            <span className="w-[3px] rounded-t-[2px] bg-gold-700" style={{ height: 15 }} />
          </span>
          <span className="font-brand text-sm font-bold tracking-[0.22em] text-bone-50">
            HORIZON ESTATES
          </span>
        </div>
        <h2 id="auth-title" className="font-display text-xl font-bold">
          {tab === 'signin' ? 'Welcome back' : 'Create your account'}
        </h2>
        <p className="mt-1.5 text-xs leading-relaxed text-bone-400">
          {tab === 'signin'
            ? 'Sign in to shortlist residences, book private viewings and manage your listings.'
            : 'Join Horizon Estates to list residences, receive viewing requests and track ₹ per sq ft trends.'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-bone-200 bg-bone-100/50">
        {(['signin', 'signup'] as const).map((value) => (
          <button
            key={value}
            type="button"
            id={`auth-tab-${value}`}
            onClick={() => {
              setTab(value);
              setError(null);
            }}
            aria-current={tab === value}
            className={`flex-1 py-3 text-center text-[11px] font-bold uppercase tracking-[0.16em] transition-all ${
              tab === value
                ? 'border-b-2 border-gold-500 bg-white text-ink-950'
                : 'text-bone-500 hover:text-ink-900'
            }`}
          >
            {value === 'signin' ? 'Sign In' : 'Sign Up'}
          </button>
        ))}
      </div>

      <div className="space-y-5 p-6">
        {error && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-700">
            {error}
          </div>
        )}

        <button
          type="button"
          id="google-signin-btn"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-bone-300 bg-white px-4 py-2.5 text-xs font-semibold text-ink-700 shadow-lux-sm transition-colors hover:bg-bone-50 disabled:opacity-60"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Continue with Google
        </button>

        <div className="relative flex items-center justify-center">
          <div className="w-full border-t border-bone-200" />
          <span className="absolute bg-white px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-bone-400">
            or with email
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {tab === 'signup' && (
            <div>
              <label htmlFor="auth-name" className={labelClass}>
                Full name *
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-bone-400" />
                <input
                  id="auth-name"
                  type="text"
                  required
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  placeholder="e.g. Ananya Sharma"
                  className={inputClass}
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="auth-email" className={labelClass}>
              Email address *
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-bone-400" />
              <input
                id="auth-email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.in"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="auth-password" className={labelClass}>
              Password *
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-bone-400" />
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                className={`${inputClass} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-bone-400 transition-colors hover:text-ink-700"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <MagneticButton
            id="auth-submit-btn"
            variant="ink"
            size="md"
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Please wait…' : tab === 'signin' ? 'Sign In' : 'Create Account'}
            <ArrowRight className="h-4 w-4 text-gold-400" />
          </MagneticButton>
        </form>

        <div className="border-t border-bone-200 pt-4">
          <span className="mb-2 block text-center text-[10px] font-bold uppercase tracking-[0.2em] text-bone-400">
            One-click demo access
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              id="demo-login-buyer-btn"
              onClick={() => handleDemoSignIn('buyer')}
              disabled={loading}
              className="rounded-lg border border-gold-400/50 bg-gold-50 px-3 py-2 text-xs font-bold text-gold-900 transition-colors hover:bg-gold-100 disabled:opacity-60"
            >
              Demo Buyer
            </button>
            <button
              type="button"
              id="demo-login-agent-btn"
              onClick={() => handleDemoSignIn('agent')}
              disabled={loading}
              className="rounded-lg border border-bone-300 bg-bone-100 px-3 py-2 text-xs font-bold text-ink-800 transition-colors hover:bg-bone-200 disabled:opacity-60"
            >
              Demo Advisor
            </button>
          </div>
        </div>

        <p className="flex items-start gap-2 text-[11px] leading-relaxed text-bone-500">
          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-bone-400" />
          Your data is stored securely with Firebase Authentication and is never shared with
          developers or third-party brokers.
        </p>

        <p className="flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-bone-400">
          <Sparkles className="h-3 w-3 text-gold-500" />
          Free forever for buyers
        </p>
      </div>
    </Modal>
  );
};
