import React from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  toolName?: string;
}

export default function SEO({ title, description, toolName }: SEOProps) {
  const baseTitle = "AI Suite - All-in-One AI Empowerment";
  const finalTitle = title ? `${title} | ${baseTitle}` : baseTitle;
  const finalDescription = description || "The ultimate AI Suite for creators, musicians, and marketers. 60+ tools at your fingertips.";

  React.useEffect(() => {
    document.title = finalTitle;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', finalDescription);
    } else {
      const meta = document.createElement('meta');
      meta.name = "description";
      meta.content = finalDescription;
      document.head.appendChild(meta);
    }
  }, [finalTitle, finalDescription]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": toolName ? "SoftwareApplication" : "WebApplication",
    "name": toolName || "AI Suite",
    "description": finalDescription,
    "applicationCategory": "MultimediaApplication, BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    }
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(jsonLd)}
    </script>
  );
}
