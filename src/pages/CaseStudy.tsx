import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, ChevronLeft, ExternalLink, Calendar, Briefcase,
  CheckCircle2, TrendingUp, Target, Zap, Award, Star,
  Clock, FolderOpen, MessageCircle, ArrowRight, Quote,
  BarChart3, Users, Eye
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import SEO from '@/components/SEO';
import { supabase } from '@/integrations/supabase/client';

interface Project {
  id: string;
  client_id: string;
  title: string;
  description: string | null;
  status: string;
  service_type: string | null;
  progress: number;
  cover_image: string | null;
  images: string[] | null;
  problem: string | null;
  solution: string | null;
  results: string | null;
  client_story: string | null;
  how_we_helped: string | null;
  results_metrics: any;
  project_url: string | null;
  tags: string[] | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  notes: string | null;
}

interface ClientProfile {
  id: string;
  full_name: string;
  company_name: string | null;
  logo_url: string | null;
  avatar_url: string | null;
  industry: string | null;
  rating: number | null;
  testimonial: string | null;
}

const METRIC_ICONS: Record<string, typeof TrendingUp> = {
  visits: TrendingUp,
  sales: BarChart3,
  engagement: Users,
  views: Eye,
  default: Target,
};

const CaseStudy = () => {
  const { clientId, projectId } = useParams<{ clientId: string; projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [client, setClient] = useState<ClientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (!projectId || !clientId) return;
    const load = async () => {
      setLoading(true);
      const [projectRes, clientRes] = await Promise.all([
        supabase.from('client_projects').select('*').eq('id', projectId).eq('is_public', true).single(),
        supabase.from('profiles').select('*').eq('id', clientId).eq('is_featured', true).single(),
      ]);
      if (projectRes.data) setProject(projectRes.data as any);
      if (clientRes.data) setClient(clientRes.data as any);
      setLoading(false);
    };
    load();
  }, [projectId, clientId]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="flex gap-1.5">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (!project || !client) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <FolderOpen className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">المشروع غير موجود</h2>
            <Link to="/" className="text-primary hover:underline text-sm">العودة للرئيسية</Link>
          </div>
        </div>
      </Layout>
    );
  }

  const metrics = Array.isArray(project.results_metrics) ? project.results_metrics : [];
  const allImages = [project.cover_image, ...(project.images || [])].filter(Boolean) as string[];

  return (
    <Layout>
      <SEO
        title={`${project.title} | دراسة حالة`}
        description={project.description || `دراسة حالة لمشروع ${project.title} مع ${client.company_name || client.full_name}`}
      />

      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-16">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[140px] will-change-transform" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8 flex-wrap">
              <Link to="/" className="hover:text-primary transition-colors">الرئيسية</Link>
              <ChevronLeft className="w-4 h-4" />
              <Link to={`/clients/${clientId}`} className="hover:text-primary transition-colors">
                {client.company_name || client.full_name}
              </Link>
              <ChevronLeft className="w-4 h-4" />
              <span className="text-foreground">{project.title}</span>
            </div>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
              {/* Service type badge */}
              {project.service_type && (
                <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
                  {project.service_type}
                </span>
              )}

              <h1 className="text-3xl md:text-5xl font-black text-foreground mb-4 leading-tight">
                {project.title}
              </h1>

              {project.description && (
                <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed mb-6">
                  {project.description}
                </p>
              )}

              {/* Client info */}
              <div className="flex items-center gap-4 flex-wrap">
                <Link to={`/clients/${clientId}`} className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-xl bg-card border border-border/50 flex items-center justify-center overflow-hidden">
                    {client.logo_url || client.avatar_url ? (
                      <img src={client.logo_url || client.avatar_url || ''} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-sm font-bold text-primary">{(client.company_name || client.full_name)?.charAt(0)}</span>
                    )}
                  </div>
                  <span className="text-sm font-semibold group-hover:text-primary transition-colors">
                    {client.company_name || client.full_name}
                  </span>
                </Link>

                {project.start_date && (
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {new Date(project.start_date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long' })}
                  </div>
                )}

                {project.project_url && (
                  <a href={project.project_url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-primary hover:underline">
                    <ExternalLink className="w-4 h-4" />
                    زيارة المشروع
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Cover Image */}
      {allImages.length > 0 && (
        <section className="container mx-auto px-4 mb-16">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-3xl overflow-hidden border border-border/50 shadow-lg shadow-primary/5"
            >
              <img
                src={allImages[activeImage]}
                alt={project.title}
                className="w-full h-auto max-h-[500px] object-cover"
              />
            </motion.div>
            {allImages.length > 1 && (
              <div className="flex gap-3 mt-4 justify-center flex-wrap">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImage === i ? 'border-primary shadow-md shadow-primary/20' : 'border-border/50 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Results Metrics */}
      {metrics.length > 0 && (
        <section className="container mx-auto px-4 mb-16">
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            {metrics.map((metric: any, i: number) => {
              const Icon = METRIC_ICONS[metric.type] || METRIC_ICONS.default;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-5 text-center"
                >
                  <Icon className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-black text-primary">{metric.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{metric.label}</p>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* Case Study Content */}
      <section className="container mx-auto px-4 mb-20">
        <div className="max-w-3xl mx-auto space-y-12">
          {/* Problem */}
          {project.problem && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-destructive" />
                </div>
                <h2 className="text-xl font-black text-foreground">التحدي</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed pr-13">{project.problem}</p>
            </motion.div>
          )}

          {/* Solution */}
          {project.solution && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-black text-foreground">الحل</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed pr-13">{project.solution}</p>
            </motion.div>
          )}

          {/* Results */}
          {project.results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                </div>
                <h2 className="text-xl font-black text-foreground">النتائج</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed pr-13">{project.results}</p>
            </motion.div>
          )}

          {/* Client Story */}
          {project.client_story && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card p-8 relative overflow-hidden"
            >
              <div className="absolute top-4 right-6 text-primary/10">
                <Quote className="w-12 h-12" />
              </div>
              <div className="relative z-10">
                <h3 className="text-lg font-black text-foreground mb-3 flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  قصة النجاح
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">{project.client_story}</p>
                {project.how_we_helped && (
                  <>
                    <h4 className="text-sm font-bold text-foreground mb-2">كيف ساعدت B.CLICK</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{project.how_we_helped}</p>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.tags.map(tag => (
                <span key={tag} className="px-3 py-1.5 rounded-xl bg-muted/50 text-xs font-medium text-muted-foreground">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Client Testimonial */}
      {client.testimonial && (
        <section className="container mx-auto px-4 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto glass-card p-8 relative overflow-hidden"
          >
            <div className="absolute top-4 right-6 text-primary/10">
              <Quote className="w-14 h-14" />
            </div>
            <div className="relative z-10">
              <p className="text-lg leading-relaxed text-foreground italic mb-4">
                "{client.testimonial}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">{(client.company_name || client.full_name)?.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold">{client.full_name}</p>
                  {client.company_name && <p className="text-xs text-muted-foreground">{client.company_name}</p>}
                </div>
                {client.rating && client.rating > 0 && (
                  <div className="flex items-center gap-0.5 mr-auto">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < (client.rating || 0) ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground/20'}`} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* CTA */}
      <section className="container mx-auto px-4 mb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto glass-card relative overflow-hidden text-center py-14 px-8"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
          <div className="relative z-10">
            <h2 className="text-2xl font-black mb-3">هل تريد نتائج مشابهة؟</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              دعنا نحقق لك نتائج استثنائية لمشروعك
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link to="/request" className="btn-primary">
                <Zap className="w-5 h-5" />
                ابدأ مشروعك
              </Link>
              <Link to={`/clients/${clientId}`} className="btn-ghost">
                <ArrowRight className="w-5 h-5" />
                عرض كل المشاريع
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </Layout>
  );
};

export default CaseStudy;
