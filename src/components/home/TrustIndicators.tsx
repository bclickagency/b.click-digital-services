import { motion } from 'framer-motion';
import { Shield, Clock, Award, Headphones } from 'lucide-react';

const indicators = [
  {
    icon: Shield,
    title: 'ضمان الجودة',
    description: 'نضمن لك جودة العمل أو استرداد أموالك',
  },
  {
    icon: Clock,
    title: 'التزام بالمواعيد',
    description: 'نسلم مشاريعنا في الوقت المحدد دائمًا',
  },
  {
    icon: Award,
    title: '+5 سنوات خبرة',
    description: 'خبرة عملية في السوق المصري والعربي',
  },
  {
    icon: Headphones,
    title: 'دعم مستمر',
    description: 'فريق دعم متاح للمساعدة في أي وقت',
  },
];

const TrustIndicators = () => {
  return (
    <div className="flex flex-wrap justify-center gap-6 mt-8">
      {indicators.map((indicator, index) => (
        <motion.div
          key={indicator.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 + index * 0.1 }}
          className="flex items-center gap-3 px-4 py-3 rounded-xl bg-background/50 backdrop-blur-xl border border-border/30"
        >
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <indicator.icon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">{indicator.title}</h4>
            <p className="text-xs text-muted-foreground hidden sm:block">{indicator.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default TrustIndicators;
