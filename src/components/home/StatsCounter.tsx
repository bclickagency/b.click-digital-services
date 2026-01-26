import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, Briefcase, Award, Clock } from 'lucide-react';

interface StatItemProps {
  icon: React.ElementType;
  value: number;
  suffix: string;
  label: string;
  delay: number;
}

const StatItem = ({ icon: Icon, value, suffix, label, delay }: StatItemProps) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  useEffect(() => {
    if (!isInView) return;
    
    const duration = 2000;
    const steps = 60;
    const stepValue = value / steps;
    const stepDuration = duration / steps;
    
    let current = 0;
    const timer = setInterval(() => {
      current += stepValue;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, stepDuration);
    
    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="glass-card text-center group hover:glow-primary transition-all duration-300"
    >
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
        <Icon className="w-8 h-8 text-primary" />
      </div>
      <div className="text-4xl md:text-5xl font-black text-gradient mb-2">
        {suffix === '+' ? '+' : ''}{count}{suffix !== '+' ? suffix : ''}
      </div>
      <div className="text-muted-foreground font-medium">{label}</div>
    </motion.div>
  );
};

const stats = [
  { icon: Briefcase, value: 50, suffix: '+', label: 'مشروع منجز' },
  { icon: Users, value: 30, suffix: '+', label: 'عميل سعيد' },
  { icon: Award, value: 5, suffix: '+', label: 'سنوات خبرة' },
  { icon: Clock, value: 24, suffix: '/7', label: 'دعم متواصل' },
];

const StatsCounter = () => {
  return (
    <section className="section-container bg-muted/30">
      <div className="text-center mb-12">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
        >
          إنجازاتنا
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="section-title"
        >
          أرقام <span className="text-gradient">نفتخر بها</span>
        </motion.h2>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatItem
            key={stat.label}
            icon={stat.icon}
            value={stat.value}
            suffix={stat.suffix}
            label={stat.label}
            delay={index * 0.1}
          />
        ))}
      </div>
    </section>
  );
};

export default StatsCounter;
