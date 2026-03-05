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
import SEO from '@/components/SEO';

const services = [
  { icon: Code2, title: 'تطوير المواقع', description: 'مواقع احترافية سريعة ومتجاوبة مع جميع الأجهزة', slug: 'web-development' },
  { icon: Smartphone, title: 'تطوير التطبيقات', description: 'تطبيقات موبايل متكاملة لأندرويد و iOS', slug: 'mobile-apps' },
  { icon: Palette, title: 'تصميم الهوية البصرية', description: 'شعارات وهويات بصرية تعكس قوة علامتك التجارية', slug: 'branding' },
  { icon: Megaphone, title: 'التسويق الرقمي', description: 'حملات إعلانية فعّالة على جميع المنصات', slug: 'digital-marketing' },
  { icon: Search, title: 'تحسين محركات البحث', description: 'نجعل موقعك يتصدر نتائج البحث', slug: 'seo' },
  { icon: PenTool, title: 'إدارة المحتوى', description: 'محتوى إبداعي يجذب جمهورك ويحقق أهدافك', slug: 'content-management' },
];

const Index = () => {
  return (
    <Layout>
      <SEO 
        title="الرئيسية" 
        description="نساعد الشركات على زيادة مبيعاتها بنسبة تصل إلى 150% من خلال حلول رقمية متكاملة تشمل تصميم المواقع، تطوير التطبيقات، التسويق الرقمي، والهوية البصرية."
      />

      {/* Hero Section - Clean & Modern */}
      <section id="hero" className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Subtle background accent */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[120px] will-change-transform" />
          <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] will-change-transform" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block px-5 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-8"
            >
              شريكك الرقمي للنجاح 🚀
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6"
            >
              نبني لك حضورًا رقميًا
              <br />
              <span className="text-primary">يحقق نتائج حقيقية</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed"
            >
              حلول رقمية متكاملة من التصميم إلى التطوير والتسويق.
              <br />
              نساعد الشركات على زيادة مبيعاتها بنسبة تصل إلى <span className="text-primary font-bold">150%</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Link to="/request" className="btn-primary flex items-center gap-2 text-lg px-8 py-4">
                <Sparkles className="w-5 h-5" />
                ابدأ مشروعك الآن
              </Link>
              <Link to="/portfolio" className="btn-ghost text-lg px-8 py-4">
                شاهد أعمالنا
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </motion.div>

            {/* Trust metrics - inline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap justify-center gap-8 mt-14 text-center"
            >
              {[
                { value: '+150', label: 'مشروع منجز' },
                { value: '+50', label: 'عميل سعيد' },
                { value: '+5', label: 'سنوات خبرة' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-black text-primary">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>
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

      {/* How We Work */}
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
            كل ما تحتاجه <span className="text-primary">تحت سقف واحد</span>
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
              <Link to={`/services/${service.slug}`} className="block h-full">
                <div className="service-card group h-full">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                    <service.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{service.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{service.description}</p>
                  <span className="inline-flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all">
                    اعرف المزيد
                    <ArrowLeft className="w-4 h-4" />
                  </span>
                </div>
              </Link>
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

      {/* Featured Project */}
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
              <Link to="/request" className="btn-secondary flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                ابدأ الآن مجانًا
              </Link>
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
