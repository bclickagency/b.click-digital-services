import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

interface ShowcaseClient {
  id: string;
  full_name: string;
  company_name: string | null;
  logo_url: string | null;
  avatar_url: string | null;
  industry: string | null;
}

const ClientsShowcase = () => {
  const { t } = useLanguage();
  const [clients, setClients] = useState<ShowcaseClient[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id, full_name, company_name, logo_url, avatar_url, industry')
        .eq('is_featured', true)
        .limit(12);
      if (data) setClients(data as ShowcaseClient[]);
    };
    load();
  }, []);

  if (clients.length === 0) return null;

  // Triple for infinite scroll
  const allClients = [...clients, ...clients, ...clients];

  return (
    <section className="py-12 overflow-hidden">
      <div className="container mx-auto px-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="inline-block px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-xs font-medium mb-3">
            {t.clientsShowcase.badge}
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            {t.clientsShowcase.title} <span className="text-primary">{t.clientsShowcase.titleHighlight}</span>
          </h2>
        </motion.div>
      </div>

      {/* Infinite scroll marquee */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <div className="flex animate-marquee gap-6 py-4" style={{ width: 'max-content', animationDuration: '40s' }}>
          {allClients.map((client, index) => (
            <div
              key={`${client.id}-${index}`}
              className="flex items-center gap-3 px-5 py-3 rounded-2xl glass-card hover:!transform-none min-w-fit"
            >
              <div className="w-10 h-10 rounded-xl bg-muted/30 border border-border/50 flex items-center justify-center overflow-hidden shrink-0">
                {client.logo_url || client.avatar_url ? (
                  <img
                    src={client.logo_url || client.avatar_url || ''}
                    alt={client.company_name || client.full_name}
                    className="w-full h-full object-cover"
                    style={{ filter: 'none' }}
                  />
                ) : (
                  <span className="text-sm font-black text-primary">
                    {(client.company_name || client.full_name)?.charAt(0)}
                  </span>
                )}
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground whitespace-nowrap">
                  {client.company_name || client.full_name}
                </p>
                {client.industry && (
                  <p className="text-[10px] text-muted-foreground">{client.industry}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientsShowcase;
