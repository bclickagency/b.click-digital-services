import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

const BeforeAfterSlider = () => {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition(pct);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updatePosition(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    updatePosition(e.clientX);
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  return (
    <section className="section-container">
      <div className="text-center mb-12">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-block px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-medium mb-4"
        >
          ✨ قبل وبعد
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="section-title"
        >
          شاهد <span className="text-primary">الفرق</span>
        </motion.h2>
      </div>

      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="relative w-full max-w-4xl mx-auto aspect-[16/10] rounded-2xl overflow-hidden cursor-col-resize select-none glass-card p-0"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{ touchAction: 'none' }}
      >
        {/* After (bottom layer) */}
        <img
          src="https://images.unsplash.com/photo-1547658719-da2b51169166?w=900&h=600&fit=crop"
          alt="بعد التطوير"
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />

        {/* Before (top layer clipped) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <img
            src="https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=900&h=600&fit=crop"
            alt="قبل التطوير"
            className="absolute inset-0 w-full h-full object-cover grayscale brightness-75"
            draggable={false}
          />
          {/* Before label */}
          <div className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-background/80 backdrop-blur-sm text-xs font-bold text-foreground">
            قبل
          </div>
        </div>

        {/* After label */}
        <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-primary/90 backdrop-blur-sm text-xs font-bold text-primary-foreground z-10">
          بعد
        </div>

        {/* Slider handle */}
        <div
          className="absolute top-0 bottom-0 z-20 flex items-center justify-center"
          style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
        >
          <div className="w-0.5 h-full bg-primary-foreground/80" />
          <div className="absolute w-10 h-10 rounded-full bg-primary shadow-lg shadow-primary/30 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-primary-foreground">
              <path d="M7 4L3 10L7 16M13 4L17 10L13 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </motion.div>

      <p className="text-center text-sm text-muted-foreground mt-4">
        اسحب المؤشر لمقارنة النتيجة قبل وبعد التطوير
      </p>
    </section>
  );
};

export default BeforeAfterSlider;
