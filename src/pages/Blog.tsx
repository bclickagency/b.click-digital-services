import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, Search, Eye } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { GridShimmer } from '@/components/ui/ShimmerSkeleton';
import LazyImage from '@/components/ui/LazyImage';
import Newsletter from '@/components/home/Newsletter';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string;
  cover_image: string | null;
  author_name: string | null;
  published_at: string | null;
  created_at: string;
  views_count: number;
}

const categories = ['الكل', 'تقنية', 'تسويق', 'تصميم', 'أعمال', 'تطوير', 'عام'];

// Fallback static posts for when database is empty
const staticPosts = [
  {
    id: '1',
    title: 'أهمية تصميم الهوية البصرية لنجاح علامتك التجارية',
    slug: 'brand-identity-importance',
    excerpt: 'تعرف على كيف يمكن لهوية بصرية قوية أن تميز علامتك التجارية وتبني ثقة العملاء وتزيد من المبيعات.',
    category: 'تصميم',
    cover_image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=500&fit=crop',
    author_name: 'فريق BClick',
    published_at: '2024-01-15',
    created_at: '2024-01-15',
    views_count: 245,
  },
  {
    id: '2',
    title: 'كيف تختار أفضل منصة لتطوير متجرك الإلكتروني',
    slug: 'ecommerce-platform-guide',
    excerpt: 'دليل شامل لاختيار المنصة المناسبة لمتجرك الإلكتروني مع مقارنة بين أشهر المنصات المتاحة.',
    category: 'تطوير',
    cover_image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=500&fit=crop',
    author_name: 'فريق BClick',
    published_at: '2024-01-10',
    created_at: '2024-01-10',
    views_count: 189,
  },
  {
    id: '3',
    title: 'استراتيجيات التسويق الرقمي الفعالة في 2024',
    slug: 'digital-marketing-strategies',
    excerpt: 'اكتشف أحدث استراتيجيات التسويق الرقمي التي ستساعدك على الوصول لجمهورك المستهدف وزيادة التحويلات.',
    category: 'تسويق',
    cover_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop',
    author_name: 'فريق BClick',
    published_at: '2024-01-05',
    created_at: '2024-01-05',
    views_count: 312,
  },
  {
    id: '4',
    title: 'تحسين محركات البحث SEO: دليل المبتدئين',
    slug: 'seo-beginners-guide',
    excerpt: 'تعلم أساسيات تحسين محركات البحث وكيف يمكنك تحسين ترتيب موقعك في نتائج Google.',
    category: 'تقنية',
    cover_image: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=800&h=500&fit=crop',
    author_name: 'فريق BClick',
    published_at: '2024-01-01',
    created_at: '2024-01-01',
    views_count: 428,
  },
  {
    id: '5',
    title: 'أهمية تجربة المستخدم UX في نجاح المواقع',
    slug: 'ux-importance',
    excerpt: 'كيف تؤثر تجربة المستخدم على معدلات التحويل ورضا العملاء وكيف يمكنك تحسينها.',
    category: 'تصميم',
    cover_image: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&h=500&fit=crop',
    author_name: 'فريق BClick',
    published_at: '2023-12-28',
    created_at: '2023-12-28',
    views_count: 156,
  },
  {
    id: '6',
    title: 'كيف تبني علامة تجارية قوية على السوشيال ميديا',
    slug: 'social-media-branding',
    excerpt: 'نصائح عملية لبناء حضور قوي على منصات التواصل الاجتماعي وزيادة التفاعل مع جمهورك.',
    category: 'تسويق',
    cover_image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=500&fit=crop',
    author_name: 'فريق BClick',
    published_at: '2023-12-25',
    created_at: '2023-12-25',
    views_count: 203,
  },
];

const BlogPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('الكل');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, category, cover_image, author_name, published_at, created_at, views_count')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (!error && data && data.length > 0) {
      setPosts(data as BlogPost[]);
    } else {
      // Use static posts as fallback
      setPosts(staticPosts);
    }
    setLoading(false);
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesCategory = activeCategory === 'الكل' || post.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const getReadTime = (excerpt: string | null) => {
    const words = excerpt?.split(' ').length || 100;
    return Math.ceil(words / 40) + ' دقائق';
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6">
              المدونة
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              مقالات ونصائح متخصصة في التصميم والتطوير والتسويق الرقمي لمساعدتك على تنمية أعمالك
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-xl mx-auto mb-12"
          >
            <div className="relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث في المقالات..."
                className="form-input pr-12"
              />
            </div>
          </motion.div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/50 text-muted-foreground hover:bg-primary/10 hover:text-primary'
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="section-padding pt-0">
        <div className="container mx-auto">
          {loading ? (
            <GridShimmer count={6} />
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              لا توجد مقالات مطابقة للبحث
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass-card group overflow-hidden"
                >
                  <div className="relative h-48 overflow-hidden rounded-t-2xl -m-6 mb-4">
                    <LazyImage
                      src={post.cover_image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=500&fit=crop'}
                      alt={post.title}
                      wrapperClassName="absolute inset-0"
                      className="transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 z-10">
                      <span className="px-3 py-1 bg-primary/90 text-primary-foreground text-xs font-medium rounded-lg">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="pt-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(post.published_at || post.created_at).toLocaleDateString('ar-EG')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {getReadTime(post.excerpt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {post.views_count}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300">
                      {post.title}
                    </h3>

                    <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    <Link
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 text-primary font-medium text-sm hover:gap-3 transition-all duration-300"
                    >
                      اقرأ المزيد
                      <ArrowLeft className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <Newsletter />
    </Layout>
  );
};

export default BlogPage;
