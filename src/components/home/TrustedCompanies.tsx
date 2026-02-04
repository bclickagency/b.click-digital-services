import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

// Placeholder company logos - you can replace these with real logos
const companies = [
  { name: 'شركة الإبداع', logo: '/placeholder.svg' },
  { name: 'مؤسسة النجاح', logo: '/placeholder.svg' },
  { name: 'شركة التقنية', logo: '/placeholder.svg' },
  { name: 'مجموعة الريادة', logo: '/placeholder.svg' },
  { name: 'شركة المستقبل', logo: '/placeholder.svg' },
  { name: 'مؤسسة الابتكار', logo: '/placeholder.svg' },
];

const TrustedCompanies = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Duplicate companies for seamless loop
  const allCompanies = [...companies, ...companies];

  return (
    <section className="py-16 overflow-hidden">
      <div className="container mx-auto px-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="inline-block px-4 py-2 rounded-xl bg-muted/50 text-muted-foreground text-sm font-medium mb-4">
            شركاء النجاح
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            شركات تثق بنا
          </h2>
        </motion.div>
      </div>

      {/* Scrolling Logo Container */}
      <div 
        ref={containerRef}
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => {
          setIsPaused(false);
          setHoveredIndex(null);
        }}
      >
        {/* Gradient overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        {/* Scrolling content */}
        <motion.div
          className="flex items-center gap-12 py-8"
          animate={{
            x: isPaused ? 0 : [0, -50 * companies.length],
          }}
          transition={{
            x: {
              duration: isPaused ? 0 : 20,
              repeat: Infinity,
              ease: 'linear',
            },
          }}
          style={{ width: 'max-content' }}
        >
          {allCompanies.map((company, index) => {
            const isHovered = hoveredIndex === index;
            const hasHover = hoveredIndex !== null;

            return (
              <motion.div
                key={`${company.name}-${index}`}
                className="flex flex-col items-center gap-3 cursor-pointer"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                animate={{
                  scale: isHovered ? 1.1 : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                <div
                  className={`w-24 h-24 rounded-2xl bg-background/80 backdrop-blur-xl border border-border/50 flex items-center justify-center p-4 transition-all duration-300 ${
                    isHovered 
                      ? 'border-primary/50 shadow-[0_8px_32px_hsl(248_98%_60%/0.15)]' 
                      : hasHover 
                        ? 'opacity-50' 
                        : ''
                  }`}
                >
                  <img
                    src={company.logo}
                    alt={company.name}
                    className={`w-full h-full object-contain transition-all duration-300 ${
                      isHovered 
                        ? '' 
                        : hasHover 
                          ? 'grayscale opacity-60' 
                          : 'grayscale opacity-70 hover:grayscale-0 hover:opacity-100'
                    }`}
                  />
                </div>
                <motion.span
                  className="text-sm font-medium text-foreground whitespace-nowrap"
                  animate={{
                    opacity: isHovered ? 1 : 0,
                    y: isHovered ? 0 : 10,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {company.name}
                </motion.span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default TrustedCompanies;
