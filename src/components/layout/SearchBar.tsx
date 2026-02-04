import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowLeft, Code2, FileText, Briefcase, HelpCircle, Layers, Palette, Megaphone, Smartphone, BarChart3 } from 'lucide-react';

interface SearchResult {
  type: 'service' | 'blog' | 'portfolio' | 'page';
  title: string;
  description: string;
  href: string;
  icon: any;
  keywords?: string[];
}

const searchData: SearchResult[] = [
  { type: 'service', title: 'تطوير المواقع', description: 'مواقع احترافية سريعة ومتجاوبة', href: '/services#web', icon: Code2, keywords: ['موقع', 'ويب', 'برمجة', 'تصميم'] },
  { type: 'service', title: 'تطوير التطبيقات', description: 'تطبيقات iOS و Android احترافية', href: '/services#apps', icon: Smartphone, keywords: ['تطبيق', 'موبايل', 'اندرويد', 'ايفون'] },
  { type: 'service', title: 'الهوية البصرية', description: 'شعارات وهويات بصرية مميزة', href: '/services#branding', icon: Palette, keywords: ['شعار', 'لوجو', 'هوية', 'براند'] },
  { type: 'service', title: 'التسويق الرقمي', description: 'حملات إعلانية فعّالة', href: '/services#marketing', icon: Megaphone, keywords: ['تسويق', 'إعلان', 'حملة', 'سوشيال'] },
  { type: 'service', title: 'تحسين محركات البحث', description: 'تصدر نتائج البحث', href: '/services#seo', icon: BarChart3, keywords: ['سيو', 'جوجل', 'بحث', 'ترتيب'] },
  { type: 'page', title: 'من نحن', description: 'تعرف على فريقنا وقصتنا', href: '/about', icon: HelpCircle, keywords: ['عن', 'فريق', 'شركة'] },
  { type: 'page', title: 'تواصل معنا', description: 'نحن هنا لمساعدتك', href: '/contact', icon: HelpCircle, keywords: ['تواصل', 'اتصال', 'رسالة'] },
  { type: 'page', title: 'اطلب خدمة', description: 'أخبرنا عن مشروعك', href: '/request', icon: Briefcase, keywords: ['طلب', 'خدمة', 'مشروع', 'عرض'] },
  { type: 'page', title: 'المدونة', description: 'مقالات ونصائح تقنية', href: '/blog', icon: FileText, keywords: ['مدونة', 'مقال', 'نصائح'] },
  { type: 'page', title: 'أعمالنا', description: 'مشاريعنا السابقة', href: '/portfolio', icon: Layers, keywords: ['أعمال', 'مشاريع', 'معرض'] },
  { type: 'page', title: 'الوظائف', description: 'انضم لفريقنا', href: '/careers', icon: Briefcase, keywords: ['وظيفة', 'عمل', 'توظيف'] },
];

const SearchBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Enhanced search with keyword matching
  const results = useMemo(() => {
    if (!query.trim()) return [];
    
    const normalizedQuery = query.trim().toLowerCase();
    
    return searchData.filter(item => {
      const titleMatch = item.title.toLowerCase().includes(normalizedQuery);
      const descMatch = item.description.toLowerCase().includes(normalizedQuery);
      const keywordMatch = item.keywords?.some(k => k.includes(normalizedQuery));
      return titleMatch || descMatch || keywordMatch;
    }).slice(0, 6);
  }, [query]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        setQuery('');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Keyboard navigation
  const handleKeyNavigation = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      handleSelect(results[selectedIndex].href);
    }
  };

  const handleSelect = (href: string) => {
    navigate(href);
    setIsOpen(false);
    setQuery('');
  };

  const groupedResults = useMemo(() => {
    const groups: { [key: string]: SearchResult[] } = {};
    results.forEach(result => {
      const type = result.type === 'service' ? 'الخدمات' : 'الصفحات';
      if (!groups[type]) groups[type] = [];
      groups[type].push(result);
    });
    return groups;
  }, [results]);

  return (
    <>
      {/* Search Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/50 hover:bg-muted/80 transition-all duration-200 group border border-transparent hover:border-border/50"
      >
        <Search className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        <span className="text-sm text-muted-foreground hidden md:inline group-hover:text-foreground transition-colors">بحث...</span>
        <kbd className="hidden md:inline text-[10px] px-1.5 py-0.5 rounded-md bg-background border border-border text-muted-foreground font-mono">
          ⌘K
        </kbd>
      </button>

      {/* Search Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => { setIsOpen(false); setQuery(''); }}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            />

            {/* Search Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="fixed top-[15%] left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4"
            >
              <div className="bg-background/95 backdrop-blur-2xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden">
                {/* Search Input */}
                <div className="flex items-center gap-3 p-4 border-b border-border/50">
                  <Search className="w-5 h-5 text-primary" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyNavigation}
                    placeholder="ابحث عن خدمة أو صفحة..."
                    className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-base"
                    autoComplete="off"
                  />
                  {query && (
                    <button
                      onClick={() => setQuery('')}
                      className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  )}
                </div>

                {/* Results */}
                <div className="max-h-80 overflow-y-auto">
                  {query && results.length === 0 ? (
                    <div className="p-8 text-center">
                      <div className="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-3">
                        <Search className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground text-sm">لا توجد نتائج لـ "{query}"</p>
                      <p className="text-muted-foreground/60 text-xs mt-1">جرب كلمات مختلفة</p>
                    </div>
                  ) : results.length > 0 ? (
                    <div className="p-2">
                      {Object.entries(groupedResults).map(([group, items]) => (
                        <div key={group}>
                          <div className="px-3 py-2 text-xs font-medium text-muted-foreground">
                            {group}
                          </div>
                          {items.map((result, index) => {
                            const globalIndex = results.indexOf(result);
                            return (
                              <motion.button
                                key={result.href + result.title}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.03 }}
                                onClick={() => handleSelect(result.href)}
                                onMouseEnter={() => setSelectedIndex(globalIndex)}
                                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-right group ${
                                  globalIndex === selectedIndex 
                                    ? 'bg-primary/10 border border-primary/20' 
                                    : 'hover:bg-muted/50 border border-transparent'
                                }`}
                              >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                                  globalIndex === selectedIndex ? 'bg-primary/20' : 'bg-muted/50'
                                }`}>
                                  <result.icon className={`w-5 h-5 ${
                                    globalIndex === selectedIndex ? 'text-primary' : 'text-muted-foreground'
                                  }`} />
                                </div>
                                <div className="flex-1">
                                  <h4 className={`font-medium transition-colors ${
                                    globalIndex === selectedIndex ? 'text-primary' : 'text-foreground'
                                  }`}>
                                    {result.title}
                                  </h4>
                                  <p className="text-xs text-muted-foreground">{result.description}</p>
                                </div>
                                <ArrowLeft className={`w-4 h-4 transition-all ${
                                  globalIndex === selectedIndex 
                                    ? 'text-primary opacity-100' 
                                    : 'text-muted-foreground opacity-0'
                                }`} />
                              </motion.button>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4">
                      <p className="text-xs text-muted-foreground mb-3 px-1">روابط سريعة</p>
                      <div className="grid grid-cols-2 gap-2">
                        {searchData.slice(0, 4).map((item) => (
                          <button
                            key={item.href}
                            onClick={() => handleSelect(item.href)}
                            className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-muted/50 transition-colors text-right border border-transparent hover:border-border/50"
                          >
                            <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
                              <item.icon className="w-4 h-4 text-primary" />
                            </div>
                            <span className="text-sm text-foreground">{item.title}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground bg-muted/30">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 rounded bg-background border border-border font-mono text-[10px]">↑↓</kbd>
                      للتنقل
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 rounded bg-background border border-border font-mono text-[10px]">↵</kbd>
                      للاختيار
                    </span>
                  </div>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-background border border-border font-mono text-[10px]">ESC</kbd>
                    للإغلاق
                  </span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default SearchBar;
