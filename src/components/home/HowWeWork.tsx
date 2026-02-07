import { motion } from 'framer-motion';
import { MessageCircle, FileSearch, Rocket, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const steps = [
  {
    icon: MessageCircle,
    step: '01',
    title: 'تواصل معنا',
    description: 'أخبرنا عن فكرتك ومتطلباتك وسنرد عليك خلال ساعات',
  },
  {
    icon: FileSearch,
    step: '02',
    title: 'نخطط معًا',
    description: 'نحلل احتياجاتك ونضع خطة عمل واضحة مع جدول زمني',
  },
  {
    icon: Rocket,
    step: '03',
    title: 'التنفيذ والإطلاق',
    description: 'ننفذ المشروع باحترافية ونسلمك النتيجة جاهزة للإطلاق',
  },
];

const HowWeWork = () => {
  return (
    <section className="section-container bg-muted/30">
      <div className="text-center mb-12">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-block px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-medium mb-4"
        >
          كيف نعمل
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="section-title"
        >
          <span className="text-gradient">3 خطوات</span> نحو النجاح
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="section-subtitle mx-auto"
        >
          نجعل رحلتك الرقمية بسيطة وسهلة
        </motion.p>
      </div>

      <div className="relative">
        {/* Connection Line - Desktop */}
        <div className="hidden lg:block absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary/30 via-primary to-primary/30 -translate-y-1/2 z-0" />

        <div className="grid md:grid-cols-3 gap-8 relative z-10">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="text-center relative"
            >
              {/* Step Number Badge */}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border-2 border-primary mb-6 relative">
                <step.icon className="w-7 h-7 text-primary" />
                <span className="absolute -top-3 -right-3 w-8 h-8 bg-primary text-primary-foreground text-sm font-bold rounded-lg flex items-center justify-center">
                  {step.step}
                </span>
              </div>

              <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>

              {/* Arrow for mobile */}
              {index < steps.length - 1 && (
                <div className="md:hidden flex justify-center my-4">
                  <div className="w-8 h-8 border-b-2 border-r-2 border-primary/50 rotate-45 transform" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mt-12"
      >
        <Link to="/request" className="btn-secondary">
          <CheckCircle2 className="w-5 h-5" />
          ابدأ الآن - استشارة مجانية
        </Link>
      </motion.div>
    </section>
  );
};

export default HowWeWork;
