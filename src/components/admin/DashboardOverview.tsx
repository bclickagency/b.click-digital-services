import { useMemo } from 'react';
import { 
  FileText, Clock, PhoneCall, CheckCircle2, TrendingUp, TrendingDown,
  ArrowLeft, MessageCircle
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

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
  new: 'hsl(248, 98%, 60%)',
  contacted: 'hsl(38, 92%, 50%)',
  closed: 'hsl(142, 71%, 45%)',
};

const DashboardOverview = ({ requests, contacts, onNavigate }: OverviewProps) => {
  const stats = useMemo(() => {
    const newCount = requests.filter(r => r.status === 'new').length;
    const contactedCount = requests.filter(r => r.status === 'contacted').length;
    const closedCount = requests.filter(r => r.status === 'closed').length;
    const conversionRate = requests.length > 0 ? Math.round((closedCount / requests.length) * 100) : 0;

    // This week vs last week
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const thisWeek = requests.filter(r => new Date(r.created_at) >= weekAgo).length;
    const lastWeek = requests.filter(r => new Date(r.created_at) >= twoWeeksAgo && new Date(r.created_at) < weekAgo).length;
    const trend = lastWeek > 0 ? Math.round(((thisWeek - lastWeek) / lastWeek) * 100) : thisWeek > 0 ? 100 : 0;

    return { total: requests.length, newCount, contactedCount, closedCount, conversionRate, trend, thisWeek };
  }, [requests]);

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

  const recentRequests = useMemo(() => requests.slice(0, 5), [requests]);
  const recentContacts = useMemo(() => contacts.slice(0, 3), [contacts]);

  const kpiCards = [
    { label: 'إجمالي الطلبات', value: stats.total, icon: FileText, color: 'primary', trend: stats.trend },
    { label: 'طلبات جديدة', value: stats.newCount, icon: Clock, color: 'warning' },
    { label: 'قيد التواصل', value: stats.contactedCount, icon: PhoneCall, color: 'info' },
    { label: 'معدل التحويل', value: `${stats.conversionRate}%`, icon: CheckCircle2, color: 'success' },
  ];

  const colorMap: Record<string, string> = {
    primary: 'bg-primary/10 text-primary',
    warning: 'bg-amber-500/10 text-amber-500',
    info: 'bg-blue-500/10 text-blue-500',
    success: 'bg-emerald-500/10 text-emerald-500',
  };

  const statusBadge = (status: RequestStatus) => {
    const map: Record<RequestStatus, { label: string; cls: string }> = {
      new: { label: 'جديد', cls: 'bg-primary/15 text-primary' },
      contacted: { label: 'تم التواصل', cls: 'bg-amber-500/15 text-amber-500' },
      closed: { label: 'مغلق', cls: 'bg-emerald-500/15 text-emerald-500' },
    };
    const { label, cls } = map[status];
    return <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${cls}`}>{label}</span>;
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi) => (
          <div key={kpi.label} className="bg-card border border-border/50 rounded-2xl p-4 hover:border-border transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[kpi.color]}`}>
                <kpi.icon className="w-5 h-5" />
              </div>
              {'trend' in kpi && typeof kpi.trend === 'number' && (
                <div className={`flex items-center gap-0.5 text-[11px] font-medium ${kpi.trend >= 0 ? 'text-emerald-500' : 'text-destructive'}`}>
                  {kpi.trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {Math.abs(kpi.trend)}%
                </div>
              )}
            </div>
            <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Area Chart - Requests Over Week */}
        <div className="lg:col-span-2 bg-card border border-border/50 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">الطلبات خلال الأسبوع</h3>
            <span className="text-xs text-muted-foreground">{stats.thisWeek} طلب هذا الأسبوع</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={timelineData}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(248, 98%, 60%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(248, 98%, 60%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }} />
              <Area type="monotone" dataKey="value" stroke="hsl(248, 98%, 60%)" fill="url(#areaGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-card border border-border/50 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">توزيع الحالات</h3>
          {stats.total > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value" strokeWidth={0}>
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex items-center justify-center gap-4 mt-2">
                {pieData.map(d => (
                  <div key={d.name} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                    {d.name} ({d.value})
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-[180px] text-sm text-muted-foreground">لا توجد بيانات</div>
          )}
        </div>
      </div>

      {/* Recent Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Requests */}
        <div className="bg-card border border-border/50 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-border/50">
            <h3 className="text-sm font-semibold text-foreground">آخر الطلبات</h3>
            <button onClick={() => onNavigate('requests')} className="text-xs text-primary hover:underline flex items-center gap-1">
              عرض الكل <ArrowLeft className="w-3 h-3" />
            </button>
          </div>
          {recentRequests.length > 0 ? (
            <div className="divide-y divide-border/30">
              {recentRequests.map(req => (
                <div key={req.id} className="flex items-center justify-between px-5 py-3 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-primary">{req.full_name.charAt(0)}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{req.full_name}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{req.service_type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {statusBadge(req.status)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="w-10 h-10 text-muted-foreground/30 mb-2" />
              <p className="text-sm text-muted-foreground">لا توجد طلبات بعد</p>
            </div>
          )}
        </div>

        {/* Recent Messages */}
        <div className="bg-card border border-border/50 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-border/50">
            <h3 className="text-sm font-semibold text-foreground">آخر الرسائل</h3>
            <button onClick={() => onNavigate('contacts')} className="text-xs text-primary hover:underline flex items-center gap-1">
              عرض الكل <ArrowLeft className="w-3 h-3" />
            </button>
          </div>
          {recentContacts.length > 0 ? (
            <div className="divide-y divide-border/30">
              {recentContacts.map(msg => (
                <div key={msg.id} className="px-5 py-3 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-foreground">{msg.name}</p>
                    <span className="text-[10px] text-muted-foreground">{new Date(msg.created_at).toLocaleDateString('ar-EG')}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{msg.subject}: {msg.message}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <MessageCircle className="w-10 h-10 text-muted-foreground/30 mb-2" />
              <p className="text-sm text-muted-foreground">لا توجد رسائل بعد</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
