import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Save, Trash2, Edit2, X, Loader2, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PricingPlan {
  id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  billing_period: string | null;
  features: string[];
  is_popular: boolean;
  is_active: boolean;
  display_order: number;
  service_type: string | null;
}

const PricingManager = () => {
  const { toast } = useToast();
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', price: '', currency: 'EGP', billing_period: 'شهري', features: '', is_popular: false, service_type: '' });

  useEffect(() => { fetchPlans(); }, []);

  const fetchPlans = async () => {
    const { data } = await supabase.from('pricing_plans').select('*').order('display_order');
    if (data) setPlans(data as PricingPlan[]);
    setLoading(false);
  };

  const resetForm = () => {
    setForm({ name: '', description: '', price: '', currency: 'EGP', billing_period: 'شهري', features: '', is_popular: false, service_type: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (p: PricingPlan) => {
    setForm({
      name: p.name, description: p.description || '', price: String(p.price),
      currency: p.currency, billing_period: p.billing_period || 'شهري',
      features: p.features.join('\n'), is_popular: p.is_popular, service_type: p.service_type || ''
    });
    setEditingId(p.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price) { toast({ title: 'خطأ', description: 'الاسم والسعر مطلوبان', variant: 'destructive' }); return; }
    setSaving(true);
    try {
      const payload = {
        name: form.name, description: form.description || null,
        price: parseFloat(form.price), currency: form.currency,
        billing_period: form.billing_period, is_popular: form.is_popular,
        features: form.features.split('\n').filter(f => f.trim()),
        service_type: form.service_type || null,
      };
      if (editingId) {
        const { error } = await supabase.from('pricing_plans').update(payload).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('pricing_plans').insert(payload);
        if (error) throw error;
      }
      toast({ title: editingId ? 'تم التحديث' : 'تمت الإضافة' });
      resetForm();
      fetchPlans();
    } catch (e: any) {
      toast({ title: 'خطأ', description: e.message, variant: 'destructive' });
    } finally { setSaving(false); }
  };

  const deletePlan = async (id: string) => {
    if (!confirm('حذف هذه الباقة؟')) return;
    await supabase.from('pricing_plans').delete().eq('id', id);
    toast({ title: 'تم الحذف' });
    fetchPlans();
  };

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from('pricing_plans').update({ is_active: !current }).eq('id', id);
    fetchPlans();
  };

  if (loading) return <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">إدارة الباقات</h2>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> إضافة باقة
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="glass-card space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="اسم الباقة *" className="px-3 py-2 rounded-lg bg-muted/50 border border-border/50 text-sm" />
              <input value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} placeholder="السعر *" type="number" className="px-3 py-2 rounded-lg bg-muted/50 border border-border/50 text-sm" dir="ltr" />
              <input value={form.currency} onChange={e => setForm(p => ({ ...p, currency: e.target.value }))} placeholder="العملة" className="px-3 py-2 rounded-lg bg-muted/50 border border-border/50 text-sm" />
              <input value={form.billing_period} onChange={e => setForm(p => ({ ...p, billing_period: e.target.value }))} placeholder="فترة الدفع" className="px-3 py-2 rounded-lg bg-muted/50 border border-border/50 text-sm" />
              <input value={form.service_type} onChange={e => setForm(p => ({ ...p, service_type: e.target.value }))} placeholder="نوع الخدمة" className="px-3 py-2 rounded-lg bg-muted/50 border border-border/50 text-sm" />
              <input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="الوصف" className="px-3 py-2 rounded-lg bg-muted/50 border border-border/50 text-sm" />
            </div>
            <textarea value={form.features} onChange={e => setForm(p => ({ ...p, features: e.target.value }))} placeholder="الميزات (كل سطر ميزة)" className="w-full px-3 py-2 rounded-lg bg-muted/50 border border-border/50 text-sm" rows={4} />
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" checked={form.is_popular} onChange={e => setForm(p => ({ ...p, is_popular: e.target.checked }))} className="rounded border-border" />
              باقة مميزة (Popular)
            </label>
            <div className="flex gap-2">
              <button onClick={handleSave} disabled={saving} className="btn-primary text-xs flex items-center gap-1.5">
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} حفظ
              </button>
              <button onClick={resetForm} className="btn-ghost text-xs"><X className="w-3.5 h-3.5" /> إلغاء</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans.map(p => (
          <motion.div key={p.id} layout className={`glass-card relative ${p.is_popular ? 'border-primary/50' : ''}`}>
            {p.is_popular && (
              <div className="absolute top-2 left-2">
                <Star className="w-4 h-4 text-primary fill-primary" />
              </div>
            )}
            <h3 className="font-bold text-foreground">{p.name}</h3>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-2xl font-black text-primary">{p.price}</span>
              <span className="text-xs text-muted-foreground">{p.currency} / {p.billing_period}</span>
            </div>
            {p.description && <p className="text-xs text-muted-foreground mt-2">{p.description}</p>}
            <ul className="mt-3 space-y-1">
              {p.features.slice(0, 4).map((f, i) => <li key={i} className="text-xs text-muted-foreground">✓ {f}</li>)}
              {p.features.length > 4 && <li className="text-xs text-muted-foreground">+{p.features.length - 4} المزيد</li>}
            </ul>
            <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-border/20">
              <button onClick={() => toggleActive(p.id, p.is_active)} className={`px-2 py-0.5 rounded text-[10px] font-medium ${p.is_active ? 'bg-[hsl(142_70%_45%/0.1)] text-[hsl(142_70%_45%)]' : 'bg-destructive/10 text-destructive'}`}>
                {p.is_active ? 'مفعّل' : 'معطّل'}
              </button>
              <div className="flex-1" />
              <button onClick={() => startEdit(p)} className="p-1.5 rounded hover:bg-muted/50 text-muted-foreground"><Edit2 className="w-3.5 h-3.5" /></button>
              <button onClick={() => deletePlan(p.id)} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </motion.div>
        ))}
      </div>

      {plans.length === 0 && !showForm && (
        <div className="text-center py-12 text-muted-foreground">لا توجد باقات. أضف باقة جديدة.</div>
      )}
    </div>
  );
};

export default PricingManager;
