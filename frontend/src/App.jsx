import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  RefreshCw, 
  Sparkles, 
  Database, 
  Layers, 
  Radio, 
  ExternalLink,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { supabase } from './lib/supabase';
import Navbar from './components/Navbar';
import StatsGrid from './components/StatsGrid';
import TaskCard from './components/TaskCard';
import NewTaskModal from './components/NewTaskModal';
import AuthModal from './components/AuthModal';
import DatabaseHealthCard from './components/DatabaseHealthCard';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [user, setUser] = useState(null);
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch initial tasks
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      showToast('Error loading tasks from Supabase', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();

    // Check user auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // Setup Realtime subscription
    const channel = supabase
      .channel('public:tasks')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tasks' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setTasks((prev) => [payload.new, ...prev]);
            showToast('New row inserted into PostgreSQL!');
          } else if (payload.eventType === 'UPDATE') {
            setTasks((prev) =>
              prev.map((t) => (t.id === payload.new.id ? payload.new : t))
            );
          } else if (payload.eventType === 'DELETE') {
            setTasks((prev) => prev.filter((t) => t.id === payload.old.id));
            showToast('Row deleted from database');
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, []);

  // Handlers
  const handleAddTask = async (newTaskData) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([newTaskData])
        .select();

      if (error) throw error;
      if (data && data.length > 0) {
        setTasks((prev) => [data[0], ...prev]);
        showToast('Record saved to PostgreSQL public.tasks');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to insert record: ' + err.message, 'error');
    }
  };

  const handleToggleStatus = async (id, newStatus) => {
    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );

    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      showToast(`Status updated to ${newStatus}`);
    } catch (err) {
      console.error(err);
      showToast('Update failed', 'error');
      fetchTasks(); // rollback
    }
  };

  const handleDelete = async (id) => {
    // Optimistic UI update
    setTasks((prev) => prev.filter((t) => t.id !== id));

    try {
      const { error } = await supabase.from('tasks').delete().eq('id', id);
      if (error) throw error;
      showToast('Deleted from database');
    } catch (err) {
      console.error(err);
      showToast('Delete failed', 'error');
      fetchTasks();
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    showToast('Signed out successfully');
  };

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title?.toLowerCase().includes(search.toLowerCase()) ||
      t.description?.toLowerCase().includes(search.toLowerCase());
    const matchesCat = filterCategory === 'All' || t.category === filterCategory;
    const matchesStat = filterStatus === 'All' || t.status === filterStatus;
    return matchesSearch && matchesCat && matchesStat;
  });

  return (
    <div className="min-h-screen bg-[#0c0d0e] text-slate-100 flex flex-col">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom duration-200">
          <div
            className={`px-4 py-3 rounded-xl border text-xs font-semibold shadow-2xl flex items-center gap-2 ${
              toast.type === 'error'
                ? 'bg-rose-950/90 border-rose-500/40 text-rose-200'
                : 'bg-[#121f19] border-[#3ECF8E]/40 text-[#3ECF8E]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <Navbar
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onSignOut={handleSignOut}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-10 border border-white/[0.08] bg-gradient-to-br from-[#14161a] via-[#101114] to-[#0c0d0e]">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#3ECF8E]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3ECF8E]/10 border border-[#3ECF8E]/20 text-[#3ECF8E] text-xs font-semibold mb-4">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              Live Postgres 17.6 + PostgREST Connected
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Modern Supabase{' '}
              <span className="bg-gradient-to-r from-[#3ECF8E] to-emerald-400 bg-clip-text text-transparent">
                Control Hub
              </span>
            </h1>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed">
              Real-time CRUD operations, schema validation, and Row Level Security powered by your local self-hosted Supabase Docker cluster.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsNewTaskOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-black bg-[#3ECF8E] hover:bg-[#34b27b] transition-all shadow-lg shadow-[#3ECF8E]/25 hover:shadow-[#3ECF8E]/40 active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                Add Record to Database
              </button>

              <button
                onClick={fetchTasks}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                Sync Data
              </button>
            </div>
          </div>
        </div>

        {/* Live Metrics */}
        <StatsGrid tasks={tasks} />

        {/* Diagnostics Card */}
        <DatabaseHealthCard />

        {/* Filter & Controls Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#141519] border border-white/[0.07] p-4 rounded-2xl">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search database rows by title or keyword..."
              className="w-full bg-[#1b1c21] border border-white/[0.06] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#3ECF8E] transition-all"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2.5">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-[#1b1c21] border border-white/[0.08] text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-[#3ECF8E] transition-all"
            >
              <option value="All">All Categories</option>
              <option value="Development">Development</option>
              <option value="Design">Design</option>
              <option value="Security">Security</option>
              <option value="Feature">Feature</option>
              <option value="Backend">Backend</option>
              <option value="General">General</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-[#1b1c21] border border-white/[0.08] text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-[#3ECF8E] transition-all"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Task Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-[#3ECF8E]" />
              PostgreSQL Records ({filteredTasks.length})
            </h2>
            <span className="text-xs text-slate-500">Auto-synced via Realtime</span>
          </div>

          {loading ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-10 h-10 border-2 border-[#3ECF8E] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-400">Loading records from Supabase...</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/[0.1] p-12 text-center">
              <Layers className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-300">No records found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No matching rows found in the database. Click "Add Record" to create your first entry.
              </p>
              <button
                onClick={() => setIsNewTaskOpen(true)}
                className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-black bg-[#3ECF8E] px-4 py-2 rounded-xl"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Record
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTasks.map((t) => (
                <TaskCard
                  key={t.id}
                  task={t}
                  onToggleStatus={handleToggleStatus}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] bg-[#090a0c] py-6 text-center text-xs text-slate-500">
        <p>
          Connected to local Supabase Docker instance • PostgreSQL 17.6 • Envoy Gateway • GoTrue Auth
        </p>
      </footer>

      {/* Modals */}
      <NewTaskModal
        isOpen={isNewTaskOpen}
        onClose={() => setIsNewTaskOpen(false)}
        onAdd={handleAddTask}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(u) => {
          setUser(u);
          showToast(`Welcome back, ${u.email}!`);
        }}
      />
    </div>
  );
}
