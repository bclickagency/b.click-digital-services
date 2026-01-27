import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ScrollProgress from '@/components/ui/ScrollProgress';
import BackToTop from '@/components/ui/BackToTop';
import PageTransition from '@/components/ui/PageTransition';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import SalesAssistant from '@/components/ai/SalesAssistant';
import QuickActionBar from './QuickActionBar';
import CookieConsent from '@/components/ui/CookieConsent';
import AccessibilityMenu from '@/components/ui/AccessibilityMenu';

interface LayoutProps {
  children: ReactNode;
  showBreadcrumbs?: boolean;
}

const Layout = ({ children, showBreadcrumbs = true }: LayoutProps) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <ScrollProgress />
      <Header />
      <main id="main-content" className="flex-1 pt-24">
        {showBreadcrumbs && !isHomePage && <Breadcrumbs />}
        <PageTransition key={location.pathname}>
          {children}
        </PageTransition>
      </main>
      <Footer />
      <BackToTop />
      <SalesAssistant />
      <QuickActionBar />
      <CookieConsent />
      <AccessibilityMenu />
    </div>
  );
};

export default Layout;
