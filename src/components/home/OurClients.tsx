import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Briefcase } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface FeaturedClient {
  id: string;
  full_name: string;
  company_name: string | null;
  logo_url: string | null;
  avatar_url: string | null;
  industry: string | null;
  rating: number | null;
  testimonial: string | null;
}

const OurClients = () => {
  const [clients, setClients] = useState<FeaturedClient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id, full_name, company_name, logo_url, avatar_url, industry, rating, testimonial')
        .eq('is_featured', true)
        .limit(8);
      if (data) setClients(data as any);
      setLoading(false);
    };
    load();
  }, []);

  if (loading || clients.length === 0) return null;

  return (
    <section className="section-container">
      <div className="text-center mb-12">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-block px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-medium mb-4"
        >
          عملاؤنا
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="section-title"
        >
          شركاء <span className="text-primary">النجاح</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="section-subtitle mx-auto"
        >
          نفخر بتعاوننا مع مجموعة من أفضل الشركات والمؤسسات
        </motion.p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {clients.map((client, i) => (
          <motion.div
            key={client.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
          >
            <Link
              to={`/clients/${client.id}`}
              className="block glass-card p-6 text-center group hover:border-primary/20 transition-all duration-300"
            >
              {/* Avatar/Logo */}
              <div className="w-20 h-20 mx-auto rounded-2xl bg-muted/30 border border-border/50 flex items-center justify-center overflow-hidden mb-4 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-primary/10 transition-all duration-300">
                {client.logo_url || client.avatar_url ? (
                  <img
                    src={client.logo_url || client.avatar_url || ''}
                    alt={client.company_name || client.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-black text-primary">
                    {(client.company_name || client.full_name)?.charAt(0)}
                  </span>
                )}
              </div>

              <h3 className="text-sm font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                {client.company_name || client.full_name}
              </h3>

              {client.industry && (
                <p className="text-xs text-muted-foreground mb-2">{client.industry}</p>
              )}

              {client.rating && client.rating > 0 && (
                <div className="flex justify-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} className={`w-3 h-3 ${idx < (client.rating || 0) ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground/20'}`} />
                  ))}
                </div>
              )}
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default OurClients;
