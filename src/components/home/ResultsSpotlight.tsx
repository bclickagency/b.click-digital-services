import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { TrendingUp, ShoppingCart, Eye, MousePointerClick } from 'lucide-react';

interface ResultCardProps {
  icon: React.ElementType;
  metric: string;
  label: string;
  description: string;
  color: string;
  delay: number;
}

const ResultCard = ({ icon: Icon, metric, label, description, color, delay }: ResultCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className="glass-card relative overflow-hidden group"
  >
    <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-[50px] opacity-20 ${color}`} />
    <div className="relative z-10">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color} bg-opacity-10`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="text-3xl md:text-4xl font-black text-foreground mb-1">{metric}</div>
      <div className="text-sm font-semibold text-foreground mb-2">{label}</div>
      <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

const results = [
  {
    icon: TrendingUp,
    metric: '+150%',
    label: 'زيادة المبيعات',
    description: 'متوسط زيادة المبيعات لعملائنا بعد تطوير حضورهم الرقمي',
    color: 'text-emerald-500 bg-emerald-500',
  },
  {
    icon: Eye,
    metric: '+200%',
    label: 'زيادة الزيارات',
    description: 'تحسين ظهور المواقع وزيادة الزيارات العضوية من محركات البحث',
    color: 'text-blue-500 bg-blue-500',
  },
  {
    icon: MousePointerClick,
    metric: '-45%',
    label: 'معدل الارتداد',
    description: 'تقليل معدل الارتداد من خلال تحسين تجربة المستخدم والتصميم',
    color: 'text-amber-500 bg-amber-500',
  },
  {
    icon: ShoppingCart,
    metric: '+80%',
    label: 'معدل التحويل',
    description: 'زيادة معدل تحويل الزوار إلى عملاء فعليين من خلال استراتيجيات مدروسة',
    color: 'text-primary bg-primary',
  },
];

const ResultsSpotlight = () => {
  return (
    <section className="section-container">
      <div className="text-center mb-12">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-block px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-medium mb-4"
        >
          📊 نتائج حقيقية
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="section-title"
        >
          نتائج <span className="text-primary">تتحدث عن نفسها</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="section-subtitle mx-auto"
        >
          أرقام حقيقية حققناها لعملائنا خلال مشاريعنا السابقة
        </motion.p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {results.map((r, i) => (
          <ResultCard key={r.label} {...r} delay={i * 0.1} />
        ))}
      </div>
    </section>
  );
};

export default ResultsSpotlight;
