import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Trash2, Shield, User, Mail } from 'lucide-react';

interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'team_member';
  created_at: string;
  email?: string;
}

interface UserManagerProps {
  currentUserId: string;
}

const UserManager = ({ currentUserId }: UserManagerProps) => {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'team_member'>('team_member');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setUsers(data as UserRole[]);
    }
    setLoading(false);
  };

  const handleAddUser = async () => {
    if (!newEmail) {
      toast({ title: 'خطأ', description: 'البريد الإلكتروني مطلوب', variant: 'destructive' });
      return;
    }

    setIsAdding(true);

    // Note: In a real app, you'd invite the user via Supabase Auth
    // For now, we'll show instructions
    toast({
      title: 'ملاحظة',
      description: 'يجب على المستخدم التسجيل أولاً ثم يمكنك إضافة صلاحياته من هنا',
    });

    setIsAdding(false);
    setNewEmail('');
  };

  const updateRole = async (id: string, role: 'admin' | 'team_member') => {
    const { error } = await supabase
      .from('user_roles')
      .update({ role })
      .eq('id', id);

    if (error) {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">إدارة المستخدمين</h2>
      </div>

      {/* Add User Form */}
      <div className="glass-card p-4">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <UserPlus className="w-5 h-5" />
          إضافة مستخدم جديد
        </h3>
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="form-input"
              placeholder="البريد الإلكتروني"
              dir="ltr"
            />
          </div>
          <select
            value={newRole}
            onChange={(e) => setNewRole(e.target.value as any)}
            className="form-input w-auto"
          >
            <option value="team_member">عضو فريق</option>
            <option value="admin">مدير</option>
          </select>
          <button 
            onClick={handleAddUser} 
            disabled={isAdding}
            className="btn-secondary"
          >
            {isAdding ? 'جاري الإضافة...' : 'إضافة'}
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          ملاحظة: يجب على المستخدم التسجيل أولاً من صفحة تسجيل الدخول، ثم يمكنك تعديل صلاحياته من هنا
        </p>
      </div>

      {/* Users List */}
      <div className="glass-card p-0 overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold">المستخدمون الحاليون</h3>
        </div>
        
        {loading ? (
          <div className="text-center py-12">جاري التحميل...</div>
        ) : users.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">لا يوجد مستخدمون</div>
        ) : (
          <div className="divide-y divide-border">
            {users.map((user) => (
              <div key={user.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    user.role === 'admin' ? 'bg-primary/20' : 'bg-muted'
                  }`}>
                    {user.role === 'admin' ? (
                      <Shield className="w-5 h-5 text-primary" />
                    ) : (
                      <User className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="font-mono text-sm" dir="ltr">{user.user_id.slice(0, 8)}...</span>
                      {user.user_id === currentUserId && (
                        <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">أنت</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      منذ {new Date(user.created_at).toLocaleDateString('ar-EG')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={user.role}
                    onChange={(e) => updateRole(user.id, e.target.value as any)}
                    disabled={user.user_id === currentUserId}
                    className="bg-transparent border border-border rounded-lg px-3 py-1.5 text-sm disabled:opacity-50"
                  >
                    <option value="team_member">عضو فريق</option>
                    <option value="admin">مدير</option>
                  </select>
                  
                  {user.user_id !== currentUserId && (
                    <button 
                      onClick={() => deleteUser(user.id, user.user_id)}
                      className="p-2 hover:bg-destructive/20 rounded-lg transition-colors text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManager;
