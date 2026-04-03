import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Briefcase, Users, TrendingUp, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface CounterProps {
  end: number;
  suffix?: string;
  prefix?: string;
  label: string;
  icon: React.ElementType;
  isInView: boolean;
}

const Counter = ({ end, suffix = '', prefix = '', label, icon: Icon, isInView }: CounterProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let frame: number;
    const duration = 2000;
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [isInView, end]);

  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <div className="text-xl md:text-2xl font-black text-foreground">
          {prefix}{count}{suffix}
        </div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
    </div>
  );
};

const LiveProjectCounter = () => {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const counters = [
    { icon: Briefcase, end: 150, suffix: '+', label: t.stats.projects },
    { icon: Users, end: 50, suffix: '+', label: t.stats.clients },
    { icon: TrendingUp, end: 95, suffix: '%', label: t.stats.satisfaction },
    { icon: Clock, end: 5, suffix: '+', label: t.stats.experience },
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="glass-card p-5 md:p-6"
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {counters.map((c) => (
          <Counter key={c.label} {...c} isInView={isInView} />
        ))}
      </div>
      {/* Live pulse indicator */}
      <div className="flex items-center justify-center gap-2 mt-4 pt-3 border-t border-border/30">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <span className="text-[10px] text-muted-foreground">{t.stats.liveIndicator}</span>
      </div>
    </motion.div>
  );
};

export default LiveProjectCounter;
