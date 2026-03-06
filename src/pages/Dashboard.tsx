import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { 
  LayoutDashboard, FileText, Menu, MessagesSquare,
  BookOpen, Briefcase, Users, Mail
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import BlogManager from '@/components/admin/BlogManager';
import PortfolioManager from '@/components/admin/PortfolioManager';
import UserManager from '@/components/admin/UserManager';
import ChatManager from '@/components/admin/ChatManager';
import RequestsTab from '@/components/admin/RequestsTab';
import ContactsTab from '@/components/admin/ContactsTab';
import DashboardOverview from '@/components/admin/DashboardOverview';
import DashboardSidebar, { type TabType, type SidebarTab } from '@/components/admin/DashboardSidebar';
import { useUnreadCount } from '@/hooks/useChat';

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

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const unreadChatCount = useUnreadCount();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate('/admin'); return; }
      setUser(session.user);
      const { data: roles } = await supabase.from('user_roles').select('role').eq('user_id', session.user.id);
      if (!roles || roles.length === 0) { await supabase.auth.signOut(); navigate('/admin'); return; }
      setUserRole(roles[0].role);
      fetchRequests();
      fetchContacts();
    };
    checkAuth();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) navigate('/admin');
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const channel = supabase
      .channel('new-requests')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'service_requests' }, (payload) => {
        setRequests(prev => [payload.new as ServiceRequest, ...prev]);
        toast({ title: '🔔 طلب جديد!', description: `${(payload.new as ServiceRequest).full_name} - ${(payload.new as ServiceRequest).service_type}` });
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'contact_messages' }, (payload) => {
        setContacts(prev => [payload.new as ContactMessage, ...prev]);
        toast({ title: '📩 رسالة جديدة!', description: `${(payload.new as ContactMessage).name} - ${(payload.new as ContactMessage).subject}` });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [toast]);

  const fetchRequests = async () => {
    const { data, error } = await supabase.from('service_requests').select('*').order('created_at', { ascending: false });
    if (!error && data) setRequests(data as ServiceRequest[]);
    setLoading(false);
  };

  const fetchContacts = async () => {
    const { data, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
    if (!error && data) setContacts(data as ContactMessage[]);
  };

  const updateStatus = async (id: string, status: RequestStatus) => {
    const { error } = await supabase.from('service_requests').update({ status }).eq('id', id);
    if (!error) {
      setRequests(requests.map(r => r.id === id ? { ...r, status } : r));
      toast({ title: 'تم التحديث', description: 'تم تحديث حالة الطلب' });
    }
  };

  const deleteRequest = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الطلب؟')) return;
    const { error } = await supabase.from('service_requests').delete().eq('id', id);
    if (!error) {
      setRequests(requests.filter(r => r.id !== id));
      toast({ title: 'تم الحذف', description: 'تم حذف الطلب بنجاح' });
    }
  };

  const handleLogout = async () => { await supabase.auth.signOut(); navigate('/admin'); };

  const newRequestsCount = useMemo(() => requests.filter(r => r.status === 'new').length, [requests]);
  const newContactsCount = useMemo(() => contacts.filter(c => c.status === 'new').length, [contacts]);

  const tabs: SidebarTab[] = useMemo(() => [
    { id: 'overview', label: 'نظرة عامة', icon: LayoutDashboard },
    { id: 'requests', label: 'الطلبات', icon: FileText, badge: newRequestsCount },
    { id: 'contacts', label: 'الرسائل', icon: Mail, badge: newContactsCount },
    { id: 'chat', label: 'المحادثات', icon: MessagesSquare, badge: unreadChatCount },
    { id: 'blog', label: 'المدونة', icon: BookOpen },
    { id: 'portfolio', label: 'الأعمال', icon: Briefcase },
    ...(userRole === 'admin' ? [{ id: 'users' as TabType, label: 'المستخدمين', icon: Users }] : []),
  ], [userRole, newRequestsCount, newContactsCount, unreadChatCount]);

  if (loading) {
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

  const tabTitles: Record<TabType, string> = {
    overview: 'نظرة عامة',
    requests: 'إدارة الطلبات',
    contacts: 'رسائل التواصل',
    chat: 'المحادثات',
    blog: 'إدارة المدونة',
    portfolio: 'إدارة الأعمال',
    users: 'إدارة المستخدمين',
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <DashboardSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabs={tabs}
        onLogout={handleLogout}
        userEmail={user?.email}
        userRole={userRole}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="lg:mr-64 min-h-screen transition-all duration-300">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 lg:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-muted/50 transition-colors">
              <Menu className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="text-lg font-semibold text-foreground">{tabTitles[activeTab]}</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden sm:block">{user?.email}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium hidden sm:block ${
              userRole === 'admin' ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'
            }`}>
              {userRole === 'admin' ? 'مدير' : 'عضو فريق'}
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          {activeTab === 'overview' && (
            <DashboardOverview
              requests={requests}
              contacts={contacts}
              onNavigate={(tab) => setActiveTab(tab as TabType)}
            />
          )}

          {activeTab === 'requests' && (
            <RequestsTab
              requests={requests}
              userRole={userRole}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              updateStatus={updateStatus}
              deleteRequest={deleteRequest}
            />
          )}

          {activeTab === 'contacts' && (
            <ContactsTab contacts={contacts} setContacts={setContacts} userRole={userRole} />
          )}

          {activeTab === 'chat' && <ChatManager />}
          {activeTab === 'blog' && userRole && <BlogManager userRole={userRole} />}
          {activeTab === 'portfolio' && userRole && <PortfolioManager userRole={userRole} />}
          {activeTab === 'users' && userRole === 'admin' && user && <UserManager currentUserId={user.id} />}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
