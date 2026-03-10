import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Briefcase, Users, TrendingUp, Clock } from 'lucide-react';

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
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div>
        <div className="text-2xl md:text-3xl font-black text-foreground">
          {prefix}{count}{suffix}
        </div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </div>
    </div>
  );
};

const LiveProjectCounter = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const counters = [
    { icon: Briefcase, end: 150, suffix: '+', label: 'مشروع منجز' },
    { icon: Users, end: 50, suffix: '+', label: 'عميل سعيد' },
    { icon: TrendingUp, end: 95, suffix: '%', label: 'نسبة رضا العملاء' },
    { icon: Clock, end: 5, suffix: '+', label: 'سنوات خبرة' },
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="glass-card p-6 md:p-8"
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {counters.map((c) => (
          <Counter key={c.label} {...c} isInView={isInView} />
        ))}
      </div>
      {/* Live pulse indicator */}
      <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-border/30">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
        </span>
        <span className="text-xs text-muted-foreground">نعمل الآن على مشاريع جديدة</span>
      </div>
    </motion.div>
  );
};

export default LiveProjectCounter;
