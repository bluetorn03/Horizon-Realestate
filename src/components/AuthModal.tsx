import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  ShieldCheck, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Sparkles,
  Building 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  onClose,
  onSuccess,
}) => {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, demoLogin } = useAuth();
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (tab === 'signin') {
        await signInWithEmail(email, password);
      } else {
        if (!displayName.trim()) {
          throw new Error('Please enter your full name.');
        }
        await signUpWithEmail(email, password, displayName);
      }
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Auth error:', err);
      let msg = err.message || 'Authentication failed. Please check credentials.';
      if (msg.includes('auth/invalid-credential') || msg.includes('auth/user-not-found') || msg.includes('auth/wrong-password')) {
        msg = 'Invalid email or password. Please try again or use Demo Sign In.';
      } else if (msg.includes('auth/email-already-in-use')) {
        msg = 'An account with this email already exists. Please sign in instead.';
      } else if (msg.includes('auth/weak-password')) {
        msg = 'Password should be at least 6 characters.';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Google Sign-in error:', err);
      setError(err.message || 'Google sign-in was cancelled or encountered an error.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = async (role: 'buyer' | 'agent') => {
    setError(null);
    setLoading(true);
    try {
      await demoLogin(role);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Demo login error:', err);
      setError('Failed to initiate demo session.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div 
        id="auth-modal-container"
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden my-auto border border-stone-200 animate-in zoom-in-95 duration-200"
      >
        {/* Header Branding */}
        <div className="bg-[#0b1329] text-white p-6 relative">
          <button
            id="auth-modal-close-btn"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 mb-2">
            <div className="flex items-end gap-0.5 h-6 w-6 justify-center pb-0.5">
              <div className="w-1 h-3.5 bg-amber-600 rounded-t-[1px]"></div>
              <div className="w-1 h-6 bg-amber-500 rounded-t-[1px]"></div>
              <div className="w-1 h-4 bg-amber-700 rounded-t-[1px]"></div>
            </div>
            <span className="font-brand font-bold text-base tracking-wider text-white">
              HORIZON ESTATES
            </span>
          </div>

          <h3 className="text-xl font-bold font-serif-luxury text-white">
            {tab === 'signin' ? 'Welcome Back' : 'Create Exclusive Account'}
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            {tab === 'signin'
              ? 'Sign in to access property management, book viewings, and save favorites.'
              : 'Join Horizon Estates to list your luxury properties and schedule private viewings.'}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-stone-200 bg-stone-50">
          <button
            id="auth-tab-signin"
            onClick={() => {
              setTab('signin');
              setError(null);
            }}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider text-center transition-all ${
              tab === 'signin'
                ? 'bg-white text-slate-900 border-b-2 border-amber-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            id="auth-tab-signup"
            onClick={() => {
              setTab('signup');
              setError(null);
            }}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider text-center transition-all ${
              tab === 'signup'
                ? 'bg-white text-slate-900 border-b-2 border-amber-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          {/* Google Sign-in Button */}
          <button
            id="google-signin-btn"
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white border border-stone-300 hover:bg-stone-50 text-slate-700 font-semibold text-xs rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
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
            <span>Continue with Google</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-stone-200 w-full"></div>
            <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Or with email
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {tab === 'signup' && (
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. William Sterling"
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              id="auth-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-[#0b1329] hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-wider py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : tab === 'signin' ? 'Sign In' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </form>

          {/* Quick Demo Access Bar */}
          <div className="pt-2 border-t border-stone-100">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-2 text-center tracking-wider">
              Quick Demo Access (1-Click)
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                id="demo-login-buyer-btn"
                type="button"
                onClick={() => handleDemoSignIn('buyer')}
                disabled={loading}
                className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold rounded-lg transition-colors text-center"
              >
                Demo Buyer
              </button>
              <button
                id="demo-login-agent-btn"
                type="button"
                onClick={() => handleDemoSignIn('agent')}
                disabled={loading}
                className="px-3 py-1.5 bg-slate-100 hover:bg-stone-200 text-slate-800 border border-stone-300 text-xs font-semibold rounded-lg transition-colors text-center"
              >
                Demo Agent
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
