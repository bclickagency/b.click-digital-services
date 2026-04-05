import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Download, Activity, FileText, MessageCircle, Briefcase,
  User, Clock, Loader2, ChevronLeft, ChevronRight, Filter, Calendar
} from 'lucide-react';

interface LogEntry {
  id: string;
  action: string;
  details: string | null;
  user_id: string | null;
  project_id: string | null;
  created_at: string;
}

interface Profile {
  id: string;
  full_name: string;
}

const ACTION_ICONS: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  طلب: { icon: FileText, color: 'text-primary', bg: 'bg-primary/10' },
  رسال: { icon: MessageCircle, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  مشروع: { icon: Briefcase, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  مستخدم: { icon: User, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  default: { icon: Activity, color: 'text-muted-foreground', bg: 'bg-muted/50' },
};

const ITEMS_PER_PAGE = 25;

const ActivityLogs = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFilter, setDateFilter] = useState<'all' | '7d' | '30d' | '90d'>('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [logsRes, profilesRes] = await Promise.all([
      supabase.from('activity_log').select('*').order('created_at', { ascending: false }).limit(500),
      supabase.from('profiles').select('id, full_name'),
    ]);
    if (logsRes.data) setLogs(logsRes.data);
    if (profilesRes.data) setProfiles(profilesRes.data);
    setLoading(false);
  };

  const getConfig = (action: string) => {
    for (const [key, config] of Object.entries(ACTION_ICONS)) {
      if (key !== 'default' && action.includes(key)) return config;
    }
    return ACTION_ICONS.default;
  };

  const getUserName = (id: string | null) => {
    if (!id) return 'النظام';
    return profiles.find(p => p.id === id)?.full_name || 'مستخدم';
  };

  const filtered = useMemo(() => {
    let result = logs;
    if (dateFilter !== 'all') {
      const days = dateFilter === '7d' ? 7 : dateFilter === '30d' ? 30 : 90;
      const start = new Date(Date.now() - days * 86400000);
      result = result.filter(l => new Date(l.created_at) >= start);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(l => l.action.toLowerCase().includes(q) || (l.details || '').toLowerCase().includes(q));
    }
    return result;
  }, [logs, searchQuery, dateFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Group logs by date
  const groupedLogs = useMemo(() => {
    const groups: Record<string, typeof paginated> = {};
    paginated.forEach(log => {
      const date = new Date(log.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
      if (!groups[date]) groups[date] = [];
      groups[date].push(log);
    });
    return Object.entries(groups);
  }, [paginated]);

  const exportLogs = () => {
    const headers = ['التاريخ', 'الإجراء', 'التفاصيل', 'المستخدم'];
    const rows = filtered.map(l => [
      new Date(l.created_at).toLocaleString('ar-EG'), l.action, l.details || '', getUserName(l.user_id),
    ]);
    const csv = '\uFEFF' + [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `activity-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  const formatTime = (dateStr: string) => new Date(dateStr).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>;

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'إجمالي السجلات', value: logs.length, color: 'bg-primary/10 text-primary' },
          { label: 'اليوم', value: logs.filter(l => new Date(l.created_at).toDateString() === new Date().toDateString()).length, color: 'bg-emerald-500/10 text-emerald-500' },
          { label: 'هذا الأسبوع', value: logs.filter(l => Date.now() - new Date(l.created_at).getTime() < 7 * 86400000).length, color: 'bg-blue-500/10 text-blue-500' },
          { label: 'المستخدمون', value: new Set(logs.map(l => l.user_id).filter(Boolean)).size, color: 'bg-purple-500/10 text-purple-500' },
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
            placeholder="بحث في السجلات..."
            className="w-full pr-10 pl-4 py-2 rounded-xl bg-card border border-border/30 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        <div className="flex items-center p-0.5 rounded-xl bg-card border border-border/30">
          {(['all', '7d', '30d', '90d'] as const).map(d => (
            <button key={d} onClick={() => { setDateFilter(d); setCurrentPage(1); }}
              className={`px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-all ${
                dateFilter === d ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}>
              {d === 'all' ? 'الكل' : d === '7d' ? '7 أيام' : d === '30d' ? '30 يوم' : '90 يوم'}
            </button>
          ))}
        </div>
        <button onClick={exportLogs}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-card border border-border/30 text-xs font-medium text-muted-foreground hover:bg-muted/50 transition-all">
          <Download className="w-3.5 h-3.5" /> تصدير
        </button>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {groupedLogs.map(([date, entries]) => (
          <div key={date}>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-3 h-3 text-muted-foreground" />
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{date}</span>
              <span className="text-[9px] text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded-full">{entries.length}</span>
            </div>
            <div className="space-y-1.5 mr-5 border-r-2 border-border/20 pr-4">
              {entries.map(log => {
                const config = getConfig(log.action);
                return (
                  <motion.div key={log.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                    className="relative flex items-start gap-3 py-2 group">
                    {/* Timeline dot */}
                    <div className={`absolute -right-[21px] top-3 w-2.5 h-2.5 rounded-full border-2 border-background ${config.bg}`} />
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${config.bg}`}>
                      <config.icon className={`w-3.5 h-3.5 ${config.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs font-medium text-foreground">{log.action}</p>
                          {log.details && <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">{log.details}</p>}
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[9px] text-muted-foreground">{formatTime(log.created_at)}</span>
                        </div>
                      </div>
                      <span className="text-[9px] text-muted-foreground/60 mt-0.5 block">{getUserName(log.user_id)}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <Activity className="w-8 h-8 text-muted-foreground/20 mb-2" />
            <p className="text-xs text-muted-foreground">لا توجد سجلات</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground">{filtered.length} سجل</span>
          <div className="flex items-center gap-1">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
              className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted/50 disabled:opacity-30">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] text-muted-foreground">{currentPage}/{totalPages}</span>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted/50 disabled:opacity-30">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityLogs;
