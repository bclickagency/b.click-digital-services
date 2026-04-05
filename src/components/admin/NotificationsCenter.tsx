import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, CheckCircle2, Check, Trash2, Search, Filter,
  Loader2, FileText, MessageCircle, Briefcase, AlertCircle,
  Info, ChevronLeft, ChevronRight, CheckCheck, X
} from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  content: string | null;
  type: string;
  is_read: boolean;
  link: string | null;
  created_at: string;
  user_id: string;
}

const TYPE_CONFIG: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  request: { icon: FileText, color: 'text-primary', bg: 'bg-primary/10' },
  message: { icon: MessageCircle, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  project: { icon: Briefcase, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  warning: { icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  info: { icon: Info, color: 'text-muted-foreground', bg: 'bg-muted/50' },
};

const ITEMS_PER_PAGE = 20;

const NotificationsCenter = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchNotifications();
    const channel = supabase.channel('notifications-rt')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, (payload) => {
        setNotifications(prev => [payload.new as Notification, ...prev]);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchNotifications = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from('notifications').select('*')
      .eq('user_id', user.id).order('created_at', { ascending: false });
    if (data) setNotifications(data);
    setLoading(false);
  };

  const markAsRead = async (id: string) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const markAllRead = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
    if (unreadIds.length === 0) return;
    for (const id of unreadIds) {
      await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    }
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    toast({ title: 'تم التحديث', description: 'تم تعليم جميع الإشعارات كمقروءة' });
  };

  const filtered = useMemo(() => {
    return notifications.filter(n => {
      const matchesFilter = filter === 'all' || (filter === 'unread' ? !n.is_read : n.is_read);
      const matchesType = typeFilter === 'all' || n.type === typeFilter;
      const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (n.content || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesType && matchesSearch;
    });
  }, [notifications, filter, typeFilter, searchQuery]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const formatTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'الآن';
    if (mins < 60) return `منذ ${mins} دقيقة`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `منذ ${hours} ساعة`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `منذ ${days} يوم`;
    return new Date(dateStr).toLocaleDateString('ar-EG');
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>;

  return (
    <div className="space-y-5">
      {/* Header Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card border border-border/30 rounded-xl p-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-primary/10 text-primary">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{notifications.length}</p>
              <p className="text-[10px] text-muted-foreground">إجمالي الإشعارات</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border/30 rounded-xl p-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-amber-500/10 text-amber-500">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{unreadCount}</p>
              <p className="text-[10px] text-muted-foreground">غير مقروء</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border/30 rounded-xl p-3 flex items-center justify-center">
          <button onClick={markAllRead} disabled={unreadCount === 0}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 disabled:opacity-40 transition-all">
            <CheckCheck className="w-3.5 h-3.5" /> تعليم الكل كمقروء
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder="بحث في الإشعارات..."
            className="w-full pr-10 pl-4 py-2 rounded-xl bg-card border border-border/30 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        <div className="flex items-center p-0.5 rounded-xl bg-card border border-border/30">
          {(['all', 'unread', 'read'] as const).map(f => (
            <button key={f} onClick={() => { setFilter(f); setCurrentPage(1); }}
              className={`px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-all ${
                filter === f ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}>
              {f === 'all' ? 'الكل' : f === 'unread' ? 'غير مقروء' : 'مقروء'}
            </button>
          ))}
        </div>
        <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setCurrentPage(1); }}
          className="px-3 py-2 rounded-xl bg-card border border-border/30 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
          <option value="all">كل الأنواع</option>
          {Object.entries(TYPE_CONFIG).map(([k, v]) => <option key={k} value={k}>{k}</option>)}
        </select>
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        <AnimatePresence>
          {paginated.map(notification => {
            const config = TYPE_CONFIG[notification.type] || TYPE_CONFIG.info;
            return (
              <motion.div key={notification.id} layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className={`bg-card border rounded-xl p-3 flex items-start gap-3 transition-all hover:border-primary/20 cursor-pointer ${
                  notification.is_read ? 'border-border/30' : 'border-primary/20 bg-primary/[0.02]'
                }`}
                onClick={() => markAsRead(notification.id)}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${config.bg}`}>
                  <config.icon className={`w-4 h-4 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h4 className={`text-xs font-medium ${notification.is_read ? 'text-muted-foreground' : 'text-foreground'}`}>
                        {notification.title}
                      </h4>
                      {notification.content && (
                        <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{notification.content}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-[9px] text-muted-foreground whitespace-nowrap">{formatTimeAgo(notification.created_at)}</span>
                      {!notification.is_read && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <Bell className="w-8 h-8 text-muted-foreground/20 mb-2" />
            <p className="text-xs text-muted-foreground">لا توجد إشعارات</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground">{filtered.length} إشعار</span>
          <div className="flex items-center gap-1">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
              className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted/50 disabled:opacity-30">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] text-muted-foreground">{currentPage}/{totalPages}</span>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted/50 disabled:opacity-30">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsCenter;
