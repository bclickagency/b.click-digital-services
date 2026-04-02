import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Save, Trash2, Edit2, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SiteContentItem {
  id: string;
  section_key: string;
  title: string | null;
  content: any;
  display_order: number;
  is_active: boolean;
}

const SECTION_LABELS: Record<string, string> = {
  'results_spotlight': 'Results Spotlight',
  'trusted_companies': 'Trusted Companies',
  'hero_stats': 'Hero Statistics',
  'testimonials': 'آراء العملاء',
  'faq': 'الأسئلة الشائعة',
};

const SiteContentManager = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<SiteContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string>('all');

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .order('display_order');
    if (!error && data) setItems(data as SiteContentItem[]);
    setLoading(false);
  };

  const startEdit = (item: SiteContentItem) => {
    setEditingId(item.id);
    setEditTitle(item.title || '');
    setEditContent(JSON.stringify(item.content, null, 2));
  };

  const saveEdit = async () => {
    if (!editingId) return;
    setSaving(true);
    try {
      const parsed = JSON.parse(editContent);
      const { error } = await supabase.from('site_content').update({
        title: editTitle,
        content: parsed,
      }).eq('id', editingId);
      if (error) throw error;
      toast({ title: 'تم الحفظ', description: 'تم تحديث المحتوى بنجاح' });
      setEditingId(null);
      fetchContent();
    } catch (e: any) {
      toast({ title: 'خطأ', description: e.message || 'فشل في حفظ المحتوى', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const addSection = async (sectionKey: string) => {
    const { error } = await supabase.from('site_content').insert({
      section_key: sectionKey,
      title: SECTION_LABELS[sectionKey] || sectionKey,
      content: [],
    });
    if (error) {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'تمت الإضافة' });
      fetchContent();
    }
  };

  const deleteSection = async (id: string) => {
    if (!confirm('هل أنت متأكد من الحذف؟')) return;
    const { error } = await supabase.from('site_content').delete().eq('id', id);
    if (!error) {
      toast({ title: 'تم الحذف' });
      fetchContent();
    }
  };

  const toggleActive = async (id: string, currentState: boolean) => {
    await supabase.from('site_content').update({ is_active: !currentState }).eq('id', id);
    fetchContent();
  };

  const existingKeys = items.map(i => i.section_key);
  const availableSections = Object.keys(SECTION_LABELS).filter(k => !existingKeys.includes(k));
  const filteredItems = selectedSection === 'all' ? items : items.filter(i => i.section_key === selectedSection);

  if (loading) return <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-xl font-bold text-foreground">إدارة محتوى الموقع</h2>
        <div className="flex gap-2 flex-wrap">
          {availableSections.map(key => (
            <button key={key} onClick={() => addSection(key)} className="btn-ghost text-xs flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" /> {SECTION_LABELS[key]}
            </button>
          ))}
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setSelectedSection('all')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${selectedSection === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-muted-foreground hover:bg-muted'}`}>الكل</button>
        {Object.entries(SECTION_LABELS).map(([key, label]) => (
          <button key={key} onClick={() => setSelectedSection(key)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${selectedSection === key ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-muted-foreground hover:bg-muted'}`}>{label}</button>
        ))}
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {filteredItems.map(item => (
            <motion.div key={item.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass-card">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-medium">
                      {SECTION_LABELS[item.section_key] || item.section_key}
                    </span>
                    <button onClick={() => toggleActive(item.id, item.is_active)} className={`px-2 py-0.5 rounded-md text-xs font-medium ${item.is_active ? 'bg-[hsl(142_70%_45%/0.1)] text-[hsl(142_70%_45%)]' : 'bg-destructive/10 text-destructive'}`}>
                      {item.is_active ? 'مفعّل' : 'معطّل'}
                    </button>
                  </div>
                  {item.title && <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>}
                  <p className="text-xs text-muted-foreground">
                    {Array.isArray(item.content) ? `${item.content.length} عنصر` : 'محتوى مخصص'}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => startEdit(item)} className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteSection(item.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {editingId === item.id && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mt-4 space-y-3 border-t border-border/30 pt-4">
                  <input
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    placeholder="العنوان"
                    className="w-full px-3 py-2 rounded-lg bg-muted/50 border border-border/50 text-sm"
                  />
                  <textarea
                    value={editContent}
                    onChange={e => setEditContent(e.target.value)}
                    rows={10}
                    className="w-full px-3 py-2 rounded-lg bg-muted/50 border border-border/50 text-sm font-mono text-foreground"
                    dir="ltr"
                  />
                  <div className="flex gap-2">
                    <button onClick={saveEdit} disabled={saving} className="btn-primary text-xs flex items-center gap-1.5">
                      {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                      حفظ
                    </button>
                    <button onClick={() => setEditingId(null)} className="btn-ghost text-xs flex items-center gap-1.5">
                      <X className="w-3.5 h-3.5" /> إلغاء
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredItems.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>لا يوجد محتوى. أضف قسمًا جديدًا من الأزرار أعلاه.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SiteContentManager;
