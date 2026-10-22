import React, { useState } from 'react';
import { X, Plus, Sparkles, Loader2 } from 'lucide-react';

export default function NewTaskModal({ isOpen, onClose, onAdd }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Development');
  const [priority, setPriority] = useState('Medium');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    await onAdd({
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      status: 'Pending',
    });
    setIsSubmitting(false);
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#15161a] border border-white/[0.1] shadow-2xl p-6 overflow-hidden">
        {/* Glow corner */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#3ECF8E]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#3ECF8E]/10 text-[#3ECF8E]">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-white">Create New Database Record</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Task Title <span className="text-[#3ECF8E]">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Build Payment Gateway integration"
              className="w-full rounded-xl bg-[#1b1d22] border border-white/[0.08] px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#3ECF8E] focus:ring-1 focus:ring-[#3ECF8E] transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl bg-[#1b1d22] border border-white/[0.08] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#3ECF8E] transition-all"
              >
                <option value="Development">Development</option>
                <option value="Design">Design</option>
                <option value="Security">Security</option>
                <option value="Feature">Feature</option>
                <option value="Backend">Backend</option>
                <option value="General">General</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full rounded-xl bg-[#1b1d22] border border-white/[0.08] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#3ECF8E] transition-all"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Description (Optional)</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add key requirements, instructions, or subtasks..."
              className="w-full rounded-xl bg-[#1b1d22] border border-white/[0.08] px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#3ECF8E] focus:ring-1 focus:ring-[#3ECF8E] transition-all resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-black bg-[#3ECF8E] hover:bg-[#34b27b] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#3ECF8E]/25 transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Saving to Postgres...
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  Insert into public.tasks
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
