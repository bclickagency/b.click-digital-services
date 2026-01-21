import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { LogOut, LayoutDashboard, FileText, Phone, Clock, Trash2, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/admin');
        return;
      }
      setUser(session.user);

      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id);

      if (!roles || roles.length === 0) {
        await supabase.auth.signOut();
        navigate('/admin');
        return;
      }

      setUserRole(roles[0].role);
      fetchRequests();
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) navigate('/admin');
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from('service_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) setRequests(data as ServiceRequest[]);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: RequestStatus) => {
    const { error } = await supabase
      .from('service_requests')
      .update({ status })
      .eq('id', id);

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  const getStatusBadge = (status: RequestStatus) => {
    const styles = {
      new: 'status-badge status-new',
      contacted: 'status-badge status-contacted',
      closed: 'status-badge status-closed',
    };
    const labels = { new: 'جديد', contacted: 'تم التواصل', closed: 'مغلق' };
    return <span className={styles[status]}>{labels[status]}</span>;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background" dir="rtl">
        <div className="text-xl">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="glass-header !rounded-none !top-0 !left-0 !right-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <LayoutDashboard className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold">لوحة التحكم</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <button onClick={handleLogout} className="btn-ghost text-sm py-2 px-3">
              <LogOut className="w-4 h-4" />
              خروج
            </button>
          </div>
        </div>
      </header>

      <main className="pt-24 px-4 pb-8 max-w-7xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'إجمالي الطلبات', value: requests.length, icon: FileText, color: 'primary' },
            { label: 'طلبات جديدة', value: requests.filter(r => r.status === 'new').length, icon: Clock, color: 'secondary' },
            { label: 'تم الإغلاق', value: requests.filter(r => r.status === 'closed').length, icon: Phone, color: 'primary' },
          ].map((stat) => (
            <div key={stat.label} className="stat-card">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  stat.color === 'primary' ? 'bg-primary/10' : 'bg-secondary/10'
                }`}>
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

        {/* Requests Table */}
        <div className="glass-card p-0 overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="text-lg font-bold">الطلبات الواردة</h2>
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
                {requests.map((request) => (
                  <tr key={request.id} className="table-row">
                    <td className="p-4 font-medium">{request.full_name}</td>
                    <td className="p-4">
                      <a href={`https://wa.me/2${request.whatsapp}`} target="_blank" rel="noopener noreferrer" 
                         className="text-secondary hover:underline flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        {request.whatsapp}
                      </a>
                    </td>
                    <td className="p-4 text-sm">{request.service_type}</td>
                    <td className="p-4 text-sm">{request.urgency}</td>
                    <td className="p-4">
                      <select
                        value={request.status}
                        onChange={(e) => updateStatus(request.id, e.target.value as RequestStatus)}
                        className="bg-transparent border border-border rounded-lg px-2 py-1 text-sm"
                      >
                        <option value="new">جديد</option>
                        <option value="contacted">تم التواصل</option>
                        <option value="closed">مغلق</option>
                      </select>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {new Date(request.created_at).toLocaleDateString('ar-EG')}
                    </td>
                    <td className="p-4">
                      {userRole === 'admin' && (
                        <button onClick={() => deleteRequest(request.id)} className="text-destructive hover:text-destructive/80">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {requests.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">لا توجد طلبات حتى الآن</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
