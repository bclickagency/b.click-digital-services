import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Download, Trash2, Search, Mail, Users, Filter } from 'lucide-react';

interface Subscriber {
  id: string;
  email: string;
  is_active: boolean;
  source: string | null;
  interests: string[] | null;
  created_at: string;
}

const INTEREST_LABELS: Record<string, string> = {
  all: 'الكل',
  portfolio: 'أعمالنا',
  blog: 'المدونة',
  careers: 'الوظائف',
};

const NewsletterManager = () => {
  const { toast } = useToast();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterInterest, setFilterInterest] = useState<string>('all');

  useEffect(() => { fetchSubscribers(); }, []);

  const fetchSubscribers = async () => {
    const { data } = await supabase.from('newsletter_subscribers').select('*').order('created_at', { ascending: false });
    if (data) setSubscribers(data as Subscriber[]);
    setLoading(false);
  };

  const filtered = subscribers.filter(s => {
    const matchesSearch = !search || s.email.toLowerCase().includes(search.toLowerCase());
    const matchesInterest = filterInterest === 'all' || (s.interests && s.interests.includes(filterInterest));
    return matchesSearch && matchesInterest;
  });

  const exportCSV = () => {
    const headers = 'Email,Active,Interests,Source,Date\n';
    const rows = filtered.map(s =>
      `${s.email},${s.is_active},${(s.interests || []).join(';')},${s.source || ''},${new Date(s.created_at).toLocaleDateString('ar-EG')}`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter_subscribers_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'تم التصدير', description: `${filtered.length} مشترك` });
  };

  if (loading) return <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  const activeCount = subscribers.filter(s => s.is_active).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-xl font-bold text-foreground">إدارة النشرة البريدية</h2>
        <button onClick={exportCSV} className="btn-ghost text-xs flex items-center gap-1.5">
          <Download className="w-3.5 h-3.5" /> تصدير CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card text-center py-4">
          <Users className="w-5 h-5 text-primary mx-auto mb-1" />
          <p className="text-2xl font-bold text-foreground">{subscribers.length}</p>
          <p className="text-xs text-muted-foreground">إجمالي المشتركين</p>
        </div>
        <div className="glass-card text-center py-4">
          <Mail className="w-5 h-5 text-[hsl(142_70%_45%)] mx-auto mb-1" />
          <p className="text-2xl font-bold text-foreground">{activeCount}</p>
          <p className="text-xs text-muted-foreground">مشترك نشط</p>
        </div>
        <div className="glass-card text-center py-4">
          <p className="text-2xl font-bold text-foreground">{subscribers.filter(s => s.interests?.includes('blog')).length}</p>
          <p className="text-xs text-muted-foreground">مهتم بالمدونة</p>
        </div>
        <div className="glass-card text-center py-4">
          <p className="text-2xl font-bold text-foreground">{subscribers.filter(s => s.interests?.includes('portfolio')).length}</p>
          <p className="text-xs text-muted-foreground">مهتم بالأعمال</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث بالبريد الإلكتروني..." className="w-full pr-10 px-3 py-2 rounded-lg bg-muted/50 border border-border/50 text-sm" />
        </div>
        <div className="flex gap-1.5">
          {Object.entries(INTEREST_LABELS).map(([key, label]) => (
            <button key={key} onClick={() => setFilterInterest(key)} className={`px-3 py-2 rounded-lg text-xs font-medium ${filterInterest === key ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-muted-foreground'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Note about bulk emails */}
      <div className="glass-card bg-primary/5 border-primary/20">
        <p className="text-xs text-muted-foreground">
          💡 لإرسال حملات بريدية جماعية، يُنصح باستخدام خدمة بريد تسويقي متخصصة. يمكنك تصدير قائمة المشتركين كملف CSV واستيرادها.
        </p>
      </div>

      {/* Table */}
      <div className="glass-card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/20">
                <th className="text-right p-3 text-xs font-medium text-muted-foreground">البريد</th>
                <th className="text-right p-3 text-xs font-medium text-muted-foreground">الاهتمامات</th>
                <th className="text-right p-3 text-xs font-medium text-muted-foreground">المصدر</th>
                <th className="text-right p-3 text-xs font-medium text-muted-foreground">التاريخ</th>
                <th className="text-right p-3 text-xs font-medium text-muted-foreground">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} className="border-b border-border/10 hover:bg-muted/20">
                  <td className="p-3 text-foreground" dir="ltr">{s.email}</td>
                  <td className="p-3">
                    <div className="flex gap-1 flex-wrap">
                      {(s.interests || ['all']).map(i => (
                        <span key={i} className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px]">{INTEREST_LABELS[i] || i}</span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3 text-muted-foreground text-xs">{s.source || '-'}</td>
                  <td className="p-3 text-muted-foreground text-xs">{new Date(s.created_at).toLocaleDateString('ar-EG')}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${s.is_active ? 'bg-[hsl(142_70%_45%/0.1)] text-[hsl(142_70%_45%)]' : 'bg-destructive/10 text-destructive'}`}>
                      {s.is_active ? 'نشط' : 'غير نشط'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="text-center py-8 text-muted-foreground text-sm">لا يوجد مشتركين</div>}
      </div>
    </div>
  );
};

export default NewsletterManager;
