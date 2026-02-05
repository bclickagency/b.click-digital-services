import { motion } from 'framer-motion';
import { Phone, MessageCircle, MapPin, Clock, Mail } from 'lucide-react';
import Layout from '@/components/layout/Layout';
 import SEO from '@/components/SEO';

const ContactPage = () => {
  return (
    <Layout>
       <SEO 
         title="تواصل معنا"
         description="تواصل مع فريق B.CLICK عبر الهاتف، الواتساب، أو قم بزيارتنا. نحن هنا لمساعدتك في تحقيق أهدافك الرقمية."
         keywords="تواصل, اتصل بنا, واتساب, B.CLICK, خدمات رقمية"
       />
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-primary/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 left-1/3 w-60 h-60 bg-secondary/20 rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
            >
              تواصل معنا
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="hero-title mb-6"
            >
              نحن هنا <span className="text-gradient">لمساعدتك</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="hero-subtitle"
            >
              تواصل معنا في أي وقت وسنرد عليك في أسرع وقت ممكن
            </motion.p>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="section-container pt-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Phone,
              title: 'اتصل بنا',
              value: '01558663972',
              link: 'tel:01558663972',
              color: 'primary',
            },
            {
              icon: MessageCircle,
              title: 'واتساب',
              value: '01558663972',
              link: 'https://wa.me/201558663972',
              color: 'secondary',
            },
            {
              icon: MapPin,
              title: 'العنوان',
              value: 'بنها – القليوبية – مصر',
              link: null,
              color: 'primary',
            },
            {
              icon: Clock,
              title: 'ساعات العمل',
              value: '9 صباحًا - 9 مساءً',
              link: null,
              color: 'secondary',
            },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card text-center"
            >
              <div className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center ${
                item.color === 'primary' ? 'bg-primary/10' : 'bg-secondary/10'
              }`}>
                <item.icon className={`w-7 h-7 ${
                  item.color === 'primary' ? 'text-primary' : 'text-secondary'
                }`} />
              </div>
              <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
              {item.link ? (
                <a
                  href={item.link}
                  target={item.link.startsWith('http') ? '_blank' : undefined}
                  rel={item.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className={`${
                    item.color === 'primary' ? 'text-primary' : 'text-secondary'
                  } hover:underline`}
                >
                  {item.value}
                </a>
              ) : (
                <p className="text-muted-foreground">{item.value}</p>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-container">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card text-center py-16 px-8 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />
          <div className="relative z-10">
            <h2 className="section-title mb-4">
              أسرع طريقة للتواصل
            </h2>
            <p className="section-subtitle mx-auto mb-8">
              تواصل معنا مباشرة عبر واتساب وسنرد عليك فورًا
            </p>
            <a
              href="https://wa.me/201558663972"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary inline-flex text-lg py-4 px-8"
            >
              <MessageCircle className="w-6 h-6" />
              تواصل عبر واتساب
            </a>
          </div>
        </motion.div>
      </section>
    </Layout>
  );
};

export default ContactPage;
