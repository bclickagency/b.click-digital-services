import { motion } from 'framer-motion';
import { CheckCircle2, Target, Eye, Award, Users, Lightbulb, Heart } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Link } from 'react-router-dom';

const values = [
  { icon: Target, title: 'الدقة', description: 'نهتم بأدق التفاصيل لضمان جودة عالية' },
  { icon: Lightbulb, title: 'الإبداع', description: 'نبتكر حلولًا فريدة تميز عملائنا' },
  { icon: Heart, title: 'الشغف', description: 'نحب ما نفعل ونعمل بحماس' },
  { icon: Users, title: 'التعاون', description: 'نعمل كفريق واحد مع عملائنا' },
];

const team = [
  { name: 'أحمد محمد', role: 'المؤسس والمدير التنفيذي', description: 'خبير في التطوير والاستراتيجية الرقمية' },
  { name: 'سارة أحمد', role: 'مديرة التصميم', description: 'متخصصة في تجربة المستخدم والهوية البصرية' },
  { name: 'محمد علي', role: 'مدير التسويق', description: 'خبير في الحملات الإعلانية والتسويق الرقمي' },
];

const AboutPage = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 right-1/3 w-80 h-80 bg-primary/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/3 left-1/3 w-60 h-60 bg-secondary/20 rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
            >
              من نحن
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="hero-title mb-6"
            >
              نحن <span className="text-gradient">B.CLICK</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="hero-subtitle"
            >
              شركة خدمات رقمية متكاملة نسعى لتحويل رؤية عملائنا إلى حقيقة رقمية مذهلة
            </motion.p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title mb-6">
              قصتنا <span className="text-gradient">ورؤيتنا</span>
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                تأسست B.CLICK برؤية واضحة: أن نكون الشريك الرقمي الأمثل للشركات والأفراد الطموحين في مصر والوطن العربي.
              </p>
              <p>
                نؤمن بأن كل فكرة تستحق أن تُرى، وكل مشروع يستحق أن يُنفذ باحترافية. لذلك نجمع بين الإبداع والتقنية لنقدم حلولًا رقمية تتجاوز التوقعات.
              </p>
              <p>
                فريقنا من المتخصصين يعمل بشغف لتحقيق أهداف عملائنا، مع الالتزام بأعلى معايير الجودة والاحترافية.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="glass-card text-center glow-primary">
              <Eye className="w-10 h-10 text-primary mx-auto mb-3" />
              <h4 className="font-bold text-foreground mb-2">رؤيتنا</h4>
              <p className="text-sm text-muted-foreground">
                أن نكون الخيار الأول للحلول الرقمية في الوطن العربي
              </p>
            </div>
            <div className="glass-card text-center">
              <Target className="w-10 h-10 text-secondary mx-auto mb-3" />
              <h4 className="font-bold text-foreground mb-2">رسالتنا</h4>
              <p className="text-sm text-muted-foreground">
                تمكين الأعمال من النجاح في العالم الرقمي
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-container bg-muted/30">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-title"
          >
            قيمنا <span className="text-gradient">الأساسية</span>
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <value.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{value.title}</h3>
              <p className="text-sm text-muted-foreground">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="section-container">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-title"
          >
            فريقنا <span className="text-gradient">المبدع</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="section-subtitle mx-auto"
          >
            نخبة من المتخصصين يعملون معًا لتحقيق أهدافك
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="service-card text-center"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1">{member.name}</h3>
              <p className="text-primary text-sm font-medium mb-2">{member.role}</p>
              <p className="text-sm text-muted-foreground">{member.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section-container">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card text-center py-12 px-8 glow-primary"
        >
          <h2 className="section-title mb-4">هل أنت مستعد للعمل معنا؟</h2>
          <p className="section-subtitle mx-auto mb-8">
            تواصل معنا اليوم وابدأ رحلتك الرقمية
          </p>
          <Link to="/request" className="btn-secondary">
            ابدأ مشروعك الآن
          </Link>
        </motion.div>
      </section>
    </Layout>
  );
};

export default AboutPage;
