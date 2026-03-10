import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, MessageCircle } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import HeroVideoBackground from '@/components/home/HeroVideoBackground';
import LiveProjectCounter from '@/components/home/LiveProjectCounter';
import TrustedCompanies from '@/components/home/TrustedCompanies';
import ResultsSpotlight from '@/components/home/ResultsSpotlight';
import InteractiveServiceExplorer from '@/components/home/InteractiveServiceExplorer';
import BeforeAfterSlider from '@/components/home/BeforeAfterSlider';
import HowWeWork from '@/components/home/HowWeWork';
import FeaturedProject from '@/components/home/FeaturedProject';
import OurClients from '@/components/home/OurClients';
import Testimonials from '@/components/home/Testimonials';
import FAQ from '@/components/home/FAQ';
import Newsletter from '@/components/home/Newsletter';
import SmartCTABanner from '@/components/home/SmartCTABanner';
import FloatingSocialProof from '@/components/home/FloatingSocialProof';
import SEO from '@/components/SEO';

const Index = () => {
  return (
    <Layout>
      <SEO 
        title="الرئيسية" 
        description="نساعد الشركات على زيادة مبيعاتها بنسبة تصل إلى 150% من خلال حلول رقمية متكاملة تشمل تصميم المواقع، تطوير التطبيقات، التسويق الرقمي، والهوية البصرية."
      />

      {/* Hero Section with Video Background */}
      <section id="hero" className="relative min-h-[90vh] flex items-center overflow-hidden">
        <HeroVideoBackground />

        <div className="container mx-auto px-4 relative z-30">
          <div className="max-w-3xl mx-auto text-center">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block px-5 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-8 backdrop-blur-sm"
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
              <Link to="/portfolio" className="btn-ghost text-lg px-8 py-4 backdrop-blur-sm">
                شاهد أعمالنا
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>

          {/* Live Project Counter */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16 max-w-4xl mx-auto"
          >
            <LiveProjectCounter />
          </motion.div>
        </div>
      </section>

      {/* Client Logo Ticker / Trusted Companies */}
      <div id="trusted">
        <TrustedCompanies />
      </div>

      {/* Results Spotlight */}
      <div id="results">
        <ResultsSpotlight />
      </div>

      {/* How We Work */}
      <div id="how-we-work">
        <HowWeWork />
      </div>

      {/* Interactive Service Explorer */}
      <div id="services">
        <InteractiveServiceExplorer />
      </div>

      {/* Before/After Slider */}
      <div id="before-after" className="bg-muted/30">
        <BeforeAfterSlider />
      </div>

      {/* Featured Project */}
      <div id="featured">
        <FeaturedProject />
      </div>

      {/* Our Clients */}
      <div id="our-clients">
        <OurClients />
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
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
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

      {/* Floating Elements */}
      <SmartCTABanner />
      <FloatingSocialProof />
    </Layout>
  );
};

export default Index;
