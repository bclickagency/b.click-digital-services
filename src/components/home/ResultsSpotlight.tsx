import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { TrendingUp, ShoppingCart, Eye, MousePointerClick } from 'lucide-react';

interface ResultCardProps {
  icon: React.ElementType;
  metric: string;
  label: string;
  description: string;
  delay: number;
}

const ResultCard = ({ icon: Icon, metric, label, description, delay }: ResultCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className="glass-card relative overflow-hidden group"
  >
    <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-[50px] opacity-20 bg-primary" />
    <div className="relative z-10">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-primary/10">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div className="text-2xl md:text-3xl font-black text-foreground mb-1">{metric}</div>
      <div className="text-xs font-semibold text-foreground mb-1">{label}</div>
      <p className="text-[10px] text-muted-foreground leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

const ResultsSpotlight = () => {
  const { t } = useLanguage();

  const results = [
    { icon: TrendingUp, metric: '+150%', label: t.results.salesIncrease, description: t.results.salesDesc },
    { icon: Eye, metric: '+200%', label: t.results.trafficIncrease, description: t.results.trafficDesc },
    { icon: MousePointerClick, metric: '-45%', label: t.results.bounceRate, description: t.results.bounceDesc },
    { icon: ShoppingCart, metric: '+80%', label: t.results.conversionRate, description: t.results.conversionDesc },
  ];

  return (
    <section className="section-container">
      <div className="text-center mb-10">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-block px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-xs font-medium mb-3"
        >
          {t.results.badge}
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="section-title"
        >
          {t.results.title} <span className="text-primary">{t.results.titleHighlight}</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="section-subtitle mx-auto"
        >
          {t.results.subtitle}
        </motion.p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {results.map((r, i) => (
          <ResultCard key={r.label} {...r} delay={i * 0.1} />
        ))}
      </div>
    </section>
  );
};

export default ResultsSpotlight;
