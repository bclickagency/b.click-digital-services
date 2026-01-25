import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ExternalLink, ArrowLeft, Star } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { GridSkeleton } from '@/components/ui/SkeletonLoader';

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
}

const categories = ['الكل', 'تصميم مواقع', 'تطبيقات موبايل', 'هوية بصرية', 'متاجر إلكترونية', 'تسويق رقمي'];

// Fallback static projects
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
  },
];

const PortfolioPage = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('الكل');

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
      // Use static projects as fallback
      setItems(staticProjects);
    }
    setLoading(false);
  };

  const filteredItems = items.filter(item => {
    return activeCategory === 'الكل' || item.category === activeCategory;
  });

  return (
    <Layout>
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
              className="hero-subtitle"
            >
              نماذج من أعمالنا السابقة التي نفذناها لعملائنا الكرام
            </motion.p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap justify-center gap-3"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>
      </section>

      {/* Projects Grid */}
      <section className="section-container pt-8">
        {loading ? (
          <GridSkeleton count={6} />
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            لا توجد مشاريع في هذا التصنيف
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group glass-card p-0 overflow-hidden cursor-pointer"
              >
                <div className="relative overflow-hidden aspect-video">
                  <img
                    src={project.cover_image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop'}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {project.featured && (
                    <div className="absolute top-4 left-4">
                      <span className="flex items-center gap-1 px-2 py-1 bg-secondary/90 text-secondary-foreground text-xs font-medium rounded-lg">
                        <Star className="w-3 h-3 fill-current" />
                        مميز
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    {project.project_url ? (
                      <a 
                        href={project.project_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn-primary text-sm"
                      >
                        عرض المشروع
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    ) : (
                      <Link to={`/portfolio/${project.slug}`} className="btn-primary text-sm">
                        تفاصيل المشروع
                        <ArrowLeft className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </div>
                <div className="p-5">
                  <span className="text-xs text-primary font-medium">{project.category}</span>
                  <h3 className="text-lg font-bold text-foreground mt-1 mb-2">{project.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{project.description}</p>
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
          className="glass-card text-center py-12 px-8 glow-primary"
        >
          <h2 className="section-title mb-4">عندك فكرة مشروع؟</h2>
          <p className="section-subtitle mx-auto mb-8">
            دعنا نحولها إلى حقيقة رقمية مذهلة
          </p>
          <Link to="/request" className="btn-secondary">
            ابدأ مشروعك الآن
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>
    </Layout>
  );
};

export default PortfolioPage;
