import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FolderOpen, MessageCircle, User, Settings, LogOut,
  Menu, X, Bell, ChevronLeft, ChevronRight, Plus, Clock, CheckCircle2,
  Loader2, Send, Paperclip, FileText, Download, ArrowLeft,
  Briefcase, Activity, ExternalLink
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import SEO from '@/components/SEO';

type ClientTab = 'overview' | 'projects' | 'messages' | 'profile';

interface Project {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  service_type: string | null;
  progress: number;
  start_date: string | null;
  end_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface ClientMessage {
  id: string;
  project_id: string | null;
  sender_id: string;
  content: string | null;
  file_url: string | null;
  file_name: string | null;
  file_size: number | null;
  is_read: boolean;
  created_at: string;
}

interface Notification {
  id: string;
  type: string;
  title: string;
  content: string | null;
  is_read: boolean;
  link: string | null;
  created_at: string;
}

const STATUS_MAP: Record<string, { label: string; cls: string; icon: typeof Clock }> = {
  pending: { label: 'قيد الانتظار', cls: 'bg-amber-500/15 text-amber-500', icon: Clock },
  in_progress: { label: 'جاري العمل', cls: 'bg-primary/15 text-primary', icon: Loader2 },
  review: { label: 'مراجعة', cls: 'bg-blue-500/15 text-blue-500', icon: Activity },
  completed: { label: 'مكتمل', cls: 'bg-emerald-500/15 text-emerald-500', icon: CheckCircle2 },
  cancelled: { label: 'ملغي', cls: 'bg-destructive/15 text-destructive', icon: X },
};

const PRIORITY_MAP: Record<string, string> = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-amber-500/15 text-amber-500',
  high: 'bg-destructive/15 text-destructive',
  urgent: 'bg-red-600/15 text-red-600',
};

