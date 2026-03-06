import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Home, 
  Info, 
  Briefcase, 
  FolderOpen, 
  MessageCircle, 
  Phone,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  ChevronLeft
} from 'lucide-react';

const navLinks = [
  { name: 'الرئيسية', path: '/', icon: Home },
  { name: 'من نحن', path: '/about', icon: Info },
  { name: 'الخدمات', path: '/services', icon: Briefcase },
  { name: 'أعمالنا', path: '/portfolio', icon: FolderOpen },
  { name: 'محتاج خدمة إيه؟', path: '/request', icon: MessageCircle },
  { name: 'تواصل معنا', path: '/contact', icon: Phone },
];

const socialLinks = [
  { icon: Instagram, href: 'https://instagram.com/bclick', label: 'Instagram' },
  { icon: Twitter, href: 'https://twitter.com/bclick', label: 'Twitter' },
  { icon: Facebook, href: 'https://facebook.com/bclick', label: 'Facebook' },
  { icon: Linkedin, href: 'https://linkedin.com/company/bclick', label: 'LinkedIn' },
];

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
}

const MobileDrawer = ({ isOpen, onClose, currentPath }: MobileDrawerProps) => {
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
            className="fixed inset-0 z-[59] bg-background/80 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-[60] w-80 max-w-[85vw] bg-background border-l border-border shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <span className="text-xl font-black text-foreground tracking-tight">
                B<span className="text-gradient">.</span>CLICK
              </span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5 text-foreground" />
              </motion.button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto p-4">
              <div className="space-y-1">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={link.path}
                      onClick={onClose}
                      className={`flex items-center justify-between gap-3 px-4 py-4 rounded-xl transition-all duration-300 ${
                        currentPath === link.path
                          ? 'bg-primary/10 text-primary'
                          : 'text-foreground hover:bg-muted/50 hover:text-primary'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          currentPath === link.path ? 'bg-primary/20' : 'bg-muted/50'
                        }`}>
                          <link.icon className={`w-5 h-5 ${
                            currentPath === link.path ? 'text-primary' : 'text-muted-foreground'
                          }`} />
                        </div>
                        <span className="font-medium">{link.name}</span>
                      </div>
                      <ChevronLeft className="w-4 h-4 text-muted-foreground" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </nav>

            {/* Social Links */}
            <div className="p-6 border-t border-border">
              <p className="text-sm text-muted-foreground mb-4">تابعنا على</p>
              <div className="flex items-center gap-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all"
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
              
              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Link
                  to="/contact"
                  onClick={onClose}
                  className="btn-secondary w-full mt-4 text-center"
                >
                  <MessageCircle className="w-5 h-5" />
                  تواصل معنا
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileDrawer;
