import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ExternalLink, ArrowLeft } from 'lucide-react';
import Layout from '@/components/layout/Layout';

const projects = [
  {
    title: 'متجر إلكتروني للأزياء',
    category: 'متاجر إلكترونية',
    description: 'متجر إلكتروني متكامل لبيع الملابس والإكسسوارات مع نظام دفع آمن',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop',
    tags: ['تجارة إلكترونية', 'تصميم UI/UX', 'React'],
  },
  {
    title: 'تطبيق توصيل طعام',
    category: 'تطبيقات موبايل',
    description: 'تطبيق متكامل لتوصيل الطعام مع تتبع الطلبات في الوقت الفعلي',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop',
    tags: ['تطبيقات', 'iOS', 'Android'],
  },
  {
    title: 'موقع شركة عقارات',
    category: 'مواقع الويب',
    description: 'موقع احترافي لعرض العقارات مع نظام بحث متقدم وخرائط تفاعلية',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop',
    tags: ['عقارات', 'Next.js', 'خرائط'],
  },
  {
    title: 'هوية بصرية لمطعم',
    category: 'تصميم الهوية',
    description: 'هوية بصرية متكاملة تشمل الشعار والمطبوعات والتواجد الرقمي',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop',
    tags: ['هوية بصرية', 'شعار', 'مطبوعات'],
  },
  {
    title: 'حملة تسويقية لمنتج',
    category: 'التسويق الرقمي',
    description: 'حملة إعلانية متكاملة على السوشيال ميديا حققت نتائج مذهلة',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
    tags: ['تسويق', 'إعلانات', 'سوشيال ميديا'],
  },
  {
    title: 'منصة تعليمية',
    category: 'مواقع الويب',
    description: 'منصة تعليمية متكاملة مع نظام اشتراكات ومتابعة تقدم الطلاب',
    image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600&h=400&fit=crop',
    tags: ['تعليم', 'LMS', 'اشتراكات'],
  },
];

const categories = ['الكل', 'مواقع الويب', 'تطبيقات موبايل', 'متاجر إلكترونية', 'تصميم الهوية', 'التسويق الرقمي'];

const PortfolioPage = () => {
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
          {categories.map((category, index) => (
            <button
              key={category}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                index === 0
                  ? 'bg-primary text-white'
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group glass-card p-0 overflow-hidden cursor-pointer"
            >
              <div className="relative overflow-hidden aspect-video">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <button className="btn-primary text-sm">
                    عرض المشروع
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-5">
                <span className="text-xs text-primary font-medium">{project.category}</span>
                <h3 className="text-lg font-bold text-foreground mt-1 mb-2">{project.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
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
