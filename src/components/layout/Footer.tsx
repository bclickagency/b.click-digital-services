import { Link } from 'react-router-dom';
import { Phone, MapPin, MessageCircle } from 'lucide-react';

const serviceLinks = [
  { name: 'تصميم المواقع', slug: 'web-development' },
  { name: 'تطوير التطبيقات', slug: 'mobile-apps' },
  { name: 'التسويق الرقمي', slug: 'digital-marketing' },
  { name: 'تصميم الهوية البصرية', slug: 'branding' },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="px-4 py-8" dir="rtl">
      <footer className="bg-card border border-border rounded-3xl max-w-7xl mx-auto">
        <div className="px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <span className="text-3xl font-black text-foreground tracking-tight">
                B<span className="text-primary">.</span>CLICK
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              شريكك الرقمي لتحويل أفكارك إلى واقع. نقدم حلولًا رقمية متكاملة تساعد أعمالك على النمو والتميز.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-foreground mb-4">روابط سريعة</h4>
            <ul className="space-y-2">
              {[
                { name: 'الرئيسية', path: '/' },
                { name: 'من نحن', path: '/about' },
                { name: 'الخدمات', path: '/services' },
                { name: 'أعمالنا', path: '/portfolio' },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services - now with links */}
          <div>
            <h4 className="text-lg font-bold text-foreground mb-4">خدماتنا</h4>
            <ul className="space-y-2">
              {serviceLinks.map((service) => (
                <li key={service.slug}>
                  <Link
                    to={`/services/${service.slug}`}
                    className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold text-foreground mb-4">تواصل معنا</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <a
                  href="tel:01558663972"
                  className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm"
                >
                  01558663972
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-secondary" />
                </div>
                <a
                  href="https://wa.me/201558663972"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-secondary transition-colors duration-300 text-sm"
                >
                  واتساب
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                </div>
                <span className="text-muted-foreground text-sm">
                  بنها – القليوبية – مصر
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © {currentYear} B.CLICK - جميع الحقوق محفوظة
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm">
              المدونة
            </Link>
            <Link to="/careers" className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm">
              التوظيف
            </Link>
            <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm">
              سياسة الخصوصية
            </Link>
            <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm">
              الشروط والأحكام
            </Link>
          </div>
        </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
