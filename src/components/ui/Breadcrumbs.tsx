import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, Home } from 'lucide-react';
import { motion } from 'framer-motion';

const routeNames: Record<string, string> = {
  '': 'الرئيسية',
  'about': 'من نحن',
  'services': 'الخدمات',
  'portfolio': 'أعمالنا',
  'request': 'طلب خدمة',
  'contact': 'تواصل معنا',
  'blog': 'المدونة',
  'careers': 'التوظيف',
  'privacy': 'سياسة الخصوصية',
  'terms': 'الشروط والأحكام',
  'admin': 'تسجيل الدخول',
  'dashboard': 'لوحة التحكم',
};

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Don't show breadcrumbs on home page
  if (pathnames.length === 0) return null;

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 py-4"
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center gap-2 text-sm flex-wrap">
        <li>
          <Link
            to="/"
            className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors duration-300"
          >
            <Home className="w-4 h-4" />
            <span>الرئيسية</span>
          </Link>
        </li>
        
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const displayName = routeNames[name] || name;

          return (
            <li key={name} className="flex items-center gap-2">
              <ChevronLeft className="w-4 h-4 text-muted-foreground" />
              {isLast ? (
                <span className="text-foreground font-medium">
                  {displayName}
                </span>
              ) : (
                <Link
                  to={routeTo}
                  className="text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  {displayName}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </motion.nav>
  );
};

export default Breadcrumbs;
