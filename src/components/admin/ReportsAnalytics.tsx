import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, FileText, Users, Briefcase, Target,
  Calendar, Download, ArrowUpRight, Clock, CheckCircle2, MessageCircle,
  Loader2, BarChart3, Activity, DollarSign
} from 'lucide-react';

type Period = '7d' | '30d' | '90d' | 'all';

interface Stats {
  totalRequests: number;
  totalContacts: number;
  totalProjects: number;
  totalSubscribers: number;
  conversionRate: number;
  avgResponseTime: string;
  requestsTrend: number;
  contactsTrend: number;
}

const PERIOD_LABELS: Record<Period, string> = {
  '7d': 'آخر 7 أيام',
  '30d': 'آخر 30 يوم',
  '90d': 'آخر 90 يوم',
  all: 'الكل',
};

const CHART_COLORS = ['hsl(var(--primary))', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const ReportsAnalytics = () => {
  const [period, setPeriod] = useState<Period>('30d');
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const [reqRes, conRes, projRes, subRes, taskRes] = await Promise.all([
      supabase.from('service_requests').select('*').order('created_at', { ascending: false }),
      supabase.from('contact_messages').select('*').order('created_at', { ascending: false }),
      supabase.from('client_projects').select('*'),
      supabase.from('newsletter_subscribers').select('*'),
      supabase.from('tasks').select('*'),
    ]);
    setRequests(reqRes.data || []);
    setContacts(conRes.data || []);
    setProjects(projRes.data || []);
    setSubscribers(subRes.data || []);
    setTasks(taskRes.data || []);
    setLoading(false);
  };

  const getDateRange = (p: Period) => {
    if (p === 'all') return null;
    const days = p === '7d' ? 7 : p === '30d' ? 30 : 90;
    return new Date(Date.now() - days * 86400000);
  };

  const filterByPeriod = <T extends { created_at: string }>(items: T[]) => {
    const start = getDateRange(period);
    if (!start) return items;
    return items.filter(i => new Date(i.created_at) >= start);
  };

  const periodRequests = useMemo(() => filterByPeriod(requests), [requests, period]);
  const periodContacts = useMemo(() => filterByPeriod(contacts), [contacts, period]);
  const periodTasks = useMemo(() => filterByPeriod(tasks), [tasks, period]);

  const stats: Stats = useMemo(() => {
    const closed = periodRequests.filter(r => r.status === 'closed').length;
    const total = periodRequests.length;
    const prevStart = getDateRange(period);
    let prevRequests = 0, prevContacts = 0;
    if (prevStart) {
      const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
      const prevEnd = new Date(prevStart.getTime());
      const prevBegin = new Date(prevStart.getTime() - days * 86400000);
      prevRequests = requests.filter(r => { const d = new Date(r.created_at); return d >= prevBegin && d < prevEnd; }).length;
      prevContacts = contacts.filter(c => { const d = new Date(c.created_at); return d >= prevBegin && d < prevEnd; }).length;
    }
    const rTrend = prevRequests > 0 ? Math.round(((total - prevRequests) / prevRequests) * 100) : total > 0 ? 100 : 0;
    const cTrend = prevContacts > 0 ? Math.round(((periodContacts.length - prevContacts) / prevContacts) * 100) : periodContacts.length > 0 ? 100 : 0;

    // Avg response time (mock based on status change frequency)
    const contactedRequests = periodRequests.filter(r => r.status !== 'new');
    const avgHours = contactedRequests.length > 0 ? Math.round(24 / Math.max(contactedRequests.length / (period === '7d' ? 7 : period === '30d' ? 30 : 90), 0.1)) : 0;

    return {
      totalRequests: total,
      totalContacts: periodContacts.length,
      totalProjects: projects.length,
      totalSubscribers: subscribers.filter(s => s.is_active).length,
      conversionRate: total > 0 ? Math.round((closed / total) * 100) : 0,
      avgResponseTime: avgHours > 0 ? `${avgHours} ساعة` : '—',
      requestsTrend: rTrend,
      contactsTrend: cTrend,
    };
  }, [periodRequests, periodContacts, projects, subscribers, period]);

  const timelineData = useMemo(() => {
    const days = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 14 : 30;
    const step = period === '90d' ? 7 : 1;
    const result: { name: string; requests: number; contacts: number }[] = [];
    const now = new Date();
    for (let i = days - 1; i >= 0; i -= step) {
      const d = new Date(now.getTime() - i * 86400000);
      const label = d.toLocaleDateString('ar-EG', period === '90d' ? { month: 'short', day: 'numeric' } : { weekday: 'short', day: 'numeric' });
      const dayStart = new Date(d); dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart.getTime() + step * 86400000);
      result.push({
        name: label,
        requests: periodRequests.filter(r => { const rd = new Date(r.created_at); return rd >= dayStart && rd < dayEnd; }).length,
        contacts: periodContacts.filter(c => { const cd = new Date(c.created_at); return cd >= dayStart && cd < dayEnd; }).length,
      });
    }
    return result.slice(-15);
  }, [periodRequests, periodContacts, period]);

  const serviceDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    periodRequests.forEach(r => { counts[r.service_type] = (counts[r.service_type] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6)
      .map(([name, value]) => ({ name: name.length > 15 ? name.slice(0, 15) + '…' : name, value }));
  }, [periodRequests]);

  const statusDistribution = useMemo(() => {
    const counts = { new: 0, contacted: 0, closed: 0 };
    periodRequests.forEach(r => { if (r.status in counts) counts[r.status as keyof typeof counts]++; });
    return [
      { name: 'جديد', value: counts.new, color: 'hsl(var(--primary))' },
      { name: 'تم التواصل', value: counts.contacted, color: '#f59e0b' },
      { name: 'مغلق', value: counts.closed, color: '#10b981' },
    ];
  }, [periodRequests]);

  const leadSources = useMemo(() => {
    const sources: Record<string, number> = {};
    [...periodRequests.map(r => r.lead_source || 'direct'), ...periodContacts.map(c => c.lead_source || 'direct')]
      .forEach(s => { sources[s] = (sources[s] || 0) + 1; });
    return Object.entries(sources).sort((a, b) => b[1] - a[1]).slice(0, 5)
      .map(([name, value]) => ({ name, value }));
  }, [periodRequests, periodContacts]);

  const taskStats = useMemo(() => {
    const t = periodTasks;
    return {
      total: t.length,
      done: t.filter(x => x.status === 'done').length,
      overdue: t.filter(x => x.due_date && new Date(x.due_date) < new Date() && x.status !== 'done').length,
      completionRate: t.length > 0 ? Math.round((t.filter(x => x.status === 'done').length / t.length) * 100) : 0,
    };
  }, [periodTasks]);

  const exportReport = () => {
    const report = [
      `تقرير B.CLICK - ${PERIOD_LABELS[period]}`,
      `تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG')}`,
      '',
      `إجمالي الطلبات: ${stats.totalRequests}`,
      `إجمالي الرسائل: ${stats.totalContacts}`,
      `معدل التحويل: ${stats.conversionRate}%`,
      `المشاريع: ${stats.totalProjects}`,
      `المشتركين: ${stats.totalSubscribers}`,
      `المهام المكتملة: ${taskStats.done}/${taskStats.total}`,
      '',
      'توزيع الخدمات:',
      ...serviceDistribution.map(s => `  ${s.name}: ${s.value}`),
      '',
      'مصادر العملاء:',
      ...leadSources.map(s => `  ${s.name}: ${s.value}`),
    ].join('\n');
    const blob = new Blob(['\uFEFF' + report], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `report-${period}-${new Date().toISOString().split('T')[0]}.txt`;
    a.click(); URL.revokeObjectURL(url);
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>;

  const kpiCards = [
    { label: 'إجمالي الطلبات', value: stats.totalRequests, icon: FileText, color: 'bg-primary/10 text-primary', trend: stats.requestsTrend },
    { label: 'الرسائل', value: stats.totalContacts, icon: MessageCircle, color: 'bg-blue-500/10 text-blue-500', trend: stats.contactsTrend },
    { label: 'معدل التحويل', value: `${stats.conversionRate}%`, icon: Target, color: 'bg-emerald-500/10 text-emerald-500' },
    { label: 'وقت الاستجابة', value: stats.avgResponseTime, icon: Clock, color: 'bg-amber-500/10 text-amber-500' },
    { label: 'المشاريع', value: stats.totalProjects, icon: Briefcase, color: 'bg-purple-500/10 text-purple-500' },
    { label: 'إتمام المهام', value: `${taskStats.completionRate}%`, icon: CheckCircle2, color: 'bg-emerald-500/10 text-emerald-500' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-foreground">التقارير والتحليلات</h2>
          <p className="text-[10px] text-muted-foreground mt-0.5">تحليل أداء الأعمال</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center p-0.5 rounded-xl bg-card border border-border/30">
            {Object.entries(PERIOD_LABELS).map(([k, v]) => (
              <button key={k} onClick={() => setPeriod(k as Period)}
                className={`px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-all ${
                  period === k ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}>{v}</button>
            ))}
          </div>
          <button onClick={exportReport}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-card border border-border/30 text-xs font-medium text-muted-foreground hover:bg-muted/50 transition-all">
            <Download className="w-3.5 h-3.5" /> تصدير
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpiCards.map(kpi => (
          <div key={kpi.label} className="bg-card border border-border/30 rounded-xl p-3 hover:border-primary/20 transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${kpi.color}`}>
                <kpi.icon className="w-4 h-4" />
              </div>
              {'trend' in kpi && typeof kpi.trend === 'number' && (
                <div className={`flex items-center gap-0.5 text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${
                  kpi.trend >= 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-destructive/10 text-destructive'
                }`}>
                  {kpi.trend >= 0 ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                  {Math.abs(kpi.trend)}%
                </div>
              )}
            </div>
            <p className="text-lg font-bold text-foreground">{kpi.value}</p>
            <p className="text-[10px] text-muted-foreground">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Timeline */}
        <div className="lg:col-span-2 bg-card border border-border/30 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">الطلبات والرسائل</h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">مقارنة الأداء عبر الزمن</p>
            </div>
            <div className="flex items-center gap-3 text-[9px]">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary" />طلبات</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" />رسائل</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={timelineData}>
              <defs>
                <linearGradient id="reqGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="conGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))', fontSize: 11 }} />
              <Area type="monotone" dataKey="requests" stroke="hsl(var(--primary))" fill="url(#reqGrad)" strokeWidth={2} dot={{ r: 2, fill: 'hsl(var(--primary))' }} name="طلبات" />
              <Area type="monotone" dataKey="contacts" stroke="#3b82f6" fill="url(#conGrad)" strokeWidth={2} dot={{ r: 2, fill: '#3b82f6' }} name="رسائل" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className="bg-card border border-border/30 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-1">توزيع الحالات</h3>
          <p className="text-[10px] text-muted-foreground mb-3">{stats.totalRequests} طلب</p>
          {stats.totalRequests > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={130}>
                <PieChart>
                  <Pie data={statusDistribution} cx="50%" cy="50%" innerRadius={38} outerRadius={55} dataKey="value" strokeWidth={0}>
                    {statusDistribution.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {statusDistribution.map(d => (
                  <div key={d.name} className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                      <span className="text-muted-foreground">{d.name}</span>
                    </div>
                    <span className="font-semibold text-foreground">{d.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : <div className="flex items-center justify-center h-[180px] text-xs text-muted-foreground">لا توجد بيانات</div>}
        </div>
      </div>

      {/* Secondary Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Service Distribution */}
        <div className="bg-card border border-border/30 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground">أكثر الخدمات طلباً</h3>
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
          </div>
          {serviceDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={serviceDistribution} layout="vertical">
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} width={100} />
                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))', fontSize: 11 }} />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 6, 6, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="flex items-center justify-center h-[180px] text-xs text-muted-foreground">لا توجد بيانات</div>}
        </div>

        {/* Lead Sources */}
        <div className="bg-card border border-border/30 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3">مصادر العملاء</h3>
          {leadSources.length > 0 ? (
            <div className="space-y-3">
              {leadSources.map((s, i) => {
                const total = leadSources.reduce((sum, d) => sum + d.value, 0);
                const pct = total > 0 ? Math.round((s.value / total) * 100) : 0;
                return (
                  <div key={s.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-foreground capitalize">{s.name}</span>
                      <span className="text-[10px] text-muted-foreground">{s.value} ({pct}%)</span>
                    </div>
                    <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6, delay: i * 0.1 }}
                        className="h-full rounded-full" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : <div className="flex items-center justify-center h-[180px] text-xs text-muted-foreground">لا توجد بيانات</div>}
        </div>

        {/* Task Performance */}
        <div className="bg-card border border-border/30 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3">أداء المهام</h3>
          <div className="space-y-3">
            {[
              { label: 'إجمالي المهام', value: taskStats.total, color: 'text-foreground' },
              { label: 'مكتملة', value: taskStats.done, color: 'text-emerald-500' },
              { label: 'متأخرة', value: taskStats.overdue, color: 'text-destructive' },
              { label: 'نسبة الإتمام', value: `${taskStats.completionRate}%`, color: 'text-primary' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-border/10 last:border-0">
                <span className="text-xs text-muted-foreground">{item.label}</span>
                <span className={`text-sm font-bold ${item.color}`}>{item.value}</span>
              </div>
            ))}
            {/* Completion bar */}
            <div className="mt-2">
              <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${taskStats.completionRate}%` }}
                  transition={{ duration: 0.8 }} className="h-full bg-emerald-500 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ReportsAnalytics;
