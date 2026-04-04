import { useMemo, useEffect, useState } from 'react';
import { 
  FileText, Clock, PhoneCall, CheckCircle2, TrendingUp, TrendingDown,
  ArrowLeft, MessageCircle, Users, Briefcase, Zap, Activity,
  ArrowUpRight, BarChart3, Plus, Eye, Bell, Calendar,
  Target, DollarSign, Layers
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

type RequestStatus = 'new' | 'contacted' | 'closed';

interface ServiceRequest {
  id: string;
  full_name: string;
  whatsapp: string;
  service_type: string;
  urgency: string;
  details: string | null;
  status: RequestStatus;
  created_at: string;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: string;
  lead_source: string | null;
  created_at: string;
}

interface OverviewProps {
  requests: ServiceRequest[];
  contacts: ContactMessage[];
  onNavigate: (tab: string) => void;
}

interface ActivityItem {
  id: string;
  action: string;
  details: string | null;
  created_at: string;
  icon: React.ElementType;
  color: string;
}

const STATUS_COLORS = {
  new: 'hsl(var(--primary))',
  contacted: 'hsl(38, 92%, 50%)',
  closed: 'hsl(142, 71%, 45%)',
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } }
};

const DashboardOverview = ({ requests, contacts, onNavigate }: OverviewProps) => {
  const [activityLog, setActivityLog] = useState<ActivityItem[]>([]);
  const [projectsCount, setProjectsCount] = useState(0);
  const [subscribersCount, setSubscribersCount] = useState(0);

  useEffect(() => {
    const fetchExtra = async () => {
      const [actRes, projRes, subRes] = await Promise.all([
        supabase.from('activity_log').select('*').order('created_at', { ascending: false }).limit(8),
        supabase.from('client_projects').select('id', { count: 'exact', head: true }),
        supabase.from('newsletter_subscribers').select('id', { count: 'exact', head: true }).eq('is_active', true),
      ]);
      if (actRes.data) {
        setActivityLog(actRes.data.map(a => ({
          ...a,
          icon: a.action.includes('طلب') ? FileText : a.action.includes('رسال') ? MessageCircle : a.action.includes('مشروع') ? Briefcase : Activity,
          color: a.action.includes('طلب') ? 'text-primary' : a.action.includes('رسال') ? 'text-blue-500' : 'text-emerald-500',
        })));
      }
      setProjectsCount(projRes.count || 0);
      setSubscribersCount(subRes.count || 0);
    };
    fetchExtra();
  }, []);

  const stats = useMemo(() => {
    const newCount = requests.filter(r => r.status === 'new').length;
    const contactedCount = requests.filter(r => r.status === 'contacted').length;
    const closedCount = requests.filter(r => r.status === 'closed').length;
    const conversionRate = requests.length > 0 ? Math.round((closedCount / requests.length) * 100) : 0;
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 86400000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 86400000);
    const thisWeek = requests.filter(r => new Date(r.created_at) >= weekAgo).length;
    const lastWeek = requests.filter(r => new Date(r.created_at) >= twoWeeksAgo && new Date(r.created_at) < weekAgo).length;
    const trend = lastWeek > 0 ? Math.round(((thisWeek - lastWeek) / lastWeek) * 100) : thisWeek > 0 ? 100 : 0;
    const newMessages = contacts.filter(c => c.status === 'new').length;
    return { total: requests.length, newCount, contactedCount, closedCount, conversionRate, trend, thisWeek, newMessages, totalContacts: contacts.length };
  }, [requests, contacts]);

  const pieData = useMemo(() => [
    { name: 'جديد', value: stats.newCount, color: STATUS_COLORS.new },
    { name: 'تم التواصل', value: stats.contactedCount, color: STATUS_COLORS.contacted },
    { name: 'مغلق', value: stats.closedCount, color: STATUS_COLORS.closed },
  ], [stats]);

  const timelineData = useMemo(() => {
    const days: Record<string, number> = {};
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86400000);
      days[d.toLocaleDateString('ar-EG', { weekday: 'short' })] = 0;
    }
    requests.forEach(r => {
      const d = new Date(r.created_at);
      if (Math.floor((now.getTime() - d.getTime()) / 86400000) < 7) {
        const key = d.toLocaleDateString('ar-EG', { weekday: 'short' });
        if (key in days) days[key]++;
      }
    });
    return Object.entries(days).map(([name, value]) => ({ name, value }));
  }, [requests]);

  const serviceData = useMemo(() => {
    const counts: Record<string, number> = {};
    requests.forEach(r => { counts[r.service_type] = (counts[r.service_type] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5)
      .map(([name, value]) => ({ name: name.length > 12 ? name.slice(0, 12) + '…' : name, value }));
  }, [requests]);

  const leadSourceData = useMemo(() => {
    const sources: Record<string, number> = {};
    [...requests.map(r => (r as any).lead_source || 'direct'), ...contacts.map(c => c.lead_source || 'direct')].forEach(s => {
      sources[s] = (sources[s] || 0) + 1;
    });
    return Object.entries(sources).sort((a, b) => b[1] - a[1]).slice(0, 4)
      .map(([name, value]) => ({ name, value }));
  }, [requests, contacts]);

  const recentRequests = useMemo(() => requests.slice(0, 5), [requests]);
  const recentContacts = useMemo(() => contacts.slice(0, 4), [contacts]);

  const kpiCards = [
    { label: 'إجمالي الطلبات', value: stats.total, icon: FileText, color: 'bg-primary/10 text-primary', trend: stats.trend },
    { label: 'طلبات جديدة', value: stats.newCount, icon: Zap, color: 'bg-amber-500/10 text-amber-500' },
    { label: 'رسائل جديدة', value: stats.newMessages, icon: MessageCircle, color: 'bg-blue-500/10 text-blue-500' },
    { label: 'معدل التحويل', value: `${stats.conversionRate}%`, icon: Target, color: 'bg-emerald-500/10 text-emerald-500' },
    { label: 'المشاريع', value: projectsCount, icon: Briefcase, color: 'bg-purple-500/10 text-purple-500' },
    { label: 'المشتركين', value: subscribersCount, icon: Users, color: 'bg-pink-500/10 text-pink-500' },
  ];

  const quickActions = [
    { label: 'الطلبات', icon: FileText, tab: 'requests', count: stats.newCount, desc: 'إدارة الطلبات الواردة' },
    { label: 'الرسائل', icon: MessageCircle, tab: 'contacts', count: stats.newMessages, desc: 'رسائل التواصل' },
    { label: 'المحادثات', icon: MessageCircle, tab: 'chat', desc: 'الدردشة المباشرة' },
    { label: 'الأعمال', icon: Briefcase, tab: 'portfolio', desc: 'إدارة المعرض' },
    { label: 'المدونة', icon: Layers, tab: 'blog', desc: 'إدارة المقالات' },
    { label: 'الباقات', icon: DollarSign, tab: 'pricing', desc: 'إدارة الأسعار' },
  ];

  const statusBadge = (status: RequestStatus) => {
    const map: Record<RequestStatus, { label: string; cls: string; dot: string }> = {
      new: { label: 'جديد', cls: 'bg-primary/10 text-primary', dot: 'bg-primary' },
      contacted: { label: 'تم التواصل', cls: 'bg-amber-500/10 text-amber-500', dot: 'bg-amber-500' },
      closed: { label: 'مغلق', cls: 'bg-emerald-500/10 text-emerald-500', dot: 'bg-emerald-500' },
    };
    const { label, cls, dot } = map[status];
    return (
      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${cls}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
        {label}
      </span>
    );
  };

  const formatTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'الآن';
    if (mins < 60) return `منذ ${mins} دقيقة`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `منذ ${hours} ساعة`;
    const days = Math.floor(hours / 24);
    return `منذ ${days} يوم`;
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-5">
      {/* Welcome + Date */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-foreground">مرحباً بك 👋</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => onNavigate('requests')} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors">
            <Eye className="w-3.5 h-3.5" />
            عرض الطلبات
          </button>
        </div>
      </motion.div>

      {/* KPI Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpiCards.map((kpi) => (
          <motion.div
            key={kpi.label}
            whileHover={{ y: -2 }}
            className="bg-card border border-border/30 rounded-2xl p-4 cursor-default group hover:border-primary/20 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${kpi.color} transition-transform group-hover:scale-105`}>
                <kpi.icon className="w-4 h-4" />
              </div>
              {'trend' in kpi && typeof kpi.trend === 'number' && (
                <div className={`flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                  kpi.trend >= 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-destructive/10 text-destructive'
                }`}>
                  {kpi.trend >= 0 ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                  {Math.abs(kpi.trend)}%
                </div>
              )}
            </div>
            <p className="text-xl font-bold text-foreground">{kpi.value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{kpi.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions Grid */}
      <motion.div variants={itemVariants}>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">وصول سريع</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {quickActions.map(action => (
            <button
              key={action.tab}
              onClick={() => onNavigate(action.tab)}
              className="relative flex flex-col items-center gap-2 p-3 rounded-xl bg-card border border-border/30 hover:border-primary/30 hover:bg-primary/5 transition-all group text-center"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                <action.icon className="w-4 h-4 text-primary" />
              </div>
              <span className="text-[11px] font-medium text-foreground">{action.label}</span>
              {action.count && action.count > 0 && (
                <span className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center min-w-[18px] px-1">
                  {action.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Charts Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Area Chart */}
        <div className="lg:col-span-2 bg-card border border-border/30 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">الطلبات خلال الأسبوع</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">{stats.thisWeek} طلب هذا الأسبوع</p>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-muted/30">
              <Activity className="w-3 h-3 text-primary" />
              <span className="text-[10px] font-medium text-muted-foreground">7 أيام</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={timelineData}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))', fontSize: 11, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="url(#areaGrad)" strokeWidth={2} dot={{ r: 2.5, fill: 'hsl(var(--primary))', strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-card border border-border/30 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-1">توزيع الحالات</h3>
          <p className="text-[11px] text-muted-foreground mb-2">{stats.total} طلب</p>
          {stats.total > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={130}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={38} outerRadius={55} dataKey="value" strokeWidth={0}>
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {pieData.map(d => (
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
          ) : (
            <div className="flex items-center justify-center h-[180px] text-xs text-muted-foreground">لا توجد بيانات</div>
          )}
        </div>
      </motion.div>

      {/* Service + Lead Sources + Pipeline */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Top Services */}
        <div className="bg-card border border-border/30 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground">أكثر الخدمات طلباً</h3>
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
          </div>
          {serviceData.length > 0 ? (
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={serviceData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} width={90} />
                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))', fontSize: 11 }} />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 6, 6, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState icon={BarChart3} text="لا توجد بيانات" />
          )}
        </div>

        {/* Lead Sources */}
        <div className="bg-card border border-border/30 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3">مصادر العملاء</h3>
          {leadSourceData.length > 0 ? (
            <div className="space-y-3">
              {leadSourceData.map((s, i) => {
                const total = leadSourceData.reduce((sum, d) => sum + d.value, 0);
                const pct = total > 0 ? Math.round((s.value / total) * 100) : 0;
                const colors = ['bg-primary', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500'];
                return (
                  <div key={s.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-foreground capitalize">{s.name}</span>
                      <span className="text-[10px] text-muted-foreground">{s.value} ({pct}%)</span>
                    </div>
                    <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6, delay: i * 0.1 }}
                        className={`h-full rounded-full ${colors[i % colors.length]}`} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState icon={Target} text="لا توجد بيانات" />
          )}
        </div>

        {/* Pipeline Summary */}
        <div className="bg-card border border-border/30 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground">خط الأنابيب</h3>
            <button onClick={() => onNavigate('requests')} className="text-[10px] text-primary hover:underline flex items-center gap-0.5">
              التفاصيل <ArrowLeft className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {([
              { status: 'new' as const, label: 'جديد', count: stats.newCount },
              { status: 'contacted' as const, label: 'تم التواصل', count: stats.contactedCount },
              { status: 'closed' as const, label: 'مغلق', count: stats.closedCount },
            ]).map(item => {
              const pct = stats.total > 0 ? (item.count / stats.total) * 100 : 0;
              return (
                <div key={item.status}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: STATUS_COLORS[item.status] }} />
                      <span className="text-xs font-medium text-foreground">{item.label}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">{item.count} ({Math.round(pct)}%)</span>
                  </div>
                  <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.7 }}
                      className="h-full rounded-full" style={{ backgroundColor: STATUS_COLORS[item.status] }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Activity Timeline + Recent Lists */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Activity Timeline */}
        <div className="bg-card border border-border/30 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-border/20">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">آخر النشاطات</h3>
            </div>
          </div>
          {activityLog.length > 0 ? (
            <div className="divide-y divide-border/10">
              {activityLog.map((item, i) => (
                <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  className="flex items-start gap-3 px-5 py-3 hover:bg-muted/10 transition-colors">
                  <div className={`w-7 h-7 rounded-lg bg-muted/30 flex items-center justify-center shrink-0 mt-0.5`}>
                    <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-foreground">{item.action}</p>
                    {item.details && <p className="text-[10px] text-muted-foreground truncate mt-0.5">{item.details}</p>}
                    <p className="text-[9px] text-muted-foreground/60 mt-0.5">{formatTimeAgo(item.created_at)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <EmptyState icon={Activity} text="لا توجد نشاطات بعد" className="py-8" />
          )}
        </div>

        {/* Recent Requests */}
        <div className="bg-card border border-border/30 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-border/20">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">آخر الطلبات</h3>
            </div>
            <button onClick={() => onNavigate('requests')} className="text-[10px] text-primary hover:underline flex items-center gap-0.5">
              الكل <ArrowLeft className="w-3 h-3" />
            </button>
          </div>
          {recentRequests.length > 0 ? (
            <div className="divide-y divide-border/10">
              {recentRequests.map((req, i) => (
                <motion.div key={req.id} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                  className="flex items-center justify-between px-5 py-2.5 hover:bg-muted/10 transition-colors cursor-pointer group"
                  onClick={() => onNavigate('requests')}>
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold text-primary">{req.full_name.charAt(0)}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{req.full_name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{req.service_type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {statusBadge(req.status)}
                    <ArrowUpRight className="w-3 h-3 text-muted-foreground/0 group-hover:text-muted-foreground transition-colors" />
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <EmptyState icon={FileText} text="لا توجد طلبات" className="py-8" />
          )}
        </div>

        {/* Recent Messages */}
        <div className="bg-card border border-border/30 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-border/20">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-blue-500" />
              <h3 className="text-sm font-semibold text-foreground">آخر الرسائل</h3>
            </div>
            <button onClick={() => onNavigate('contacts')} className="text-[10px] text-primary hover:underline flex items-center gap-0.5">
              الكل <ArrowLeft className="w-3 h-3" />
            </button>
          </div>
          {recentContacts.length > 0 ? (
            <div className="divide-y divide-border/10">
              {recentContacts.map((msg, i) => (
                <motion.div key={msg.id} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                  className="px-5 py-2.5 hover:bg-muted/10 transition-colors cursor-pointer group"
                  onClick={() => onNavigate('contacts')}>
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-blue-500">{msg.name.charAt(0)}</span>
                      </div>
                      <p className="text-xs font-medium text-foreground">{msg.name}</p>
                    </div>
                    <span className="text-[9px] text-muted-foreground">{formatTimeAgo(msg.created_at)}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground truncate pr-9">{msg.subject}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <EmptyState icon={MessageCircle} text="لا توجد رسائل" className="py-8" />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const EmptyState = ({ icon: Icon, text, className = '' }: { icon: React.ElementType; text: string; className?: string }) => (
  <div className={`flex flex-col items-center justify-center text-center ${className || 'py-12'}`}>
    <div className="w-10 h-10 rounded-xl bg-muted/30 flex items-center justify-center mb-2">
      <Icon className="w-5 h-5 text-muted-foreground/30" />
    </div>
    <p className="text-xs text-muted-foreground">{text}</p>
  </div>
);

export default DashboardOverview;
