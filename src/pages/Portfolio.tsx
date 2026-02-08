import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ExternalLink, 
  ArrowLeft, 
  Star, 
  TrendingUp,
  Filter,
  LayoutGrid,
  List
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { GridShimmer } from '@/components/ui/ShimmerSkeleton';
import LazyImage from '@/components/ui/LazyImage';
import SEO from '@/components/SEO';
import MagneticButton from '@/components/ui/MagneticButton';

interface PortfolioItem {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_image: string | null;
  category: string;
  technologies: string[];
  client_name: string | null;
  project_url: string | null;
  featured: boolean;
  results?: {
    metric: string;
    value: string;
  }[];
}

const categories = ['الكل', 'تصميم مواقع', 'تطبيقات موبايل', 'هوية بصرية', 'متاجر إلكترونية', 'تسويق رقمي'];
const industries = ['الكل', 'عقارات', 'تجارة إلكترونية', 'مطاعم', 'تقنية', 'تعليم', 'صحة'];

// Fallback static projects with results
const staticProjects: PortfolioItem[] = [
  {
    id: '1',
    title: 'متجر إلكتروني للأزياء',
    slug: 'fashion-store',
    category: 'متاجر إلكترونية',
    description: 'متجر إلكتروني متكامل لبيع الملابس والإكسسوارات مع نظام دفع آمن',
    cover_image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop',
    technologies: ['تجارة إلكترونية', 'تصميم UI/UX', 'React'],
    client_name: 'Fashion Co',
    project_url: null,
    featured: true,
    results: [
      { metric: 'زيادة المبيعات', value: '+200%' },
      { metric: 'معدل التحويل', value: '4.5%' },
      { metric: 'الزيارات الشهرية', value: '+15K' },
    ],
  },
  {
    id: '2',
    title: 'تطبيق توصيل طعام',
    slug: 'food-delivery-app',
    category: 'تطبيقات موبايل',
    description: 'تطبيق متكامل لتوصيل الطعام مع تتبع الطلبات في الوقت الفعلي',
    cover_image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop',
    technologies: ['تطبيقات', 'iOS', 'Android'],
    client_name: 'Food Express',
    project_url: null,
    featured: true,
    results: [
      { metric: 'التحميلات', value: '+45K' },
      { metric: 'زيادة الطلبات', value: '+120%' },
      { metric: 'تقييم المتجر', value: '4.9★' },
    ],
  },
  {
    id: '3',
    title: 'موقع شركة عقارات',
    slug: 'real-estate-website',
    category: 'تصميم مواقع',
    description: 'موقع احترافي لعرض العقارات مع نظام بحث متقدم وخرائط تفاعلية',
    cover_image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop',
    technologies: ['عقارات', 'Next.js', 'خرائط'],
    client_name: 'Real Estate Pro',
    project_url: null,
    featured: false,
    results: [
      { metric: 'زيادة الزيارات', value: '+180%' },
      { metric: 'العملاء المحتملين', value: '+250%' },
      { metric: 'سرعة التحميل', value: '0.8s' },
    ],
  },
  {
    id: '4',
    title: 'هوية بصرية لمطعم',
    slug: 'restaurant-branding',
    category: 'هوية بصرية',
    description: 'هوية بصرية متكاملة تشمل الشعار والمطبوعات والتواجد الرقمي',
    cover_image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop',
    technologies: ['هوية بصرية', 'شعار', 'مطبوعات'],
    client_name: 'Fine Dining',
    project_url: null,
    featured: false,
    results: [
      { metric: 'زيادة الحجوزات', value: '+85%' },
      { metric: 'تفاعل سوشيال', value: '+150%' },
      { metric: 'تقييم العملاء', value: '5★' },
    ],
  },
  {
    id: '5',
    title: 'حملة تسويقية لمنتج',
    slug: 'product-marketing-campaign',
    category: 'تسويق رقمي',
    description: 'حملة إعلانية متكاملة على السوشيال ميديا حققت نتائج مذهلة',
    cover_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
    technologies: ['تسويق', 'إعلانات', 'سوشيال ميديا'],
    client_name: 'Tech Startup',
    project_url: null,
    featured: false,
    results: [
      { metric: 'زيادة المبيعات', value: '+300%' },
      { metric: 'عائد الإعلانات', value: '8X' },
      { metric: 'تكلفة العميل', value: '-40%' },
    ],
  },
  {
    id: '6',
    title: 'منصة تعليمية',
    slug: 'educational-platform',
    category: 'تصميم مواقع',
    description: 'منصة تعليمية متكاملة مع نظام اشتراكات ومتابعة تقدم الطلاب',
    cover_image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600&h=400&fit=crop',
    technologies: ['تعليم', 'LMS', 'اشتراكات'],
    client_name: 'EduLearn',
    project_url: null,
    featured: true,
    results: [
      { metric: 'الطلاب المسجلين', value: '+5K' },
      { metric: 'معدل الإكمال', value: '78%' },
      { metric: 'رضا الطلاب', value: '4.8★' },
    ],
  },
];

