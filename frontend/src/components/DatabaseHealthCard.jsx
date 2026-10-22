import React, { useState } from 'react';
import { Terminal, Copy, Check, Server, Shield, Radio, Database } from 'lucide-react';
import { SUPABASE_URL } from '../lib/supabase';

export default function DatabaseHealthCard() {
  const [copied, setCopied] = useState(false);

  const curlSnippet = `curl -H "apikey: <ANON_KEY>" ${SUPABASE_URL}/rest/v1/tasks`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(curlSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#16171b] to-[#121316] border border-white/[0.08] p-6 shadow-xl">
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#3ECF8E]/10 text-[#3ECF8E] border border-[#3ECF8E]/20">
            <Server className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Supabase Engine Diagnostic</h3>
            <p className="text-xs text-slate-400">Direct PostgREST & WebSocket pipeline</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3ECF8E]/10 border border-[#3ECF8E]/30 text-xs font-semibold text-[#3ECF8E]">
          <span className="w-2 h-2 rounded-full bg-[#3ECF8E] animate-pulse" />
          Operational
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 text-xs">
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
          <span className="text-slate-500 font-medium">PostgreSQL Engine</span>
          <p className="mt-1 font-mono text-slate-200 font-semibold">Postgres v17.6</p>
        </div>
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
          <span className="text-slate-500 font-medium">Gateway Proxy</span>
          <p className="mt-1 font-mono text-slate-200 font-semibold">Envoy :8000</p>
        </div>
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
          <span className="text-slate-500 font-medium">Connection Pooler</span>
          <p className="mt-1 font-mono text-slate-200 font-semibold">Supavisor :6543</p>
        </div>
      </div>

      {/* Code Snippet Box */}
      <div className="mt-4 p-3.5 rounded-xl bg-[#0e0f12] border border-white/[0.06] flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-hidden">
          <Terminal className="w-4 h-4 text-[#3ECF8E] shrink-0" />
          <code className="text-xs text-slate-300 font-mono truncate">{curlSnippet}</code>
        </div>
        <button
          onClick={copyToClipboard}
          className="shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
          title="Copy curl query"
        >
          {copied ? <Check className="w-4 h-4 text-[#3ECF8E]" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
