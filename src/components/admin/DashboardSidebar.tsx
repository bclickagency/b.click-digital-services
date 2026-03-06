import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, FileText, Mail, MessagesSquare, 
  BookOpen, Briefcase, Users, LogOut, ChevronRight, ChevronLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

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

  const renderTab = (tab: SidebarTab) => (
    <button
      key={tab.id}
      onClick={() => { setActiveTab(tab.id); onClose(); }}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
        activeTab === tab.id
          ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
          : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
      )}
    >
      <tab.icon className="w-[18px] h-[18px] shrink-0" />
      {!collapsed && (
        <>
          <span className="flex-1 text-right">{tab.label}</span>
          {tab.badge && tab.badge > 0 && (
            <span className="bg-destructive text-destructive-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
              {tab.badge}
            </span>
          )}
        </>
      )}
      {collapsed && tab.badge && tab.badge > 0 && (
        <span className="absolute -top-1 -left-1 bg-destructive text-destructive-foreground text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
          {tab.badge}
        </span>
      )}
    </button>
  );

  const SectionLabel = ({ label }: { label: string }) => (
    !collapsed ? (
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-semibold px-3 mt-6 mb-2">{label}</p>
    ) : <div className="mt-4 mb-2 border-t border-border/30 mx-2" />
  );

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />
      )}

      <aside className={cn(
        'fixed top-0 right-0 bottom-0 z-50 flex flex-col bg-background border-l border-border/50 transition-all duration-300',
        collapsed ? 'w-[72px]' : 'w-64',
        'lg:translate-x-0',
        isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
      )}>
        {/* Header / Branding */}
        <div className={cn('flex items-center border-b border-border/50 h-16 shrink-0', collapsed ? 'px-3 justify-center' : 'px-5 gap-3')}>
          {!collapsed && (
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-black text-sm">B</span>
              </div>
              <span className="text-lg font-bold text-foreground">
                B<span className="text-primary">.</span>CLICK
              </span>
            </Link>
          )}
          {collapsed && (
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-black text-sm">B</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
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
        <div className="border-t border-border/50 p-3 space-y-2">
          {!collapsed && (
            <div className="px-3 py-2">
              <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
              <span className={cn(
                'inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full font-medium',
                userRole === 'admin' ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'
              )}>
                {userRole === 'admin' ? 'مدير' : 'عضو فريق'}
              </span>
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
              {!collapsed && <span>خروج</span>}
            </button>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex p-2 rounded-xl text-muted-foreground hover:bg-muted/50 transition-all"
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
