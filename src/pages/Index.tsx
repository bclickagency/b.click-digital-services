import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, MessageCircle } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import TrustedCompanies from '@/components/home/TrustedCompanies';
import ClientsShowcase from '@/components/home/ClientsShowcase';
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
import { useLanguage } from '@/contexts/LanguageContext';

const Index = () => {
  const { t } = useLanguage();

  return (
    <Layout>
      <SEO 
        title={t.nav.home} 
        description={t.hero.subtitle}
      />

      {/* Hero Section */}
      <HeroSection />

      {/* Client Logo Ticker / Trusted Companies */}
      <div id="trusted">
        <TrustedCompanies />
      </div>

      {/* Clients Showcase - New Section */}
      <div id="clients-showcase">
        <ClientsShowcase />
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
          className="glass-card relative overflow-hidden text-center py-12 px-6"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
          <div className="relative z-10">
            <h2 className="section-title mb-3">
              {t.cta.title}
            </h2>
            <p className="section-subtitle mx-auto mb-6">
              {t.cta.subtitle}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/request" className="btn-secondary flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                {t.cta.primary}
              </Link>
              <a
                href="https://wa.me/201558663972"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                <MessageCircle className="w-4 h-4" />
                {t.cta.whatsapp}
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
