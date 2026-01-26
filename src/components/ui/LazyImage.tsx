import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  placeholderColor?: string;
}

const LazyImage = ({ 
  src, 
  alt, 
  className, 
  wrapperClassName,
  placeholderColor = 'bg-muted'
}: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [blurDataUrl, setBlurDataUrl] = useState<string>('');
  const imgRef = useRef<HTMLDivElement>(null);

  // Generate a tiny blur placeholder
  useEffect(() => {
    // Create a tiny canvas for blur effect
    const canvas = document.createElement('canvas');
    canvas.width = 10;
    canvas.height = 10;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Create gradient placeholder
      const gradient = ctx.createLinearGradient(0, 0, 10, 10);
      gradient.addColorStop(0, 'hsl(252, 98%, 60%)');
      gradient.addColorStop(1, 'hsl(252, 98%, 40%)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 10, 10);
      setBlurDataUrl(canvas.toDataURL());
    }
  }, []);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { 
        rootMargin: '100px',
        threshold: 0.1 
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={imgRef}
      className={cn('relative overflow-hidden', wrapperClassName)}
    >
      {/* Blur Placeholder */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: isLoaded ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        className={cn(
          'absolute inset-0',
          placeholderColor
        )}
        style={{
          backgroundImage: blurDataUrl ? `url(${blurDataUrl})` : undefined,
          backgroundSize: 'cover',
          filter: 'blur(20px)',
          transform: 'scale(1.1)',
        }}
      />

      {/* Shimmer Effect */}
      {!isLoaded && (
        <div className="absolute inset-0 shimmer-effect" />
      )}

      {/* Actual Image */}
      {isInView && (
        <motion.img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ 
            opacity: isLoaded ? 1 : 0,
            scale: isLoaded ? 1 : 1.1
          }}
          transition={{ duration: 0.5 }}
          className={cn('w-full h-full object-cover', className)}
          loading="lazy"
        />
      )}
    </div>
  );
};

export default LazyImage;
