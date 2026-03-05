import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'أحمد محمد',
    role: 'مؤسس شركة TechStart',
    content: 'تجربة رائعة مع فريق B.CLICK! نفذوا موقعنا الإلكتروني باحترافية عالية وفي الوقت المحدد. الفريق متعاون جداً ويفهم احتياجات العميل بشكل ممتاز.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    rating: 5,
  },
  {
    id: 2,
    name: 'سارة أحمد',
    role: 'مديرة التسويق - Fashion Hub',
    content: 'ساعدونا في بناء هوية بصرية قوية وحملات تسويقية ناجحة. زادت مبيعاتنا بنسبة 150% خلال 3 أشهر فقط. شكراً B.CLICK!',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    rating: 5,
  },
  {
    id: 3,
    name: 'محمد علي',
    role: 'CEO - PropertyFinder',
    content: 'تطبيق الموبايل الذي صمموه لنا غيّر طريقة عملنا بالكامل. واجهة سهلة وأداء ممتاز. أنصح بشدة بالتعامل معهم.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    rating: 5,
  },
  {
    id: 4,
    name: 'فاطمة خالد',
    role: 'صاحبة متجر إلكتروني',
    content: 'متجري الإلكتروني أصبح يعمل بشكل مثالي بفضل فريق B.CLICK. الدعم الفني متواصل والتحديثات مستمرة.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    rating: 5,
  },
];

const Testimonials = () => {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const next = () => {
    setIsAutoPlaying(false);
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setIsAutoPlaying(false);
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="section-container overflow-hidden">
      <div className="text-center mb-12">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
        >
          آراء عملائنا
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="section-title"
        >
          ماذا يقول <span className="text-primary">عملاؤنا</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="section-subtitle mx-auto"
        >
          نفتخر بثقة عملائنا ونسعى دائماً لتقديم أفضل خدمة
        </motion.p>
      </div>

      {/* Testimonials Carousel */}
      <div className="relative max-w-4xl mx-auto">
        <div className="glass-card py-12 px-8 md:px-16 relative overflow-hidden">
          <Quote className="absolute top-6 right-6 w-12 h-12 text-primary/20" />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <img
                src={testimonials[current].avatar}
                alt={testimonials[current].name}
                className="w-20 h-20 rounded-full mx-auto mb-6 border-4 border-primary/20 object-cover"
                loading="lazy"
              />
              
              <div className="flex justify-center gap-1 mb-4">
                {[...Array(testimonials[current].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              
              <p className="text-lg md:text-xl text-foreground leading-relaxed mb-6">
                "{testimonials[current].content}"
              </p>
              
              <h4 className="text-xl font-bold text-foreground">
                {testimonials[current].name}
              </h4>
              <p className="text-muted-foreground text-sm">
                {testimonials[current].role}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsAutoPlaying(false);
                setCurrent(index);
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                current === index 
                  ? 'bg-primary w-8' 
                  : 'bg-muted hover:bg-muted-foreground/50'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
