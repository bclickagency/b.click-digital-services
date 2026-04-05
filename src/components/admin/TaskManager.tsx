import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, LayoutGrid, LayoutList, Calendar, User, Flag,
  CheckCircle2, Clock, Eye, Trash2, X, Edit2, AlertCircle,
  ArrowUpDown, ChevronLeft, ChevronRight, Loader2, GripVertical
} from 'lucide-react';

type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';
type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
type ViewMode = 'kanban' | 'table';

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  assigned_to: string | null;
  project_id: string | null;
  due_date: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

interface TeamMember {
  id: string;
  full_name: string;
  avatar_url: string | null;
}

interface Project {
  id: string;
  title: string;
}

const STATUS_CONFIG: Record<TaskStatus, { label: string; icon: React.ElementType; color: string; bg: string; dot: string }> = {
  todo: { label: 'قيد الانتظار', icon: Clock, color: 'text-muted-foreground', bg: 'bg-muted/30', dot: 'bg-muted-foreground' },
  in_progress: { label: 'قيد التنفيذ', icon: Loader2, color: 'text-primary', bg: 'bg-primary/5', dot: 'bg-primary' },
  review: { label: 'مراجعة', icon: Eye, color: 'text-amber-500', bg: 'bg-amber-500/5', dot: 'bg-amber-500' },
  done: { label: 'مكتمل', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/5', dot: 'bg-emerald-500' },
};

const PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string }> = {
  low: { label: 'منخفض', color: 'bg-muted text-muted-foreground' },
  medium: { label: 'متوسط', color: 'bg-blue-500/10 text-blue-500' },
  high: { label: 'عالي', color: 'bg-amber-500/10 text-amber-500' },
  urgent: { label: 'عاجل', color: 'bg-destructive/10 text-destructive' },
};

const ITEMS_PER_PAGE = 12;

