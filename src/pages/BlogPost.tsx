import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Eye, 
  ArrowRight, 
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Copy,
  CheckCircle
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { ShimmerSkeleton, TextShimmer } from '@/components/ui/ShimmerSkeleton';
import LazyImage from '@/components/ui/LazyImage';
import { toast } from '@/hooks/use-toast';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  category: string;
  cover_image: string | null;
  author_name: string | null;
  published_at: string | null;
  created_at: string;
  views_count: number;
  tags: string[] | null;
}

// Fallback post for demo
const fallbackPost: BlogPost = {
  id: '1',
  title: 'أهمية تصميم الهوية البصرية لنجاح علامتك التجارية',
  slug: 'brand-identity-importance',
  content: `
    <h2>ما هي الهوية البصرية؟</h2>
    <p>الهوية البصرية هي مجموعة العناصر المرئية التي تمثل علامتك التجارية وتميزها عن المنافسين. تشمل هذه العناصر الشعار، الألوان، الخطوط، والصور المستخدمة في جميع المواد التسويقية.</p>
    
    <h2>لماذا تحتاج هوية بصرية قوية؟</h2>
    <p>الهوية البصرية القوية تساعدك على:</p>
    <ul>
      <li>بناء الثقة مع العملاء</li>
      <li>التميز عن المنافسين</li>
      <li>تعزيز التعرف على العلامة التجارية</li>
      <li>زيادة القيمة المتوقعة للمنتجات</li>
    </ul>
    
    <h2>عناصر الهوية البصرية الأساسية</h2>
    <p>تتكون الهوية البصرية من عدة عناصر أساسية يجب أن تعمل معاً بتناغم:</p>
    
    <h3>1. الشعار (Logo)</h3>
    <p>الشعار هو العنصر الأكثر أهمية في الهوية البصرية. يجب أن يكون بسيطاً، مميزاً، وقابلاً للتذكر.</p>
    
    <h3>2. الألوان</h3>
    <p>اختيار الألوان المناسبة يؤثر على المشاعر والانطباعات التي تتركها علامتك التجارية.</p>
    
    <h3>3. الخطوط</h3>
    <p>الخطوط المستخدمة تعكس شخصية العلامة التجارية وتؤثر على سهولة القراءة.</p>
    
    <h2>نصائح لبناء هوية بصرية ناجحة</h2>
    <p>لبناء هوية بصرية قوية وفعالة، اتبع هذه النصائح:</p>
    <ol>
      <li>افهم جمهورك المستهدف جيداً</li>
      <li>ادرس المنافسين وتميز عنهم</li>
      <li>حافظ على البساطة والوضوح</li>
      <li>كن متسقاً في جميع المنصات</li>
      <li>استعن بمصممين محترفين</li>
    </ol>
  `,
  excerpt: 'تعرف على كيف يمكن لهوية بصرية قوية أن تميز علامتك التجارية وتبني ثقة العملاء.',
  category: 'تصميم',
  cover_image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=600&fit=crop',
  author_name: 'فريق B.CLICK',
  published_at: '2024-01-15',
  created_at: '2024-01-15',
  views_count: 245,
  tags: ['هوية بصرية', 'تصميم', 'علامة تجارية', 'شعار'],
};

const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (!error && data) {
      setPost(data as BlogPost);
      // Increment view count
      await supabase
        .from('blog_posts')
        .update({ views_count: (data.views_count || 0) + 1 })
        .eq('id', data.id);
    } else {
      // Use fallback post for demo
      setPost(fallbackPost);
    }
    setLoading(false);
  };

  const getReadTime = (content: string) => {
    const words = content.split(' ').length;
    return Math.ceil(words / 200) + ' دقائق';
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleShare = (platform: string) => {
    const title = post?.title || '';
    let url = '';

    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        toast({
          title: 'تم النسخ!',
          description: 'تم نسخ رابط المقال بنجاح',
        });
        setTimeout(() => setCopied(false), 2000);
        return;
    }

    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            <ShimmerSkeleton className="h-8 w-3/4 mb-4" />
            <ShimmerSkeleton className="h-96 w-full rounded-2xl mb-8" />
            <TextShimmer lines={10} />
          </div>
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <div className="section-container text-center">
          <h1 className="text-2xl font-bold mb-4">المقال غير موجود</h1>
          <Link to="/blog" className="btn-primary">
            <ArrowRight className="w-5 h-5 rotate-180" />
            العودة للمدونة
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero */}
      <section className="relative">
        <div className="h-[50vh] md:h-[60vh] relative overflow-hidden">
          <LazyImage
            src={post.cover_image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&h=600&fit=crop'}
            alt={post.title}
            className="absolute inset-0"
            wrapperClassName="absolute inset-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>
        
        <div className="container mx-auto px-4 relative -mt-32 z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto glass-card"
          >
            <span className="inline-block px-4 py-1 bg-primary/10 text-primary text-sm font-medium rounded-lg mb-4">
              {post.category}
            </span>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(post.published_at || post.created_at).toLocaleDateString('ar-EG', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {getReadTime(post.content)}
              </span>
              <span className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                {post.views_count} مشاهدة
              </span>
            </div>

            {/* Share Buttons */}
            <div className="flex items-center gap-3 pt-4 border-t border-border/30">
              <Share2 className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">شارك المقال:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleShare('facebook')}
                  className="w-9 h-9 rounded-lg bg-blue-600/10 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleShare('twitter')}
                  className="w-9 h-9 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  className="w-9 h-9 rounded-lg bg-blue-700/10 text-blue-700 flex items-center justify-center hover:bg-blue-700 hover:text-white transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleShare('copy')}
                  className="w-9 h-9 rounded-lg bg-muted text-muted-foreground flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="section-container pt-12">
        <div className="max-w-4xl mx-auto">
          <motion.article
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="prose prose-lg prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-border/30">
              <h4 className="text-sm text-muted-foreground mb-4">الوسوم:</h4>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 bg-muted/50 text-muted-foreground rounded-lg text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Back Link */}
          <div className="mt-12">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
            >
              <ArrowRight className="w-5 h-5 rotate-180" />
              العودة للمدونة
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BlogPostPage;
