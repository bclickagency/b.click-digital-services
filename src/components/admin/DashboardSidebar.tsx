import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, FileText, Mail, MessagesSquare, 
  BookOpen, Briefcase, Users, LogOut, ChevronRight, ChevronLeft,
  Globe, Bell, Settings, Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type TabType = 'overview' | 'requests' | 'contacts' | 'chat' | 'blog' | 'portfolio' | 'users';

interface SidebarTab {
  id: TabType;
  label: string;
  icon: React.ElementType;
  badge?: number;
  section?: string;
}

interface DashboardSidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  tabs: SidebarTab[];
  onLogout: () => void;
  userEmail?: string;
  userRole?: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const DashboardSidebar = ({
  activeTab, setActiveTab, tabs, onLogout,
  userEmail, userRole, isOpen, onClose
}: DashboardSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);

  const mainTabs = tabs.filter(t => !['blog', 'portfolio', 'users'].includes(t.id));
  const contentTabs = tabs.filter(t => ['blog', 'portfolio'].includes(t.id));
  const adminTabs = tabs.filter(t => t.id === 'users');

  const totalBadges = tabs.reduce((sum, t) => sum + (t.badge || 0), 0);

  const renderTab = (tab: SidebarTab) => {
    const isActive = activeTab === tab.id;
    return (
      <motion.button
        key={tab.id}
        onClick={() => { setActiveTab(tab.id); onClose(); }}
        whileHover={{ x: collapsed ? 0 : -2 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative group',
          isActive
            ? 'bg-primary/15 text-primary'
            : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
        )}
      >
        {/* Active indicator bar */}
        {isActive && (
          <motion.div
            layoutId="activeTab"
            className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-primary rounded-full"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        )}

        <div className="relative">
          <tab.icon className={cn("w-[18px] h-[18px] shrink-0 transition-colors", isActive && "text-primary")} />
          {collapsed && tab.badge && tab.badge > 0 && (
            <span className="absolute -top-1.5 -left-1.5 bg-destructive text-destructive-foreground text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-background">
              {tab.badge > 9 ? '9+' : tab.badge}
            </span>
          )}
        </div>

        {!collapsed && (
          <>
            <span className="flex-1 text-right">{tab.label}</span>
            {tab.badge && tab.badge > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-destructive text-destructive-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center"
              >
                {tab.badge}
              </motion.span>
            )}
          </>
        )}
      </motion.button>
    );
  };

  const SectionLabel = ({ label }: { label: string }) => (
    !collapsed ? (
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-semibold px-3 mt-5 mb-2">{label}</p>
    ) : <div className="mt-4 mb-2 border-t border-border/20 mx-3" />
  );

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <aside className={cn(
        'fixed top-0 right-0 bottom-0 z-50 flex flex-col transition-all duration-300',
        'bg-background/95 backdrop-blur-xl border-l border-border/30',
        collapsed ? 'w-[72px]' : 'w-64',
        'lg:translate-x-0',
        isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
      )}>
        {/* Header / Branding */}
        <div className={cn(
          'flex items-center border-b border-border/20 h-16 shrink-0',
          collapsed ? 'px-3 justify-center' : 'px-5 justify-between'
        )}>
          {!collapsed ? (
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/30 transition-shadow">
                <span className="text-primary-foreground font-black text-sm">B</span>
              </div>
              <div>
                <span className="text-base font-bold text-foreground">
                  B<span className="text-primary">.</span>CLICK
                </span>
                <p className="text-[9px] text-muted-foreground/60 font-medium -mt-0.5">لوحة التحكم</p>
              </div>
            </Link>
          ) : (
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-primary-foreground font-black text-sm">B</span>
            </div>
          )}
          {!collapsed && (
            <div className="relative">
              <Bell className="w-4 h-4 text-muted-foreground" />
              {totalBadges > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full" />
              )}
            </div>
          )}
        </div>

        {/* Quick Stats Mini */}
        {!collapsed && (
          <div className="px-4 py-3 border-b border-border/20">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/5 border border-primary/10">
              <Zap className="w-3.5 h-3.5 text-primary" />
              <span className="text-[11px] font-medium text-foreground">
                {totalBadges > 0 ? `${totalBadges} إشعار جديد` : 'لا توجد إشعارات'}
              </span>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5 scrollbar-thin">
          <SectionLabel label="الرئيسية" />
          {mainTabs.map(renderTab)}

          {contentTabs.length > 0 && (
            <>
              <SectionLabel label="المحتوى" />
              {contentTabs.map(renderTab)}
            </>
          )}

          {adminTabs.length > 0 && (
            <>
              <SectionLabel label="الإدارة" />
              {adminTabs.map(renderTab)}
            </>
          )}
        </nav>

        {/* Footer */}
        <div className="border-t border-border/20 p-3 space-y-2">
          {!collapsed && (
            <div className="px-3 py-2.5 rounded-xl bg-muted/30">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-primary">
                    {userEmail?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-foreground truncate">{userEmail}</p>
                  <span className={cn(
                    'inline-block mt-0.5 text-[9px] px-1.5 py-0.5 rounded-full font-semibold',
                    userRole === 'admin' ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'
                  )}>
                    {userRole === 'admin' ? 'مدير النظام' : 'عضو فريق'}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-1">
            <button
              onClick={onLogout}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all',
                collapsed ? 'w-full justify-center' : 'flex-1'
              )}
            >
              <LogOut className="w-4 h-4" />
              {!collapsed && <span className="text-xs">خروج</span>}
            </button>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex p-2 rounded-xl text-muted-foreground hover:bg-muted/50 transition-all"
              title={collapsed ? 'توسيع' : 'طي'}
            >
              {collapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;
export type { TabType, SidebarTab };
