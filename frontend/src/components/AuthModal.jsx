import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  Loader2, 
  AlertCircle, 
  CheckCircle, 
  KeyRound, 
  Sparkles, 
  Eye, 
  EyeOff,
  UserPlus,
  LogIn,
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  // Tabs: 'signin' | 'signup' | 'forgot'
  const [activeTab, setActiveTab] = useState('signin');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [copied, setCopied] = useState(false);

  // Default credentials
  const defaultCredentials = {
    email: 'admin@supabase.local',
    password: 'this_password_is_insecure_and_should_be_updated',
    studioUsername: 'supabase'
  };

  if (!isOpen) return null;

  const handleFillDemo = () => {
    setActiveTab('signin');
    setEmail(defaultCredentials.email);
    setPassword(defaultCredentials.password);
    setErrorMsg('');
    setSuccessMsg('Default credentials filled! Click "Sign In" to proceed.');
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(defaultCredentials.password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Sign In Handler
  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) throw error;

      if (data?.user) {
        setSuccessMsg(`Welcome back, ${data.user.email}!`);
        onAuthSuccess(data.user);
        setTimeout(() => onClose(), 800);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Sign Up Handler
  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify.');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
      });

      if (error) throw error;

      setSuccessMsg('Account created successfully! You are logged in.');
      if (data?.user) {
        onAuthSuccess(data.user);
        setTimeout(() => onClose(), 1000);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password Handler
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    if (!email.trim()) {
      setErrorMsg('Please enter your email address.');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: window.location.origin,
      });

      if (error) throw error;

      setSuccessMsg(
        'Password reset requested! Check your inbox or Supabase logs.'
      );
    } catch (err) {
      setErrorMsg(err.message || 'Unable to process reset request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-[#141519] border border-white/[0.1] shadow-2xl p-6 overflow-hidden">
        {/* Glow corner */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-[#3ECF8E]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#3ECF8E]/10 text-[#3ECF8E]">
              <KeyRound className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-white">Supabase Authentication</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center p-1 bg-[#1a1b20] border border-white/[0.06] rounded-xl mt-4">
          <button
            type="button"
            onClick={() => {
              setActiveTab('signin');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'signin'
                ? 'bg-[#3ECF8E] text-black shadow-md shadow-[#3ECF8E]/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            Sign In
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('signup');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'signup'
                ? 'bg-[#3ECF8E] text-black shadow-md shadow-[#3ECF8E]/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            Sign Up
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('forgot');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'forgot'
                ? 'bg-[#3ECF8E] text-black shadow-md shadow-[#3ECF8E]/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Forgot
          </button>
        </div>

        {/* Default / Demo Credentials Info Box */}
        <div className="mt-4 p-3.5 rounded-2xl bg-[#1b1d23] border border-white/[0.06] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#3ECF8E]" />
              Default System Credentials
            </span>
            <button
              onClick={handleFillDemo}
              className="text-[11px] font-bold text-[#3ECF8E] hover:underline flex items-center gap-1"
            >
              ⚡ Auto-Fill
            </button>
          </div>
          <div className="text-[11px] font-mono text-slate-400 space-y-1 bg-[#121316] p-2 rounded-lg border border-white/[0.04]">
            <div className="flex justify-between">
              <span className="text-slate-500">Email:</span>
              <span className="text-slate-200">{defaultCredentials.email}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Password:</span>
              <div className="flex items-center gap-1">
                <span className="text-slate-200 max-w-[170px] truncate">
                  {defaultCredentials.password}
                </span>
                <button
                  onClick={handleCopyPassword}
                  className="text-slate-400 hover:text-white"
                  title="Copy password"
                >
                  {copied ? <Check className="w-3 h-3 text-[#3ECF8E]" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="mt-3.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-2.5 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mt-3.5 p-3 rounded-xl bg-[#3ECF8E]/10 border border-[#3ECF8E]/20 flex items-center gap-2.5 text-xs text-[#3ECF8E]">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* FORM 1: SIGN IN */}
        {activeTab === 'signin' && (
          <form onSubmit={handleSignIn} className="mt-4 space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@supabase.local"
                  className="w-full rounded-xl bg-[#1b1d22] border border-white/[0.08] pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#3ECF8E] transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-300">Password</label>
                <button
                  type="button"
                  onClick={() => setActiveTab('forgot')}
                  className="text-[11px] text-[#3ECF8E] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl bg-[#1b1d22] border border-white/[0.08] pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#3ECF8E] transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 rounded-xl text-xs font-bold text-black bg-[#3ECF8E] hover:bg-[#34b27b] disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#3ECF8E]/25"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        )}

        {/* FORM 2: SIGN UP */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignUp} className="mt-4 space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="newuser@example.com"
                  className="w-full rounded-xl bg-[#1b1d22] border border-white/[0.08] pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#3ECF8E] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Create Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full rounded-xl bg-[#1b1d22] border border-white/[0.08] pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#3ECF8E] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full rounded-xl bg-[#1b1d22] border border-white/[0.08] pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#3ECF8E] transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 rounded-xl text-xs font-bold text-black bg-[#3ECF8E] hover:bg-[#34b27b] disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#3ECF8E]/25"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create New Account'
              )}
            </button>
          </form>
        )}

        {/* FORM 3: FORGOT PASSWORD */}
        {activeTab === 'forgot' && (
          <form onSubmit={handleForgotPassword} className="mt-4 space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Account Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your registered email"
                  className="w-full rounded-xl bg-[#1b1d22] border border-white/[0.08] pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#3ECF8E] transition-all"
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Enter your email address to receive password reset instructions. In self-hosted setups without external SMTP, password resets are logged in the Supabase Auth server.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 rounded-xl text-xs font-bold text-black bg-[#3ECF8E] hover:bg-[#34b27b] disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#3ECF8E]/25"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending Reset Request...
                </>
              ) : (
                'Send Password Reset Link'
              )}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('signin')}
                className="text-xs text-slate-400 hover:text-[#3ECF8E] transition-colors"
              >
                ← Back to Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
