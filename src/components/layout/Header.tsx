import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun, LogIn, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import MegaMenu, { MegaMenuTrigger } from './MegaMenu';
import SearchBar from './SearchBar';
import MobileDrawer from './MobileDrawer';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t, dir } = useLanguage();
  const location = useLocation();

  const navLinks = [
    { name: t.nav.home, path: '/' },
    { name: t.nav.about, path: '/about' },
    { name: t.nav.portfolio, path: '/portfolio' },
    { name: t.nav.request, path: '/request' },
    { name: t.nav.contact, path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;
  const isServicesActive = location.pathname === '/services';

  const navLinkClass = (path: string) =>
    `px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 ${
      isActive(path)
        ? 'text-primary-foreground bg-primary shadow-[0_2px_10px_hsl(248_100%_61%/0.3)]'
        : 'text-foreground hover:text-primary hover:bg-background/60'
    }`;

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  return (
    <>
      <header className="glass-header" dir={dir}>
        <nav className="flex items-center justify-between relative">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-black text-foreground tracking-tight">
              B<span className="text-gradient">.</span>CLICK
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1 bg-muted/30 backdrop-blur-xl rounded-full p-1 border border-border/30">
            {navLinks.slice(0, 2).map((link) => (
              <Link key={link.path} to={link.path} className={navLinkClass(link.path)}>
                {link.name}
              </Link>
            ))}

            {/* Mega Menu Trigger */}
            <div className="relative">
              <MegaMenuTrigger 
                isOpen={isMegaMenuOpen || isServicesActive} 
                onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)} 
              />
            </div>

            {navLinks.slice(2).map((link) => (
              <Link key={link.path} to={link.path} className={navLinkClass(link.path)}>
                {link.name}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search Bar */}
            <div className="hidden md:block">
              <SearchBar />
            </div>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="p-2 rounded-full bg-background/60 backdrop-blur-xl border border-border/30 hover:bg-muted/50 transition-all duration-300 shadow-[inset_0_1px_1px_hsl(0_0%_100%/0.1)] flex items-center gap-1.5"
              aria-label="Toggle language"
            >
              <Globe className="w-4 h-4 text-foreground" />
              <span className="text-[10px] font-bold text-foreground">{language === 'ar' ? 'EN' : 'ع'}</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-background/60 backdrop-blur-xl border border-border/30 hover:bg-muted/50 transition-all duration-300 shadow-[inset_0_1px_1px_hsl(0_0%_100%/0.1)]"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                {theme === 'dark' ? (
                  <motion.div key="moon" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Moon className="w-4 h-4 text-foreground" />
                  </motion.div>
                ) : (
                  <motion.div key="sun" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Sun className="w-4 h-4 text-foreground" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* Login CTA - Desktop */}
            <Link
              to="/login"
              className="hidden lg:flex items-center gap-2 btn-secondary text-xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              {t.nav.login}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-full bg-background/60 backdrop-blur-xl border border-border/30 hover:bg-muted/50 transition-all duration-300 shadow-[inset_0_1px_1px_hsl(0_0%_100%/0.1)]"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-4 h-4 text-foreground" />
              ) : (
                <Menu className="w-4 h-4 text-foreground" />
              )}
            </button>
          </div>

          {/* Mega Menu */}
          <MegaMenu isOpen={isMegaMenuOpen} onClose={() => setIsMegaMenuOpen(false)} />
        </nav>
      </header>

      {/* Mobile Drawer */}
      <MobileDrawer 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        currentPath={location.pathname}
      />
    </>
  );
};

export default Header;
