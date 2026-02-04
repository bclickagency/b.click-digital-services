import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import MegaMenu, { MegaMenuTrigger } from './MegaMenu';
import SearchBar from './SearchBar';
import MobileDrawer from './MobileDrawer';

const navLinks = [
  { name: 'الرئيسية', path: '/' },
  { name: 'من نحن', path: '/about' },
  { name: 'أعمالنا', path: '/portfolio' },
  { name: 'محتاج خدمة إيه؟', path: '/request' },
  { name: 'تواصل معنا', path: '/contact' },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  const isServicesActive = location.pathname === '/services';

  return (
    <header className="glass-header" dir="rtl">
      <nav className="flex items-center justify-between relative">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-black text-foreground tracking-tight">
            B<span className="text-gradient">.</span>CLICK
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1 bg-muted/30 backdrop-blur-xl rounded-full p-1.5 border border-border/30">
          <Link
            to="/"
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              isActive('/')
                ? 'text-primary-foreground bg-primary shadow-[0_2px_10px_hsl(248_98%_60%/0.3)]'
                : 'text-foreground hover:text-primary hover:bg-background/60'
            }`}
          >
            الرئيسية
          </Link>
          
          <Link
            to="/about"
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              isActive('/about')
                ? 'text-primary-foreground bg-primary shadow-[0_2px_10px_hsl(248_98%_60%/0.3)]'
                : 'text-foreground hover:text-primary hover:bg-background/60'
            }`}
          >
            من نحن
          </Link>

          {/* Mega Menu Trigger */}
          <div className="relative">
            <MegaMenuTrigger 
              isOpen={isMegaMenuOpen || isServicesActive} 
              onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)} 
            />
          </div>

          <Link
            to="/portfolio"
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              isActive('/portfolio')
                ? 'text-primary-foreground bg-primary shadow-[0_2px_10px_hsl(248_98%_60%/0.3)]'
                : 'text-foreground hover:text-primary hover:bg-background/60'
            }`}
          >
            أعمالنا
          </Link>

          <Link
            to="/request"
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              isActive('/request')
                ? 'text-primary-foreground bg-primary shadow-[0_2px_10px_hsl(248_98%_60%/0.3)]'
                : 'text-foreground hover:text-primary hover:bg-background/60'
            }`}
          >
            محتاج خدمة إيه؟
          </Link>

          <Link
            to="/contact"
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              isActive('/contact')
                ? 'text-primary-foreground bg-primary shadow-[0_2px_10px_hsl(248_98%_60%/0.3)]'
                : 'text-foreground hover:text-primary hover:bg-background/60'
            }`}
          >
            تواصل معنا
          </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="hidden md:block">
            <SearchBar />
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full bg-background/60 backdrop-blur-xl border border-border/30 hover:bg-muted/50 transition-all duration-300 shadow-[inset_0_1px_1px_hsl(0_0%_100%/0.1)]"
            aria-label="Toggle theme"
          >
            <AnimatePresence mode="wait" initial={false}>
              {theme === 'dark' ? (
                <motion.div
                  key="moon"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon className="w-5 h-5 text-foreground" />
                </motion.div>
              ) : (
                <motion.div
                  key="sun"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun className="w-5 h-5 text-foreground" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          {/* CTA Button - Desktop - Changed to Login */}
          <Link
            to="/admin"
            className="hidden lg:flex btn-primary text-sm"
          >
            تسجيل الدخول
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2.5 rounded-full bg-background/60 backdrop-blur-xl border border-border/30 hover:bg-muted/50 transition-all duration-300 shadow-[inset_0_1px_1px_hsl(0_0%_100%/0.1)]"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5 text-foreground" />
            ) : (
              <Menu className="w-5 h-5 text-foreground" />
            )}
          </button>
        </div>

        {/* Mega Menu */}
        <MegaMenu isOpen={isMegaMenuOpen} onClose={() => setIsMegaMenuOpen(false)} />
      </nav>

      {/* Mobile Drawer */}
      <MobileDrawer 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        currentPath={location.pathname}
      />
    </header>
  );
};

export default Header;
