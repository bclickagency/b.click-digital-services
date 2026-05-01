import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Star, Calendar, Briefcase, ArrowLeft, ExternalLink, Clock,
  CheckCircle2, Loader2, X, ChevronLeft, ChevronRight, Quote,
  TrendingUp, Target, Zap, Award, MessageCircle, FolderOpen
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import SEO from '@/components/SEO';
import { supabase } from '@/integrations/supabase/client';

interface ClientProfile {
  id: string;
  full_name: string;
  company_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  logo_url: string | null;
  industry: string | null;
  rating: number | null;
  testimonial: string | null;
  collaboration_start: string | null;
}

interface ClientProject {
  id: string;
  title: string;
  description: string | null;
  status: string;
  service_type: string | null;
  progress: number;
  cover_image: string | null;
  tags: string[] | null;
  is_public: boolean;
  is_featured: boolean;
  project_url: string | null;
  created_at: string;
  start_date: string | null;
  end_date: string | null;
  results_metrics: any;
}

const STATUS_LABELS: Record<string, { label: string; cls: string; icon: typeof Clock }> = {
  pending: { label: 'قيد التطوير', cls: 'bg-amber-500/15 text-amber-500 border border-amber-500/20', icon: Clock },
  in_progress: { label: 'جاري العمل', cls: 'bg-primary/15 text-primary border border-primary/20', icon: Loader2 },
  completed: { label: 'مكتمل', cls: 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/20', icon: CheckCircle2 },
  cancelled: { label: 'ملغي', cls: 'bg-destructive/15 text-destructive border border-destructive/20', icon: X },
};

const ClientShowcase = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const [client, setClient] = useState<ClientProfile | null>(null);
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (!clientId) return;
    const load = async () => {
      setLoading(true);
      const [profileRes, projectsRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', clientId).eq('is_featured', true).single(),
        supabase.from('client_projects').select('id,client_id,title,description,status,priority,service_type,start_date,end_date,progress,cover_image,images,problem,solution,results,client_story,how_we_helped,results_metrics,project_url,tags,is_featured,is_public,created_at,updated_at').eq('client_id', clientId).eq('is_public', true).order('created_at', { ascending: false }),
      ]);
      if (profileRes.data) setClient(profileRes.data as any);
      if (projectsRes.data) setProjects(projectsRes.data as any);
      setLoading(false);
    };
    load();
  }, [clientId]);

  const serviceTypes = [...new Set(projects.map(p => p.service_type).filter(Boolean))];
  const filteredProjects = activeFilter === 'all' ? projects : projects.filter(p => p.service_type === activeFilter);
  const completedProjects = projects.filter(p => p.status === 'completed').length;

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center animate-pulse">
              <Briefcase className="w-6 h-6 text-primary" />
            </div>
            <div className="flex gap-1.5">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!client) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <FolderOpen className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">لم يتم العثور على العميل</h2>
            <Link to="/" className="text-primary hover:underline text-sm">العودة للرئيسية</Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO
        title={`${client.company_name || client.full_name} | عملاؤنا`}
        description={`اكتشف المشاريع التي نفذتها B.CLICK لعميلنا ${client.company_name || client.full_name}`}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-28 pb-16">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[140px] will-change-transform" />
          <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] will-change-transform" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
              <Link to="/" className="hover:text-primary transition-colors">الرئيسية</Link>
              <ChevronLeft className="w-4 h-4" />
              <Link to="/portfolio" className="hover:text-primary transition-colors">أعمالنا</Link>
              <ChevronLeft className="w-4 h-4" />
              <span className="text-foreground">{client.company_name || client.full_name}</span>
            </div>

            {/* Client Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
              {/* Logo/Avatar */}
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-3xl bg-card border border-border/50 flex items-center justify-center overflow-hidden shadow-lg shadow-primary/5">
                {client.logo_url || client.avatar_url ? (
                  <img
                    src={client.logo_url || client.avatar_url || ''}
                    alt={client.company_name || client.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-black text-primary">
                    {(client.company_name || client.full_name)?.charAt(0)}
                  </span>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap mb-2">
                  <h1 className="text-3xl md:text-4xl font-black text-foreground">
                    {client.company_name || client.full_name}
                  </h1>
                  {client.industry && (
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                      {client.industry}
                    </span>
                  )}
                </div>
                {client.bio && (
                  <p className="text-muted-foreground leading-relaxed max-w-2xl">{client.bio}</p>
                )}

                {/* Quick stats */}
                <div className="flex items-center gap-6 mt-4 flex-wrap">
                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-foreground">{projects.length}</span>
                    <span className="text-muted-foreground">مشروع</span>
                  </div>
                  {client.collaboration_start && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">منذ {new Date(client.collaboration_start).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long' })}</span>
                    </div>
                  )}
                  {client.rating && client.rating > 0 && (
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < (client.rating || 0) ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground/20'}`} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="container mx-auto px-4 -mt-4 mb-12">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Briefcase, label: 'إجمالي المشاريع', value: projects.length, color: 'primary' },
            { icon: CheckCircle2, label: 'مشاريع مكتملة', value: completedProjects, color: 'emerald' },
            { icon: TrendingUp, label: 'نسبة الإنجاز', value: `${projects.length > 0 ? Math.round((completedProjects / projects.length) * 100) : 0}%`, color: 'blue' },
            { icon: Award, label: 'التقييم', value: client.rating ? `${client.rating}/5` : '—', color: 'amber' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-5 text-center group hover:border-primary/20 transition-all"
            >
              <stat.icon className={`w-6 h-6 mx-auto mb-2 text-${stat.color === 'primary' ? 'primary' : stat.color + '-500'} group-hover:scale-110 transition-transform`} />
              <p className="text-2xl font-black text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Client Testimonial */}
      {client.testimonial && (
        <section className="container mx-auto px-4 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto glass-card p-8 md:p-10 relative overflow-hidden"
          >
            <div className="absolute top-4 right-6 text-primary/10">
              <Quote className="w-16 h-16" />
            </div>
            <div className="relative z-10">
              <p className="text-lg md:text-xl leading-relaxed text-foreground italic mb-6">
                "{client.testimonial}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">
                    {(client.company_name || client.full_name)?.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold">{client.full_name}</p>
                  {client.company_name && (
                    <p className="text-xs text-muted-foreground">{client.company_name}</p>
                  )}
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

      {/* Projects Section */}
      <section className="container mx-auto px-4 mb-20">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-foreground">
                المشاريع المنفذة
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                تم تنفيذ {projects.length} مشروع لهذا العميل
              </p>
            </div>

            {/* Filters */}
            {serviceTypes.length > 1 && (
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeFilter === 'all'
                      ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                  }`}
                >
                  الكل
                </button>
                {serviceTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => setActiveFilter(type!)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      activeFilter === type
                        ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                        : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProjects.map((project, i) => {
              const status = STATUS_LABELS[project.status] || STATUS_LABELS.pending;
              const StatusIcon = status.icon;
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link
                    to={`/clients/${clientId}/projects/${project.id}`}
                    className="block group"
                  >
                    <div className="glass-card overflow-hidden hover:border-primary/20 transition-all duration-300">
                      {/* Cover Image */}
                      <div className="relative h-48 bg-muted/30 overflow-hidden">
                        {project.cover_image ? (
                          <img
                            src={project.cover_image}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
                            <FolderOpen className="w-12 h-12 text-primary/20" />
                          </div>
                        )}
                        {/* Status Badge */}
                        <div className="absolute top-3 left-3">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm ${status.cls}`}>
                            <StatusIcon className="w-3 h-3" />
                            {status.label}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                          {project.title}
                        </h3>
                        {project.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {project.description}
                          </p>
                        )}

                        {/* Tags */}
                        {project.tags && project.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {project.tags.slice(0, 4).map(tag => (
                              <span key={tag} className="px-2 py-0.5 rounded-md bg-muted/50 text-[10px] font-medium text-muted-foreground">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-3 border-t border-border/30">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            {project.service_type && (
                              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                                {project.service_type}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                            عرض التفاصيل
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {filteredProjects.length === 0 && (
            <div className="glass-card flex flex-col items-center justify-center py-20 text-center">
              <FolderOpen className="w-16 h-16 text-muted-foreground/20 mb-4" />
              <h3 className="text-lg font-semibold mb-1">لا توجد مشاريع</h3>
              <p className="text-sm text-muted-foreground">لم يتم العثور على مشاريع بهذا التصنيف</p>
            </div>
          )}
        </div>
      </section>

      {/* Timeline */}
      {projects.length > 0 && (
        <section className="container mx-auto px-4 mb-20">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-black text-foreground text-center mb-10">
              رحلة التعاون
            </h2>
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute top-0 bottom-0 right-6 w-px bg-border/50" />

              <div className="space-y-8">
                {projects.map((project, i) => {
                  const status = STATUS_LABELS[project.status] || STATUS_LABELS.pending;
                  return (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="relative flex gap-6 pr-2"
                    >
                      {/* Dot */}
                      <div className="relative z-10 w-12 h-12 rounded-xl bg-card border border-border/50 flex items-center justify-center shrink-0 shadow-sm">
                        {project.status === 'completed' ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <Loader2 className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      {/* Content */}
                      <div className="flex-1 pb-8">
                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                          <h4 className="text-sm font-bold text-foreground">{project.title}</h4>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${status.cls}`}>
                            {status.label}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">{project.service_type || 'مشروع'}</p>
                        <p className="text-xs text-muted-foreground/70">
                          {project.start_date
                            ? new Date(project.start_date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long' })
                            : new Date(project.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long' })
                          }
                          {project.end_date && ` — ${new Date(project.end_date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long' })}`}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
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
            <h2 className="text-2xl md:text-3xl font-black mb-3">
              هل تريد نتائج مشابهة؟
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              تواصل معنا الآن وابدأ مشروعك مع فريق B.CLICK
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link to="/request" className="btn-primary">
                <Zap className="w-5 h-5" />
                ابدأ مشروعك
              </Link>
              <a href="https://wa.me/201558663972" target="_blank" rel="noopener noreferrer" className="btn-ghost">
                <MessageCircle className="w-5 h-5" />
                تواصل واتساب
              </a>
            </div>
          </div>
        </motion.div>
      </section>
    </Layout>
  );
};

export default ClientShowcase;
