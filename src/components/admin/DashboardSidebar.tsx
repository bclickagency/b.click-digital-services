import { Link } from 'react-router-dom';
import { LogOut, ChevronRight, ChevronLeft, Zap, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type TabType = 'overview' | 'requests' | 'contacts' | 'chat' | 'tasks' | 'blog' | 'portfolio' | 'reports' | 'notifications' | 'activity_logs' | 'users' | 'site_content' | 'team' | 'careers' | 'pricing' | 'newsletter';

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

const DashboardSidebar = ({ activeTab, setActiveTab, tabs, onLogout, userEmail, userRole, isOpen, onClose }: DashboardSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);

  const sections = [
    { label: 'الرئيسية', ids: ['overview', 'requests', 'contacts', 'chat', 'tasks'] },
    { label: 'المحتوى', ids: ['blog', 'portfolio'] },
    { label: 'التحليلات', ids: ['reports', 'notifications', 'activity_logs'] },
    { label: 'الإدارة', ids: ['users', 'site_content', 'team', 'careers', 'pricing', 'newsletter'] },
  ];

  const totalBadges = tabs.reduce((sum, t) => sum + (t.badge || 0), 0);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />
        )}
      </AnimatePresence>

      <aside className={cn(
        'fixed top-0 right-0 bottom-0 z-50 flex flex-col transition-all duration-300',
        'bg-background/95 backdrop-blur-xl border-l border-border/20',
        collapsed ? 'w-[64px]' : 'w-60',
        'lg:translate-x-0',
        isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
      )}>
        {/* Header */}
        <div className={cn('flex items-center border-b border-border/15 h-14 shrink-0', collapsed ? 'px-3 justify-center' : 'px-4 justify-between')}>
          {!collapsed ? (
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-md shadow-primary/20">
                <span className="text-primary-foreground font-black text-xs">B</span>
              </div>
              <div>
                <span className="text-sm font-bold text-foreground">B<span className="text-primary">.</span>CLICK</span>
                <p className="text-[8px] text-muted-foreground/50 font-medium -mt-0.5">لوحة التحكم</p>
              </div>
            </Link>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-md shadow-primary/20">
              <span className="text-primary-foreground font-black text-xs">B</span>
            </div>
          )}
          {!collapsed && totalBadges > 0 && (
            <div className="relative">
              <Bell className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full" />
            </div>
          )}
        </div>

        {/* Quick Stats */}
        {!collapsed && (
          <div className="px-3 py-2 border-b border-border/15">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-primary/5 border border-primary/10">
              <Zap className="w-3 h-3 text-primary" />
              <span className="text-[10px] font-medium text-foreground">
                {totalBadges > 0 ? `${totalBadges} إشعار جديد` : 'لا توجد إشعارات'}
              </span>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5 scrollbar-thin">
          {sections.map(section => {
            const sectionTabs = tabs.filter(t => section.ids.includes(t.id));
            if (sectionTabs.length === 0) return null;
            return (
              <div key={section.label}>
                {!collapsed ? (
                  <p className="text-[9px] uppercase tracking-widest text-muted-foreground/40 font-semibold px-2.5 mt-3 mb-1.5">{section.label}</p>
                ) : (
                  <div className="mt-3 mb-1.5 border-t border-border/15 mx-2" />
                )}
                {sectionTabs.map(tab => {
                  const isActive = activeTab === tab.id;
                  return (
                    <motion.button key={tab.id}
                      onClick={() => { setActiveTab(tab.id); onClose(); }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        'w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all duration-150 relative group',
                        isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                      )}>
                      {isActive && (
                        <motion.div layoutId="activeTab"
                          className="absolute right-0 top-1/2 -translate-y-1/2 w-[2.5px] h-5 bg-primary rounded-full"
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }} />
                      )}
                      <div className="relative">
                        <tab.icon className={cn('w-4 h-4 shrink-0', isActive && 'text-primary')} />
                        {collapsed && tab.badge && tab.badge > 0 && (
                          <span className="absolute -top-1 -left-1 bg-destructive text-destructive-foreground text-[7px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center ring-2 ring-background">
                            {tab.badge > 9 ? '9+' : tab.badge}
                          </span>
                        )}
                      </div>
                      {!collapsed && (
                        <>
                          <span className="flex-1 text-right">{tab.label}</span>
                          {tab.badge && tab.badge > 0 && (
                            <span className="bg-destructive text-destructive-foreground text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] text-center">
                              {tab.badge}
                            </span>
                          )}
                        </>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-border/15 p-2 space-y-1.5">
          {!collapsed && (
            <div className="px-2.5 py-2 rounded-lg bg-muted/20">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold text-primary">{userEmail?.charAt(0).toUpperCase() || 'U'}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-medium text-foreground truncate">{userEmail}</p>
                  <span className={cn('inline-block mt-0.5 text-[8px] px-1.5 py-0.5 rounded-full font-semibold',
                    userRole === 'admin' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                  )}>
                    {userRole === 'admin' ? 'مدير النظام' : 'عضو فريق'}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-1">
            <button onClick={onLogout}
              className={cn('flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all',
                collapsed ? 'w-full justify-center' : 'flex-1')}>
              <LogOut className="w-3.5 h-3.5" />
              {!collapsed && <span className="text-[10px]">خروج</span>}
            </button>
            <button onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex p-1.5 rounded-lg text-muted-foreground hover:bg-muted/40 transition-all">
              {collapsed ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;
export type { TabType, SidebarTab };
