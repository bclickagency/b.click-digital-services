import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getSafeErrorMessage } from '@/lib/errorHandler';
import { 
  UserPlus, Trash2, Shield, User, Mail, Search, 
  Users as UsersIcon, FolderPlus, Briefcase, Loader2
} from 'lucide-react';

interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'team_member' | 'client';
  created_at: string;
}

interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  company_name: string | null;
  created_at: string;
}

interface UserManagerProps {
  currentUserId: string;
}

const UserManager = ({ currentUserId }: UserManagerProps) => {
  const { toast } = useToast();
  const [users, setUsers] = useState<(UserRole & { profile?: Profile })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [showProjectModal, setShowProjectModal] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState({
    title: '', description: '', service_type: '', priority: 'medium', status: 'pending',
  });
  const [creatingProject, setCreatingProject] = useState(false);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const { data: roles, error } = await supabase
      .from('user_roles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && roles) {
      // Fetch profiles for all users
      const userIds = roles.map(r => r.user_id);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .in('id', userIds);

      const merged = roles.map(r => ({
        ...r,
        profile: profiles?.find(p => p.id === r.user_id) as Profile | undefined,
      }));
      setUsers(merged as any);
    }
    setLoading(false);
  };

  const updateRole = async (id: string, role: 'admin' | 'team_member' | 'client') => {
    const { error } = await supabase.from('user_roles').update({ role: role as any }).eq('id', id);
    if (error) {
      toast({ title: 'خطأ', description: getSafeErrorMessage(error), variant: 'destructive' });
    } else {
      setUsers(users.map(u => u.id === id ? { ...u, role } : u));
      toast({ title: 'تم التحديث', description: 'تم تحديث صلاحيات المستخدم' });
    }
  };

  const deleteUser = async (id: string, userId: string) => {
    if (userId === currentUserId) {
      toast({ title: 'خطأ', description: 'لا يمكنك حذف نفسك', variant: 'destructive' });
      return;
    }
    if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return;
    const { error } = await supabase.from('user_roles').delete().eq('id', id);
    if (!error) {
      setUsers(users.filter(u => u.id !== id));
      toast({ title: 'تم الحذف', description: 'تم حذف المستخدم بنجاح' });
    }
  };

  const createProject = async () => {
    if (!showProjectModal || !projectForm.title.trim()) return;
    setCreatingProject(true);
    try {
      const { error } = await supabase.from('client_projects').insert({
        client_id: showProjectModal,
        title: projectForm.title,
        description: projectForm.description || null,
        service_type: projectForm.service_type || null,
        priority: projectForm.priority,
        status: projectForm.status,
      });
      if (error) throw error;
      toast({ title: 'تم الإنشاء', description: 'تم إنشاء المشروع بنجاح' });
      setShowProjectModal(null);
      setProjectForm({ title: '', description: '', service_type: '', priority: 'medium', status: 'pending' });
    } catch (err: any) {
      toast({ title: 'خطأ', description: err.message, variant: 'destructive' });
    } finally {
      setCreatingProject(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesSearch = (u.profile?.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.profile?.email || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = filterRole === 'all' || u.role === filterRole;
      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, filterRole]);

  const roleCounts = useMemo(() => ({
    all: users.length,
    admin: users.filter(u => u.role === 'admin').length,
    team_member: users.filter(u => u.role === 'team_member').length,
    client: users.filter(u => u.role === 'client').length,
  }), [users]);

  const roleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'مدير';
      case 'team_member': return 'عضو فريق';
      case 'client': return 'عميل';
      default: return role;
    }
  };

  const roleBadge = (role: string) => {
    const map: Record<string, string> = {
      admin: 'bg-primary/15 text-primary',
      team_member: 'bg-blue-500/15 text-blue-500',
      client: 'bg-emerald-500/15 text-emerald-500',
    };
    return map[role] || 'bg-muted text-muted-foreground';
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'الكل', value: roleCounts.all, icon: UsersIcon, filter: 'all' },
          { label: 'مديرون', value: roleCounts.admin, icon: Shield, filter: 'admin' },
          { label: 'فريق العمل', value: roleCounts.team_member, icon: User, filter: 'team_member' },
          { label: 'العملاء', value: roleCounts.client, icon: Briefcase, filter: 'client' },
        ].map(s => (
          <button key={s.filter} onClick={() => setFilterRole(s.filter)}
            className={`bg-card border rounded-2xl p-4 text-right transition-all ${
              filterRole === s.filter ? 'border-primary' : 'border-border/50 hover:border-border'
            }`}>
            <s.icon className="w-5 h-5 text-muted-foreground mb-2" />
            <p className="text-xl font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="بحث بالاسم أو البريد..."
          className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-card border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
      </div>

      {/* Users Table */}
      <div className="bg-card border border-border/50 rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-border/50 flex items-center justify-between">
          <h3 className="text-sm font-semibold">المستخدمون ({filteredUsers.length})</h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-16 text-sm text-muted-foreground">لا يوجد مستخدمون</div>
        ) : (
          <div className="divide-y divide-border/20">
            {filteredUsers.map(u => (
              <div key={u.id} className="flex items-center justify-between px-5 py-3 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    u.role === 'admin' ? 'bg-primary/10' : u.role === 'client' ? 'bg-emerald-500/10' : 'bg-blue-500/10'
                  }`}>
                    {u.role === 'admin' ? <Shield className="w-5 h-5 text-primary" /> :
                     u.role === 'client' ? <User className="w-5 h-5 text-emerald-500" /> :
                     <User className="w-5 h-5 text-blue-500" />}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground truncate">
                        {u.profile?.full_name || 'بدون اسم'}
                      </p>
                      {u.user_id === currentUserId && (
                        <span className="text-[10px] bg-primary/15 text-primary px-1.5 py-0.5 rounded-full">أنت</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate" dir="ltr">
                      {u.profile?.email || u.user_id.slice(0, 12) + '...'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Role badge */}
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${roleBadge(u.role)}`}>
                    {roleLabel(u.role)}
                  </span>

                  {/* Create project (for clients only) */}
                  {u.role === 'client' && (
                    <button onClick={() => setShowProjectModal(u.user_id)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all" title="إنشاء مشروع">
                      <FolderPlus className="w-4 h-4" />
                    </button>
                  )}

                  {/* Role change */}
                  {u.user_id !== currentUserId && (
                    <select value={u.role}
                      onChange={(e) => updateRole(u.id, e.target.value as any)}
                      className="bg-transparent border border-border/50 rounded-lg px-2 py-1 text-xs focus:outline-none">
                      <option value="client">عميل</option>
                      <option value="team_member">عضو فريق</option>
                      <option value="admin">مدير</option>
                    </select>
                  )}

                  {/* Delete */}
                  {u.user_id !== currentUserId && (
                    <button onClick={() => deleteUser(u.id, u.user_id)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowProjectModal(null)} />
          <div className="relative bg-card border border-border/50 rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
              <h3 className="text-base font-semibold">إنشاء مشروع جديد</h3>
              <button onClick={() => setShowProjectModal(null)} className="p-1.5 rounded-lg hover:bg-muted/50 text-muted-foreground">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs text-muted-foreground block mb-1.5">عنوان المشروع *</label>
                <input type="text" value={projectForm.title}
                  onChange={(e) => setProjectForm(p => ({ ...p, title: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  placeholder="عنوان المشروع" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1.5">الوصف</label>
                <textarea value={projectForm.description}
                  onChange={(e) => setProjectForm(p => ({ ...p, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none"
                  placeholder="وصف المشروع" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1.5">نوع الخدمة</label>
                  <input type="text" value={projectForm.service_type}
                    onChange={(e) => setProjectForm(p => ({ ...p, service_type: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                    placeholder="مثلاً: تصميم موقع" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1.5">الأولوية</label>
                  <select value={projectForm.priority}
                    onChange={(e) => setProjectForm(p => ({ ...p, priority: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all">
                    <option value="low">منخفضة</option>
                    <option value="medium">متوسطة</option>
                    <option value="high">عالية</option>
                    <option value="urgent">عاجلة</option>
                  </select>
                </div>
              </div>
              <button onClick={createProject} disabled={!projectForm.title.trim() || creatingProject}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {creatingProject ? <Loader2 className="w-4 h-4 animate-spin" /> : <FolderPlus className="w-4 h-4" />}
                {creatingProject ? 'جاري الإنشاء...' : 'إنشاء المشروع'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManager;
