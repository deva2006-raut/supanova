import React from 'react';
import { Calendar, Trash2, Tag, Check, ArrowRightCircle } from 'lucide-react';

const priorityBadges = {
  Urgent: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
  High: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  Medium: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  Low: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
};

const categoryColors = {
  Development: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
  Design: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  Security: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  Feature: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  Backend: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  General: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
};

export default function TaskCard({ task, onToggleStatus, onDelete }) {
  const isDone = task.status === 'Completed';

  const nextStatus = {
    Pending: 'In Progress',
    'In Progress': 'Completed',
    Completed: 'Pending',
  };

  return (
    <div
      className={`group relative rounded-2xl p-5 transition-all duration-300 border ${
        isDone
          ? 'bg-[#121316]/60 border-white/[0.04] opacity-80'
          : 'bg-[#16171b] border-white/[0.08] hover:border-[#3ECF8E]/30 hover:shadow-xl hover:shadow-black/40 hover:-translate-y-0.5'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Toggle Checkbox */}
        <button
          onClick={() => onToggleStatus(task.id, isDone ? 'Pending' : 'Completed')}
          className={`mt-1 flex-shrink-0 w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
            isDone
              ? 'bg-[#3ECF8E] border-[#3ECF8E] text-black shadow-md shadow-[#3ECF8E]/30'
              : 'border-white/20 bg-white/[0.03] hover:border-[#3ECF8E] text-transparent hover:text-white/40'
          }`}
          title={isDone ? 'Mark as Pending' : 'Mark as Completed'}
        >
          <Check className="w-3.5 h-3.5 stroke-[3]" />
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span
              className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${
                categoryColors[task.category] || categoryColors.General
              }`}
            >
              {task.category || 'General'}
            </span>
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                priorityBadges[task.priority] || priorityBadges.Medium
              }`}
            >
              {task.priority || 'Medium'}
            </span>
          </div>

          <h3
            className={`font-semibold text-sm leading-snug transition-colors ${
              isDone ? 'line-through text-slate-400' : 'text-white group-hover:text-[#3ECF8E]'
            }`}
          >
            {task.title}
          </h3>

          {task.description && (
            <p className="mt-1 text-xs text-slate-400 leading-relaxed line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="mt-3.5 flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-white/[0.05]">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{new Date(task.created_at).toLocaleDateString()}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleStatus(task.id, nextStatus[task.status] || 'Pending')}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-300 hover:text-[#3ECF8E] px-2 py-1 rounded-md bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
                title="Advance Status"
              >
                <span>{task.status}</span>
                <ArrowRightCircle className="w-3 h-3 text-[#3ECF8E]" />
              </button>

              <button
                onClick={() => onDelete(task.id)}
                className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors"
                title="Delete from Supabase"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