const PortfolioPage = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('الكل');
  const [activeIndustry, setActiveIndustry] = useState('الكل');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from('portfolio_items')
      .select('id, title, slug, description, cover_image, category, technologies, client_name, project_url, featured')
      .eq('status', 'published')
      .order('display_order', { ascending: true });

    if (!error && data && data.length > 0) {
      setItems(data as PortfolioItem[]);
    } else {
      setItems(staticProjects);
    }
    setLoading(false);
  };

  const filteredItems = items.filter(item => {
    return activeCategory === 'الكل' || item.category === activeCategory;
  });

  const featuredItems = filteredItems.filter(item => item.featured);
  const regularItems = filteredItems.filter(item => !item.featured);

  return (
    <Layout>
      <SEO 
        title="أعمالنا"
        description="استعرض مشاريعنا الناجحة في تطوير المواقع، تطبيقات الموبايل، الهوية البصرية، والتسويق الرقمي. نتائج ملموسة وعملاء سعداء."
        keywords="أعمالنا, portfolio, مشاريع, تصميم مواقع, تطبيقات"
      />

      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-primary/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 left-1/3 w-60 h-60 bg-secondary/20 rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
            >
              أعمالنا
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="hero-title mb-6"
            >
              مشاريع <span className="text-gradient">نفتخر بها</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="hero-subtitle mb-4"
            >
              نماذج من أعمالنا السابقة التي نفذناها لعملائنا الكرام
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground"
            >
              <TrendingUp className="w-5 h-5 inline-block ml-2 text-primary" />
              كل مشروع يعرض نتائج حقيقية وقابلة للقياس
            </motion.p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          {/* Category Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-2"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* View Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      {featuredItems.length > 0 && (
        <section className="container mx-auto px-4 pb-8">
          <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Star className="w-5 h-5 text-secondary fill-secondary" />
            مشاريع مميزة
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {featuredItems.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-0 overflow-hidden group"
              >
                <div className="grid md:grid-cols-2">
                  <div className="relative aspect-video md:aspect-auto">
                    <LazyImage
                      src={project.cover_image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop'}
                      alt={project.title}
                      wrapperClassName="absolute inset-0"
                      className="transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="flex items-center gap-1 px-2 py-1 bg-secondary/90 text-secondary-foreground text-xs font-medium rounded-lg">
                        <Star className="w-3 h-3 fill-current" />
                        مميز
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <span className="text-xs text-primary font-medium">{project.category}</span>
                    <h3 className="text-xl font-bold text-foreground mt-1 mb-2">{project.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{project.description}</p>
                    
                    {/* Results */}
                    {project.results && (
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        {project.results.map((result, i) => (
                          <div key={i} className="text-center p-2 bg-muted/50 rounded-lg">
                            <div className="text-lg font-bold text-primary">{result.value}</div>
                            <div className="text-[10px] text-muted-foreground">{result.metric}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    <Link 
                      to={`/portfolio/${project.slug}`} 
                      className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all"
                    >
                      تفاصيل المشروع
                      <ArrowLeft className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Projects Grid */}
      <section className="section-container pt-8">
        {loading ? (
          <GridShimmer count={6} />
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            لا توجد مشاريع في هذا التصنيف
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'
          }>
            {regularItems.map((project, index) => (
              viewMode === 'grid' ? (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group glass-card p-0 overflow-hidden cursor-pointer"
                >
                  <div className="relative overflow-hidden aspect-video">
                    <LazyImage
                      src={project.cover_image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop'}
                      alt={project.title}
                      wrapperClassName="absolute inset-0"
                      className="transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <Link to={`/portfolio/${project.slug}`} className="btn-primary text-sm">
                        تفاصيل المشروع
                        <ArrowLeft className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                  <div className="p-5">
                    <span className="text-xs text-primary font-medium">{project.category}</span>
                    <h3 className="text-lg font-bold text-foreground mt-1 mb-2">{project.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{project.description}</p>
                    
                    {/* Mini Results */}
                    {project.results && (
                      <div className="flex gap-3 mb-3">
                        {project.results.slice(0, 2).map((result, i) => (
                          <span key={i} className="text-xs">
                            <span className="font-bold text-primary">{result.value}</span>
                            <span className="text-muted-foreground mr-1">{result.metric}</span>
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {project.technologies?.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 rounded-lg bg-muted text-muted-foreground text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-card p-4"
                >
                  <div className="flex gap-4">
                    <div className="w-32 h-24 rounded-xl overflow-hidden shrink-0">
                      <LazyImage
                        src={project.cover_image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop'}
                        alt={project.title}
                        wrapperClassName="w-full h-full"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-xs text-primary font-medium">{project.category}</span>
                          <h3 className="text-lg font-bold text-foreground">{project.title}</h3>
                        </div>
                        {project.results && (
                          <span className="text-sm font-bold text-primary">{project.results[0].value}</span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{project.description}</p>
                      <Link 
                        to={`/portfolio/${project.slug}`} 
                        className="inline-flex items-center gap-1 text-sm text-primary mt-2 hover:gap-2 transition-all"
                      >
                        التفاصيل
                        <ArrowLeft className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="section-container">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card text-center py-12 px-8 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />
          <div className="relative z-10">
            <h2 className="section-title mb-4">عندك مشروع مشابه؟</h2>
            <p className="section-subtitle mx-auto mb-8">
              دعنا نحولها إلى حقيقة رقمية مذهلة مع نتائج قابلة للقياس
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <MagneticButton>
                <Link to="/request" className="btn-secondary">
                  ابدأ مشروعك الآن
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              </MagneticButton>
              <a
                href="https://wa.me/201558663972"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                استشارة مجانية
              </a>
            </div>
          </div>
        </motion.div>
      </section>
    </Layout>
  );
};

export default PortfolioPage;
