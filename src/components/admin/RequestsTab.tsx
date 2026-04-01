import { useMemo, useState } from 'react';
import { 
  Search, Download, FileText, Clock, Phone, Trash2, MessageCircle,
  Copy, Eye, X, CheckCircle2, PhoneCall, GripVertical,
  LayoutGrid, LayoutList, ArrowUpDown, Filter
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

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
  email?: string | null;
  lead_source?: string | null;
}

const CHART_COLORS = ['hsl(var(--primary))', 'hsl(38, 92%, 50%)', 'hsl(142, 71%, 45%)'];

const STATUS_CONFIG: Record<RequestStatus, { label: string; cls: string; icon: React.ElementType; dot: string }> = {
  new: { label: 'جديد', cls: 'bg-primary/15 text-primary border-primary/20', icon: Clock, dot: 'bg-primary' },
  contacted: { label: 'تم التواصل', cls: 'bg-amber-500/15 text-amber-500 border-amber-500/20', icon: PhoneCall, dot: 'bg-amber-500' },
  closed: { label: 'مغلق', cls: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/20', icon: CheckCircle2, dot: 'bg-emerald-500' },
};

const URGENCY_CONFIG: Record<string, string> = {
  'عاجل': 'bg-destructive/15 text-destructive',
  'متوسط': 'bg-amber-500/15 text-amber-500',
  'عادي': 'bg-muted text-muted-foreground',
};

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

type ViewMode = 'table' | 'kanban';
const ITEMS_PER_PAGE = 15;

const RequestsTab = ({
  requests, userRole, searchQuery, setSearchQuery,
  statusFilter, setStatusFilter, updateStatus, deleteRequest,
}: RequestsTabProps) => {
  const { toast } = useToast();
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  const filteredRequests = useMemo(() => {
    return requests.filter(r => {
      const matchesSearch = r.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.service_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.whatsapp.includes(searchQuery);
      const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [requests, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);
  const paginatedRequests = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRequests.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredRequests, currentPage]);

  const kanbanData = useMemo(() => ({
    new: requests.filter(r => r.status === 'new'),
    contacted: requests.filter(r => r.status === 'contacted'),
    closed: requests.filter(r => r.status === 'closed'),
  }), [requests]);

  const statusChartData = useMemo(() => [
    { name: 'جديد', value: requests.filter(r => r.status === 'new').length },
    { name: 'تم التواصل', value: requests.filter(r => r.status === 'contacted').length },
    { name: 'مغلق', value: requests.filter(r => r.status === 'closed').length },
  ], [requests]);

  const serviceChartData = useMemo(() => {
    const counts: Record<string, number> = {};
    requests.forEach(r => { counts[r.service_type] = (counts[r.service_type] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name: name.length > 12 ? name.slice(0, 12) + '…' : name, value }));
  }, [requests]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'تم النسخ', description: 'تم نسخ الرقم بنجاح' });
  };

  const getWhatsAppLink = (whatsapp: string) => {
    const cleaned = whatsapp.replace(/[\s\-\+]/g, '');
    const num = cleaned.startsWith('0') ? '20' + cleaned.slice(1) : cleaned.startsWith('20') ? cleaned : '20' + cleaned;
    return `https://wa.me/${encodeURIComponent(num)}`;
  };

  const exportCSV = () => {
    const headers = ['الاسم', 'واتساب', 'البريد', 'الخدمة', 'الاستعجال', 'الحالة', 'المصدر', 'التاريخ', 'التفاصيل'];
    const rows = filteredRequests.map(r => [
      r.full_name, r.whatsapp, r.email || '', r.service_type, r.urgency, r.status,
      r.lead_source || 'direct', new Date(r.created_at).toLocaleDateString('ar-EG'), r.details || ''
    ]);
    const csv = '\uFEFF' + [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `requests-${new Date().toISOString().split('T')[0]}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  const KanbanCard = ({ req }: { req: ServiceRequest }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-background border border-border/30 rounded-xl p-3.5 hover:border-primary/20 hover:shadow-sm transition-all cursor-pointer group"
      onClick={() => setSelectedRequest(req)}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <span className="text-[10px] font-bold text-primary">{req.full_name.charAt(0)}</span>
          </div>
          <span className="text-sm font-medium text-foreground">{req.full_name}</span>
        </div>
        <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${URGENCY_CONFIG[req.urgency] || URGENCY_CONFIG['عادي']}`}>
          {req.urgency}
        </span>
      </div>
      <p className="text-[11px] text-muted-foreground mb-2">{req.service_type}</p>
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground">{new Date(req.created_at).toLocaleDateString('ar-EG')}</span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <a href={getWhatsAppLink(req.whatsapp)} target="_blank" rel="noopener noreferrer"
            className="p-1 rounded-lg text-emerald-500 hover:bg-emerald-500/10 transition-colors"
            onClick={e => e.stopPropagation()}>
            <MessageCircle className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </motion.div>
  );

  return (
    <>
      {/* Charts */}
      {requests.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-card border border-border/30 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">حالة الطلبات</h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={statusChartData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" strokeWidth={0}>
                  {statusChartData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-card border border-border/30 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">الطلبات حسب الخدمة</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={serviceChartData}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }} />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Search + Filter + Export + View Toggle */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder="بحث بالاسم أو الخدمة أو الرقم..."
            className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-card border border-border/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
        </div>
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-card border border-border/30">
          {(['all', 'new', 'contacted', 'closed'] as const).map(s => (
            <button key={s} onClick={() => { setStatusFilter(s); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                statusFilter === s
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}>
              {s === 'all' ? 'الكل' : STATUS_CONFIG[s].label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex items-center p-1 rounded-xl bg-card border border-border/30">
            <button onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'table' ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              title="عرض جدول">
              <LayoutList className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'kanban' ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              title="عرض كانبان">
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
          <button onClick={exportCSV} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-card border border-border/30 text-xs font-medium text-muted-foreground hover:bg-muted/50 transition-all">
            <Download className="w-3.5 h-3.5" /> CSV
          </button>
        </div>
      </div>

      {/* Kanban View */}
      <AnimatePresence mode="wait">
        {viewMode === 'kanban' ? (
          <motion.div
            key="kanban"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {(['new', 'contacted', 'closed'] as const).map(status => (
              <div key={status} className="bg-card border border-border/30 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border/20">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${STATUS_CONFIG[status].dot}`} />
                    <span className="text-sm font-semibold text-foreground">{STATUS_CONFIG[status].label}</span>
                  </div>
                  <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                    {kanbanData[status].length}
                  </span>
                </div>
                <div className="p-3 space-y-2.5 max-h-[500px] overflow-y-auto">
                  {kanbanData[status].length > 0 ? (
                    kanbanData[status].map(req => <KanbanCard key={req.id} req={req} />)
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <div className="w-10 h-10 rounded-xl bg-muted/30 flex items-center justify-center mb-2">
                        <FileText className="w-5 h-5 text-muted-foreground/30" />
                      </div>
                      <p className="text-xs text-muted-foreground">لا توجد طلبات</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          /* Table View */
          <motion.div
            key="table"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="bg-card border border-border/30 rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-border/20 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">الطلبات الواردة</h2>
                <span className="text-xs text-muted-foreground">{filteredRequests.length} طلب</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/20">
                      <th className="text-right px-5 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">الاسم</th>
                      <th className="text-right px-5 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">واتساب</th>
                      <th className="text-right px-5 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">الخدمة</th>
                      <th className="text-right px-5 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">الأولوية</th>
                      <th className="text-right px-5 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">الحالة</th>
                      <th className="text-right px-5 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">التاريخ</th>
                      <th className="text-right px-5 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/15">
                    {paginatedRequests.map((req) => (
                      <tr key={req.id} className={`hover:bg-muted/20 transition-colors ${req.status === 'new' ? 'bg-primary/[0.02]' : ''}`}>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                              <span className="text-xs font-bold text-primary">{req.full_name.charAt(0)}</span>
                            </div>
                            <span className="text-sm font-medium text-foreground">{req.full_name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-1">
                            <a href={getWhatsAppLink(req.whatsapp)} target="_blank" rel="noopener noreferrer"
                              className="text-emerald-500 hover:text-emerald-400 transition-colors" title="فتح واتساب">
                              <MessageCircle className="w-4 h-4" />
                            </a>
                            <span className="text-sm text-muted-foreground" dir="ltr">{req.whatsapp}</span>
                            <button onClick={() => copyToClipboard(req.whatsapp)} className="text-muted-foreground/50 hover:text-muted-foreground transition-colors" title="نسخ الرقم">
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-sm text-muted-foreground">{req.service_type}</td>
                        <td className="px-5 py-3">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${URGENCY_CONFIG[req.urgency] || URGENCY_CONFIG['عادي']}`}>
                            {req.urgency}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <button
                            onClick={() => {
                              const next: Record<RequestStatus, RequestStatus> = { new: 'contacted', contacted: 'closed', closed: 'new' };
                              updateStatus(req.id, next[req.status]);
                            }}
                            className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-all hover:opacity-80 ${STATUS_CONFIG[req.status].cls}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[req.status].dot}`} />
                            {STATUS_CONFIG[req.status].label}
                          </button>
                        </td>
                        <td className="px-5 py-3 text-xs text-muted-foreground">{new Date(req.created_at).toLocaleDateString('ar-EG')}</td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-1">
                            <button onClick={() => setSelectedRequest(req)} className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all" title="عرض التفاصيل">
                              <Eye className="w-4 h-4" />
                            </button>
                            {userRole === 'admin' && (
                              <button onClick={() => deleteRequest(req.id)} className="p-1.5 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all" title="حذف">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredRequests.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-muted/30 flex items-center justify-center mb-3">
                      <FileText className="w-8 h-8 text-muted-foreground/30" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">لا توجد طلبات مطابقة</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">جرّب تغيير معايير البحث</p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-5 py-3 border-t border-border/20">
                  <span className="text-xs text-muted-foreground">
                    صفحة {currentPage} من {totalPages}
                  </span>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).slice(
                      Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2)
                    ).map(page => (
                      <button key={page} onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                          page === currentPage ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted/50'
                        }`}>
                        {page}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Request Detail Modal */}
      <AnimatePresence>
        {selectedRequest && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setSelectedRequest(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-card border border-border/30 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border/20">
                <h3 className="text-base font-semibold text-foreground">تفاصيل الطلب</h3>
                <button onClick={() => setSelectedRequest(null)} className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">{selectedRequest.full_name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{selectedRequest.full_name}</p>
                    <p className="text-sm text-muted-foreground">{selectedRequest.service_type}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted/20 rounded-xl p-3">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">واتساب</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium" dir="ltr">{selectedRequest.whatsapp}</span>
                      <button onClick={() => copyToClipboard(selectedRequest.whatsapp)} className="text-muted-foreground hover:text-foreground">
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <div className="bg-muted/20 rounded-xl p-3">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">الأولوية</p>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${URGENCY_CONFIG[selectedRequest.urgency] || URGENCY_CONFIG['عادي']}`}>
                      {selectedRequest.urgency}
                    </span>
                  </div>
                  <div className="bg-muted/20 rounded-xl p-3">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">الحالة</p>
                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${STATUS_CONFIG[selectedRequest.status].cls}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[selectedRequest.status].dot}`} />
                      {STATUS_CONFIG[selectedRequest.status].label}
                    </span>
                  </div>
                  <div className="bg-muted/20 rounded-xl p-3">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">التاريخ</p>
                    <span className="text-sm font-medium">{new Date(selectedRequest.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                </div>

                {selectedRequest.details && (
                  <div className="bg-muted/20 rounded-xl p-3">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">التفاصيل</p>
                    <p className="text-sm text-foreground leading-relaxed">{selectedRequest.details}</p>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-2">
                  <a href={getWhatsAppLink(selectedRequest.whatsapp)} target="_blank" rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl py-2.5 text-sm font-medium transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    فتح واتساب
                  </a>
                  <select
                    value={selectedRequest.status}
                    onChange={(e) => {
                      updateStatus(selectedRequest.id, e.target.value as RequestStatus);
                      setSelectedRequest({ ...selectedRequest, status: e.target.value as RequestStatus });
                    }}
                    className="flex-1 bg-card border border-border/30 rounded-xl py-2.5 px-3 text-sm text-center"
                  >
                    <option value="new">جديد</option>
                    <option value="contacted">تم التواصل</option>
                    <option value="closed">مغلق</option>
                  </select>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default RequestsTab;
