import { motion } from 'framer-motion';

const companies = [
  { name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/200px-Google_2015_logo.svg.png' },
  { name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/200px-Microsoft_logo_%282012%29.svg.png' },
  { name: 'Amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/200px-Amazon_logo.svg.png' },
  { name: 'Meta', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/200px-Meta_Platforms_Inc._logo.svg.png' },
  { name: 'Apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/100px-Apple_logo_black.svg.png' },
  { name: 'Samsung', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/200px-Samsung_Logo.svg.png' },
];

const TrustedCompanies = () => {
  const allCompanies = [...companies, ...companies];

  return (
    <section className="py-16 overflow-hidden">
      <div className="container mx-auto px-4 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="inline-block px-4 py-2 rounded-xl bg-muted/50 text-muted-foreground text-sm font-medium mb-4">
            شركاء النجاح
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            شركات تثق بنا
          </h2>
        </motion.div>
      </div>

      {/* Marquee container */}
      <div className="relative">
        {/* Gradient overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        {/* CSS marquee - no JS animation overhead */}
        <div className="flex animate-marquee gap-16 py-8" style={{ width: 'max-content' }}>
          {allCompanies.map((company, index) => (
            <div
              key={`${company.name}-${index}`}
              className="flex items-center justify-center w-32 h-16 px-4 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
            >
              <img
                src={company.logo}
                alt={company.name}
                className="max-w-full max-h-full object-contain dark:invert"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedCompanies;
