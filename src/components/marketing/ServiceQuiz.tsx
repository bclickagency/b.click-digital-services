import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  HelpCircle,
  Code2,
  Smartphone,
  Palette,
  Megaphone,
  ShoppingCart,
  BarChart3
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface QuizQuestion {
  id: number;
  question: string;
  options: {
    text: string;
    points: Record<string, number>;
  }[];
}

interface QuizResult {
  service: string;
  slug: string;
  icon: any;
  description: string;
  score: number;
}

const questions: QuizQuestion[] = [
  {
    id: 1,
    question: 'ما هو الهدف الرئيسي لمشروعك الرقمي؟',
    options: [
      { text: 'زيادة المبيعات والأرباح', points: { ecommerce: 3, marketing: 2 } },
      { text: 'بناء حضور رقمي قوي', points: { web: 3, branding: 2 } },
      { text: 'الوصول لعملاء جدد', points: { marketing: 3, seo: 2 } },
      { text: 'تسهيل التواصل مع العملاء', points: { apps: 3, web: 1 } },
    ],
  },
  {
    id: 2,
    question: 'ما هي ميزانيتك التقريبية للمشروع؟',
    options: [
      { text: 'أقل من 5,000 جنيه', points: { branding: 2, seo: 2 } },
      { text: '5,000 - 15,000 جنيه', points: { web: 3, marketing: 2 } },
      { text: '15,000 - 30,000 جنيه', points: { ecommerce: 2, apps: 2 } },
      { text: 'أكثر من 30,000 جنيه', points: { apps: 3, ecommerce: 3 } },
    ],
  },
  {
    id: 3,
    question: 'ما هو مجال عملك؟',
    options: [
      { text: 'تجارة ومنتجات', points: { ecommerce: 3, marketing: 2 } },
      { text: 'خدمات مهنية', points: { web: 3, branding: 2 } },
      { text: 'مطاعم وطعام', points: { apps: 2, marketing: 2, branding: 1 } },
      { text: 'تقنية وبرمجيات', points: { apps: 3, web: 2 } },
    ],
  },
  {
    id: 4,
    question: 'ما مدى أهمية الظهور في محركات البحث لك؟',
    options: [
      { text: 'أولوية قصوى', points: { seo: 3, web: 1 } },
      { text: 'مهم لكن ليس الأهم', points: { marketing: 2, seo: 1 } },
      { text: 'أفضل السوشيال ميديا', points: { marketing: 3 } },
      { text: 'لست متأكدًا', points: { analytics: 2 } },
    ],
  },
  {
    id: 5,
    question: 'هل لديك هوية بصرية (شعار، ألوان، الخ)؟',
    options: [
      { text: 'نعم، هوية متكاملة', points: { web: 2, ecommerce: 2, apps: 2 } },
      { text: 'شعار فقط', points: { branding: 2 } },
      { text: 'لا، أحتاج هوية جديدة', points: { branding: 3 } },
      { text: 'أريد تحديث الهوية الحالية', points: { branding: 2 } },
    ],
  },
];

const serviceResults: Record<string, { name: string; slug: string; icon: any; description: string }> = {
  web: {
    name: 'تطوير المواقع',
    slug: 'web-development',
    icon: Code2,
    description: 'موقع احترافي سيساعدك في بناء حضور رقمي قوي وجذب العملاء.',
  },
  apps: {
    name: 'تطوير التطبيقات',
    slug: 'mobile-apps',
    icon: Smartphone,
    description: 'تطبيق موبايل سيسهل التواصل مع عملائك ويزيد ولاءهم.',
  },
  branding: {
    name: 'تصميم الهوية البصرية',
    slug: 'branding',
    icon: Palette,
    description: 'هوية بصرية مميزة ستجعل علامتك التجارية لا تُنسى.',
  },
  marketing: {
    name: 'التسويق الرقمي',
    slug: 'digital-marketing',
    icon: Megaphone,
    description: 'حملات تسويقية فعالة ستوصلك للجمهور المناسب.',
  },
  ecommerce: {
    name: 'المتاجر الإلكترونية',
    slug: 'ecommerce',
    icon: ShoppingCart,
    description: 'متجر إلكتروني متكامل سيضاعف مبيعاتك.',
  },
  seo: {
    name: 'تحسين محركات البحث',
    slug: 'seo',
    icon: BarChart3,
    description: 'تحسين SEO سيجعل عملاءك يجدونك بسهولة في جوجل.',
  },
  analytics: {
    name: 'التحليلات والتقارير',
    slug: 'analytics',
    icon: BarChart3,
    description: 'تحليل البيانات سيساعدك في اتخاذ قرارات أفضل.',
  },
};

const ServiceQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const handleAnswer = (optionIndex: number) => {
    const question = questions[currentQuestion];
    const option = question.options[optionIndex];

    // Update scores
    const newScores = { ...scores };
    Object.entries(option.points).forEach(([service, points]) => {
      newScores[service] = (newScores[service] || 0) + points;
    });
    setScores(newScores);

    // Store answer
    setAnswers([...answers, optionIndex]);

    // Move to next question or show results
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const getResults = (): QuizResult[] => {
    return Object.entries(scores)
      .map(([service, score]) => ({
        service,
        slug: serviceResults[service]?.slug || '',
        icon: serviceResults[service]?.icon,
        description: serviceResults[service]?.description || '',
        score,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  };

  const restart = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setScores({});
    setShowResults(false);
    setIsStarted(false);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <section className="section-container">
      <div className="max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {!isStarted ? (
            <motion.div
              key="start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-card text-center"
            >
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <HelpCircle className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                مش متأكد محتاج إيه؟
              </h2>
              <p className="text-muted-foreground mb-8">
                أجب على 5 أسئلة سريعة ودعنا نساعدك في تحديد الخدمة المناسبة لمشروعك
              </p>
              <button
                onClick={() => setIsStarted(true)}
                className="btn-secondary"
              >
                <Sparkles className="w-5 h-5" />
                ابدأ الاختبار
              </button>
            </motion.div>
          ) : !showResults ? (
            <motion.div
              key={`question-${currentQuestion}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="glass-card"
            >
              {/* Progress */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">
                    سؤال {currentQuestion + 1} من {questions.length}
                  </span>
                  <span className="text-sm font-medium text-primary">
                    {Math.round(progress)}%
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
              </div>

              {/* Question */}
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-6">
                {questions[currentQuestion].question}
              </h3>

              {/* Options */}
              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleAnswer(index)}
                    className="w-full p-4 text-right rounded-xl border border-border/50 hover:border-primary hover:bg-primary/5 transition-all duration-200 group"
                  >
                    <span className="text-foreground group-hover:text-primary transition-colors">
                      {option.text}
                    </span>
                  </motion.button>
                ))}
              </div>

              {/* Back button */}
              {currentQuestion > 0 && (
                <button
                  onClick={() => setCurrentQuestion(currentQuestion - 1)}
                  className="mt-6 text-sm text-muted-foreground hover:text-foreground flex items-center gap-2"
                >
                  <ArrowRight className="w-4 h-4" />
                  السؤال السابق
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card"
            >
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 15 }}
                  className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4"
                >
                  <Sparkles className="w-10 h-10 text-primary" />
                </motion.div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  النتيجة جاهزة! 🎉
                </h3>
                <p className="text-muted-foreground">
                  بناءً على إجاباتك، هذه الخدمات الأنسب لك:
                </p>
              </div>

              {/* Results */}
              <div className="space-y-4 mb-8">
                {getResults().map((result, index) => (
                  <motion.div
                    key={result.service}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.15 }}
                    className={`p-4 rounded-xl border ${
                      index === 0 ? 'border-primary bg-primary/5' : 'border-border/50'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                        index === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      }`}>
                        {result.icon && <result.icon className="w-6 h-6" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-bold text-foreground">
                            {serviceResults[result.service]?.name}
                          </h4>
                          {index === 0 && (
                            <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">
                              الأنسب
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {result.description}
                        </p>
                        <Link
                          to={`/services/${result.slug}`}
                          className="text-sm text-primary font-medium hover:underline inline-flex items-center gap-1"
                        >
                          اعرف المزيد
                          <ArrowLeft className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/request" className="btn-secondary flex-1 justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                  اطلب استشارة مجانية
                </Link>
                <button onClick={restart} className="btn-ghost flex-1 justify-center">
                  أعد الاختبار
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ServiceQuiz;
