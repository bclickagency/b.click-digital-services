import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowLeft, Code2, FileText, Briefcase, HelpCircle } from 'lucide-react';

interface SearchResult {
  type: 'service' | 'blog' | 'portfolio' | 'page';
  title: string;
  description: string;
  href: string;
  icon: any;
}

const searchData: SearchResult[] = [
  { type: 'service', title: 'تطوير المواقع', description: 'مواقع احترافية سريعة', href: '/services', icon: Code2 },
  { type: 'service', title: 'تطوير التطبيقات', description: 'تطبيقات iOS و Android', href: '/services', icon: Code2 },
  { type: 'service', title: 'الهوية البصرية', description: 'شعارات وتصميمات', href: '/services', icon: Code2 },
  { type: 'service', title: 'التسويق الرقمي', description: 'حملات إعلانية', href: '/services', icon: Code2 },
  { type: 'page', title: 'من نحن', description: 'تعرف على فريقنا', href: '/about', icon: HelpCircle },
  { type: 'page', title: 'تواصل معنا', description: 'نحن هنا لمساعدتك', href: '/contact', icon: HelpCircle },
  { type: 'page', title: 'اطلب خدمة', description: 'أخبرنا عن مشروعك', href: '/request', icon: Briefcase },
  { type: 'page', title: 'المدونة', description: 'مقالات ونصائح', href: '/blog', icon: FileText },
  { type: 'page', title: 'أعمالنا', description: 'مشاريعنا السابقة', href: '/portfolio', icon: Briefcase },
];

const SearchBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.trim()) {
      const filtered = searchData.filter(
        item =>
          item.title.includes(query) ||
          item.description.includes(query)
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query]);

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

  const handleSelect = (href: string) => {
    navigate(href);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <>
      {/* Search Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/50 hover:bg-muted transition-all duration-300 group"
      >
        <Search className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        <span className="text-sm text-muted-foreground hidden md:inline">بحث...</span>
        <kbd className="hidden md:inline text-xs px-1.5 py-0.5 rounded bg-background border border-border text-muted-foreground">
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
              onClick={() => { setIsOpen(false); setQuery(''); }}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            />

            {/* Search Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="fixed top-[20%] left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4"
            >
              <div className="glass-card overflow-hidden">
                {/* Search Input */}
                <div className="flex items-center gap-3 p-4 border-b border-border">
                  <Search className="w-5 h-5 text-muted-foreground" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="ابحث عن خدمة، صفحة، أو مقال..."
                    className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                  />
                  {query && (
                    <button
                      onClick={() => setQuery('')}
                      className="p-1 rounded-lg hover:bg-muted transition-colors"
                    >
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  )}
                </div>

                {/* Results */}
                <div className="max-h-80 overflow-y-auto">
                  {query && results.length === 0 ? (
                    <div className="p-8 text-center">
                      <p className="text-muted-foreground">لا توجد نتائج لـ "{query}"</p>
                    </div>
                  ) : results.length > 0 ? (
                    <div className="p-2">
                      {results.map((result, index) => (
                        <motion.button
                          key={result.href + result.title}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => handleSelect(result.href)}
                          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-all text-right group"
                        >
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <result.icon className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {result.title}
                            </h4>
                            <p className="text-xs text-muted-foreground">{result.description}</p>
                          </div>
                          <ArrowLeft className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4">
                      <p className="text-xs text-muted-foreground mb-3">روابط سريعة</p>
                      <div className="grid grid-cols-2 gap-2">
                        {searchData.slice(0, 4).map((item) => (
                          <button
                            key={item.href}
                            onClick={() => handleSelect(item.href)}
                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors text-right"
                          >
                            <item.icon className="w-4 h-4 text-primary" />
                            <span className="text-sm text-foreground">{item.title}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                  <span>اضغط ESC للإغلاق</span>
                  <span>↵ للاختيار</span>
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
