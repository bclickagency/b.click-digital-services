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
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Testimonials from '@/components/home/Testimonials';
import StatsCounter from '@/components/home/StatsCounter';
import Newsletter from '@/components/home/Newsletter';
import FAQ from '@/components/home/FAQ';
import TypewriterText from '@/components/ui/TypewriterText';
import AnimatedBlob from '@/components/ui/AnimatedBlob';
import ScrollDownIndicator from '@/components/ui/ScrollDownIndicator';
import TiltCard from '@/components/ui/TiltCard';
import SectionIndicator from '@/components/ui/SectionIndicator';
import MagneticButton from '@/components/ui/MagneticButton';

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
  { id: 'stats', label: 'الإحصائيات' },
  { id: 'services', label: 'الخدمات' },
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

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hero-subtitle mb-8 max-w-2xl"
            >
              نقدم حلولًا رقمية متكاملة تساعد أعمالك على النمو والتميز في السوق الرقمي. من التصميم إلى التطوير والتسويق، نحن هنا لنجاحك.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <MagneticButton className="btn-secondary">
                <Link to="/request" className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  ابدأ مشروعك الآن
                </Link>
              </MagneticButton>
              <Link to="/services" className="btn-ghost">
                اكتشف خدماتنا
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>

          {/* Scroll Down Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <ScrollDownIndicator targetId="stats" />
          </div>
        </div>
      </section>

      {/* Stats Counter */}
      <div id="stats">
        <StatsCounter />
      </div>

      {/* Services Section */}
      <section id="services" className="section-container">
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
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
            حلول رقمية <span className="text-gradient">شاملة</span>
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
                  <p className="text-muted-foreground text-sm">{service.description}</p>
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
            اكتشف المزيد
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>

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
              جاهز تبدأ مشروعك؟
            </h2>
            <p className="section-subtitle mx-auto mb-8">
              تواصل معنا الآن واحصل على استشارة مجانية لمشروعك
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <MagneticButton>
                <Link to="/request" className="btn-secondary flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  ابدأ الآن
                </Link>
              </MagneticButton>
              <a
                href="https://wa.me/201558663972"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
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
