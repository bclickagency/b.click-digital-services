import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getSafeErrorMessage } from '@/lib/errorHandler';
import RichTextEditor from './RichTextEditor';
import { Plus, Edit2, Trash2, Star, X, Save, ExternalLink } from 'lucide-react';

interface PortfolioItem {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  full_description: string | null;
  cover_image: string | null;
  images: string[];
  category: string;
  technologies: string[];
  client_name: string | null;
  project_url: string | null;
  status: 'draft' | 'published';
  featured: boolean;
  display_order: number;
  created_at: string;
}

interface PortfolioManagerProps {
  userRole: string;
}

const categories = ['تصميم مواقع', 'تطبيقات موبايل', 'هوية بصرية', 'متاجر إلكترونية', 'تسويق رقمي'];

const PortfolioManager = ({ userRole }: PortfolioManagerProps) => {
  const { toast } = useToast();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<PortfolioItem> | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from('portfolio_items')
      .select('*')
      .order('display_order', { ascending: true });

    if (!error && data) {
      setItems(data as PortfolioItem[]);
    }
    setLoading(false);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s\u0600-\u06FF]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleSave = async () => {
    if (!editingItem?.title) {
      toast({ title: 'خطأ', description: 'العنوان مطلوب', variant: 'destructive' });
      return;
    }

    const itemData = {
      ...editingItem,
      slug: editingItem.slug || generateSlug(editingItem.title),
    };

    if (editingItem.id) {
      const { error } = await supabase
        .from('portfolio_items')
        .update(itemData)
        .eq('id', editingItem.id);

      if (error) {
        toast({ title: 'خطأ', description: getSafeErrorMessage(error), variant: 'destructive' });
      } else {
        toast({ title: 'تم التحديث', description: 'تم تحديث المشروع بنجاح' });
        fetchItems();
        setIsEditing(false);
        setEditingItem(null);
      }
    } else {
      const { error } = await supabase
        .from('portfolio_items')
        .insert(itemData as any);

      if (error) {
        toast({ title: 'خطأ', description: getSafeErrorMessage(error), variant: 'destructive' });
      } else {
        toast({ title: 'تم الإنشاء', description: 'تم إنشاء المشروع بنجاح' });
        fetchItems();
        setIsEditing(false);
        setEditingItem(null);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المشروع؟')) return;

    const { error } = await supabase.from('portfolio_items').delete().eq('id', id);
    if (!error) {
      setItems(items.filter(i => i.id !== id));
      toast({ title: 'تم الحذف', description: 'تم حذف المشروع بنجاح' });
    }
  };

  const toggleFeatured = async (id: string, featured: boolean) => {
    const { error } = await supabase
      .from('portfolio_items')
      .update({ featured: !featured })
      .eq('id', id);

    if (!error) {
      setItems(items.map(i => i.id === id ? { ...i, featured: !featured } : i));
    }
  };

  if (isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">{editingItem?.id ? 'تعديل المشروع' : 'إضافة مشروع جديد'}</h2>
          <button onClick={() => { setIsEditing(false); setEditingItem(null); }} className="btn-ghost">
            <X className="w-4 h-4 ml-2" />
            إلغاء
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div>
              <label className="form-label">اسم المشروع *</label>
              <input
                type="text"
                value={editingItem?.title || ''}
                onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                className="form-input"
                placeholder="اسم المشروع"
              />
            </div>

            <div>
              <label className="form-label">الوصف المختصر</label>
              <textarea
                value={editingItem?.description || ''}
                onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                className="form-input resize-none"
                rows={3}
                placeholder="وصف مختصر للمشروع"
              />
            </div>

            <div>
              <label className="form-label">الوصف الكامل</label>
              <RichTextEditor
                content={editingItem?.full_description || ''}
                onChange={(content) => setEditingItem({ ...editingItem, full_description: content })}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="glass-card p-4 space-y-4">
              <h3 className="font-semibold border-b border-border pb-2">إعدادات المشروع</h3>
              
              <div>
                <label className="form-label">الحالة</label>
                <select
                  value={editingItem?.status || 'draft'}
                  onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value as any })}
                  className="form-input"
                >
                  <option value="draft">مسودة</option>
                  <option value="published">منشور</option>
                </select>
              </div>

              <div>
                <label className="form-label">التصنيف</label>
                <select
                  value={editingItem?.category || 'تصميم مواقع'}
                  onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                  className="form-input"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">صورة الغلاف</label>
                <input
                  type="url"
                  value={editingItem?.cover_image || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, cover_image: e.target.value })}
                  className="form-input"
                  placeholder="رابط الصورة"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="form-label">اسم العميل</label>
                <input
                  type="text"
                  value={editingItem?.client_name || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, client_name: e.target.value })}
                  className="form-input"
                  placeholder="اسم العميل"
                />
              </div>

              <div>
                <label className="form-label">رابط المشروع</label>
                <input
                  type="url"
                  value={editingItem?.project_url || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, project_url: e.target.value })}
                  className="form-input"
                  placeholder="https://..."
                  dir="ltr"
                />
              </div>

              <div>
                <label className="form-label">التقنيات المستخدمة (مفصولة بفاصلة)</label>
                <input
                  type="text"
                  value={editingItem?.technologies?.join(', ') || ''}
                  onChange={(e) => setEditingItem({ 
                    ...editingItem, 
                    technologies: e.target.value.split(',').map(t => t.trim()).filter(Boolean) 
                  })}
                  className="form-input"
                  placeholder="React, Node.js, Supabase"
                />
              </div>

              <div>
                <label className="form-label">ترتيب العرض</label>
                <input
                  type="number"
                  value={editingItem?.display_order || 0}
                  onChange={(e) => setEditingItem({ ...editingItem, display_order: parseInt(e.target.value) })}
                  className="form-input"
                  min="0"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={editingItem?.featured || false}
                  onChange={(e) => setEditingItem({ ...editingItem, featured: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="featured" className="text-sm">مشروع مميز</label>
              </div>

              <button onClick={handleSave} className="btn-secondary w-full">
                <Save className="w-4 h-4 ml-2" />
                حفظ المشروع
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">إدارة الأعمال</h2>
        <button 
          onClick={() => { setIsEditing(true); setEditingItem({ status: 'draft', category: 'تصميم مواقع', technologies: [], images: [], featured: false, display_order: 0 }); }}
          className="btn-secondary"
        >
          <Plus className="w-4 h-4 ml-2" />
          مشروع جديد
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">جاري التحميل...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">لا توجد مشاريع بعد</div>
      ) : (
        <div className="grid gap-4">
          {items.map((item) => (
            <div key={item.id} className="glass-card p-4 flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                {item.cover_image && (
                  <img 
                    src={item.cover_image} 
                    alt={item.title} 
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{item.title}</h3>
                    {item.featured && <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                    <span>{item.category}</span>
                    {item.client_name && (
                      <>
                        <span>•</span>
                        <span>{item.client_name}</span>
                      </>
                    )}
                    {item.project_url && (
                      <>
                        <span>•</span>
                        <a href={item.project_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                          <ExternalLink className="w-3 h-3" />
                          عرض
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  item.status === 'published' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                }`}>
                  {item.status === 'published' ? 'منشور' : 'مسودة'}
                </span>
                <button 
                  onClick={() => toggleFeatured(item.id, item.featured)}
                  className={`p-2 rounded-lg transition-colors ${item.featured ? 'text-yellow-400' : 'text-muted-foreground hover:text-yellow-400'}`}
                >
                  <Star className={`w-4 h-4 ${item.featured ? 'fill-yellow-400' : ''}`} />
                </button>
                <button 
                  onClick={() => { setEditingItem(item); setIsEditing(true); }}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                {userRole === 'admin' && (
                  <button 
                    onClick={() => handleDelete(item.id)}
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
  );
};

export default PortfolioManager;
