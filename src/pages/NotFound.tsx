import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowRight, Search, MessageCircle } from "lucide-react";
import Layout from "@/components/layout/Layout";

const NotFound = () => {
  return (
    <Layout showBreadcrumbs={false}>
      <section className="min-h-[80vh] flex items-center justify-center relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-secondary/20 rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-2xl mx-auto">
            {/* Animated 404 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="relative mb-8"
            >
              <span className="text-[12rem] md:text-[16rem] font-black text-gradient leading-none select-none">
                404
              </span>
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 10, 0],
                  y: [0, -10, 0]
                }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                <Search className="w-20 h-20 md:w-32 md:h-32 text-muted-foreground/30" />
              </motion.div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-4xl font-bold text-foreground mb-4"
            >
              عذراً، الصفحة غير موجودة!
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-muted-foreground mb-8 leading-relaxed"
            >
              يبدو أن الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
              <br />
              لا تقلق، يمكنك العودة للصفحة الرئيسية أو استكشاف خدماتنا.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Link to="/" className="btn-primary">
                <Home className="w-5 h-5" />
                الصفحة الرئيسية
              </Link>
              <Link to="/services" className="btn-ghost">
                خدماتنا
                <ArrowRight className="w-5 h-5 rotate-180" />
              </Link>
              <Link to="/contact" className="btn-secondary">
                <MessageCircle className="w-5 h-5" />
                تواصل معنا
              </Link>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-16 pt-8 border-t border-border/30"
            >
              <p className="text-sm text-muted-foreground mb-4">روابط قد تفيدك:</p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <Link to="/about" className="text-primary hover:underline">من نحن</Link>
                <Link to="/portfolio" className="text-primary hover:underline">أعمالنا</Link>
                <Link to="/blog" className="text-primary hover:underline">المدونة</Link>
                <Link to="/careers" className="text-primary hover:underline">الوظائف</Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;
