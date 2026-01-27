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
        <div className="hidden lg:flex items-center gap-1">
          <Link
            to="/"
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
              isActive('/')
                ? 'text-primary bg-primary/10'
                : 'text-foreground hover:text-primary hover:bg-muted/50'
            }`}
          >
            الرئيسية
          </Link>
          
          <Link
            to="/about"
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
              isActive('/about')
                ? 'text-primary bg-primary/10'
                : 'text-foreground hover:text-primary hover:bg-muted/50'
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
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
              isActive('/portfolio')
                ? 'text-primary bg-primary/10'
                : 'text-foreground hover:text-primary hover:bg-muted/50'
            }`}
          >
            أعمالنا
          </Link>

          <Link
            to="/request"
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
              isActive('/request')
                ? 'text-primary bg-primary/10'
                : 'text-foreground hover:text-primary hover:bg-muted/50'
            }`}
          >
            محتاج خدمة إيه؟
          </Link>

          <Link
            to="/contact"
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
              isActive('/contact')
                ? 'text-primary bg-primary/10'
                : 'text-foreground hover:text-primary hover:bg-muted/50'
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
            className="p-2 rounded-xl bg-muted/50 hover:bg-muted transition-all duration-300"
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

          {/* CTA Button - Desktop */}
          <Link
            to="/contact"
            className="hidden lg:flex btn-primary text-sm"
          >
            تواصل معنا
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-muted/50 hover:bg-muted transition-all duration-300"
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
