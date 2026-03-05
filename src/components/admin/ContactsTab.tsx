import { useState, useMemo } from 'react';
import { Search, Trash2, Download } from 'lucide-react';
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

const ContactsTab = ({ contacts, setContacts, userRole }: ContactsTabProps) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

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

  const deleteContact = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الرسالة؟')) return;
    const { error } = await supabase.from('contact_messages').delete().eq('id', id);
    if (!error) {
      setContacts(prev => prev.filter(c => c.id !== id));
      toast({ title: 'تم الحذف', description: 'تم حذف الرسالة بنجاح' });
    }
  };

  const exportCSV = () => {
    const headers = ['الاسم', 'البريد', 'الموضوع', 'الرسالة', 'المصدر', 'التاريخ'];
    const rows = filteredContacts.map(c => [c.name, c.email, c.subject, c.message, c.lead_source || 'direct', new Date(c.created_at).toLocaleDateString('ar-EG')]);
    const csv = '\uFEFF' + [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `contacts-${new Date().toISOString().split('T')[0]}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="glass-card p-0 overflow-hidden">
      <div className="p-4 border-b border-border flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold">رسائل التواصل</h2>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث..."
              className="pr-10 pl-4 py-2 rounded-xl bg-muted/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-48"
            />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-muted/50 border border-border/50 text-sm">
            <option value="all">كل الحالات</option>
            <option value="new">جديد</option>
            <option value="read">مقروء</option>
          </select>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-muted/50 border border-border/50 text-sm"
          />
          <button onClick={exportCSV} className="btn-ghost text-sm py-2 px-3">
            <Download className="w-4 h-4" /> تصدير
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/30">
            <tr>
              <th className="text-right p-4 text-sm font-medium">الاسم</th>
              <th className="text-right p-4 text-sm font-medium">البريد</th>
              <th className="text-right p-4 text-sm font-medium">الموضوع</th>
              <th className="text-right p-4 text-sm font-medium">المصدر</th>
              <th className="text-right p-4 text-sm font-medium">التاريخ</th>
              {userRole === 'admin' && <th className="text-right p-4 text-sm font-medium">إجراءات</th>}
            </tr>
          </thead>
          <tbody>
            {filteredContacts.map((msg) => (
              <tr key={msg.id} className="table-row">
                <td className="p-4 font-medium">{msg.name}</td>
                <td className="p-4 text-sm" dir="ltr">{msg.email}</td>
                <td className="p-4 text-sm">{msg.subject}</td>
                <td className="p-4 text-sm text-muted-foreground">{msg.lead_source || 'direct'}</td>
                <td className="p-4 text-sm text-muted-foreground">{new Date(msg.created_at).toLocaleDateString('ar-EG')}</td>
                {userRole === 'admin' && (
                  <td className="p-4">
                    <button onClick={() => deleteContact(msg.id)} className="text-destructive hover:text-destructive/80">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {filteredContacts.length === 0 && <div className="text-center py-12 text-muted-foreground">لا توجد رسائل مطابقة</div>}
      </div>
    </div>
  );
};

export default ContactsTab;
