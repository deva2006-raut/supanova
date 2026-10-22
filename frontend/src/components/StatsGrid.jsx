import React from 'react';
import { Layers, CheckCircle2, Clock, Flame, ShieldAlert, Cpu } from 'lucide-react';

export default function StatsGrid({ tasks = [], pingTime = 12 }) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'Completed').length;
  const inProgress = tasks.filter((t) => t.status === 'In Progress').length;
  const highPriority = tasks.filter((t) => t.priority === 'High' || t.priority === 'Urgent').length;

  const stats = [
    {
      label: 'Total Database Rows',
      value: total,
      sub: 'public.tasks table',
      icon: Layers,
      color: 'from-blue-500/20 to-blue-600/5',
      iconColor: 'text-blue-400',
      borderColor: 'group-hover:border-blue-500/30',
    },
    {
      label: 'Completed Tasks',
      value: completed,
      sub: `${total > 0 ? Math.round((completed / total) * 100) : 0}% completion rate`,
      icon: CheckCircle2,
      color: 'from-[#3ECF8E]/20 to-[#3ECF8E]/5',
      iconColor: 'text-[#3ECF8E]',
      borderColor: 'group-hover:border-[#3ECF8E]/30',
    },
    {
      label: 'In Progress',
      value: inProgress,
      sub: 'Active sprint execution',
      icon: Clock,
      color: 'from-amber-500/20 to-amber-600/5',
      iconColor: 'text-amber-400',
      borderColor: 'group-hover:border-amber-500/30',
    },
    {
      label: 'High Priority',
      value: highPriority,
      sub: 'Needs immediate review',
      icon: Flame,
      color: 'from-rose-500/20 to-rose-600/5',
      iconColor: 'text-rose-400',
      borderColor: 'group-hover:border-rose-500/30',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s, idx) => {
        const Icon = s.icon;
        return (
          <div
            key={idx}
            className={`group relative overflow-hidden rounded-2xl bg-[#141519] border border-white/[0.07] p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${s.borderColor}`}
          >
            <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-gradient-to-br ${s.color} blur-xl pointer-events-none transition-all duration-500 group-hover:scale-150`} />
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400">{s.label}</span>
              <div className={`p-2 rounded-xl bg-white/[0.04] border border-white/[0.05] ${s.iconColor}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white tracking-tight">{s.value}</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">{s.sub}</p>
          </div>
        );
      })}
    </div>
  );
}
