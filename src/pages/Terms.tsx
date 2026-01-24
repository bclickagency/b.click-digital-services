import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';

const TermsPage = () => {
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
              الشروط والأحكام
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
                  مرحبًا بك في B.CLICK. باستخدامك لموقعنا وخدماتنا، فإنك توافق على الالتزام بهذه الشروط والأحكام. يرجى قراءتها بعناية قبل استخدام خدماتنا.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">تعريفات</h2>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong className="text-foreground">"الشركة" أو "نحن":</strong> تشير إلى B.CLICK</li>
                  <li><strong className="text-foreground">"العميل" أو "أنت":</strong> يشير إلى الشخص أو الكيان الذي يستخدم خدماتنا</li>
                  <li><strong className="text-foreground">"الخدمات":</strong> تشمل جميع خدمات التصميم والتطوير والتسويق التي نقدمها</li>
                  <li><strong className="text-foreground">"المشروع":</strong> يشير إلى أي عمل أو مهمة يتم الاتفاق عليها بيننا</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">الخدمات المقدمة</h2>
                <p className="leading-relaxed mb-4">نقدم مجموعة متنوعة من الخدمات الرقمية تشمل:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>تصميم وتطوير المواقع الإلكترونية</li>
                  <li>تصميم الهوية البصرية والعلامات التجارية</li>
                  <li>تطوير تطبيقات الويب والهاتف</li>
                  <li>التسويق الرقمي وإدارة وسائل التواصل الاجتماعي</li>
                  <li>تحسين محركات البحث (SEO)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">عملية العمل</h2>
                <p className="leading-relaxed mb-4">تتضمن عملية العمل معنا الخطوات التالية:</p>
                <ol className="list-decimal list-inside space-y-2">
                  <li>تقديم طلب الخدمة وتحديد المتطلبات</li>
                  <li>تقديم عرض السعر والجدول الزمني</li>
                  <li>الموافقة على العرض ودفع الدفعة المقدمة</li>
                  <li>بدء العمل على المشروع</li>
                  <li>مراجعة واعتماد العمل</li>
                  <li>تسليم المشروع النهائي ودفع المبلغ المتبقي</li>
                </ol>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">الأسعار والدفع</h2>
                <ul className="list-disc list-inside space-y-2">
                  <li>يتم تحديد الأسعار بناءً على نطاق العمل ومتطلبات المشروع</li>
                  <li>يُطلب دفعة مقدمة قبل بدء العمل (عادةً 50%)</li>
                  <li>يتم دفع المبلغ المتبقي عند اكتمال المشروع</li>
                  <li>الأسعار لا تشمل أي رسوم أو ضرائب إضافية ما لم يُذكر خلاف ذلك</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">التعديلات والمراجعات</h2>
                <p className="leading-relaxed mb-4">
                  نحرص على رضا عملائنا ونقدم عددًا محددًا من جولات التعديلات:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>يتضمن كل مشروع عدد محدد من جولات التعديلات (يُحدد في العرض)</li>
                  <li>التعديلات الإضافية خارج النطاق المتفق عليه قد تستوجب رسومًا إضافية</li>
                  <li>يجب تقديم طلبات التعديل كتابيًا</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">حقوق الملكية الفكرية</h2>
                <ul className="list-disc list-inside space-y-2">
                  <li>تنتقل ملكية التصاميم والأعمال النهائية للعميل بعد السداد الكامل</li>
                  <li>نحتفظ بحق عرض الأعمال في معرض أعمالنا ما لم يُطلب خلاف ذلك</li>
                  <li>لا يحق للعميل إعادة بيع أو توزيع الأعمال كقوالب أو منتجات</li>
                  <li>جميع العناصر المشتراة من أطراف ثالثة تخضع لشروط ترخيصها الأصلية</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">إلغاء المشروع واسترداد الأموال</h2>
                <ul className="list-disc list-inside space-y-2">
                  <li>الدفعة المقدمة غير قابلة للاسترداد بمجرد بدء العمل</li>
                  <li>في حالة الإلغاء، يتم احتساب تكلفة العمل المنجز</li>
                  <li>نحتفظ بحق إلغاء المشروع في حالات القوة القاهرة أو عدم التعاون</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">مسؤولياتك كعميل</h2>
                <ul className="list-disc list-inside space-y-2">
                  <li>تقديم جميع المعلومات والمحتوى المطلوب في الوقت المناسب</li>
                  <li>الرد على الاستفسارات وطلبات الموافقة خلال مدة معقولة</li>
                  <li>التأكد من امتلاكك حقوق استخدام أي محتوى تقدمه</li>
                  <li>تقديم ملاحظات واضحة ومحددة</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">الضمان وإخلاء المسؤولية</h2>
                <p className="leading-relaxed mb-4">
                  نسعى لتقديم أفضل جودة ممكنة، ولكن:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>لا نضمن نتائج محددة للتسويق أو تحسين محركات البحث</li>
                  <li>لسنا مسؤولين عن أي خسائر ناتجة عن استخدام خدماتنا</li>
                  <li>نقدم دعمًا فنيًا لفترة محددة بعد تسليم المشروع (تُحدد في العرض)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">السرية</h2>
                <p className="leading-relaxed">
                  نلتزم بالحفاظ على سرية جميع المعلومات التي تشاركها معنا. لن نكشف عن أي معلومات سرية لأطراف ثالثة دون موافقتك المسبقة، إلا إذا كان ذلك مطلوبًا بموجب القانون.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">التغييرات على الشروط</h2>
                <p className="leading-relaxed">
                  نحتفظ بحق تعديل هذه الشروط والأحكام في أي وقت. ستصبح التغييرات سارية فور نشرها على الموقع. استمرارك في استخدام خدماتنا يعني موافقتك على الشروط المحدثة.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">القانون المطبق</h2>
                <p className="leading-relaxed">
                  تخضع هذه الشروط والأحكام للقوانين المصرية وتُفسر وفقًا لها. أي نزاعات تنشأ عن هذه الشروط تخضع للاختصاص القضائي للمحاكم المصرية.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">تواصل معنا</h2>
                <p className="leading-relaxed">
                  إذا كانت لديك أي أسئلة حول هذه الشروط والأحكام، يرجى التواصل معنا:
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

export default TermsPage;
