import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface PageHeroProps {
  badge?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  children?: ReactNode;
  minHeight?: string;
  badgeColor?: 'primary' | 'secondary';
}

const PageHero = ({
  badge,
  title,
  highlight,
  subtitle,
  children,
  minHeight = 'min-h-[50vh]',
  badgeColor = 'primary',
}: PageHeroProps) => {
  return (
    <section className={`relative ${minHeight} flex items-center overflow-hidden`}>
      {/* Background blobs - pure CSS, no JS animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-primary/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/3 w-60 h-60 bg-secondary/20 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          {badge && (
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`inline-block px-4 py-2 rounded-full text-sm font-medium mb-6 ${
                badgeColor === 'primary'
                  ? 'bg-primary/10 text-primary'
                  : 'bg-secondary/10 text-secondary'
              }`}
            >
              {badge}
            </motion.span>
          )}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="hero-title mb-6"
          >
            {title}{' '}
            {highlight && <span className="text-gradient">{highlight}</span>}
          </motion.h1>
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="hero-subtitle"
            >
              {subtitle}
            </motion.p>
          )}
          {children && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {children}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PageHero;
