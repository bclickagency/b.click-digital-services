import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code2, 
  Smartphone, 
  Palette, 
  Megaphone, 
  Search, 
  PenTool,
  ShoppingCart,
  BarChart3,
  ArrowLeft,
  ChevronDown
} from 'lucide-react';

const services = [
  {
    icon: Code2,
    title: 'تطوير المواقع',
    description: 'مواقع احترافية سريعة ومتجاوبة',
    href: '/services#web',
  },
  {
    icon: Smartphone,
    title: 'تطوير التطبيقات',
    description: 'تطبيقات iOS و Android',
    href: '/services#apps',
  },
  {
    icon: Palette,
    title: 'الهوية البصرية',
    description: 'شعارات وهويات مميزة',
    href: '/services#branding',
  },
  {
    icon: Megaphone,
    title: 'التسويق الرقمي',
    description: 'حملات إعلانية فعّالة',
    href: '/services#marketing',
  },
  {
    icon: Search,
    title: 'تحسين SEO',
    description: 'تصدر نتائج البحث',
    href: '/services#seo',
  },
  {
    icon: PenTool,
    title: 'إدارة المحتوى',
    description: 'محتوى إبداعي جذاب',
    href: '/services#content',
  },
  {
    icon: ShoppingCart,
    title: 'المتاجر الإلكترونية',
    description: 'متاجر متكاملة آمنة',
    href: '/services#ecommerce',
  },
  {
    icon: BarChart3,
    title: 'التحليلات',
    description: 'تقارير وإحصائيات شاملة',
    href: '/services#analytics',
  },
];

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MegaMenu = ({ isOpen, onClose }: MegaMenuProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-background/50 backdrop-blur-sm"
          />
          
          {/* Menu */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 z-50"
          >
            <div className="glass-card mx-4 p-6 max-w-6xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {services.map((service, index) => (
                  <motion.div
                    key={service.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={service.href}
                      onClick={onClose}
                      className="group flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-all duration-300"
                    >
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                        <service.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {service.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {service.description}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  استكشف جميع خدماتنا الرقمية
                </p>
                <Link
                  to="/services"
                  onClick={onClose}
                  className="flex items-center gap-2 text-primary font-medium text-sm hover:gap-3 transition-all"
                >
                  عرض الكل
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export const MegaMenuTrigger = ({ 
  isOpen, 
  onClick 
}: { 
  isOpen: boolean; 
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
      isOpen
        ? 'text-primary bg-primary/10'
        : 'text-foreground hover:text-primary hover:bg-muted/50'
    }`}
  >
    الخدمات
    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
  </button>
);

export default MegaMenu;
