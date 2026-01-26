import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  ExternalLink, 
  Calendar,
  User,
  Tag,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { ShimmerSkeleton, TextShimmer } from '@/components/ui/ShimmerSkeleton';
import LazyImage from '@/components/ui/LazyImage';

interface PortfolioItem {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  full_description: string | null;
  cover_image: string | null;
  images: string[] | null;
  category: string;
  technologies: string[] | null;
  client_name: string | null;
  project_url: string | null;
  created_at: string;
}

// Fallback project for demo
const fallbackProject: PortfolioItem = {
  id: '1',
  title: 'متجر إلكتروني للأزياء',
  slug: 'fashion-store',
  description: 'متجر إلكتروني متكامل لبيع الملابس والإكسسوارات مع نظام دفع آمن',
  full_description: `
    <h2>نظرة عامة على المشروع</h2>
    <p>تم تطوير متجر إلكتروني متكامل لشركة Fashion Co لبيع الملابس والإكسسوارات النسائية والرجالية. يتميز المتجر بتصميم عصري وتجربة مستخدم سلسة.</p>
    
    <h2>التحديات</h2>
    <ul>
      <li>إنشاء تجربة تسوق سهلة وممتعة</li>
      <li>تكامل مع بوابات دفع متعددة</li>
      <li>نظام إدارة مخزون متقدم</li>
      <li>تحسين سرعة التحميل للصور عالية الجودة</li>
    </ul>
    
    <h2>الحلول المقدمة</h2>
    <p>قمنا بتطوير منصة تجارة إلكترونية متكاملة تشمل:</p>
    <ul>
      <li>واجهة مستخدم جذابة ومتجاوبة مع جميع الأجهزة</li>
      <li>نظام تصفية وبحث متقدم للمنتجات</li>
      <li>سلة مشتريات ذكية مع حفظ المنتجات</li>
      <li>تكامل مع PayPal و Stripe للدفع الآمن</li>
      <li>لوحة تحكم إدارية شاملة</li>
    </ul>
    
    <h2>النتائج</h2>
    <p>بعد إطلاق المتجر، حققنا:</p>
    <ul>
      <li>زيادة 200% في المبيعات خلال 3 أشهر</li>
      <li>معدل تحويل 4.5% (أعلى من متوسط الصناعة)</li>
      <li>تقييم 4.9/5 من العملاء</li>
    </ul>
  `,
  cover_image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop',
  images: [
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
  ],
  category: 'متاجر إلكترونية',
  technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'Tailwind CSS'],
  client_name: 'Fashion Co',
  project_url: null,
  created_at: '2024-01-15',
};

const PortfolioItemPage = () => {
  const { slug } = useParams();
  const [project, setProject] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    fetchProject();
  }, [slug]);

  const fetchProject = async () => {
    const { data, error } = await supabase
      .from('portfolio_items')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (!error && data) {
      setProject(data as PortfolioItem);
    } else {
      // Use fallback project for demo
      setProject(fallbackProject);
    }
    setLoading(false);
  };

  const images = project?.images?.length ? project.images : [project?.cover_image || ''];

  const nextImage = () => {
    setActiveImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveImage((prev) => (prev - 1 + images.length) % images.length);
  };

  if (loading) {
    return (
      <Layout>
        <div className="section-container">
          <div className="max-w-5xl mx-auto">
            <ShimmerSkeleton className="h-8 w-3/4 mb-4" />
            <ShimmerSkeleton className="h-[60vh] w-full rounded-2xl mb-8" />
            <TextShimmer lines={8} />
          </div>
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="section-container text-center">
          <h1 className="text-2xl font-bold mb-4">المشروع غير موجود</h1>
          <Link to="/portfolio" className="btn-primary">
            <ArrowRight className="w-5 h-5 rotate-180" />
            العودة للأعمال
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero */}
      <section className="section-padding">
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Link
                to="/portfolio"
                className="inline-flex items-center gap-2 text-primary mb-6 hover:gap-3 transition-all"
              >
                <ArrowRight className="w-5 h-5 rotate-180" />
                العودة للأعمال
              </Link>

              <span className="inline-block px-4 py-1 bg-primary/10 text-primary text-sm font-medium rounded-lg mb-4">
                {project.category}
              </span>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-6">
                {project.title}
              </h1>

              <p className="text-lg text-muted-foreground mb-8">
                {project.description}
              </p>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-6 text-sm text-muted-foreground mb-8">
                {project.client_name && (
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    العميل: {project.client_name}
                  </span>
                )}
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(project.created_at).toLocaleDateString('ar-EG', {
                    year: 'numeric',
                    month: 'long',
                  })}
                </span>
                {project.project_url && (
                  <a
                    href={project.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    <ExternalLink className="w-4 h-4" />
                    زيارة المشروع
                  </a>
                )}
              </div>
            </motion.div>

            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="relative rounded-2xl overflow-hidden mb-12"
            >
              <div className="aspect-video relative">
                <LazyImage
                  src={images[activeImage]}
                  alt={project.title}
                  wrapperClassName="absolute inset-0"
                />
              </div>

              {/* Gallery Navigation */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  {/* Dots */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImage(index)}
                        className={`w-3 h-3 rounded-full transition-all ${
                          activeImage === index 
                            ? 'bg-primary w-8' 
                            : 'bg-white/50 hover:bg-white/80'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </motion.div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-12">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                      activeImage === index 
                        ? 'border-primary' 
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${project.title} - ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Technologies */}
            {project.technologies && project.technologies.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-12"
              >
                <h3 className="flex items-center gap-2 text-lg font-bold text-foreground mb-4">
                  <Tag className="w-5 h-5 text-primary" />
                  التقنيات المستخدمة
                </h3>
                <div className="flex flex-wrap gap-3">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-4 py-2 bg-primary/10 text-primary rounded-xl text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Full Description */}
            {project.full_description && (
              <motion.article
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="prose prose-lg prose-invert max-w-none glass-card"
                dangerouslySetInnerHTML={{ __html: project.full_description }}
              />
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-container pt-0">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card text-center py-12 px-8 glow-primary max-w-3xl mx-auto"
        >
          <h2 className="section-title mb-4">عندك مشروع مشابه؟</h2>
          <p className="section-subtitle mx-auto mb-8">
            دعنا نساعدك في تحويل فكرتك إلى حقيقة
          </p>
          <Link to="/request" className="btn-secondary">
            ابدأ مشروعك الآن
            <ArrowRight className="w-5 h-5 rotate-180" />
          </Link>
        </motion.div>
      </section>
    </Layout>
  );
};

export default PortfolioItemPage;
