import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Save, Trash2, Edit2, X, Loader2, Eye, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface JobListing {
  id: string;
  title: string;
  department: string;
  type: string;
  location: string;
  description: string | null;
  requirements: string[];
  is_active: boolean;
  display_order: number;
}

interface JobApplication {
  id: string;
  job_id: string | null;
  full_name: string;
  email: string;
  phone: string;
  specialization: string;
  experience_years: string | null;
  portfolio_link: string | null;
  status: string;
  created_at: string;
}

const CareersManager = () => {
  const { toast } = useToast();
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeView, setActiveView] = useState<'jobs' | 'applications'>('jobs');
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [form, setForm] = useState({ title: '', department: '', type: 'دوام كامل', location: 'عن بُعد', description: '' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const [jobsRes, appsRes] = await Promise.all([
      supabase.from('job_listings').select('*').order('display_order'),
      supabase.from('job_applications').select('*').order('created_at', { ascending: false }),
    ]);
    if (jobsRes.data) setJobs(jobsRes.data as JobListing[]);
    if (appsRes.data) setApplications(appsRes.data as JobApplication[]);
    setLoading(false);
  };

  const resetForm = () => { setForm({ title: '', department: '', type: 'دوام كامل', location: 'عن بُعد', description: '' }); setEditingId(null); setShowForm(false); };

  const startEdit = (j: JobListing) => {
    setForm({ title: j.title, department: j.department, type: j.type, location: j.location, description: j.description || '' });
    setEditingId(j.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.department) { toast({ title: 'خطأ', description: 'العنوان والقسم مطلوبان', variant: 'destructive' }); return; }
    setSaving(true);
    try {
      const payload = { title: form.title, department: form.department, type: form.type, location: form.location, description: form.description || null };
      if (editingId) {
        const { error } = await supabase.from('job_listings').update(payload).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('job_listings').insert(payload);
        if (error) throw error;
      }
      toast({ title: editingId ? 'تم التحديث' : 'تمت الإضافة' });
      resetForm();
      fetchData();
    } catch (e: any) {
      toast({ title: 'خطأ', description: e.message, variant: 'destructive' });
    } finally { setSaving(false); }
  };

  const deleteJob = async (id: string) => {
    if (!confirm('حذف هذه الوظيفة؟')) return;
    await supabase.from('job_listings').delete().eq('id', id);
    toast({ title: 'تم الحذف' });
    fetchData();
  };

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from('job_listings').update({ is_active: !current }).eq('id', id);
    fetchData();
  };

  if (loading) return <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-xl font-bold text-foreground">إدارة الوظائف</h2>
        <div className="flex gap-2">
          <button onClick={() => setActiveView('jobs')} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${activeView === 'jobs' ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-muted-foreground'}`}>
            الوظائف ({jobs.length})
          </button>
          <button onClick={() => setActiveView('applications')} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${activeView === 'applications' ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-muted-foreground'}`}>
            الطلبات ({applications.length})
          </button>
        </div>
      </div>

      {activeView === 'jobs' ? (
        <>
          <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary text-sm flex items-center gap-2">
            <Plus className="w-4 h-4" /> إضافة وظيفة
          </button>

          <AnimatePresence>
            {showForm && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="glass-card space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="عنوان الوظيفة *" className="px-3 py-2 rounded-lg bg-muted/50 border border-border/50 text-sm" />
                  <input value={form.department} onChange={e => setForm(p => ({ ...p, department: e.target.value }))} placeholder="القسم *" className="px-3 py-2 rounded-lg bg-muted/50 border border-border/50 text-sm" />
                  <input value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} placeholder="نوع العمل" className="px-3 py-2 rounded-lg bg-muted/50 border border-border/50 text-sm" />
                  <input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} placeholder="الموقع" className="px-3 py-2 rounded-lg bg-muted/50 border border-border/50 text-sm" />
                </div>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="الوصف" className="w-full px-3 py-2 rounded-lg bg-muted/50 border border-border/50 text-sm" rows={3} />
                <div className="flex gap-2">
                  <button onClick={handleSave} disabled={saving} className="btn-primary text-xs flex items-center gap-1.5">
                    {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} حفظ
                  </button>
                  <button onClick={resetForm} className="btn-ghost text-xs"><X className="w-3.5 h-3.5" /> إلغاء</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-3">
            {jobs.map(j => (
              <div key={j.id} className="glass-card flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Briefcase className="w-5 h-5 text-primary shrink-0" />
                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground text-sm truncate">{j.title}</h3>
                    <p className="text-xs text-muted-foreground">{j.department} · {j.type} · {j.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button onClick={() => toggleActive(j.id, j.is_active)} className={`px-2 py-0.5 rounded text-[10px] font-medium ${j.is_active ? 'bg-[hsl(142_70%_45%/0.1)] text-[hsl(142_70%_45%)]' : 'bg-destructive/10 text-destructive'}`}>
                    {j.is_active ? 'مفعّل' : 'معطّل'}
                  </button>
                  <button onClick={() => startEdit(j)} className="p-1.5 rounded hover:bg-muted/50 text-muted-foreground"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => deleteJob(j.id)} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
            {jobs.length === 0 && <div className="text-center py-8 text-muted-foreground">لا توجد وظائف</div>}
          </div>
        </>
      ) : (
        <div className="space-y-3">
          {applications.map(app => (
            <div key={app.id} className="glass-card">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-foreground text-sm">{app.full_name}</h3>
                  <p className="text-xs text-muted-foreground">{app.specialization} · {app.email}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{new Date(app.created_at).toLocaleDateString('ar-EG')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${app.status === 'new' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                    {app.status === 'new' ? 'جديد' : app.status}
                  </span>
                  <button onClick={() => setSelectedApp(selectedApp?.id === app.id ? null : app)} className="p-1.5 rounded hover:bg-muted/50 text-muted-foreground">
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              {selectedApp?.id === app.id && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="mt-3 pt-3 border-t border-border/20 grid md:grid-cols-2 gap-2 text-xs">
                  <p><span className="text-muted-foreground">الهاتف:</span> {app.phone}</p>
                  <p><span className="text-muted-foreground">الخبرة:</span> {app.experience_years || '-'}</p>
                  {app.portfolio_link && <p><span className="text-muted-foreground">البورتفوليو:</span> <a href={app.portfolio_link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{app.portfolio_link}</a></p>}
                </motion.div>
              )}
            </div>
          ))}
          {applications.length === 0 && <div className="text-center py-8 text-muted-foreground">لا توجد طلبات توظيف</div>}
        </div>
      )}
    </div>
  );
};

export default CareersManager;
