import { useMemo, useState, useCallback } from 'react';
import { 
  Search, Download, FileText, Clock, Phone, Trash2, MessageCircle,
  Copy, Eye, X, CheckCircle2, PhoneCall, GripVertical,
  LayoutGrid, LayoutList, ArrowUpDown, Filter, ChevronLeft, ChevronRight,
  MoreHorizontal, ExternalLink
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

const STATUS_CONFIG: Record<RequestStatus, { label: string; cls: string; icon: React.ElementType; dot: string; bg: string }> = {
  new: { label: 'جديد', cls: 'bg-primary/10 text-primary border-primary/20', icon: Clock, dot: 'bg-primary', bg: 'bg-primary/5' },
  contacted: { label: 'تم التواصل', cls: 'bg-amber-500/10 text-amber-500 border-amber-500/20', icon: PhoneCall, dot: 'bg-amber-500', bg: 'bg-amber-500/5' },
  closed: { label: 'مغلق', cls: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20', icon: CheckCircle2, dot: 'bg-emerald-500', bg: 'bg-emerald-500/5' },
};

const URGENCY_CONFIG: Record<string, string> = {
  'عاجل': 'bg-destructive/10 text-destructive',
  'متوسط': 'bg-amber-500/10 text-amber-500',
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
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filteredRequests = useMemo(() => {
    return requests.filter(r => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = r.full_name.toLowerCase().includes(q) ||
        r.service_type.toLowerCase().includes(q) || r.whatsapp.includes(searchQuery);
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'تم النسخ', description: 'تم نسخ الرقم' });
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

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedRequests.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedRequests.map(r => r.id)));
    }
  };

  const bulkUpdateStatus = (status: RequestStatus) => {
    selectedIds.forEach(id => updateStatus(id, status));
    setSelectedIds(new Set());
    toast({ title: 'تم التحديث', description: `تم تحديث ${selectedIds.size} طلب` });
  };

  const statusCounts = useMemo(() => ({
    all: requests.length,
    new: requests.filter(r => r.status === 'new').length,
    contacted: requests.filter(r => r.status === 'contacted').length,
    closed: requests.filter(r => r.status === 'closed').length,
  }), [requests]);

  const KanbanCard = ({ req }: { req: ServiceRequest }) => (
    <motion.div layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
      className="bg-background border border-border/30 rounded-xl p-3 hover:border-primary/20 hover:shadow-sm transition-all cursor-pointer group"
      onClick={() => setSelectedRequest(req)}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <span className="text-[10px] font-bold text-primary">{req.full_name.charAt(0)}</span>
          </div>
          <span className="text-xs font-medium text-foreground">{req.full_name}</span>
        </div>
        <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${URGENCY_CONFIG[req.urgency] || URGENCY_CONFIG['عادي']}`}>
          {req.urgency}
        </span>
      </div>
      <p className="text-[10px] text-muted-foreground mb-2">{req.service_type}</p>
      <div className="flex items-center justify-between">
        <span className="text-[9px] text-muted-foreground">{new Date(req.created_at).toLocaleDateString('ar-EG')}</span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <a href={getWhatsAppLink(req.whatsapp)} target="_blank" rel="noopener noreferrer"
            className="p-1 rounded-lg text-emerald-500 hover:bg-emerald-500/10" onClick={e => e.stopPropagation()}>
            <MessageCircle className="w-3 h-3" />
          </a>
        </div>
      </div>
    </motion.div>
  );

  return (
    <>
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {([
          { key: 'all', label: 'الكل', count: statusCounts.all, color: 'bg-muted/50 text-foreground' },
          { key: 'new', label: 'جديد', count: statusCounts.new, color: 'bg-primary/10 text-primary' },
          { key: 'contacted', label: 'تم التواصل', count: statusCounts.contacted, color: 'bg-amber-500/10 text-amber-500' },
          { key: 'closed', label: 'مغلق', count: statusCounts.closed, color: 'bg-emerald-500/10 text-emerald-500' },
        ]).map(s => (
          <button key={s.key} onClick={() => { setStatusFilter(s.key); setCurrentPage(1); }}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
              statusFilter === s.key ? 'border-primary/30 bg-primary/5' : 'border-border/30 bg-card hover:border-border/50'
            }`}>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.color}`}>
              <span className="text-sm font-bold">{s.count}</span>
            </div>
            <span className="text-xs font-medium text-foreground">{s.label}</span>
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder="بحث بالاسم أو الخدمة أو الرقم..."
            className="w-full pr-10 pl-4 py-2 rounded-xl bg-card border border-border/30 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
        </div>
        <div className="flex items-center p-0.5 rounded-xl bg-card border border-border/30">
          <button onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-lg transition-all ${viewMode === 'table' ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}>
            <LayoutList className="w-4 h-4" />
          </button>
          <button onClick={() => setViewMode('kanban')}
            className={`p-1.5 rounded-lg transition-all ${viewMode === 'kanban' ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}>
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
        <button onClick={exportCSV} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-card border border-border/30 text-xs font-medium text-muted-foreground hover:bg-muted/50 transition-all">
          <Download className="w-3.5 h-3.5" /> CSV
        </button>
      </div>

      {/* Bulk Actions */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-2 mb-3 p-2 rounded-xl bg-primary/5 border border-primary/20">
            <span className="text-xs font-medium text-foreground mr-2">{selectedIds.size} محدد</span>
            <button onClick={() => bulkUpdateStatus('contacted')} className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-500 text-[10px] font-semibold hover:bg-amber-500/20 transition-colors">
              تم التواصل
            </button>
            <button onClick={() => bulkUpdateStatus('closed')} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 text-[10px] font-semibold hover:bg-emerald-500/20 transition-colors">
              مغلق
            </button>
            <button onClick={() => setSelectedIds(new Set())} className="mr-auto text-[10px] text-muted-foreground hover:text-foreground transition-colors">
              إلغاء التحديد
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Views */}
      <AnimatePresence mode="wait">
        {viewMode === 'kanban' ? (
          <motion.div key="kanban" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['new', 'contacted', 'closed'] as const).map(status => (
              <div key={status} className={`rounded-2xl overflow-hidden border border-border/30 ${STATUS_CONFIG[status].bg}`}>
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/20 bg-card/50">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${STATUS_CONFIG[status].dot}`} />
                    <span className="text-xs font-semibold text-foreground">{STATUS_CONFIG[status].label}</span>
                  </div>
                  <span className="text-[10px] font-medium text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                    {kanbanData[status].length}
                  </span>
                </div>
                <div className="p-2.5 space-y-2 max-h-[500px] overflow-y-auto">
                  {kanbanData[status].length > 0 ? (
                    kanbanData[status].map(req => <KanbanCard key={req.id} req={req} />)
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <div className="w-9 h-9 rounded-xl bg-muted/30 flex items-center justify-center mb-2">
                        <FileText className="w-4 h-4 text-muted-foreground/30" />
                      </div>
                      <p className="text-[10px] text-muted-foreground">لا توجد طلبات</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div key="table" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="bg-card border border-border/30 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/20 bg-muted/20">
                      <th className="text-right px-4 py-2.5 w-10">
                        <input type="checkbox" checked={selectedIds.size === paginatedRequests.length && paginatedRequests.length > 0}
                          onChange={toggleSelectAll}
                          className="w-3.5 h-3.5 rounded border-border/50 text-primary focus:ring-primary/30" />
                      </th>
                      <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">الاسم</th>
                      <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">واتساب</th>
                      <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">الخدمة</th>
                      <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">الأولوية</th>
                      <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">الحالة</th>
                      <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">التاريخ</th>
                      <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider w-20">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/10">
                    {paginatedRequests.map((req) => (
                      <tr key={req.id} className={`hover:bg-muted/15 transition-colors ${selectedIds.has(req.id) ? 'bg-primary/[0.03]' : ''} ${req.status === 'new' ? 'bg-primary/[0.01]' : ''}`}>
                        <td className="px-4 py-2.5">
                          <input type="checkbox" checked={selectedIds.has(req.id)} onChange={() => toggleSelect(req.id)}
                            className="w-3.5 h-3.5 rounded border-border/50 text-primary focus:ring-primary/30" />
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                              <span className="text-[10px] font-bold text-primary">{req.full_name.charAt(0)}</span>
                            </div>
                            <span className="text-xs font-medium text-foreground">{req.full_name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-1">
                            <a href={getWhatsAppLink(req.whatsapp)} target="_blank" rel="noopener noreferrer"
                              className="text-emerald-500 hover:text-emerald-400">
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                            <span className="text-[11px] text-muted-foreground" dir="ltr">{req.whatsapp}</span>
                            <button onClick={() => copyToClipboard(req.whatsapp)} className="text-muted-foreground/40 hover:text-muted-foreground">
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-2.5 text-[11px] text-muted-foreground hidden md:table-cell">{req.service_type}</td>
                        <td className="px-4 py-2.5 hidden lg:table-cell">
                          <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${URGENCY_CONFIG[req.urgency] || URGENCY_CONFIG['عادي']}`}>
                            {req.urgency}
                          </span>
                        </td>
                        <td className="px-4 py-2.5">
                          <button
                            onClick={() => {
                              const next: Record<RequestStatus, RequestStatus> = { new: 'contacted', contacted: 'closed', closed: 'new' };
                              updateStatus(req.id, next[req.status]);
                            }}
                            className={`inline-flex items-center gap-1 text-[9px] font-semibold px-2 py-0.5 rounded-full border transition-all hover:opacity-80 ${STATUS_CONFIG[req.status].cls}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[req.status].dot}`} />
                            {STATUS_CONFIG[req.status].label}
                          </button>
                        </td>
                        <td className="px-4 py-2.5 text-[10px] text-muted-foreground hidden sm:table-cell">
                          {new Date(req.created_at).toLocaleDateString('ar-EG')}
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-0.5">
                            <button onClick={() => setSelectedRequest(req)} className="p-1 rounded-lg text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all">
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            {userRole === 'admin' && (
                              <button onClick={() => deleteRequest(req.id)} className="p-1 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredRequests.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-12 h-12 rounded-xl bg-muted/30 flex items-center justify-center mb-2">
                      <FileText className="w-6 h-6 text-muted-foreground/30" />
                    </div>
                    <p className="text-xs font-medium text-muted-foreground">لا توجد طلبات مطابقة</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-0.5">جرّب تغيير معايير البحث</p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-2.5 border-t border-border/20">
                  <span className="text-[10px] text-muted-foreground">
                    عرض {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredRequests.length)} من {filteredRequests.length}
                  </span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                      className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted/50 disabled:opacity-30 transition-all">
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = currentPage <= 3 ? i + 1 : currentPage + i - 2;
                      if (page > totalPages || page < 1) return null;
                      return (
                        <button key={page} onClick={() => setCurrentPage(page)}
                          className={`w-7 h-7 rounded-lg text-[10px] font-medium transition-all ${
                            page === currentPage ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted/50'
                          }`}>{page}</button>
                      );
                    })}
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                      className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted/50 disabled:opacity-30 transition-all">
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setSelectedRequest(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-card border border-border/30 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-border/20">
                <h3 className="text-sm font-semibold text-foreground">تفاصيل الطلب</h3>
                <button onClick={() => setSelectedRequest(null)} className="p-1 rounded-lg hover:bg-muted/50 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="text-base font-bold text-primary">{selectedRequest.full_name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{selectedRequest.full_name}</p>
                    <p className="text-[11px] text-muted-foreground">{selectedRequest.service_type}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-muted/20 rounded-xl p-3">
                    <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-1">واتساب</p>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium" dir="ltr">{selectedRequest.whatsapp}</span>
                      <button onClick={() => copyToClipboard(selectedRequest.whatsapp)} className="text-muted-foreground hover:text-foreground">
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <div className="bg-muted/20 rounded-xl p-3">
                    <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-1">الأولوية</p>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${URGENCY_CONFIG[selectedRequest.urgency] || URGENCY_CONFIG['عادي']}`}>
                      {selectedRequest.urgency}
                    </span>
                  </div>
                  <div className="bg-muted/20 rounded-xl p-3">
                    <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-1">الحالة</p>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${STATUS_CONFIG[selectedRequest.status].cls}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[selectedRequest.status].dot}`} />
                      {STATUS_CONFIG[selectedRequest.status].label}
                    </span>
                  </div>
                  <div className="bg-muted/20 rounded-xl p-3">
                    <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-1">التاريخ</p>
                    <span className="text-xs font-medium">{new Date(selectedRequest.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>

                {selectedRequest.details && (
                  <div className="bg-muted/20 rounded-xl p-3">
                    <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-1">التفاصيل</p>
                    <p className="text-xs text-foreground leading-relaxed">{selectedRequest.details}</p>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-1">
                  <a href={getWhatsAppLink(selectedRequest.whatsapp)} target="_blank" rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl py-2 text-xs font-medium transition-colors">
                    <MessageCircle className="w-3.5 h-3.5" />
                    واتساب
                  </a>
                  <select value={selectedRequest.status}
                    onChange={(e) => {
                      updateStatus(selectedRequest.id, e.target.value as RequestStatus);
                      setSelectedRequest({ ...selectedRequest, status: e.target.value as RequestStatus });
                    }}
                    className="flex-1 bg-card border border-border/30 rounded-xl py-2 px-3 text-xs text-center">
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
