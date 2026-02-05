 import { Helmet } from 'react-helmet-async';
 
 interface SEOProps {
   title?: string;
   description?: string;
   keywords?: string;
   image?: string;
   url?: string;
   type?: 'website' | 'article';
   publishedTime?: string;
   author?: string;
 }
 
 const defaultMeta = {
   title: 'B.CLICK - وكالة الحلول الرقمية المتكاملة',
   description: 'نقدم حلولًا رقمية متكاملة تشمل تصميم المواقع، تطوير التطبيقات، التسويق الرقمي، والهوية البصرية. شريكك الرقمي للنجاح في مصر والوطن العربي.',
   keywords: 'تصميم مواقع, تطوير تطبيقات, تسويق رقمي, هوية بصرية, SEO, متاجر إلكترونية, مصر',
   image: 'https://bclickagency.lovable.app/og-image.png',
   url: 'https://bclickagency.lovable.app',
 };
 
 const SEO = ({
   title,
   description = defaultMeta.description,
   keywords = defaultMeta.keywords,
   image = defaultMeta.image,
   url = defaultMeta.url,
   type = 'website',
   publishedTime,
   author,
 }: SEOProps) => {
   const fullTitle = title ? `${title} | B.CLICK` : defaultMeta.title;
 
   return (
     <Helmet>
       {/* Basic Meta */}
       <title>{fullTitle}</title>
       <meta name="description" content={description} />
       <meta name="keywords" content={keywords} />
       <meta name="author" content={author || 'B.CLICK Agency'} />
       <link rel="canonical" href={url} />
 
       {/* Open Graph */}
       <meta property="og:title" content={fullTitle} />
       <meta property="og:description" content={description} />
       <meta property="og:image" content={image} />
       <meta property="og:url" content={url} />
       <meta property="og:type" content={type} />
       <meta property="og:site_name" content="B.CLICK Agency" />
       <meta property="og:locale" content="ar_EG" />
 
       {/* Twitter Card */}
       <meta name="twitter:card" content="summary_large_image" />
       <meta name="twitter:title" content={fullTitle} />
       <meta name="twitter:description" content={description} />
       <meta name="twitter:image" content={image} />
 
       {/* Article specific */}
       {type === 'article' && publishedTime && (
         <meta property="article:published_time" content={publishedTime} />
       )}
       {type === 'article' && author && (
         <meta property="article:author" content={author} />
       )}
 
       {/* Structured Data */}
       <script type="application/ld+json">
         {JSON.stringify({
           '@context': 'https://schema.org',
           '@type': type === 'article' ? 'Article' : 'Organization',
           name: 'B.CLICK Agency',
           url: defaultMeta.url,
           logo: image,
           description: defaultMeta.description,
           contactPoint: {
             '@type': 'ContactPoint',
             telephone: '+201558663972',
             contactType: 'customer service',
             availableLanguage: ['Arabic', 'English'],
           },
           sameAs: [
             'https://wa.me/201558663972',
           ],
         })}
       </script>
     </Helmet>
   );
 };
 
 export default SEO;