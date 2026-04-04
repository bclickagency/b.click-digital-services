import { useState, useMemo } from 'react';
import { Search, Trash2, Download, Mail, Eye, X, MessageCircle, Clock, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

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

interface ContactsTabProps {
  contacts: ContactMessage[];
  setContacts: React.Dispatch<React.SetStateAction<ContactMessage[]>>;
  userRole: string | null;
}

const ITEMS_PER_PAGE = 15;

const ContactsTab = ({ contacts, setContacts, userRole }: ContactsTabProps) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filteredContacts = useMemo(() => {
    return contacts.filter(c => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.subject.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [contacts, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredContacts.length / ITEMS_PER_PAGE);
  const paginatedContacts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredContacts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredContacts, currentPage]);

  const stats = useMemo(() => ({
    total: contacts.length,
    newCount: contacts.filter(c => c.status === 'new').length,
    sources: [...new Set(contacts.map(c => c.lead_source || 'direct'))].length,
  }), [contacts]);

  const deleteContact = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الرسالة؟')) return;
    const { error } = await supabase.from('contact_messages').delete().eq('id', id);
    if (!error) {
      setContacts(prev => prev.filter(c => c.id !== id));
      toast({ title: 'تم الحذف', description: 'تم حذف الرسالة' });
    }
  };

  const bulkDelete = async () => {
    if (!confirm(`هل تريد حذف ${selectedIds.size} رسالة؟`)) return;
    for (const id of selectedIds) {
      await supabase.from('contact_messages').delete().eq('id', id);
    }
    setContacts(prev => prev.filter(c => !selectedIds.has(c.id)));
    setSelectedIds(new Set());
    toast({ title: 'تم الحذف', description: `تم حذف ${selectedIds.size} رسالة` });
  };

  const exportCSV = () => {
    const headers = ['الاسم', 'البريد', 'الهاتف', 'الموضوع', 'الرسالة', 'المصدر', 'التاريخ'];
    const rows = filteredContacts.map(c => [c.name, c.email, c.phone || '', c.subject, c.message, c.lead_source || 'direct', new Date(c.created_at).toLocaleDateString('ar-EG')]);
    const csv = '\uFEFF' + [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `contacts-${new Date().toISOString().split('T')[0]}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const toggleSelectAll = () => {
    setSelectedIds(prev => prev.size === paginatedContacts.length ? new Set() : new Set(paginatedContacts.map(c => c.id)));
  };

  const formatTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `منذ ${mins || 1} دقيقة`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `منذ ${hours} ساعة`;
    return new Date(dateStr).toLocaleDateString('ar-EG');
  };

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'إجمالي الرسائل', value: stats.total, icon: Mail, color: 'bg-primary/10 text-primary' },
          { label: 'رسائل جديدة', value: stats.newCount, icon: Clock, color: 'bg-amber-500/10 text-amber-500' },
          { label: 'مصادر', value: stats.sources, icon: MessageCircle, color: 'bg-emerald-500/10 text-emerald-500' },
        ].map(stat => (
          <div key={stat.label} className="bg-card border border-border/30 rounded-xl p-3">
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder="بحث بالاسم أو البريد أو الموضوع..."
            className="w-full pr-10 pl-4 py-2 rounded-xl bg-card border border-border/30 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
        </div>
        <div className="flex items-center gap-1 p-0.5 rounded-xl bg-card border border-border/30">
          {(['all', 'new', 'read'] as const).map(s => (
            <button key={s} onClick={() => { setStatusFilter(s); setCurrentPage(1); }}
              className={`px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-all ${
                statusFilter === s ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}>
              {s === 'all' ? 'الكل' : s === 'new' ? 'جديد' : 'مقروء'}
            </button>
          ))}
        </div>
        <button onClick={exportCSV} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-card border border-border/30 text-xs font-medium text-muted-foreground hover:bg-muted/50 transition-all">
          <Download className="w-3.5 h-3.5" /> تصدير
        </button>
      </div>

      {/* Bulk Actions */}
      <AnimatePresence>
        {selectedIds.size > 0 && userRole === 'admin' && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            className="flex items-center gap-2 p-2 rounded-xl bg-destructive/5 border border-destructive/20">
            <span className="text-xs font-medium text-foreground mr-2">{selectedIds.size} محدد</span>
            <button onClick={bulkDelete} className="px-2.5 py-1 rounded-lg bg-destructive/10 text-destructive text-[10px] font-semibold hover:bg-destructive/20 transition-colors">
              حذف المحدد
            </button>
            <button onClick={() => setSelectedIds(new Set())} className="mr-auto text-[10px] text-muted-foreground hover:text-foreground transition-colors">
              إلغاء
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="bg-card border border-border/30 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/20 bg-muted/20">
                <th className="text-right px-4 py-2.5 w-10">
                  <input type="checkbox" checked={selectedIds.size === paginatedContacts.length && paginatedContacts.length > 0}
                    onChange={toggleSelectAll} className="w-3.5 h-3.5 rounded border-border/50 text-primary focus:ring-primary/30" />
                </th>
                <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">المرسل</th>
                <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">الموضوع</th>
                <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">المصدر</th>
                <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">التاريخ</th>
                <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider w-20">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10">
              {paginatedContacts.map((msg) => (
                <tr key={msg.id} className={`hover:bg-muted/15 transition-colors ${msg.status === 'new' ? 'bg-primary/[0.01]' : ''} ${selectedIds.has(msg.id) ? 'bg-primary/[0.03]' : ''}`}>
                  <td className="px-4 py-2.5">
                    <input type="checkbox" checked={selectedIds.has(msg.id)} onChange={() => toggleSelect(msg.id)}
                      className="w-3.5 h-3.5 rounded border-border/50 text-primary focus:ring-primary/30" />
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-primary">{msg.name.charAt(0)}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{msg.name}</p>
                        <p className="text-[10px] text-muted-foreground truncate" dir="ltr">{msg.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-[11px] text-muted-foreground truncate max-w-[180px] hidden md:table-cell">{msg.subject}</td>
                  <td className="px-4 py-2.5 hidden lg:table-cell">
                    <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {msg.lead_source || 'direct'}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-[10px] text-muted-foreground hidden sm:table-cell">{formatTimeAgo(msg.created_at)}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-0.5">
                      <button onClick={() => setSelectedMessage(msg)} className="p-1 rounded-lg text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      {userRole === 'admin' && (
                        <button onClick={() => deleteContact(msg.id)} className="p-1 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredContacts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 rounded-xl bg-muted/30 flex items-center justify-center mb-2">
                <Mail className="w-6 h-6 text-muted-foreground/30" />
              </div>
              <p className="text-xs font-medium text-muted-foreground">لا توجد رسائل مطابقة</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-border/20">
            <span className="text-[10px] text-muted-foreground">
              عرض {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredContacts.length)} من {filteredContacts.length}
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

      {/* Message Detail Modal */}
      <AnimatePresence>
        {selectedMessage && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setSelectedMessage(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-card border border-border/30 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-border/20">
                <h3 className="text-sm font-semibold text-foreground">تفاصيل الرسالة</h3>
                <button onClick={() => setSelectedMessage(null)} className="p-1 rounded-lg hover:bg-muted/50 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="text-base font-bold text-primary">{selectedMessage.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{selectedMessage.name}</p>
                    <p className="text-[11px] text-muted-foreground" dir="ltr">{selectedMessage.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-muted/20 rounded-xl p-3">
                    <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-1">الموضوع</p>
                    <p className="text-xs font-medium">{selectedMessage.subject}</p>
                  </div>
                  <div className="bg-muted/20 rounded-xl p-3">
                    <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-1">المصدر</p>
                    <p className="text-xs font-medium">{selectedMessage.lead_source || 'direct'}</p>
                  </div>
                  {selectedMessage.phone && (
                    <div className="bg-muted/20 rounded-xl p-3">
                      <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-1">الهاتف</p>
                      <p className="text-xs font-medium" dir="ltr">{selectedMessage.phone}</p>
                    </div>
                  )}
                  <div className="bg-muted/20 rounded-xl p-3">
                    <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-1">التاريخ</p>
                    <p className="text-xs font-medium">{new Date(selectedMessage.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                  </div>
                </div>

                <div className="bg-muted/20 rounded-xl p-3">
                  <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-1.5">الرسالة</p>
                  <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>

                <a href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                  className="flex items-center justify-center gap-1.5 w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl py-2 text-xs font-medium transition-colors">
                  <Mail className="w-3.5 h-3.5" /> الرد عبر البريد
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContactsTab;
