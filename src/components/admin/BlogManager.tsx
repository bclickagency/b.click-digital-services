import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import RichTextEditor from './RichTextEditor';
import { Plus, Edit2, Trash2, Eye, Clock, Calendar, X, Save } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  category: string;
  tags: string[];
  author_name: string | null;
  status: 'draft' | 'published' | 'scheduled';
  published_at: string | null;
  scheduled_at: string | null;
  views_count: number;
  created_at: string;
}

interface BlogManagerProps {
  userRole: string;
}

const categories = ['تقنية', 'تسويق', 'تصميم', 'أعمال', 'تطوير', 'عام'];

const BlogManager = ({ userRole }: BlogManagerProps) => {
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPosts(data as BlogPost[]);
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
    if (!editingPost?.title || !editingPost?.content) {
      toast({ title: 'خطأ', description: 'العنوان والمحتوى مطلوبان', variant: 'destructive' });
      return;
    }

    const postData = {
      ...editingPost,
      slug: editingPost.slug || generateSlug(editingPost.title),
      published_at: editingPost.status === 'published' && !editingPost.published_at 
        ? new Date().toISOString() 
        : editingPost.published_at,
    };

    if (editingPost.id) {
      // Update existing
      const { error } = await supabase
        .from('blog_posts')
        .update(postData)
        .eq('id', editingPost.id);

      if (error) {
        toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'تم التحديث', description: 'تم تحديث المقال بنجاح' });
        fetchPosts();
        setIsEditing(false);
        setEditingPost(null);
      }
    } else {
      // Create new
      const { error } = await supabase
        .from('blog_posts')
        .insert(postData as any);

      if (error) {
        toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'تم الإنشاء', description: 'تم إنشاء المقال بنجاح' });
        fetchPosts();
        setIsEditing(false);
        setEditingPost(null);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المقال؟')) return;

    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    if (!error) {
      setPosts(posts.filter(p => p.id !== id));
      toast({ title: 'تم الحذف', description: 'تم حذف المقال بنجاح' });
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      draft: 'bg-muted text-muted-foreground',
      published: 'bg-green-500/20 text-green-400',
      scheduled: 'bg-yellow-500/20 text-yellow-400',
    };
    const labels: Record<string, string> = {
      draft: 'مسودة',
      published: 'منشور',
      scheduled: 'مجدول',
    };
    return <span className={`px-2 py-1 rounded-full text-xs ${styles[status]}`}>{labels[status]}</span>;
  };

  if (isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">{editingPost?.id ? 'تعديل المقال' : 'إنشاء مقال جديد'}</h2>
          <button onClick={() => { setIsEditing(false); setEditingPost(null); }} className="btn-ghost">
            <X className="w-4 h-4 ml-2" />
            إلغاء
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <label className="form-label">العنوان *</label>
              <input
                type="text"
                value={editingPost?.title || ''}
                onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                className="form-input"
                placeholder="عنوان المقال"
              />
            </div>

            <div>
              <label className="form-label">المقتطف</label>
              <textarea
                value={editingPost?.excerpt || ''}
                onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                className="form-input resize-none"
                rows={3}
                placeholder="وصف مختصر للمقال"
              />
            </div>

            <div>
              <label className="form-label">المحتوى *</label>
              <RichTextEditor
                content={editingPost?.content || ''}
                onChange={(content) => setEditingPost({ ...editingPost, content })}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="glass-card p-4 space-y-4">
              <h3 className="font-semibold border-b border-border pb-2">إعدادات النشر</h3>
              
              <div>
                <label className="form-label">الحالة</label>
                <select
                  value={editingPost?.status || 'draft'}
                  onChange={(e) => setEditingPost({ ...editingPost, status: e.target.value as any })}
                  className="form-input"
                >
                  <option value="draft">مسودة</option>
                  <option value="published">نشر الآن</option>
                  <option value="scheduled">جدولة</option>
                </select>
              </div>

              {editingPost?.status === 'scheduled' && (
                <div>
                  <label className="form-label">تاريخ النشر</label>
                  <input
                    type="datetime-local"
                    value={editingPost?.scheduled_at?.slice(0, 16) || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, scheduled_at: e.target.value })}
                    className="form-input"
                  />
                </div>
              )}

              <div>
                <label className="form-label">التصنيف</label>
                <select
                  value={editingPost?.category || 'عام'}
                  onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
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
                  value={editingPost?.cover_image || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, cover_image: e.target.value })}
                  className="form-input"
                  placeholder="رابط الصورة"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="form-label">اسم الكاتب</label>
                <input
                  type="text"
                  value={editingPost?.author_name || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, author_name: e.target.value })}
                  className="form-input"
                  placeholder="اسم الكاتب"
                />
              </div>

              <div>
                <label className="form-label">الوسوم (مفصولة بفاصلة)</label>
                <input
                  type="text"
                  value={editingPost?.tags?.join(', ') || ''}
                  onChange={(e) => setEditingPost({ 
                    ...editingPost, 
                    tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) 
                  })}
                  className="form-input"
                  placeholder="تصميم, ويب, تسويق"
                />
              </div>

              <button onClick={handleSave} className="btn-secondary w-full">
                <Save className="w-4 h-4 ml-2" />
                حفظ المقال
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
        <h2 className="text-xl font-bold">إدارة المدونة</h2>
        <button 
          onClick={() => { setIsEditing(true); setEditingPost({ status: 'draft', category: 'عام', tags: [] }); }}
          className="btn-secondary"
        >
          <Plus className="w-4 h-4 ml-2" />
          مقال جديد
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">جاري التحميل...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">لا توجد مقالات بعد</div>
      ) : (
        <div className="grid gap-4">
          {posts.map((post) => (
            <div key={post.id} className="glass-card p-4 flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                {post.cover_image && (
                  <img 
                    src={post.cover_image} 
                    alt={post.title} 
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold">{post.title}</h3>
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                    <span>{post.category}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {post.views_count}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.created_at).toLocaleDateString('ar-EG')}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {getStatusBadge(post.status)}
                <button 
                  onClick={() => { setEditingPost(post); setIsEditing(true); }}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                {userRole === 'admin' && (
                  <button 
                    onClick={() => handleDelete(post.id)}
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

export default BlogManager;
