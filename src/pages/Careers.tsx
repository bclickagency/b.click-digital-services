import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Briefcase, Users, Zap, Heart, Coffee, Laptop } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import SEO from '@/components/SEO';
import PageHero from '@/components/layout/PageHero';
import JobApplicationForm from '@/components/careers/JobApplicationForm';
import { supabase } from '@/integrations/supabase/client';

const benefits = [
  { icon: Laptop, title: 'العمل عن بُعد', description: 'اعمل من أي مكان في العالم بمرونة كاملة' },
  { icon: Clock, title: 'ساعات مرنة', description: 'نظم وقتك بما يناسب حياتك الشخصية' },
  { icon: Zap, title: 'نمو مهني', description: 'فرص تدريب وتطوير مستمرة' },
  { icon: Users, title: 'فريق متميز', description: 'اعمل مع أفضل المواهب في المجال' },
  { icon: Heart, title: 'بيئة صحية', description: 'نهتم بصحتك النفسية والجسدية' },
  { icon: Coffee, title: 'ثقافة إيجابية', description: 'بيئة عمل ممتعة ومحفزة' },
];

interface Job {
  id: string;
  title: string;
  type: string;
  location: string;
  department: string;
  description: string | null;
}

const CareersPage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      const { data } = await supabase.from('job_listings').select('*').eq('is_active', true).order('display_order');
      if (data) setJobs(data as Job[]);
    };
    fetchJobs();
  }, []);

  const openApplication = (job?: Job) => {
    setSelectedJob(job || null);
    setShowForm(true);
  };

  return (
    <Layout>
      <SEO
        title="التوظيف"
        description="انضم لفريق B.CLICK المتميز. نبحث عن مواهب استثنائية في التصميم والتطوير والتسويق الرقمي. بيئة عمل مرنة ومحفزة."
        keywords="وظائف, توظيف, فرص عمل, B.CLICK, تصميم, تطوير, تسويق"
      />

      <PageHero
        title="انضم لفريقنا"
        subtitle="نبحث عن مواهب استثنائية للانضمام لفريقنا المتميز. إذا كنت شغوفًا بالإبداع والتكنولوجيا، فنحن نريدك معنا!"
        minHeight="min-h-[40vh]"
      >
        <a href="#jobs" className="btn-primary inline-flex items-center gap-2 mt-6">
          استعرض الوظائف المتاحة
        </a>
      </PageHero>

      {/* Why Join Us */}
      <section className="section-container bg-muted/30">
        <div className="text-center mb-12">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="section-title">
            لماذا تنضم إلينا؟
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-muted-foreground max-w-2xl mx-auto">
            نقدم بيئة عمل محفزة ومزايا تنافسية لمساعدتك على النمو والتطور
          </motion.p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div key={benefit.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="glass-card text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <benefit.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">{benefit.title}</h3>
              <p className="text-muted-foreground text-sm">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Available Jobs */}
      <section id="jobs" className="section-container">
        <div className="text-center mb-12">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="section-title">
            الوظائف المتاحة
          </motion.h2>
        </div>
        <div className="space-y-4 max-w-4xl mx-auto">
          {jobs.map((job, index) => (
            <motion.div key={job.id} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="glass-card hover:border-primary/50 transition-all duration-300">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-foreground">{job.title}</h3>
                    <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-lg">{job.department}</span>
                  </div>
                  {job.description && <p className="text-muted-foreground text-sm mb-3">{job.description}</p>}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" />{job.type}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{job.location}</span>
                  </div>
                </div>
                <button onClick={() => openApplication(job)} className="btn-primary text-sm whitespace-nowrap">تقدم الآن</button>
              </div>
            </motion.div>
          ))}
          {jobs.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>لا توجد وظائف متاحة حالياً. تابعنا للحصول على فرص جديدة!</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="section-container">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card text-center max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">لم تجد الوظيفة المناسبة؟</h2>
          <p className="text-muted-foreground mb-6">أرسل لنا سيرتك الذاتية وسنتواصل معك عند توفر فرصة مناسبة</p>
          <button onClick={() => openApplication()} className="btn-primary inline-flex items-center gap-2">تقدم الآن</button>
        </motion.div>
      </section>

      <JobApplicationForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        jobId={selectedJob?.id}
        jobTitle={selectedJob?.title}
      />
    </Layout>
  );
};

export default CareersPage;