const TaskManager = () => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    title: '', description: '', status: 'todo' as TaskStatus, priority: 'medium' as TaskPriority,
    assigned_to: '', project_id: '', due_date: '',
  });

  useEffect(() => {
    fetchData();
    const channel = supabase.channel('tasks-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => fetchTasks())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchData = async () => {
    await Promise.all([fetchTasks(), fetchTeamMembers(), fetchProjects()]);
    setLoading(false);
  };

  const fetchTasks = async () => {
    const { data } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
    if (data) setTasks(data as Task[]);
  };

  const fetchTeamMembers = async () => {
    const { data } = await supabase.from('profiles').select('id, full_name, avatar_url');
    if (data) setTeamMembers(data);
  };

  const fetchProjects = async () => {
    const { data } = await supabase.from('client_projects').select('id, title');
    if (data) setProjects(data);
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', status: 'todo', priority: 'medium', assigned_to: '', project_id: '', due_date: '' });
    setEditingTask(null);
    setShowForm(false);
  };

  const openEditForm = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title, description: task.description || '', status: task.status, priority: task.priority,
      assigned_to: task.assigned_to || '', project_id: task.project_id || '',
      due_date: task.due_date ? new Date(task.due_date).toISOString().slice(0, 16) : '',
    });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) { toast({ title: 'خطأ', description: 'عنوان المهمة مطلوب', variant: 'destructive' }); return; }
    const payload = {
      title: formData.title, description: formData.description || null,
      status: formData.status, priority: formData.priority,
      assigned_to: formData.assigned_to || null, project_id: formData.project_id || null,
      due_date: formData.due_date || null,
    };

    if (editingTask) {
      const { error } = await supabase.from('tasks').update(payload).eq('id', editingTask.id);
      if (!error) toast({ title: 'تم التحديث', description: 'تم تحديث المهمة بنجاح' });
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from('tasks').insert({ ...payload, created_by: user?.id || null });
      if (!error) toast({ title: 'تم الإنشاء', description: 'تم إنشاء المهمة بنجاح' });
    }
    resetForm();
    fetchTasks();
  };

  const deleteTask = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه المهمة؟')) return;
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (!error) { setTasks(prev => prev.filter(t => t.id !== id)); toast({ title: 'تم الحذف' }); }
  };

  const updateTaskStatus = async (id: string, status: TaskStatus) => {
    const { error } = await supabase.from('tasks').update({ status }).eq('id', id);
    if (!error) setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, searchQuery, statusFilter, priorityFilter]);

  const totalPages = Math.ceil(filteredTasks.length / ITEMS_PER_PAGE);
  const paginatedTasks = filteredTasks.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const kanbanData = useMemo(() => ({
    todo: filteredTasks.filter(t => t.status === 'todo'),
    in_progress: filteredTasks.filter(t => t.status === 'in_progress'),
    review: filteredTasks.filter(t => t.status === 'review'),
    done: filteredTasks.filter(t => t.status === 'done'),
  }), [filteredTasks]);

  const stats = useMemo(() => ({
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    review: tasks.filter(t => t.status === 'review').length,
    done: tasks.filter(t => t.status === 'done').length,
    overdue: tasks.filter(t => t.due_date && new Date(t.due_date) < new Date() && t.status !== 'done').length,
  }), [tasks]);

  const getMemberName = (id: string | null) => teamMembers.find(m => m.id === id)?.full_name || 'غير معين';

  const formatDate = (d: string | null) => d ? new Date(d).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' }) : '';

  const isOverdue = (t: Task) => t.due_date && new Date(t.due_date) < new Date() && t.status !== 'done';

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-6 h-6 text-primary animate-spin" />
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'الكل', value: stats.total, color: 'bg-muted/50 text-foreground' },
          { label: 'قيد الانتظار', value: stats.todo, color: 'bg-muted/50 text-muted-foreground' },
          { label: 'قيد التنفيذ', value: stats.inProgress, color: 'bg-primary/10 text-primary' },
          { label: 'مراجعة', value: stats.review, color: 'bg-amber-500/10 text-amber-500' },
          { label: 'مكتمل', value: stats.done, color: 'bg-emerald-500/10 text-emerald-500' },
          { label: 'متأخر', value: stats.overdue, color: 'bg-destructive/10 text-destructive' },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border/30 rounded-xl p-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1.5 ${s.color}`}>
              <span className="text-sm font-bold">{s.value}</span>
            </div>
            <p className="text-[10px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder="بحث في المهام..."
            className="w-full pr-10 pl-4 py-2 rounded-xl bg-card border border-border/30 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        <select value={priorityFilter} onChange={e => { setPriorityFilter(e.target.value); setCurrentPage(1); }}
          className="px-3 py-2 rounded-xl bg-card border border-border/30 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
          <option value="all">كل الأولويات</option>
          {Object.entries(PRIORITY_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <div className="flex items-center p-0.5 rounded-xl bg-card border border-border/30">
          <button onClick={() => setViewMode('kanban')} className={`p-1.5 rounded-lg transition-all ${viewMode === 'kanban' ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}>
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button onClick={() => setViewMode('table')} className={`p-1.5 rounded-lg transition-all ${viewMode === 'table' ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}>
            <LayoutList className="w-4 h-4" />
          </button>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors">
          <Plus className="w-3.5 h-3.5" /> مهمة جديدة
        </button>
      </div>

      {/* Kanban View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {(['todo', 'in_progress', 'review', 'done'] as const).map(status => {
            const config = STATUS_CONFIG[status];
            return (
              <div key={status} className={`rounded-2xl border border-border/30 ${config.bg} overflow-hidden`}>
                <div className="flex items-center justify-between px-3 py-2.5 border-b border-border/20 bg-card/50">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${config.dot}`} />
                    <span className="text-xs font-semibold text-foreground">{config.label}</span>
                  </div>
                  <span className="text-[10px] font-medium text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                    {kanbanData[status].length}
                  </span>
                </div>
                <div className="p-2 space-y-2 max-h-[450px] overflow-y-auto">
                  {kanbanData[status].length > 0 ? kanbanData[status].map(task => (
                    <motion.div key={task.id} layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                      className={`bg-background border rounded-xl p-3 hover:border-primary/20 hover:shadow-sm transition-all cursor-pointer group ${
                        isOverdue(task) ? 'border-destructive/30' : 'border-border/30'
                      }`}
                      onClick={() => openEditForm(task)}>
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-xs font-medium text-foreground leading-snug flex-1">{task.title}</h4>
                        <span className={`text-[8px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 mr-1.5 ${PRIORITY_CONFIG[task.priority].color}`}>
                          {PRIORITY_CONFIG[task.priority].label}
                        </span>
                      </div>
                      {task.description && <p className="text-[10px] text-muted-foreground mb-2 line-clamp-2">{task.description}</p>}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {task.assigned_to && (
                            <div className="flex items-center gap-1">
                              <div className="w-4.5 h-4.5 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-[7px] font-bold text-primary">{getMemberName(task.assigned_to).charAt(0)}</span>
                              </div>
                            </div>
                          )}
                          {task.due_date && (
                            <span className={`flex items-center gap-0.5 text-[9px] ${isOverdue(task) ? 'text-destructive font-semibold' : 'text-muted-foreground'}`}>
                              <Calendar className="w-2.5 h-2.5" />
                              {formatDate(task.due_date)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          {status !== 'done' && (
                            <button onClick={e => { e.stopPropagation(); const next: Record<string, TaskStatus> = { todo: 'in_progress', in_progress: 'review', review: 'done' }; updateTaskStatus(task.id, next[status]); }}
                              className="p-0.5 rounded text-emerald-500 hover:bg-emerald-500/10">
                              <CheckCircle2 className="w-3 h-3" />
                            </button>
                          )}
                          <button onClick={e => { e.stopPropagation(); deleteTask(task.id); }}
                            className="p-0.5 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <config.icon className="w-5 h-5 text-muted-foreground/20 mb-1" />
                      <p className="text-[10px] text-muted-foreground">لا توجد مهام</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-card border border-border/30 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/20 bg-muted/20">
                  <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">المهمة</th>
                  <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">الحالة</th>
                  <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">الأولوية</th>
                  <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">معين إلى</th>
                  <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">الموعد</th>
                  <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider w-20">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/10">
                {paginatedTasks.map(task => (
                  <tr key={task.id} className={`hover:bg-muted/15 transition-colors ${isOverdue(task) ? 'bg-destructive/[0.02]' : ''}`}>
                    <td className="px-4 py-2.5">
                      <p className="text-xs font-medium text-foreground">{task.title}</p>
                      {task.description && <p className="text-[10px] text-muted-foreground truncate max-w-[200px]">{task.description}</p>}
                    </td>
                    <td className="px-4 py-2.5 hidden md:table-cell">
                      <span className={`inline-flex items-center gap-1 text-[9px] font-semibold px-2 py-0.5 rounded-full ${STATUS_CONFIG[task.status].bg} ${STATUS_CONFIG[task.status].color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[task.status].dot}`} />
                        {STATUS_CONFIG[task.status].label}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 hidden lg:table-cell">
                      <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${PRIORITY_CONFIG[task.priority].color}`}>
                        {PRIORITY_CONFIG[task.priority].label}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-[11px] text-muted-foreground hidden lg:table-cell">{getMemberName(task.assigned_to)}</td>
                    <td className="px-4 py-2.5 hidden sm:table-cell">
                      <span className={`text-[10px] ${isOverdue(task) ? 'text-destructive font-semibold' : 'text-muted-foreground'}`}>
                        {formatDate(task.due_date) || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-0.5">
                        <button onClick={() => openEditForm(task)} className="p-1 rounded-lg text-muted-foreground hover:bg-muted/50 hover:text-foreground"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => deleteTask(task.id)} className="p-1 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredTasks.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12">
                <CheckCircle2 className="w-8 h-8 text-muted-foreground/20 mb-2" />
                <p className="text-xs text-muted-foreground">لا توجد مهام</p>
              </div>
            )}
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-border/20">
              <span className="text-[10px] text-muted-foreground">{filteredTasks.length} مهمة</span>
              <div className="flex items-center gap-1">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                  className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted/50 disabled:opacity-30"><ChevronRight className="w-3.5 h-3.5" /></button>
                <span className="text-[10px] text-muted-foreground">{currentPage}/{totalPages}</span>
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted/50 disabled:opacity-30"><ChevronLeft className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Task Form Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={resetForm} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-card border border-border/30 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-border/20">
                <h3 className="text-sm font-semibold text-foreground">{editingTask ? 'تعديل المهمة' : 'مهمة جديدة'}</h3>
                <button onClick={resetForm} className="p-1 rounded-lg hover:bg-muted/50"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-5 space-y-3 max-h-[70vh] overflow-y-auto">
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">العنوان *</label>
                  <input type="text" value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border/30 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="عنوان المهمة" />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">الوصف</label>
                  <textarea value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border/30 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[70px] resize-none"
                    placeholder="وصف المهمة..." />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">الحالة</label>
                    <select value={formData.status} onChange={e => setFormData(p => ({ ...p, status: e.target.value as TaskStatus }))}
                      className="w-full px-3 py-2 rounded-xl bg-background border border-border/30 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30">
                      {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">الأولوية</label>
                    <select value={formData.priority} onChange={e => setFormData(p => ({ ...p, priority: e.target.value as TaskPriority }))}
                      className="w-full px-3 py-2 rounded-xl bg-background border border-border/30 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30">
                      {Object.entries(PRIORITY_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">تعيين إلى</label>
                  <select value={formData.assigned_to} onChange={e => setFormData(p => ({ ...p, assigned_to: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border/30 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30">
                    <option value="">غير معين</option>
                    {teamMembers.map(m => <option key={m.id} value={m.id}>{m.full_name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">المشروع</label>
                  <select value={formData.project_id} onChange={e => setFormData(p => ({ ...p, project_id: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border/30 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30">
                    <option value="">بدون مشروع</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">تاريخ الاستحقاق</label>
                  <input type="datetime-local" value={formData.due_date} onChange={e => setFormData(p => ({ ...p, due_date: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border/30 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <button onClick={handleSubmit}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl py-2.5 text-xs font-medium transition-colors">
                  {editingTask ? 'حفظ التعديلات' : 'إنشاء المهمة'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TaskManager;
