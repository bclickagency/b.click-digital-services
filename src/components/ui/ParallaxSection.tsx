import { ReactNode, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxSectionProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  direction?: 'up' | 'down';
}

const ParallaxSection = ({
  children,
  className = '',
  speed = 0.5,
  direction = 'up',
}: ParallaxSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const multiplier = direction === 'up' ? -1 : 1;
  const y = useTransform(scrollYProgress, [0, 1], [0, 200 * speed * multiplier]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
};

interface ParallaxBackgroundProps {
  imageUrl?: string;
  children: ReactNode;
  className?: string;
  overlayOpacity?: number;
}

export const ParallaxBackground = ({
  imageUrl,
  children,
  className = '',
  overlayOpacity = 0.7,
}: ParallaxBackgroundProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {imageUrl && (
        <motion.div
          className="absolute inset-0 -top-[20%] -bottom-[20%]"
          style={{ y }}
        >
          <img
            src={imageUrl}
            alt=""
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0 bg-background"
            style={{ opacity: overlayOpacity }}
          />
        </motion.div>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

// Floating elements with parallax
interface FloatingElementProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  offset?: { x?: number; y?: number };
}

export const FloatingElement = ({
  children,
  className = '',
  speed = 1,
  offset = { x: 0, y: 0 },
}: FloatingElementProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [50 * speed, -50 * speed]);
  const x = useTransform(scrollYProgress, [0, 1], [offset.x || 0, -(offset.x || 0)]);

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      className={`will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default ParallaxSection;
