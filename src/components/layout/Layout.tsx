import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ScrollProgress from '@/components/ui/ScrollProgress';
import BackToTop from '@/components/ui/BackToTop';
import PageTransition from '@/components/ui/PageTransition';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import SalesAssistant from '@/components/ai/SalesAssistant';

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
      <main className="flex-1 pt-24">
        {showBreadcrumbs && !isHomePage && <Breadcrumbs />}
        <PageTransition key={location.pathname}>
          {children}
        </PageTransition>
      </main>
      <Footer />
      <BackToTop />
      <SalesAssistant />
    </div>
  );
};

export default Layout;
