import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft, Palette, Megaphone, Code2, Brain, Video, Settings } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import LiveProjectCounter from './LiveProjectCounter';

const floatingPills = [
  { icon: Palette, delay: 0, x: '-5%', y: '15%', key: 'design' },
  { icon: Megaphone, delay: 0.8, x: '85%', y: '20%', key: 'marketing' },
  { icon: Code2, delay: 0.4, x: '0%', y: '70%', key: 'development' },
  { icon: Brain, delay: 1.2, x: '88%', y: '65%', key: 'ai' },
  { icon: Video, delay: 0.6, x: '10%', y: '45%', key: 'montage' },
  { icon: Settings, delay: 1.0, x: '80%', y: '42%', key: 'management' },
];

const HeroSection = () => {
  const { t } = useLanguage();

  const pillLabels = t.hero.pills as Record<string, string>;

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        {/* Dark gradient base */}
        <div className="absolute inset-0 bg-background" />
        
        {/* Perspective Grid */}
        <div className="absolute inset-0 overflow-hidden opacity-[0.08]">
          <div
            className="absolute inset-0 animate-grid-move"
            style={{
              backgroundImage: `
                linear-gradient(hsl(248 100% 61% / 0.3) 1px, transparent 1px),
                linear-gradient(90deg, hsl(248 100% 61% / 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
              transformOrigin: 'center top',
            }}
          />
        </div>

        {/* Ambient neon glows */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[hsl(248_100%_61%/0.08)] rounded-full blur-[150px] animate-glow-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[hsl(190_100%_50%/0.05)] rounded-full blur-[150px] animate-glow-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 right-1/3 w-[300px] h-[300px] bg-[hsl(248_100%_70%/0.06)] rounded-full blur-[120px]" />
      </div>

      {/* Floating Pills */}
      <div className="absolute inset-0 z-10 hidden lg:block">
        {floatingPills.map((pill) => (
          <motion.div
            key={pill.key}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: pill.delay + 0.5, duration: 0.5 }}
            className="absolute animate-float-gentle"
            style={{
              left: pill.x,
              top: pill.y,
              animationDelay: `${pill.delay}s`,
            }}
          >
            <div className="glass-card px-4 py-2.5 flex items-center gap-2 hover:!transform-none hover:shadow-[0_0_20px_hsl(248_100%_61%/0.2)] transition-shadow duration-300 cursor-default">
              <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center">
                <pill.icon className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="text-xs font-semibold text-foreground whitespace-nowrap">{pillLabels[pill.key]}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 relative z-20">
        <div className="max-w-4xl mx-auto">
          {/* Glass Container */}
          <div className="neon-border rounded-3xl p-8 md:p-12 relative">
            <div className="text-center">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6 backdrop-blur-sm border border-primary/20"
              >
                {t.hero.badge}
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="hero-title mb-5"
              >
                {t.hero.title}
                <br />
                <span className="text-primary">{t.hero.titleHighlight}</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="hero-subtitle mb-8 max-w-xl mx-auto leading-relaxed"
              >
                {t.hero.subtitle}
                <br />
                <span className="text-primary font-semibold">{t.hero.subtitleHighlight}</span>
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap justify-center gap-3"
              >
                <Link
                  to="/request"
                  className="btn-primary text-sm px-6 py-3 animate-pulse-glow"
                >
                  <Sparkles className="w-4 h-4" />
                  {t.hero.cta}
                </Link>
                <Link
                  to="/portfolio"
                  className="btn-ghost text-sm px-6 py-3 backdrop-blur-sm border border-border/30 hover:border-primary/30"
                >
                  {t.hero.ctaSecondary}
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Live Project Counter */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-10 max-w-3xl mx-auto"
          >
            <LiveProjectCounter />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