const ClientPortal = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile, role, loading: authLoading, signOut, updateProfile, isClient } = useAuth();
  const [activeTab, setActiveTab] = useState<ClientTab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<ClientMessage[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageInput, setMessageInput] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    full_name: '', phone: '', company_name: '', bio: '',
  });

  // Auth check
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
    if (!authLoading && user && !isClient) {
      navigate('/dashboard');
    }
  }, [authLoading, user, isClient, navigate]);

  // Load data
  useEffect(() => {
    if (!user) return;
    const loadData = async () => {
      setLoading(true);
      const [projectsRes, msgsRes, notifsRes] = await Promise.all([
        supabase.from('client_projects').select('*').eq('client_id', user.id).order('created_at', { ascending: false }),
        supabase.from('client_messages').select('*').or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`).order('created_at', { ascending: true }),
        supabase.from('notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(20),
      ]);
      if (projectsRes.data) setProjects(projectsRes.data as Project[]);
      if (msgsRes.data) setMessages(msgsRes.data as ClientMessage[]);
      if (notifsRes.data) setNotifications(notifsRes.data as Notification[]);
      setLoading(false);
    };
    loadData();
  }, [user]);

  // Realtime subscriptions
  useEffect(() => {
    if (!user) return;
    const msgChannel = supabase
      .channel('client-messages-rt')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'client_messages', filter: `receiver_id=eq.${user.id}` }, (payload) => {
        setMessages(prev => [...prev, payload.new as ClientMessage]);
      })
      .subscribe();

    const notifChannel = supabase
      .channel('client-notifs-rt')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` }, (payload) => {
        setNotifications(prev => [payload.new as Notification, ...prev]);
        toast({ title: (payload.new as Notification).title, description: (payload.new as Notification).content || '' });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(msgChannel);
      supabase.removeChannel(notifChannel);
    };
  }, [user, toast]);

  // Profile form sync
  useEffect(() => {
    if (profile) {
      setProfileForm({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        company_name: profile.company_name || '',
        bio: profile.bio || '',
      });
    }
  }, [profile]);

  const unreadNotifs = useMemo(() => notifications.filter(n => !n.is_read).length, [notifications]);

  const projectStats = useMemo(() => ({
    total: projects.length,
    active: projects.filter(p => p.status === 'in_progress').length,
    completed: projects.filter(p => p.status === 'completed').length,
    pending: projects.filter(p => p.status === 'pending').length,
  }), [projects]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !user) return;
    setSendingMessage(true);
    try {
      const { data, error } = await supabase.from('client_messages').insert({
        sender_id: user.id,
        content: messageInput.trim(),
        project_id: selectedProject?.id || null,
      }).select().single();
      if (error) throw error;
      setMessages(prev => [...prev, data as ClientMessage]);
      setMessageInput('');
    } catch (error: any) {
      toast({ title: 'خطأ', description: 'حدث خطأ أثناء إرسال الرسالة', variant: 'destructive' });
    } finally {
      setSendingMessage(false);
    }
  };

  const handleProfileSave = async () => {
    const { error } = await updateProfile(profileForm as any);
    if (error) {
      toast({ title: 'خطأ', description: 'حدث خطأ أثناء حفظ البيانات', variant: 'destructive' });
    } else {
      toast({ title: 'تم الحفظ', description: 'تم تحديث بياناتك بنجاح' });
      setEditingProfile(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" dir="rtl">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center animate-pulse">
            <span className="text-primary-foreground font-black text-sm">B</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview' as ClientTab, label: 'نظرة عامة', icon: LayoutDashboard },
    { id: 'projects' as ClientTab, label: 'مشاريعي', icon: FolderOpen, badge: projectStats.active },
    { id: 'messages' as ClientTab, label: 'الرسائل', icon: MessageCircle },
    { id: 'profile' as ClientTab, label: 'الملف الشخصي', icon: User },
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <SEO title="بوابة العميل | B.CLICK" description="إدارة مشاريعك مع B.CLICK" />

      {/* Mobile backdrop */}
      {sidebarOpen && <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={cn(
        'fixed top-0 right-0 bottom-0 z-50 w-64 flex flex-col bg-background border-l border-border/50 transition-transform duration-300',
        'lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
      )}>
        <div className="flex items-center gap-3 px-5 h-16 border-b border-border/50">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-black text-sm">B</span>
            </div>
            <span className="text-lg font-bold text-foreground">B<span className="text-primary">.</span>CLICK</span>
          </Link>
        </div>

        {/* User Info */}
        <div className="px-5 py-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-bold text-primary">
                {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || '?'}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground truncate">{profile?.full_name || 'عميل'}</p>
              <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              )}>
              <tab.icon className="w-[18px] h-[18px] shrink-0" />
              <span className="flex-1 text-right">{tab.label}</span>
              {tab.badge && tab.badge > 0 && (
                <span className="bg-destructive text-destructive-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="border-t border-border/50 p-3">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all">
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:mr-64 min-h-screen transition-all duration-300">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 lg:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-muted/50 transition-colors">
              <Menu className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="text-lg font-semibold text-foreground">
              {tabs.find(t => t.id === activeTab)?.label}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-xl hover:bg-muted/50 transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              {unreadNotifs > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-destructive text-destructive-foreground text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {unreadNotifs}
                </span>
              )}
            </button>
          </div>
        </header>

        <main className="p-4 lg:p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Welcome */}
              <div className="bg-card border border-border/50 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-foreground">مرحباً، {profile?.full_name || 'عميل'} 👋</h2>
                <p className="text-sm text-muted-foreground mt-1">إليك ملخص مشاريعك ونشاطك مع B.CLICK</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'إجمالي المشاريع', value: projectStats.total, icon: Briefcase, color: 'primary' },
                  { label: 'مشاريع نشطة', value: projectStats.active, icon: Activity, color: 'info' },
                  { label: 'قيد الانتظار', value: projectStats.pending, icon: Clock, color: 'warning' },
                  { label: 'مكتملة', value: projectStats.completed, icon: CheckCircle2, color: 'success' },
                ].map(stat => {
                  const colorMap: Record<string, string> = {
                    primary: 'bg-primary/10 text-primary',
                    info: 'bg-blue-500/10 text-blue-500',
                    warning: 'bg-amber-500/10 text-amber-500',
                    success: 'bg-emerald-500/10 text-emerald-500',
                  };
                  return (
                    <div key={stat.label} className="bg-card border border-border/50 rounded-2xl p-4 hover:border-border transition-colors">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${colorMap[stat.color]}`}>
                        <stat.icon className="w-5 h-5" />
                      </div>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                    </div>
                  );
                })}
              </div>

              {/* Recent Projects */}
              <div className="bg-card border border-border/50 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 border-b border-border/50">
                  <h3 className="text-sm font-semibold">آخر المشاريع</h3>
                  <button onClick={() => setActiveTab('projects')} className="text-xs text-primary hover:underline flex items-center gap-1">
                    عرض الكل <ArrowLeft className="w-3 h-3" />
                  </button>
                </div>
                {projects.length > 0 ? (
                  <div className="divide-y divide-border/30">
                    {projects.slice(0, 5).map(project => {
                      const status = STATUS_MAP[project.status] || STATUS_MAP.pending;
                      return (
                        <div key={project.id} className="flex items-center justify-between px-5 py-3 hover:bg-muted/30 transition-colors">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                              <FolderOpen className="w-4 h-4 text-primary" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">{project.title}</p>
                              <p className="text-[11px] text-muted-foreground">{project.service_type || 'مشروع'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            {/* Progress bar */}
                            <div className="hidden sm:flex items-center gap-2">
                              <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${project.progress}%` }} />
                              </div>
                              <span className="text-[10px] text-muted-foreground w-8">{project.progress}%</span>
                            </div>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${status.cls}`}>{status.label}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <FolderOpen className="w-10 h-10 text-muted-foreground/30 mb-2" />
                    <p className="text-sm text-muted-foreground">لا توجد مشاريع بعد</p>
                    <Link to="/request" className="text-xs text-primary hover:underline mt-2">اطلب خدمة جديدة</Link>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Link to="/request" className="bg-card border border-border/50 rounded-2xl p-4 hover:border-primary/30 transition-all group">
                  <Plus className="w-8 h-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-semibold">طلب خدمة جديدة</p>
                  <p className="text-xs text-muted-foreground">ابدأ مشروعاً جديداً مع فريقنا</p>
                </Link>
                <button onClick={() => setActiveTab('messages')} className="bg-card border border-border/50 rounded-2xl p-4 hover:border-primary/30 transition-all text-right group">
                  <MessageCircle className="w-8 h-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-semibold">تواصل مع الفريق</p>
                  <p className="text-xs text-muted-foreground">أرسل رسالة لفريق العمل</p>
                </button>
                <button onClick={() => setActiveTab('profile')} className="bg-card border border-border/50 rounded-2xl p-4 hover:border-primary/30 transition-all text-right group">
                  <Settings className="w-8 h-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-semibold">إعدادات الحساب</p>
                  <p className="text-xs text-muted-foreground">تعديل بياناتك الشخصية</p>
                </button>
              </div>
            </div>
          )}

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div className="space-y-4">
              {projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projects.map(project => {
                    const status = STATUS_MAP[project.status] || STATUS_MAP.pending;
                    const StatusIcon = status.icon;
                    return (
                      <motion.div key={project.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="bg-card border border-border/50 rounded-2xl p-5 hover:border-border transition-all">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-base font-semibold text-foreground">{project.title}</h3>
                            <p className="text-xs text-muted-foreground mt-0.5">{project.service_type || 'مشروع'}</p>
                          </div>
                          <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full ${status.cls}`}>
                            <StatusIcon className="w-3 h-3" />
                            {status.label}
                          </span>
                        </div>
                        {project.description && (
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{project.description}</p>
                        )}
                        {/* Progress */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                            <span>التقدم</span>
                            <span>{project.progress}%</span>
                          </div>
                          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${project.progress}%` }}
                              transition={{ duration: 1, ease: 'easeOut' }}
                              className="h-full bg-primary rounded-full" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                            {project.priority && (
                              <span className={`px-2 py-0.5 rounded-full ${PRIORITY_MAP[project.priority] || PRIORITY_MAP.medium}`}>
                                {project.priority === 'low' ? 'منخفض' : project.priority === 'medium' ? 'متوسط' : project.priority === 'high' ? 'عالي' : 'عاجل'}
                              </span>
                            )}
                            <span>{new Date(project.created_at).toLocaleDateString('ar-EG')}</span>
                          </div>
                        </div>
                        {project.notes && (
                          <div className="mt-3 pt-3 border-t border-border/30">
                            <p className="text-xs text-muted-foreground">{project.notes}</p>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-card border border-border/50 rounded-2xl flex flex-col items-center justify-center py-20 text-center">
                  <FolderOpen className="w-16 h-16 text-muted-foreground/20 mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-1">لا توجد مشاريع بعد</h3>
                  <p className="text-sm text-muted-foreground mb-4">ابدأ مشروعك الأول مع B.CLICK</p>
                  <Link to="/request" className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all">
                    طلب خدمة جديدة
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div className="bg-card border border-border/50 rounded-2xl overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 180px)' }}>
              <div className="px-5 py-3 border-b border-border/50 flex items-center justify-between">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-primary" />
                  الرسائل المباشرة مع فريق B.CLICK
                </h3>
              </div>

              {/* Messages list */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length > 0 ? messages.map(msg => {
                  const isOwn = msg.sender_id === user?.id;
                  return (
                    <div key={msg.id} className={cn('flex gap-3', isOwn ? 'flex-row-reverse' : '')}>
                      <div className={cn('w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                        isOwn ? 'bg-primary/10' : 'bg-emerald-500/10')}>
                        {isOwn ? <User className="w-4 h-4 text-primary" /> : <Briefcase className="w-4 h-4 text-emerald-500" />}
                      </div>
                      <div className="max-w-[70%]">
                        <div className={cn('p-3 rounded-2xl text-sm',
                          isOwn ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-muted rounded-tl-sm')}>
                          {msg.content && <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>}
                          {msg.file_url && (
                            <a href={msg.file_url} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-2 mt-1 opacity-80 hover:opacity-100">
                              <FileText className="w-4 h-4" />
                              <span className="text-xs">{msg.file_name || 'ملف'}</span>
                            </a>
                          )}
                        </div>
                        <p className={cn('text-[10px] text-muted-foreground mt-1', isOwn ? 'text-left' : 'text-right')}>
                          {new Date(msg.created_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <MessageCircle className="w-12 h-12 text-muted-foreground/20 mb-3" />
                    <p className="text-sm text-muted-foreground">ابدأ محادثة مع فريق B.CLICK</p>
                  </div>
                )}
              </div>

              {/* Message Input */}
              <form onSubmit={sendMessage} className="p-4 border-t border-border/50">
                <div className="flex gap-2">
                  <input type="text" value={messageInput} onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="اكتب رسالتك..."
                    className="flex-1 bg-muted/50 border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                    disabled={sendingMessage} />
                  <button type="submit" disabled={!messageInput.trim() || sendingMessage}
                    className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-all disabled:opacity-50">
                    {sendingMessage ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="max-w-2xl space-y-6">
              <div className="bg-card border border-border/50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-base font-semibold">الملف الشخصي</h3>
                  {!editingProfile ? (
                    <button onClick={() => setEditingProfile(true)}
                      className="text-xs text-primary hover:underline">تعديل</button>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={() => setEditingProfile(false)}
                        className="text-xs text-muted-foreground hover:text-foreground">إلغاء</button>
                      <button onClick={handleProfileSave}
                        className="text-xs text-primary font-medium hover:underline">حفظ</button>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">
                      {profileForm.full_name?.charAt(0) || '?'}
                    </span>
                  </div>
                  <div>
                    <p className="text-lg font-semibold">{profileForm.full_name || 'عميل'}</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1.5">الاسم الكامل</label>
                    {editingProfile ? (
                      <input type="text" value={profileForm.full_name}
                        onChange={(e) => setProfileForm(p => ({ ...p, full_name: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
                    ) : (
                      <p className="text-sm font-medium bg-muted/30 rounded-xl px-4 py-2.5">{profileForm.full_name || '—'}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1.5">رقم الهاتف</label>
                    {editingProfile ? (
                      <input type="tel" value={profileForm.phone}
                        onChange={(e) => setProfileForm(p => ({ ...p, phone: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" dir="ltr" />
                    ) : (
                      <p className="text-sm font-medium bg-muted/30 rounded-xl px-4 py-2.5" dir="ltr">{profileForm.phone || '—'}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1.5">اسم الشركة</label>
                    {editingProfile ? (
                      <input type="text" value={profileForm.company_name}
                        onChange={(e) => setProfileForm(p => ({ ...p, company_name: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
                    ) : (
                      <p className="text-sm font-medium bg-muted/30 rounded-xl px-4 py-2.5">{profileForm.company_name || '—'}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1.5">البريد الإلكتروني</label>
                    <p className="text-sm font-medium bg-muted/30 rounded-xl px-4 py-2.5 text-muted-foreground" dir="ltr">{user?.email}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs text-muted-foreground block mb-1.5">نبذة</label>
                    {editingProfile ? (
                      <textarea value={profileForm.bio}
                        onChange={(e) => setProfileForm(p => ({ ...p, bio: e.target.value }))}
                        rows={3}
                        className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none" />
                    ) : (
                      <p className="text-sm font-medium bg-muted/30 rounded-xl px-4 py-2.5 min-h-[60px]">{profileForm.bio || '—'}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Account Info */}
              <div className="bg-card border border-border/50 rounded-2xl p-6">
                <h3 className="text-base font-semibold mb-4">معلومات الحساب</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-muted-foreground">نوع الحساب</span>
                    <span className="text-sm font-medium bg-primary/15 text-primary px-3 py-0.5 rounded-full">عميل</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-muted-foreground">تاريخ التسجيل</span>
                    <span className="text-sm font-medium">{user?.created_at ? new Date(user.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-muted-foreground">عدد المشاريع</span>
                    <span className="text-sm font-medium">{projects.length}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ClientPortal;
