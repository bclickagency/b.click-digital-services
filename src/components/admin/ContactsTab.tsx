import { useState, useMemo } from 'react';
import { Search, Trash2, Download, Mail, Eye, X, MessageCircle, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  const [dateFilter, setDateFilter] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredContacts = useMemo(() => {
    return contacts.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.subject.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
      const matchesDate = !dateFilter || c.created_at.startsWith(dateFilter);
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [contacts, searchQuery, statusFilter, dateFilter]);

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
      toast({ title: 'تم الحذف', description: 'تم حذف الرسالة بنجاح' });
    }
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

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'إجمالي الرسائل', value: stats.total, icon: Mail, color: 'bg-primary/10 text-primary' },
          { label: 'رسائل جديدة', value: stats.newCount, icon: Clock, color: 'bg-amber-500/10 text-amber-500' },
          { label: 'مصادر مختلفة', value: stats.sources, icon: MessageCircle, color: 'bg-emerald-500/10 text-emerald-500' },
        ].map(stat => (
          <div key={stat.label} className="bg-card border border-border/50 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder="بحث بالاسم أو البريد أو الموضوع..."
            className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-card border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
          className="px-3 py-2.5 rounded-xl bg-card border border-border/50 text-sm">
          <option value="all">كل الحالات</option>
          <option value="new">جديد</option>
          <option value="read">مقروء</option>
        </select>
        <input type="date" value={dateFilter} onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
          className="px-3 py-2.5 rounded-xl bg-card border border-border/50 text-sm" />
        <button onClick={exportCSV} className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-card border border-border/50 text-xs font-medium text-muted-foreground hover:bg-muted/50 transition-all">
          <Download className="w-3.5 h-3.5" /> تصدير
        </button>
      </div>

      {/* Table */}
      <div className="bg-card border border-border/50 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/30">
                <th className="text-right px-5 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">المرسل</th>
                <th className="text-right px-5 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">الموضوع</th>
                <th className="text-right px-5 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">المصدر</th>
                <th className="text-right px-5 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">التاريخ</th>
                <th className="text-right px-5 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {paginatedContacts.map((msg) => (
                <tr key={msg.id} className={`hover:bg-muted/30 transition-colors ${msg.status === 'new' ? 'bg-primary/[0.02]' : ''}`}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-primary">{msg.name.charAt(0)}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{msg.name}</p>
                        <p className="text-[11px] text-muted-foreground truncate" dir="ltr">{msg.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-muted-foreground truncate max-w-[200px]">{msg.subject}</td>
                  <td className="px-5 py-3">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {msg.lead_source || 'direct'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">{new Date(msg.created_at).toLocaleDateString('ar-EG')}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setSelectedMessage(msg)} className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all" title="عرض">
                        <Eye className="w-4 h-4" />
                      </button>
                      {userRole === 'admin' && (
                        <button onClick={() => deleteContact(msg.id)} className="p-1.5 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all" title="حذف">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredContacts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-3">
                <Mail className="w-8 h-8 text-muted-foreground/30" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">لا توجد رسائل مطابقة</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-border/30">
            <span className="text-xs text-muted-foreground">صفحة {currentPage} من {totalPages}</span>
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

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setSelectedMessage(null)} />
          <div className="relative bg-card border border-border/50 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
              <h3 className="text-base font-semibold text-foreground">تفاصيل الرسالة</h3>
              <button onClick={() => setSelectedMessage(null)} className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">{selectedMessage.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{selectedMessage.name}</p>
                  <p className="text-sm text-muted-foreground" dir="ltr">{selectedMessage.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/30 rounded-xl p-3">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">الموضوع</p>
                  <p className="text-sm font-medium">{selectedMessage.subject}</p>
                </div>
                <div className="bg-muted/30 rounded-xl p-3">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">المصدر</p>
                  <p className="text-sm font-medium">{selectedMessage.lead_source || 'direct'}</p>
                </div>
                {selectedMessage.phone && (
                  <div className="bg-muted/30 rounded-xl p-3">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">الهاتف</p>
                    <p className="text-sm font-medium" dir="ltr">{selectedMessage.phone}</p>
                  </div>
                )}
                <div className="bg-muted/30 rounded-xl p-3">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">التاريخ</p>
                  <p className="text-sm font-medium">{new Date(selectedMessage.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>

              <div className="bg-muted/30 rounded-xl p-4">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">الرسالة</p>
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>

              <a href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl py-2.5 text-sm font-medium transition-colors">
                <Mail className="w-4 h-4" /> الرد عبر البريد
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactsTab;
