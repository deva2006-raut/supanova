import React from 'react';
import { Database, Zap, ExternalLink, ShieldCheck, UserCheck, LogIn, LogOut, Activity } from 'lucide-react';

export default function Navbar({ user, onOpenAuth, onSignOut }) {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#0c0d0e]/80 border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3ECF8E] to-[#1b7a50] p-[1px] shadow-lg shadow-[#3ECF8E]/20">
            <div className="w-full h-full bg-[#121316] rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-[#3ECF8E] fill-[#3ECF8E]/20" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                SupaNova
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-[#3ECF8E]/10 text-[#3ECF8E] px-2 py-0.5 rounded-full border border-[#3ECF8E]/20">
                PRO
              </span>
            </div>
            <p className="text-xs text-slate-400">PostgreSQL + Realtime Hub</p>
          </div>
        </div>

        {/* Center: System Status */}
        <div className="hidden md:flex items-center gap-2 bg-[#17181c] border border-white/[0.06] px-3.5 py-1.5 rounded-full text-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3ECF8E] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3ECF8E]"></span>
          </span>
          <span className="text-slate-300 font-medium">Stack Connected:</span>
          <span className="text-[#3ECF8E] font-mono font-semibold">Envoy :8000</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">PG 17.6</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <a
            href="http://localhost:8000"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white bg-[#1b1c21] hover:bg-[#23252c] border border-white/[0.08] px-3.5 py-2 rounded-lg transition-all shadow-sm"
          >
            <Database className="w-3.5 h-3.5 text-[#3ECF8E]" />
            Studio Admin
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>

          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-[#1b1c21] border border-white/[0.08] px-3 py-1.5 rounded-lg text-xs">
                <UserCheck className="w-3.5 h-3.5 text-[#3ECF8E]" />
                <span className="text-slate-200 max-w-[120px] truncate">{user.email}</span>
              </div>
              <button
                onClick={onSignOut}
                title="Sign Out"
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors border border-transparent hover:border-rose-500/20"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="inline-flex items-center gap-2 text-xs font-semibold text-black bg-[#3ECF8E] hover:bg-[#34b27b] px-4 py-2 rounded-lg transition-all shadow-lg shadow-[#3ECF8E]/25 hover:shadow-[#3ECF8E]/40 active:scale-95"
            >
              <LogIn className="w-3.5 h-3.5" />
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
