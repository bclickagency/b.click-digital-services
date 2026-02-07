import { motion } from 'framer-motion';
import { Phone, MessageCircle, MapPin, Clock, Mail, Send, Facebook, Instagram, Linkedin } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import SEO from '@/components/SEO';
import ContactForm from '@/components/forms/ContactForm';

const contactInfo = [
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
    icon: Mail,
    title: 'البريد الإلكتروني',
    value: 'info@bclick.com',
    link: 'mailto:info@bclick.com',
    color: 'primary',
  },
  {
    icon: Clock,
    title: 'ساعات العمل',
    value: '9 صباحًا - 9 مساءً',
    link: null,
    color: 'secondary',
  },
];

const socialLinks = [
  { icon: Facebook, href: 'https://facebook.com/bclickagency', label: 'فيسبوك' },
  { icon: Instagram, href: 'https://instagram.com/bclickagency', label: 'إنستجرام' },
  { icon: Linkedin, href: 'https://linkedin.com/company/bclickagency', label: 'لينكدإن' },
];

const faqs = [
  {
    question: 'ما هي أسرع طريقة للتواصل؟',
    answer: 'أسرع طريقة للتواصل معنا هي عبر واتساب، حيث نرد خلال دقائق خلال ساعات العمل.',
  },
  {
    question: 'كم يستغرق الرد على الاستفسارات؟',
    answer: 'نرد على جميع الرسائل خلال 24 ساعة كحد أقصى، وعادةً ما يكون الرد أسرع من ذلك بكثير.',
  },
  {
    question: 'هل يمكنني زيارة مكتبكم؟',
    answer: 'بالطبع! يسعدنا استقبالك في مقرنا ببنها - القليوبية. يرجى التواصل مسبقًا لتحديد موعد.',
  },
];

const ContactPage = () => {
  return (
    <Layout>
      <SEO 
        title="تواصل معنا"
        description="تواصل مع فريق B.CLICK عبر الهاتف، الواتساب، أو البريد الإلكتروني. نحن هنا لمساعدتك في تحقيق أهدافك الرقمية. نرد خلال 24 ساعة."
        keywords="تواصل, اتصل بنا, واتساب, B.CLICK, خدمات رقمية"
      />
      
      {/* Hero Section */}
      <section className="relative min-h-[40vh] flex items-center overflow-hidden">
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
              تواصل معنا في أي وقت وسنرد عليك خلال ساعات قليلة
            </motion.p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="section-container pt-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card text-center hover:scale-105 transition-transform duration-300"
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
                  } hover:underline font-medium`}
                  dir={item.link.startsWith('tel') || item.link.startsWith('mailto') ? 'ltr' : undefined}
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

      {/* Main Content - Form + Map */}
      <section className="section-container">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="glass-card">
              <h2 className="text-2xl font-bold text-foreground mb-2">أرسل لنا رسالة</h2>
              <p className="text-muted-foreground mb-6">
                أخبرنا عن مشروعك أو استفسارك وسنتواصل معك في أقرب وقت
              </p>
              <ContactForm />
            </div>
          </motion.div>

          {/* Map + Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Map */}
            <div className="glass-card p-0 overflow-hidden aspect-video lg:aspect-auto lg:h-80">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110502.76994566947!2d31.113544749999996!3d30.46671565!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14f7c2c7d9c7c2d5%3A0x1c5c9c7c7c7c7c7c!2sBanha%2C%20Qalyubia%20Governorate!5e0!3m2!1sen!2seg!4v1700000000000!5m2!1sen!2seg"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="موقعنا على الخريطة"
              />
            </div>

            {/* Address */}
            <div className="glass-card">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">عنوان المقر</h3>
                  <p className="text-muted-foreground">بنها – القليوبية – مصر</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    نستقبل الزيارات من الأحد إلى الخميس من 9 صباحًا حتى 5 مساءً
                  </p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="glass-card">
              <h3 className="font-bold text-foreground mb-4">تابعنا على السوشيال ميديا</h3>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-all duration-300"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-container bg-muted/30">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="section-title"
            >
              أسئلة شائعة عن <span className="text-gradient">التواصل</span>
            </motion.h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card"
              >
                <h3 className="font-bold text-foreground mb-2">{faq.question}</h3>
                <p className="text-muted-foreground text-sm">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
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
            <p className="section-subtitle mx-auto mb-4">
              تواصل معنا مباشرة عبر واتساب وسنرد عليك خلال دقائق
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              ⚡ متوسط وقت الرد: 15 دقيقة خلال ساعات العمل
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
