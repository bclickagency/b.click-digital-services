import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  // تطوير المواقع
  {
    category: 'تطوير المواقع',
    question: 'كم يستغرق تطوير موقع إلكتروني؟',
    answer: 'يعتمد الوقت على حجم المشروع وتعقيده. المواقع البسيطة تستغرق 2-4 أسابيع، بينما المواقع المعقدة قد تستغرق 2-3 أشهر. نلتزم دائماً بالجدول الزمني المتفق عليه.',
  },
  {
    category: 'تطوير المواقع',
    question: 'هل تقدمون خدمات الاستضافة والصيانة؟',
    answer: 'نعم، نقدم باقات استضافة آمنة وسريعة مع صيانة دورية وتحديثات أمنية مستمرة لضمان عمل موقعك بأفضل أداء.',
  },
  // تطوير التطبيقات
  {
    category: 'تطوير التطبيقات',
    question: 'هل تطورون تطبيقات لأندرويد و iOS؟',
    answer: 'نعم، نطور تطبيقات لكلا النظامين باستخدام تقنيات حديثة مثل React Native و Flutter لضمان أفضل أداء وتجربة مستخدم.',
  },
  {
    category: 'تطوير التطبيقات',
    question: 'كم تكلفة تطوير تطبيق موبايل؟',
    answer: 'تختلف التكلفة حسب متطلبات التطبيق وميزاته. نقدم عرض سعر مخصص بعد دراسة احتياجاتك. تواصل معنا للحصول على استشارة مجانية.',
  },
  // التسويق الرقمي
  {
    category: 'التسويق الرقمي',
    question: 'ما هي منصات التواصل الاجتماعي التي تديرونها؟',
    answer: 'ندير جميع المنصات الرئيسية: فيسبوك، إنستغرام، تويتر، لينكد إن، تيك توك، ويوتيوب. نختار المنصات المناسبة لطبيعة عملك وجمهورك.',
  },
  {
    category: 'التسويق الرقمي',
    question: 'كيف تقيسون نجاح الحملات الإعلانية؟',
    answer: 'نستخدم مؤشرات أداء واضحة (KPIs) مثل معدل التحويل، تكلفة الاكتساب، العائد على الاستثمار، ونقدم تقارير دورية مفصلة.',
  },
  // الهوية البصرية
  {
    category: 'الهوية البصرية',
    question: 'ماذا تشمل خدمة الهوية البصرية؟',
    answer: 'تشمل تصميم الشعار، اختيار الألوان والخطوط، تصميم المطبوعات (كروت، فواتير، ليترهيد)، ودليل استخدام الهوية البصرية.',
  },
  {
    category: 'الهوية البصرية',
    question: 'كم عدد مقترحات الشعار التي تقدمونها؟',
    answer: 'نقدم 3-5 مقترحات أولية للشعار مع إمكانية التعديل حتى 3 مرات على المقترح المختار لضمان رضاك التام.',
  },
  // عام
  {
    category: 'عام',
    question: 'ما هي طرق الدفع المتاحة؟',
    answer: 'نقبل الدفع عبر التحويل البنكي، فودافون كاش، وغيرها. نتطلب عادة 50% مقدماً و50% عند التسليم.',
  },
  {
    category: 'عام',
    question: 'هل تقدمون ضمان على الخدمات؟',
    answer: 'نعم، نقدم ضمان لمدة شهر على جميع خدماتنا يشمل إصلاح أي أخطاء تقنية مجاناً، بالإضافة لدعم فني مستمر.',
  },
];

const categories = ['الكل', 'تطوير المواقع', 'تطوير التطبيقات', 'التسويق الرقمي', 'الهوية البصرية', 'عام'];

const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState('الكل');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filteredFAQs = activeCategory === 'الكل' 
    ? faqData 
    : faqData.filter(faq => faq.category === activeCategory);

  return (
    <section className="section-container" id="faq">
      <div className="text-center mb-12">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
        >
          <HelpCircle className="w-4 h-4 inline-block ml-2" />
          الأسئلة الشائعة
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="section-title"
        >
          كل ما تريد <span className="text-gradient">معرفته</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="section-subtitle mx-auto"
        >
          إجابات على الأسئلة الأكثر شيوعاً حول خدماتنا
        </motion.p>
      </div>

      {/* Category Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-wrap justify-center gap-3 mb-10"
      >
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => {
              setActiveCategory(category);
              setOpenIndex(null);
            }}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
              activeCategory === category
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            {category}
          </button>
        ))}
      </motion.div>

      {/* FAQ Accordion */}
      <div className="max-w-3xl mx-auto space-y-4">
        <AnimatePresence mode="wait">
          {filteredFAQs.map((faq, index) => (
            <motion.div
              key={`${activeCategory}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card p-0 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-right"
              >
                <span className="font-bold text-foreground text-lg">{faq.question}</span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0 mr-4"
                >
                  <ChevronDown className="w-5 h-5 text-primary" />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-5 pb-5 pt-0">
                      <div className="border-t border-border/30 pt-4">
                        <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-lg mb-3">
                          {faq.category}
                        </span>
                        <p className="text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default FAQ;
