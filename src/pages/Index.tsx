import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Palette, 
  Code2, 
  Megaphone, 
  Smartphone, 
  Search, 
  PenTool,
  MessageCircle,
  Sparkles,
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Testimonials from '@/components/home/Testimonials';
import StatsCounter from '@/components/home/StatsCounter';
import Newsletter from '@/components/home/Newsletter';
import FAQ from '@/components/home/FAQ';
import TrustedCompanies from '@/components/home/TrustedCompanies';
import HowWeWork from '@/components/home/HowWeWork';
import FeaturedProject from '@/components/home/FeaturedProject';
import TrustIndicators from '@/components/home/TrustIndicators';
import TypewriterText from '@/components/ui/TypewriterText';
import AnimatedBlob from '@/components/ui/AnimatedBlob';
import ScrollDownIndicator from '@/components/ui/ScrollDownIndicator';
import TiltCard from '@/components/ui/TiltCard';
import SectionIndicator from '@/components/ui/SectionIndicator';
import MagneticButton from '@/components/ui/MagneticButton';
import SEO from '@/components/SEO';

const services = [
  {
    icon: Code2,
    title: 'تطوير المواقع',
    description: 'مواقع احترافية سريعة ومتجاوبة مع جميع الأجهزة',
  },
  {
    icon: Smartphone,
    title: 'تطوير التطبيقات',
    description: 'تطبيقات موبايل متكاملة لأندرويد و iOS',
  },
  {
    icon: Palette,
    title: 'تصميم الهوية البصرية',
    description: 'شعارات وهويات بصرية تعكس قوة علامتك التجارية',
  },
  {
    icon: Megaphone,
    title: 'التسويق الرقمي',
    description: 'حملات إعلانية فعّالة على جميع المنصات',
  },
  {
    icon: Search,
    title: 'تحسين محركات البحث',
    description: 'نجعل موقعك يتصدر نتائج البحث',
  },
  {
    icon: PenTool,
    title: 'إدارة المحتوى',
    description: 'محتوى إبداعي يجذب جمهورك ويحقق أهدافك',
  },
];

const sections = [
  { id: 'hero', label: 'الرئيسية' },
  { id: 'trusted', label: 'شركاؤنا' },
  { id: 'stats', label: 'الإحصائيات' },
  { id: 'how-we-work', label: 'كيف نعمل' },
  { id: 'services', label: 'الخدمات' },
  { id: 'featured', label: 'مشروع مميز' },
  { id: 'testimonials', label: 'آراء العملاء' },
  { id: 'faq', label: 'الأسئلة الشائعة' },
  { id: 'cta', label: 'ابدأ الآن' },
];

const typewriterTexts = [
  'مواقع إلكترونية',
  'تطبيقات موبايل',
  'هوية بصرية',
  'تسويق رقمي',
  'متاجر إلكترونية',
];

const Index = () => {
  return (
    <Layout>
      <SEO 
        title="الرئيسية" 
        description="نساعد الشركات على زيادة مبيعاتها بنسبة تصل إلى 150% من خلال حلول رقمية متكاملة تشمل تصميم المواقع، تطوير التطبيقات، التسويق الرقمي، والهوية البصرية."
      />
      {/* Section Indicator */}
      <SectionIndicator sections={sections} />

      {/* Hero Section */}
      <section id="hero" className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <AnimatedBlob className="top-1/4 right-1/4" color="primary" size="xl" delay={0} />
          <AnimatedBlob className="bottom-1/4 left-1/4" color="secondary" size="lg" delay={2} />
          <AnimatedBlob className="top-1/2 left-1/2" color="primary" size="md" delay={4} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                🚀 شريكك الرقمي للنجاح
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="hero-title mb-6"
            >
              نحوّل أفكارك إلى
              <br />
              <span className="text-gradient">
                <TypewriterText texts={typewriterTexts} />
              </span>
            </motion.h1>

            {/* Enhanced Value Proposition */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hero-subtitle mb-4 max-w-2xl"
            >
              نساعد الشركات على زيادة مبيعاتها بنسبة تصل إلى{' '}
              <span className="text-secondary font-bold">150%</span> خلال 3 أشهر
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-muted-foreground text-lg mb-8 max-w-2xl"
            >
              حلول رقمية متكاملة من التصميم إلى التطوير والتسويق - كل ما تحتاجه تحت سقف واحد
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <MagneticButton className="btn-secondary">
                <Link to="/request" className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  احصل على استشارة مجانية
                </Link>
              </MagneticButton>
              <Link to="/portfolio" className="btn-ghost">
                شاهد أعمالنا
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <TrustIndicators />
          </div>

          {/* Scroll Down Indicator */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
            <ScrollDownIndicator targetId="trusted" />
          </div>
        </div>
      </section>

      {/* Trusted Companies */}
      <div id="trusted">
        <TrustedCompanies />
      </div>

      {/* Stats Counter */}
      <div id="stats">
        <StatsCounter />
      </div>

      {/* How We Work - NEW */}
      <div id="how-we-work">
        <HowWeWork />
      </div>

      {/* Services Section */}
      <section id="services" className="section-container">
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-medium mb-4"
          >
            خدماتنا
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="section-title"
          >
            كل ما تحتاجه <span className="text-gradient">تحت سقف واحد</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="section-subtitle mx-auto"
          >
            نقدم مجموعة متكاملة من الخدمات الرقمية لتلبية جميع احتياجاتك
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <TiltCard className="h-full">
                <div className="service-card group h-full">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                    <service.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{service.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{service.description}</p>
                  <Link 
                    to={`/services`} 
                    className="inline-flex items-center gap-2 text-primary text-sm font-medium hover:gap-3 transition-all"
                  >
                    اعرف المزيد
                    <ArrowLeft className="w-4 h-4" />
                  </Link>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link to="/services" className="btn-primary">
            اكتشف جميع خدماتنا
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>

      {/* Featured Project - NEW */}
      <div id="featured">
        <FeaturedProject />
      </div>

      {/* Testimonials */}
      <div id="testimonials">
        <Testimonials />
      </div>

      {/* FAQ */}
      <div id="faq">
        <FAQ />
      </div>

      {/* Newsletter */}
      <Newsletter />

      {/* CTA Section */}
      <section id="cta" className="section-container">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card relative overflow-hidden text-center py-16 px-8"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />
          <div className="relative z-10">
            <h2 className="section-title mb-4">
              جاهز تضاعف مبيعاتك؟
            </h2>
            <p className="section-subtitle mx-auto mb-8">
              تواصل معنا الآن واحصل على استشارة مجانية لمشروعك
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <MagneticButton>
                <Link to="/request" className="btn-secondary flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  ابدأ الآن مجانًا
                </Link>
              </MagneticButton>
              <a
                href="https://wa.me/201558663972"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                <MessageCircle className="w-5 h-5" />
                تواصل عبر واتساب
              </a>
            </div>
          </div>
        </motion.div>
      </section>
    </Layout>
  );
};

export default Index;
