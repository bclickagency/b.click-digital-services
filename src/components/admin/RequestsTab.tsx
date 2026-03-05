import { useMemo } from 'react';
import { Search, Download, Filter, FileText, Clock, Phone, Trash2, MessageCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--muted-foreground))'];

interface RequestsTabProps {
  requests: ServiceRequest[];
  userRole: string | null;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
  updateStatus: (id: string, status: RequestStatus) => void;
  deleteRequest: (id: string) => void;
}

const RequestsTab = ({
  requests,
  userRole,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  updateStatus,
  deleteRequest,
}: RequestsTabProps) => {
  const filteredRequests = useMemo(() => {
    return requests.filter(r => {
      const matchesSearch = r.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.service_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.whatsapp.includes(searchQuery);
      const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [requests, searchQuery, statusFilter]);

  const statusChartData = useMemo(() => [
    { name: 'جديد', value: requests.filter(r => r.status === 'new').length },
    { name: 'تم التواصل', value: requests.filter(r => r.status === 'contacted').length },
    { name: 'مغلق', value: requests.filter(r => r.status === 'closed').length },
  ], [requests]);

  const serviceChartData = useMemo(() => {
    const counts: Record<string, number> = {};
    requests.forEach(r => { counts[r.service_type] = (counts[r.service_type] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name: name.length > 15 ? name.slice(0, 15) + '...' : name, value }));
  }, [requests]);

  const exportCSV = () => {
    const headers = ['الاسم', 'واتساب', 'الخدمة', 'الاستعجال', 'الحالة', 'التاريخ', 'التفاصيل'];
    const rows = filteredRequests.map(r => [r.full_name, r.whatsapp, r.service_type, r.urgency, r.status, new Date(r.created_at).toLocaleDateString('ar-EG'), r.details || '']);
    const csv = '\uFEFF' + [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `requests-${new Date().toISOString().split('T')[0]}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'إجمالي الطلبات', value: requests.length, icon: FileText, color: 'primary' },
          { label: 'طلبات جديدة', value: requests.filter(r => r.status === 'new').length, icon: Clock, color: 'secondary' },
          { label: 'تم الإغلاق', value: requests.filter(r => r.status === 'closed').length, icon: Phone, color: 'primary' },
        ].map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color === 'primary' ? 'bg-primary/10' : 'bg-secondary/10'}`}>
                <stat.icon className={`w-6 h-6 ${stat.color === 'primary' ? 'text-primary' : 'text-secondary'}`} />
              </div>
              <div>
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      {requests.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="glass-card">
            <h3 className="text-sm font-bold text-foreground mb-4">حالة الطلبات</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={statusChartData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {statusChartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="glass-card">
            <h3 className="text-sm font-bold text-foreground mb-4">الطلبات حسب الخدمة</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={serviceChartData}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Search + Filter + Export */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="بحث بالاسم أو الخدمة أو الرقم..."
            className="w-full pr-10 pl-4 py-2 rounded-xl bg-muted/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-muted/50 border border-border/50 text-sm">
          <option value="all">كل الحالات</option>
          <option value="new">جديد</option>
          <option value="contacted">تم التواصل</option>
          <option value="closed">مغلق</option>
        </select>
        <button onClick={exportCSV} className="btn-ghost text-sm py-2 px-3">
          <Download className="w-4 h-4" /> تصدير CSV
        </button>
      </div>

      {/* Requests Table */}
      <div className="glass-card p-0 overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-bold">الطلبات الواردة</h2>
          <span className="text-sm text-muted-foreground">{filteredRequests.length} طلب</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30">
              <tr>
                <th className="text-right p-4 text-sm font-medium">الاسم</th>
                <th className="text-right p-4 text-sm font-medium">واتساب</th>
                <th className="text-right p-4 text-sm font-medium">الخدمة</th>
                <th className="text-right p-4 text-sm font-medium">الاستعجال</th>
                <th className="text-right p-4 text-sm font-medium">الحالة</th>
                <th className="text-right p-4 text-sm font-medium">التاريخ</th>
                <th className="text-right p-4 text-sm font-medium">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request) => (
                <tr key={request.id} className="table-row">
                  <td className="p-4 font-medium">{request.full_name}</td>
                  <td className="p-4">
                    <a href={`https://wa.me/20${encodeURIComponent(request.whatsapp)}`} target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />{request.whatsapp}
                    </a>
                  </td>
                  <td className="p-4 text-sm">{request.service_type}</td>
                  <td className="p-4 text-sm">{request.urgency}</td>
                  <td className="p-4">
                    <select value={request.status} onChange={(e) => updateStatus(request.id, e.target.value as RequestStatus)}
                      className="bg-transparent border border-border rounded-lg px-2 py-1 text-sm">
                      <option value="new">جديد</option>
                      <option value="contacted">تم التواصل</option>
                      <option value="closed">مغلق</option>
                    </select>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">{new Date(request.created_at).toLocaleDateString('ar-EG')}</td>
                  <td className="p-4">
                    {userRole === 'admin' && (
                      <button onClick={() => deleteRequest(request.id)} className="text-destructive hover:text-destructive/80"><Trash2 className="w-4 h-4" /></button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredRequests.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">لا توجد طلبات مطابقة</div>
          )}
        </div>
      </div>
    </>
  );
};

export default RequestsTab;
