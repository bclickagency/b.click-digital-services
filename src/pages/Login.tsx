import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, User, ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import SEO from '@/components/SEO';

type AuthMode = 'login' | 'register' | 'forgot';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mode, setMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast({ title: 'تم الإرسال', description: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني' });
        setMode('login');
        return;
      }

      if (mode === 'register') {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('كلمتا المرور غير متطابقتين');
        }
        if (formData.password.length < 6) {
          throw new Error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
        }

        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: { full_name: formData.fullName },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        
        if (data.user) {
          // Add client role
          await supabase.from('user_roles').insert({
            user_id: data.user.id,
            role: 'client' as any,
          });
        }

        toast({
          title: 'تم إنشاء الحساب',
          description: 'يرجى التحقق من بريدك الإلكتروني لتأكيد حسابك',
        });
        setMode('login');
        return;
      }

      // Login
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      if (error) throw error;

      // Check role and route accordingly
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id);

      if (!roles || roles.length === 0) {
        // No role assigned, treat as client
        await supabase.from('user_roles').insert({
          user_id: data.user.id,
          role: 'client' as any,
        });
        toast({ title: 'مرحباً بك!', description: 'تم تسجيل الدخول بنجاح' });
        navigate('/client');
        return;
      }

      const role = roles[0].role;
      toast({ title: 'مرحباً بك!', description: 'تم تسجيل الدخول بنجاح' });

      if (role === 'admin' || role === 'team_member') {
        navigate('/dashboard');
      } else {
        navigate('/client');
      }
    } catch (error: any) {
      const msg = error.message === 'Invalid login credentials'
        ? 'بيانات الدخول غير صحيحة'
        : error.message;
      toast({ title: 'خطأ', description: msg, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const update = (field: string, value: string) => setFormData(prev => ({ ...prev, [field]: value }));

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4" dir="rtl">
      <SEO title="تسجيل الدخول | B.CLICK" description="سجّل دخولك إلى حسابك في B.CLICK" />

      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] will-change-transform" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-primary/5 rounded-full blur-[120px] will-change-transform" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <span className="text-3xl font-black">B<span className="text-primary">.</span>CLICK</span>
          </Link>
        </div>

        <div className="bg-card border border-border/50 rounded-2xl p-8 shadow-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: mode === 'login' ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: mode === 'login' ? 20 : -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Header */}
              <div className="text-center mb-6">
                <h1 className="text-xl font-bold text-foreground">
                  {mode === 'login' && 'تسجيل الدخول'}
                  {mode === 'register' && 'إنشاء حساب جديد'}
                  {mode === 'forgot' && 'استعادة كلمة المرور'}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {mode === 'login' && 'سجّل دخولك للوصول إلى حسابك'}
                  {mode === 'register' && 'أنشئ حسابك لمتابعة مشاريعك مع B.CLICK'}
                  {mode === 'forgot' && 'أدخل بريدك الإلكتروني لإعادة تعيين كلمة المرور'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'register' && (
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1.5">الاسم الكامل</label>
                    <div className="relative">
                      <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => update('fullName', e.target.value)}
                        className="w-full pr-10 pl-4 py-3 rounded-xl bg-muted/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                        placeholder="الاسم الكامل"
                        required
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">البريد الإلكتروني</label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => update('email', e.target.value)}
                      className="w-full pr-10 pl-4 py-3 rounded-xl bg-muted/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                      placeholder="your@email.com"
                      dir="ltr"
                      required
                    />
                  </div>
                </div>

                {mode !== 'forgot' && (
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1.5">كلمة المرور</label>
                    <div className="relative">
                      <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => update('password', e.target.value)}
                        className="w-full pr-10 pl-10 py-3 rounded-xl bg-muted/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                        placeholder="••••••••"
                        required
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {mode === 'register' && (
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1.5">تأكيد كلمة المرور</label>
                    <div className="relative">
                      <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) => update('confirmPassword', e.target.value)}
                        className="w-full pr-10 pl-4 py-3 rounded-xl bg-muted/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>
                )}

                {mode === 'login' && (
                  <div className="flex justify-end">
                    <button type="button" onClick={() => setMode('forgot')}
                      className="text-xs text-primary hover:underline">
                      نسيت كلمة المرور؟
                    </button>
                  </div>
                )}

                <button type="submit" disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      جاري التحميل...
                    </>
                  ) : (
                    <>
                      {mode === 'login' && 'تسجيل الدخول'}
                      {mode === 'register' && 'إنشاء الحساب'}
                      {mode === 'forgot' && 'إرسال رابط الاستعادة'}
                    </>
                  )}
                </button>
              </form>

              {/* Mode switching */}
              <div className="mt-6 text-center space-y-2">
                {mode === 'login' && (
                  <p className="text-sm text-muted-foreground">
                    ليس لديك حساب؟{' '}
                    <button onClick={() => setMode('register')} className="text-primary font-medium hover:underline">
                      أنشئ حساباً
                    </button>
                  </p>
                )}
                {(mode === 'register' || mode === 'forgot') && (
                  <button onClick={() => setMode('login')}
                    className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mx-auto transition-colors">
                    <ArrowLeft className="w-3 h-3" />
                    العودة لتسجيل الدخول
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Back to home */}
        <div className="text-center mt-4">
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            ← العودة للموقع
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
