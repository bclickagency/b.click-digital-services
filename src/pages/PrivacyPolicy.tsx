import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';

const PrivacyPolicyPage = () => {
  const lastUpdated = '2024-01-01';

  return (
    <Layout>
      {/* Hero Section */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6">
              سياسة الخصوصية
            </h1>
            <p className="text-muted-foreground">
              آخر تحديث: {new Date(lastUpdated).toLocaleDateString('ar-EG')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding pt-0">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card max-w-4xl mx-auto prose prose-lg prose-invert"
          >
            <div className="space-y-8 text-muted-foreground">
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">مقدمة</h2>
                <p className="leading-relaxed">
                  نحن في B.CLICK نقدر خصوصيتك ونلتزم بحماية بياناتك الشخصية. توضح سياسة الخصوصية هذه كيفية جمع واستخدام وحماية معلوماتك عند استخدام موقعنا وخدماتنا.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">المعلومات التي نجمعها</h2>
                <p className="leading-relaxed mb-4">نقوم بجمع المعلومات التالية:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong className="text-foreground">معلومات التواصل:</strong> الاسم، رقم الهاتف، البريد الإلكتروني عند التواصل معنا</li>
                  <li><strong className="text-foreground">معلومات الخدمة:</strong> تفاصيل المشاريع والطلبات التي تقدمها</li>
                  <li><strong className="text-foreground">معلومات تقنية:</strong> عنوان IP، نوع المتصفح، نظام التشغيل</li>
                  <li><strong className="text-foreground">ملفات تعريف الارتباط:</strong> لتحسين تجربة التصفح</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">كيف نستخدم معلوماتك</h2>
                <p className="leading-relaxed mb-4">نستخدم المعلومات التي نجمعها من أجل:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>تقديم وتحسين خدماتنا</li>
                  <li>التواصل معك بشأن مشاريعك وطلباتك</li>
                  <li>إرسال تحديثات وعروض (بموافقتك)</li>
                  <li>تحليل استخدام الموقع لتحسين تجربة المستخدم</li>
                  <li>الامتثال للمتطلبات القانونية</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">حماية معلوماتك</h2>
                <p className="leading-relaxed">
                  نتخذ إجراءات أمنية مناسبة لحماية معلوماتك من الوصول غير المصرح به أو التغيير أو الإفصاح أو الإتلاف. تشمل هذه الإجراءات تشفير البيانات واستخدام خوادم آمنة وتقييد الوصول للمعلومات.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">مشاركة المعلومات</h2>
                <p className="leading-relaxed mb-4">
                  لا نبيع أو نؤجر معلوماتك الشخصية لأطراف ثالثة. قد نشارك معلوماتك في الحالات التالية:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>مع مقدمي الخدمات الذين يساعدوننا في تشغيل أعمالنا</li>
                  <li>عند الضرورة للامتثال للقانون أو الإجراءات القانونية</li>
                  <li>لحماية حقوقنا أو سلامة مستخدمينا</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">ملفات تعريف الارتباط (Cookies)</h2>
                <p className="leading-relaxed">
                  نستخدم ملفات تعريف الارتباط لتحسين تجربتك على موقعنا. يمكنك التحكم في إعدادات ملفات تعريف الارتباط من خلال متصفحك. قد يؤثر تعطيل ملفات تعريف الارتباط على بعض وظائف الموقع.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">حقوقك</h2>
                <p className="leading-relaxed mb-4">لديك الحق في:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>الوصول إلى بياناتك الشخصية</li>
                  <li>طلب تصحيح أي معلومات غير دقيقة</li>
                  <li>طلب حذف بياناتك</li>
                  <li>الاعتراض على معالجة بياناتك</li>
                  <li>إلغاء الاشتراك في الاتصالات التسويقية</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">الاحتفاظ بالبيانات</h2>
                <p className="leading-relaxed">
                  نحتفظ بمعلوماتك الشخصية طالما كان ذلك ضروريًا لتحقيق الأغراض المذكورة في هذه السياسة، أو حسب ما يقتضيه القانون.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">التغييرات على هذه السياسة</h2>
                <p className="leading-relaxed">
                  قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سنخطرك بأي تغييرات جوهرية عبر نشر السياسة الجديدة على هذه الصفحة وتحديث تاريخ "آخر تحديث".
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">تواصل معنا</h2>
                <p className="leading-relaxed">
                  إذا كانت لديك أي أسئلة حول سياسة الخصوصية هذه أو ممارساتنا، يرجى التواصل معنا:
                </p>
                <ul className="list-none space-y-2 mt-4">
                  <li><strong className="text-foreground">الهاتف:</strong> 01558663972</li>
                  <li><strong className="text-foreground">واتساب:</strong> wa.me/201558663972</li>
                  <li><strong className="text-foreground">العنوان:</strong> بنها – القليوبية – مصر</li>
                </ul>
              </section>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default PrivacyPolicyPage;
