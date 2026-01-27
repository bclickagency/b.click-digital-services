import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Section {
  id: string;
  label: string;
}

interface SectionIndicatorProps {
  sections: Section[];
}

const SectionIndicator = ({ sections }: SectionIndicatorProps) => {
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      sections.forEach((section, index) => {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(index);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-3"
    >
      {sections.map((section, index) => (
        <button
          key={section.id}
          onClick={() => scrollToSection(section.id)}
          className="group relative flex items-center gap-3"
        >
          {/* Label - shows on hover */}
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            whileHover={{ opacity: 1, x: 0 }}
            className="absolute right-full mr-3 px-3 py-1 rounded-lg bg-background/90 backdrop-blur-sm border border-border text-sm text-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {section.label}
          </motion.span>

          {/* Dot */}
          <motion.div
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              activeSection === index
                ? 'bg-primary scale-125'
                : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
            }`}
            whileHover={{ scale: 1.3 }}
          />

          {/* Line */}
          {index < sections.length - 1 && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-px h-3 bg-border" />
          )}
        </button>
      ))}
    </motion.div>
  );
};

export default SectionIndicator;
