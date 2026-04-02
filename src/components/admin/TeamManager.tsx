import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Save, Trash2, Edit2, X, Loader2, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  avatar_url: string | null;
  social_links: any;
  is_active: boolean;
  display_order: number;
}

const TeamManager = () => {
  const { toast } = useToast();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', role: '', bio: '', avatar_url: '' });

  useEffect(() => { fetchMembers(); }, []);

  const fetchMembers = async () => {
    const { data } = await supabase.from('team_members').select('*').order('display_order');
    if (data) setMembers(data as TeamMember[]);
    setLoading(false);
  };

  const resetForm = () => { setForm({ name: '', role: '', bio: '', avatar_url: '' }); setEditingId(null); setShowForm(false); };

  const startEdit = (m: TeamMember) => {
    setForm({ name: m.name, role: m.role, bio: m.bio || '', avatar_url: m.avatar_url || '' });
    setEditingId(m.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.role) { toast({ title: 'خطأ', description: 'الاسم والمنصب مطلوبان', variant: 'destructive' }); return; }
    setSaving(true);
    try {
      if (editingId) {
        const { error } = await supabase.from('team_members').update({ name: form.name, role: form.role, bio: form.bio || null, avatar_url: form.avatar_url || null }).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('team_members').insert({ name: form.name, role: form.role, bio: form.bio || null, avatar_url: form.avatar_url || null });
        if (error) throw error;
      }
      toast({ title: editingId ? 'تم التحديث' : 'تمت الإضافة' });
      resetForm();
      fetchMembers();
    } catch (e: any) {
      toast({ title: 'خطأ', description: e.message, variant: 'destructive' });
    } finally { setSaving(false); }
  };

  const deleteMember = async (id: string) => {
    if (!confirm('حذف هذا العضو؟')) return;
    await supabase.from('team_members').delete().eq('id', id);
    toast({ title: 'تم الحذف' });
    fetchMembers();
  };

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from('team_members').update({ is_active: !current }).eq('id', id);
    fetchMembers();
  };

  if (loading) return <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">إدارة الفريق</h2>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> إضافة عضو
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="glass-card space-y-4">
            <h3 className="font-semibold text-foreground">{editingId ? 'تعديل عضو' : 'إضافة عضو جديد'}</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="الاسم *" className="px-3 py-2 rounded-lg bg-muted/50 border border-border/50 text-sm" />
              <input value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} placeholder="المنصب *" className="px-3 py-2 rounded-lg bg-muted/50 border border-border/50 text-sm" />
              <input value={form.avatar_url} onChange={e => setForm(p => ({ ...p, avatar_url: e.target.value }))} placeholder="رابط الصورة" className="px-3 py-2 rounded-lg bg-muted/50 border border-border/50 text-sm" dir="ltr" />
              <textarea value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} placeholder="نبذة" className="px-3 py-2 rounded-lg bg-muted/50 border border-border/50 text-sm" rows={2} />
            </div>
            <div className="flex gap-2">
              <button onClick={handleSave} disabled={saving} className="btn-primary text-xs flex items-center gap-1.5">
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} حفظ
              </button>
              <button onClick={resetForm} className="btn-ghost text-xs flex items-center gap-1.5"><X className="w-3.5 h-3.5" /> إلغاء</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map(m => (
          <motion.div key={m.id} layout className="glass-card flex flex-col">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
                {m.avatar_url ? <img src={m.avatar_url} alt={m.name} className="w-full h-full object-cover" /> : <User className="w-5 h-5 text-primary" />}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground text-sm truncate">{m.name}</h3>
                <p className="text-xs text-muted-foreground">{m.role}</p>
              </div>
            </div>
            {m.bio && <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{m.bio}</p>}
            <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-border/20">
              <button onClick={() => toggleActive(m.id, m.is_active)} className={`px-2 py-0.5 rounded text-[10px] font-medium ${m.is_active ? 'bg-[hsl(142_70%_45%/0.1)] text-[hsl(142_70%_45%)]' : 'bg-destructive/10 text-destructive'}`}>
                {m.is_active ? 'مفعّل' : 'معطّل'}
              </button>
              <div className="flex-1" />
              <button onClick={() => startEdit(m)} className="p-1.5 rounded hover:bg-muted/50 text-muted-foreground"><Edit2 className="w-3.5 h-3.5" /></button>
              <button onClick={() => deleteMember(m.id)} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </motion.div>
        ))}
      </div>

      {members.length === 0 && !showForm && (
        <div className="text-center py-12 text-muted-foreground">لا يوجد أعضاء فريق. أضف عضواً جديداً.</div>
      )}
    </div>
  );
};

export default TeamManager;
