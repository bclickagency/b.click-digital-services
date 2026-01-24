import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, Search } from 'lucide-react';
import Layout from '@/components/layout/Layout';

const blogPosts = [
  {
    id: 1,
    title: 'أهمية تصميم الهوية البصرية لنجاح علامتك التجارية',
    excerpt: 'تعرف على كيف يمكن لهوية بصرية قوية أن تميز علامتك التجارية وتبني ثقة العملاء وتزيد من المبيعات.',
    category: 'تصميم',
    date: '2024-01-15',
    readTime: '5 دقائق',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=500&fit=crop',
  },
  {
    id: 2,
    title: 'كيف تختار أفضل منصة لتطوير متجرك الإلكتروني',
    excerpt: 'دليل شامل لاختيار المنصة المناسبة لمتجرك الإلكتروني مع مقارنة بين أشهر المنصات المتاحة.',
    category: 'تطوير',
    date: '2024-01-10',
    readTime: '7 دقائق',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=500&fit=crop',
  },
  {
    id: 3,
    title: 'استراتيجيات التسويق الرقمي الفعالة في 2024',
    excerpt: 'اكتشف أحدث استراتيجيات التسويق الرقمي التي ستساعدك على الوصول لجمهورك المستهدف وزيادة التحويلات.',
    category: 'تسويق',
    date: '2024-01-05',
    readTime: '6 دقائق',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop',
  },
  {
    id: 4,
    title: 'تحسين محركات البحث SEO: دليل المبتدئين',
    excerpt: 'تعلم أساسيات تحسين محركات البحث وكيف يمكنك تحسين ترتيب موقعك في نتائج Google.',
    category: 'SEO',
    date: '2024-01-01',
    readTime: '8 دقائق',
    image: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=800&h=500&fit=crop',
  },
  {
    id: 5,
    title: 'أهمية تجربة المستخدم UX في نجاح المواقع',
    excerpt: 'كيف تؤثر تجربة المستخدم على معدلات التحويل ورضا العملاء وكيف يمكنك تحسينها.',
    category: 'تصميم',
    date: '2023-12-28',
    readTime: '5 دقائق',
    image: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&h=500&fit=crop',
  },
  {
    id: 6,
    title: 'كيف تبني علامة تجارية قوية على السوشيال ميديا',
    excerpt: 'نصائح عملية لبناء حضور قوي على منصات التواصل الاجتماعي وزيادة التفاعل مع جمهورك.',
    category: 'تسويق',
    date: '2023-12-25',
    readTime: '6 دقائق',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=500&fit=crop',
  },
];

const categories = ['الكل', 'تصميم', 'تطوير', 'تسويق', 'SEO'];

const BlogPage = () => {
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
            {categories.map((category, index) => (
              <button
                key={category}
                className={`px-6 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  index === 0
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card group overflow-hidden"
              >
                <div className="relative h-48 overflow-hidden rounded-t-2xl -m-6 mb-4">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-primary/90 text-primary-foreground text-xs font-medium rounded-lg">
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="pt-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(post.date).toLocaleDateString('ar-EG')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.readTime}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300">
                    {post.title}
                  </h3>

                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <Link
                    to={`/blog/${post.id}`}
                    className="inline-flex items-center gap-2 text-primary font-medium text-sm hover:gap-3 transition-all duration-300"
                  >
                    اقرأ المزيد
                    <ArrowLeft className="w-4 h-4" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Load More Button */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <button className="btn-secondary">
              تحميل المزيد
            </button>
          </motion.div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="section-padding">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card text-center max-w-2xl mx-auto"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              اشترك في نشرتنا البريدية
            </h2>
            <p className="text-muted-foreground mb-6">
              احصل على أحدث المقالات والنصائح مباشرة في بريدك الإلكتروني
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="بريدك الإلكتروني"
                className="form-input flex-1"
              />
              <button className="btn-primary whitespace-nowrap">
                اشترك الآن
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default BlogPage;
