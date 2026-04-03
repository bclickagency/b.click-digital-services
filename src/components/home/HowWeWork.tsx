import { motion } from 'framer-motion';
import { MessageCircle, FileSearch, Rocket, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const HowWeWork = () => {
  const { t } = useLanguage();

  const steps = [
    { icon: MessageCircle, step: '01', title: t.howWeWork.step1, description: t.howWeWork.step1Desc },
    { icon: FileSearch, step: '02', title: t.howWeWork.step2, description: t.howWeWork.step2Desc },
    { icon: Rocket, step: '03', title: t.howWeWork.step3, description: t.howWeWork.step3Desc },
  ];

  return (
    <section className="section-container bg-muted/30">
      <div className="text-center mb-10">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-block px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-xs font-medium mb-3"
        >
          {t.howWeWork.badge}
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="section-title"
        >
          <span className="text-gradient">{t.howWeWork.title}</span> {t.howWeWork.titleSuffix}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="section-subtitle mx-auto"
        >
          {t.howWeWork.subtitle}
        </motion.p>
      </div>

      <div className="relative">
        <div className="hidden lg:block absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary/30 via-primary to-primary/30 -translate-y-1/2 z-0" />

        <div className="grid md:grid-cols-3 gap-6 relative z-10">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="text-center relative"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border-2 border-primary mb-4 relative">
                <step.icon className="w-6 h-6 text-primary" />
                <span className="absolute -top-2 -right-2 w-7 h-7 bg-primary text-primary-foreground text-xs font-bold rounded-lg flex items-center justify-center">
                  {step.step}
                </span>
              </div>

              <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-xs leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>

              {index < steps.length - 1 && (
                <div className="md:hidden flex justify-center my-3">
                  <div className="w-6 h-6 border-b-2 border-r-2 border-primary/50 rotate-45 transform" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mt-10"
      >
        <Link to="/request" className="btn-secondary text-xs">
          <CheckCircle2 className="w-4 h-4" />
          {t.howWeWork.cta}
        </Link>
      </motion.div>
    </section>
  );
};

export default HowWeWork;
