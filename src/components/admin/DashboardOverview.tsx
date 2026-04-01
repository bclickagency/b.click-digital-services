import { useMemo } from 'react';
import { 
  FileText, Clock, PhoneCall, CheckCircle2, TrendingUp, TrendingDown,
  ArrowLeft, MessageCircle, Users, Briefcase, Zap, Activity,
  ArrowUpRight, BarChart3
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';
import { motion } from 'framer-motion';

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

const STATUS_COLORS = {
  new: 'hsl(var(--primary))',
  contacted: 'hsl(38, 92%, 50%)',
  closed: 'hsl(142, 71%, 45%)',
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

const DashboardOverview = ({ requests, contacts, onNavigate }: OverviewProps) => {
  const stats = useMemo(() => {
    const newCount = requests.filter(r => r.status === 'new').length;
    const contactedCount = requests.filter(r => r.status === 'contacted').length;
    const closedCount = requests.filter(r => r.status === 'closed').length;
    const conversionRate = requests.length > 0 ? Math.round((closedCount / requests.length) * 100) : 0;

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
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
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = d.toLocaleDateString('ar-EG', { weekday: 'short' });
      days[key] = 0;
    }
    requests.forEach(r => {
      const d = new Date(r.created_at);
      const diff = Math.floor((now.getTime() - d.getTime()) / (24 * 60 * 60 * 1000));
      if (diff < 7) {
        const key = d.toLocaleDateString('ar-EG', { weekday: 'short' });
        if (key in days) days[key]++;
      }
    });
    return Object.entries(days).map(([name, value]) => ({ name, value }));
  }, [requests]);

  const serviceData = useMemo(() => {
    const counts: Record<string, number> = {};
    requests.forEach(r => { counts[r.service_type] = (counts[r.service_type] || 0) + 1; });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({ name: name.length > 15 ? name.slice(0, 15) + '…' : name, value }));
  }, [requests]);

  const recentRequests = useMemo(() => requests.slice(0, 6), [requests]);
  const recentContacts = useMemo(() => contacts.slice(0, 4), [contacts]);

  const kpiCards = [
    { label: 'إجمالي الطلبات', value: stats.total, icon: FileText, gradient: 'from-primary/20 to-primary/5', iconBg: 'bg-primary/15 text-primary', trend: stats.trend },
    { label: 'طلبات جديدة', value: stats.newCount, icon: Zap, gradient: 'from-amber-500/20 to-amber-500/5', iconBg: 'bg-amber-500/15 text-amber-500' },
    { label: 'الرسائل الجديدة', value: stats.newMessages, icon: MessageCircle, gradient: 'from-blue-500/20 to-blue-500/5', iconBg: 'bg-blue-500/15 text-blue-500' },
    { label: 'معدل التحويل', value: `${stats.conversionRate}%`, icon: TrendingUp, gradient: 'from-emerald-500/20 to-emerald-500/5', iconBg: 'bg-emerald-500/15 text-emerald-500' },
  ];

  const quickActions = [
    { label: 'الطلبات الجديدة', icon: FileText, tab: 'requests', count: stats.newCount },
    { label: 'الرسائل', icon: MessageCircle, tab: 'contacts', count: stats.newMessages },
    { label: 'المحادثات', icon: MessagesSquare, tab: 'chat' },
    { label: 'إدارة الأعمال', icon: Briefcase, tab: 'portfolio' },
  ];

  const MessagesSquare = MessageCircle;

  const statusBadge = (status: RequestStatus) => {
    const map: Record<RequestStatus, { label: string; cls: string; dot: string }> = {
      new: { label: 'جديد', cls: 'bg-primary/10 text-primary', dot: 'bg-primary' },
      contacted: { label: 'تم التواصل', cls: 'bg-amber-500/10 text-amber-500', dot: 'bg-amber-500' },
      closed: { label: 'مغلق', cls: 'bg-emerald-500/10 text-emerald-500', dot: 'bg-emerald-500' },
    };
    const { label, cls, dot } = map[status];
    return (
      <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full ${cls}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
        {label}
      </span>
    );
  };

  const urgencyDot = (urgency: string) => {
    const colors: Record<string, string> = {
      'عاجل': 'bg-destructive',
      'متوسط': 'bg-amber-500',
      'عادي': 'bg-muted-foreground/40',
    };
    return <span className={`w-2 h-2 rounded-full ${colors[urgency] || colors['عادي']}`} />;
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Welcome + Quick Actions */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">مرحباً بك 👋</h2>
          <p className="text-sm text-muted-foreground mt-0.5">إليك نظرة عامة على أعمالك اليوم</p>
        </div>
        <div className="flex items-center gap-2">
          {quickActions.slice(0, 3).map(action => (
            <button
              key={action.tab}
              onClick={() => onNavigate(action.tab)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-card border border-border/50 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5 transition-all"
            >
              <action.icon className="w-3.5 h-3.5" />
              {action.label}
              {action.count && action.count > 0 && (
                <span className="bg-destructive text-destructive-foreground text-[9px] font-bold px-1 rounded-full">
                  {action.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className={`relative overflow-hidden bg-gradient-to-br ${kpi.gradient} border border-border/30 rounded-2xl p-4 group cursor-default`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${kpi.iconBg} transition-transform group-hover:scale-110`}>
                <kpi.icon className="w-5 h-5" />
              </div>
              {'trend' in kpi && typeof kpi.trend === 'number' && (
                <div className={`flex items-center gap-0.5 text-[11px] font-semibold px-1.5 py-0.5 rounded-full ${
                  kpi.trend >= 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-destructive/10 text-destructive'
                }`}>
                  {kpi.trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {Math.abs(kpi.trend)}%
                </div>
              )}
            </div>
            <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{kpi.label}</p>
          </motion.div>
        ))}
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
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={timelineData}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ 
                  borderRadius: 12, border: '1px solid hsl(var(--border))', 
                  background: 'hsl(var(--card))', fontSize: 12,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}
              />
              <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="url(#areaGrad)" strokeWidth={2.5} dot={{ r: 3, fill: 'hsl(var(--primary))', strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-card border border-border/30 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-1">توزيع الحالات</h3>
          <p className="text-[11px] text-muted-foreground mb-3">{stats.total} طلب إجمالي</p>
          {stats.total > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={42} outerRadius={62} dataKey="value" strokeWidth={0}>
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-3">
                {pieData.map(d => (
                  <div key={d.name} className="flex items-center justify-between text-[12px]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                      <span className="text-muted-foreground">{d.name}</span>
                    </div>
                    <span className="font-semibold text-foreground">{d.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-sm text-muted-foreground">لا توجد بيانات</div>
          )}
        </div>
      </motion.div>

      {/* Service Distribution + Pipeline */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Services */}
        <div className="bg-card border border-border/30 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">أكثر الخدمات طلباً</h3>
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
          </div>
          {serviceData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={serviceData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} width={100} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))', fontSize: 12 }}
                />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 6, 6, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[180px] text-sm text-muted-foreground">لا توجد بيانات</div>
          )}
        </div>

        {/* Pipeline Summary */}
        <div className="bg-card border border-border/30 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">خط أنابيب المبيعات</h3>
            <button onClick={() => onNavigate('requests')} className="text-[11px] text-primary hover:underline flex items-center gap-0.5">
              التفاصيل <ArrowLeft className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-4">
            {([
              { status: 'new' as const, label: 'جديد', color: 'primary', count: stats.newCount },
              { status: 'contacted' as const, label: 'تم التواصل', color: 'amber-500', count: stats.contactedCount },
              { status: 'closed' as const, label: 'مغلق', color: 'emerald-500', count: stats.closedCount },
            ]).map(item => {
              const percentage = stats.total > 0 ? (item.count / stats.total) * 100 : 0;
              return (
                <div key={item.status}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full bg-${item.color}`} style={{ backgroundColor: STATUS_COLORS[item.status] }} />
                      <span className="text-xs font-medium text-foreground">{item.label}</span>
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground">{item.count} ({Math.round(percentage)}%)</span>
                  </div>
                  <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: STATUS_COLORS[item.status] }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Recent Activity Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Requests */}
        <div className="bg-card border border-border/30 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/20">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">آخر الطلبات</h3>
            </div>
            <button onClick={() => onNavigate('requests')} className="text-[11px] text-primary hover:underline flex items-center gap-0.5">
              عرض الكل <ArrowLeft className="w-3 h-3" />
            </button>
          </div>
          {recentRequests.length > 0 ? (
            <div className="divide-y divide-border/15">
              {recentRequests.map((req, i) => (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between px-5 py-3 hover:bg-muted/20 transition-colors cursor-pointer group"
                  onClick={() => onNavigate('requests')}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                      <span className="text-xs font-bold text-primary">{req.full_name.charAt(0)}</span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground truncate">{req.full_name}</p>
                        {urgencyDot(req.urgency)}
                      </div>
                      <p className="text-[11px] text-muted-foreground truncate">{req.service_type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {statusBadge(req.status)}
                    <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground/0 group-hover:text-muted-foreground transition-colors" />
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-14 h-14 rounded-2xl bg-muted/30 flex items-center justify-center mb-3">
                <FileText className="w-7 h-7 text-muted-foreground/30" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">لا توجد طلبات بعد</p>
              <p className="text-[11px] text-muted-foreground/60 mt-0.5">ستظهر الطلبات الجديدة هنا</p>
            </div>
          )}
        </div>

        {/* Recent Messages */}
        <div className="bg-card border border-border/30 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/20">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-blue-500" />
              <h3 className="text-sm font-semibold text-foreground">آخر الرسائل</h3>
            </div>
            <button onClick={() => onNavigate('contacts')} className="text-[11px] text-primary hover:underline flex items-center gap-0.5">
              عرض الكل <ArrowLeft className="w-3 h-3" />
            </button>
          </div>
          {recentContacts.length > 0 ? (
            <div className="divide-y divide-border/15">
              {recentContacts.map((msg, i) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="px-5 py-3 hover:bg-muted/20 transition-colors cursor-pointer group"
                  onClick={() => onNavigate('contacts')}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-blue-500">{msg.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{msg.name}</p>
                        <p className="text-[10px] text-muted-foreground">{msg.subject}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-muted-foreground">{new Date(msg.created_at).toLocaleDateString('ar-EG')}</span>
                      <ArrowUpRight className="w-3 h-3 text-muted-foreground/0 group-hover:text-muted-foreground transition-colors" />
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground/80 truncate pr-10">{msg.message}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-14 h-14 rounded-2xl bg-muted/30 flex items-center justify-center mb-3">
                <MessageCircle className="w-7 h-7 text-muted-foreground/30" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">لا توجد رسائل بعد</p>
              <p className="text-[11px] text-muted-foreground/60 mt-0.5">ستظهر الرسائل الجديدة هنا</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DashboardOverview;
