import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  Star,
  Users,
  Clock,
  Target,
  Sparkles,
  TrendingUp,
  Quote
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import SEO from '@/components/SEO';
import MagneticButton from '@/components/ui/MagneticButton';
import { servicesData } from '@/data/services';

const ServiceDetailPage = () => {
  const { serviceSlug } = useParams();
  const service = servicesData.find(s => s.slug === serviceSlug);

  if (!service) {
    return (
      <Layout>
        <div className="section-container text-center py-20">
          <h1 className="text-2xl font-bold mb-4">الخدمة غير موجودة</h1>
          <Link to="/services" className="btn-primary">
            <ArrowRight className="w-5 h-5 rotate-180" />
            العودة للخدمات
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO 
        title={service.title}
        description={service.description}
        keywords={service.keywords}
      />

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-primary/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 left-1/3 w-60 h-60 bg-secondary/20 rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Link
                to="/services"
                className="inline-flex items-center gap-2 text-primary mb-6 hover:gap-3 transition-all"
              >
                <ArrowRight className="w-5 h-5 rotate-180" />
                جميع الخدمات
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-4 mb-6"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <service.icon className="w-8 h-8 text-primary" />
              </div>
              <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                {service.category}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="hero-title mb-6"
            >
              {service.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="hero-subtitle mb-8"
            >
              {service.fullDescription}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <MagneticButton>
                <Link to="/request" className="btn-secondary flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  اطلب هذه الخدمة
                </Link>
              </MagneticButton>
              <a
                href="https://wa.me/201558663972"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                استشارة مجانية
                <ArrowLeft className="w-5 h-5" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {service.stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card text-center"
            >
              <div className="text-3xl md:text-4xl font-black text-primary mb-2">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="section-container bg-muted/30">
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-medium mb-4"
          >
            ما نقدمه
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="section-title"
          >
            مميزات <span className="text-gradient">خدمتنا</span>
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {service.features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="section-container">
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 rounded-xl bg-secondary/10 text-secondary text-sm font-medium mb-4"
          >
            خطوات العمل
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="section-title"
          >
            كيف نعمل <span className="text-gradient">معك</span>
          </motion.h2>
        </div>

        <div className="max-w-3xl mx-auto">
          {service.process.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex gap-6 mb-8 last:mb-0"
            >
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shrink-0">
                  {index + 1}
                </div>
                {index < service.process.length - 1 && (
                  <div className="w-0.5 h-full bg-border mt-2" />
                )}
              </div>
              <div className="glass-card flex-1 mt-0">
                <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
                <div className="flex items-center gap-2 mt-3 text-xs text-primary">
                  <Clock className="w-4 h-4" />
                  {step.duration}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Case Study */}
      {service.caseStudy && (
        <section className="section-container bg-muted/30">
          <div className="text-center mb-12">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-medium mb-4"
            >
              قصة نجاح
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="section-title"
            >
              مشروع <span className="text-gradient">ناجح</span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card max-w-4xl mx-auto overflow-hidden"
          >
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <img 
                  src={service.caseStudy.image} 
                  alt={service.caseStudy.title}
                  className="w-full h-64 object-cover rounded-xl"
                />
              </div>
              <div>
                <span className="text-xs text-primary font-medium">{service.caseStudy.client}</span>
                <h3 className="text-xl font-bold text-foreground mt-1 mb-4">{service.caseStudy.title}</h3>
                <p className="text-muted-foreground text-sm mb-6">{service.caseStudy.challenge}</p>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {service.caseStudy.results.map((result, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl font-bold text-primary">{result.value}</div>
                      <div className="text-xs text-muted-foreground">{result.label}</div>
                    </div>
                  ))}
                </div>

                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl">
                  <Quote className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground italic mb-2">
                      "{service.caseStudy.testimonial}"
                    </p>
                    <span className="text-xs font-medium text-foreground">
                      — {service.caseStudy.clientName}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* Pricing */}
      <section className="section-container">
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 rounded-xl bg-secondary/10 text-secondary text-sm font-medium mb-4"
          >
            الأسعار
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="section-title"
          >
            اختر <span className="text-gradient">الباقة المناسبة</span>
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {service.pricing.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`glass-card text-center relative ${plan.popular ? 'border-2 border-secondary' : ''}`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-secondary text-secondary-foreground text-xs font-bold rounded-full">
                  الأكثر طلبًا
                </span>
              )}
              <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
              <div className="text-3xl font-bold text-primary mb-4">
                {plan.price}
                {plan.price !== 'حسب الطلب' && <span className="text-sm text-muted-foreground"> ج.م</span>}
              </div>
              <ul className="space-y-3 text-sm text-muted-foreground mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className={`w-4 h-4 ${plan.popular ? 'text-secondary' : 'text-primary'}`} />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link 
                to="/request" 
                className={plan.popular ? 'btn-secondary w-full' : 'btn-ghost w-full border border-border'}
              >
                اطلب الآن
              </Link>
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
          className="glass-card text-center py-12 px-8 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />
          <div className="relative z-10">
            <h2 className="section-title mb-4">جاهز تبدأ؟</h2>
            <p className="section-subtitle mx-auto mb-8">
              تواصل معنا الآن واحصل على استشارة مجانية
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <MagneticButton>
                <Link to="/request" className="btn-secondary flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  ابدأ مشروعك
                </Link>
              </MagneticButton>
              <Link to="/portfolio" className="btn-ghost">
                شاهد أعمالنا
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </Layout>
  );
};

export default ServiceDetailPage;
