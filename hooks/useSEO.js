import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { BROKER_INFO } from '../data/constants.js';

/**
 * Hook SEO Grug Brain Style
 * Gera meta tags dinâmicas para Google, WhatsApp, Facebook
 * 
 * @param {Object} seo - Configurações SEO
 * @param {string} seo.title - Título da página
 * @param {string} seo.description - Descrição
 * @param {string} seo.image - URL da imagem (Open Graph)
 * @param {string} seo.url - URL canônica
 * @param {Object} seo.property - Dados do imóvel (opcional, para Schema.org)
 */
export const useSEO = ({ title, description, image, url, property }) => {
    const defaultTitle = `${BROKER_INFO.name} - Private Broker em Santos`;
    const defaultDescription = 'Imóveis exclusivos de alto padrão em Santos e região. Atendimento personalizado, discrição e expertise no mercado imobiliário de luxo.';
    const defaultImage = image || `${window.location.origin}/og-default.jpg`;

    const fullTitle = title ? `${title} | ${BROKER_INFO.name}` : defaultTitle;
    const metaDescription = description || defaultDescription;
    const canonicalUrl = url || window.location.href;

    // Schema.org para Google Rich Results
    const generateSchema = () => {
        if (!property) {
            // Schema para página principal (Organization)
            return {
                "@context": "https://schema.org",
                "@type": "RealEstateAgent",
                "name": BROKER_INFO.name,
                "description": metaDescription,
                "url": canonicalUrl,
                "telephone": BROKER_INFO.whatsapp,
                "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Santos",
                    "addressRegion": "SP",
                    "addressCountry": "BR"
                }
            };
        }

        // Schema para imóvel específico
        return {
            "@context": "https://schema.org",
            "@type": property.tipo?.includes('Comercial') ? 'CommercialRealEstate' : 'Apartment',
            "name": property.title,
            "description": property.description || metaDescription,
            "address": {
                "@type": "PostalAddress",
                "addressLocality": property.cidade || "Santos",
                "addressRegion": property.estado || "SP",
                "streetAddress": property.mostrar_endereco ? property.endereco : property.bairro,
                "postalCode": property.cep,
                "addressCountry": "BR"
            },
            "geo": property.mostrar_endereco && property.lat && property.lng ? {
                "@type": "GeoCoordinates",
                "latitude": property.lat,
                "longitude": property.lng
            } : undefined,
            "offers": {
                "@type": "Offer",
                "price": property.price ? property.price.replace(/[^0-9]/g, '') : undefined,
                "priceCurrency": "BRL",
                "availability": property.status === 'disponivel' ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
            },
            "floorSize": property.area_util ? {
                "@type": "QuantitativeValue",
                "value": property.area_util,
                "unitCode": "MTK"
            } : undefined,
            "numberOfRooms": property.quartos,
            "image": property.image || image
        };
    };

    return (
        <Helmet>
            {/* Título básico */}
            <title>{fullTitle}</title>
            <meta name="description" content={metaDescription} />

            {/* Canonical URL (evita conteúdo duplicado no Google) */}
            <link rel="canonical" href={canonicalUrl} />

            {/* Open Graph (Facebook, WhatsApp, LinkedIn) */}
            <meta property="og:type" content={property ? "website" : "business.business"} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:image" content={defaultImage} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:site_name" content={BROKER_INFO.name} />
            <meta property="og:locale" content="pt_BR" />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={metaDescription} />
            <meta name="twitter:image" content={defaultImage} />

            {/* Schema.org (Google Rich Results) */}
            <script type="application/ld+json">
                {JSON.stringify(generateSchema())}
            </script>

            {/* Keywords específicas para Santos e região */}
            {property && (
                <meta name="keywords" content={`
          ${property.tipo}, 
          ${property.bairro}, 
          ${property.cidade || 'Santos'}, 
          imóveis ${property.cidade || 'Santos'},
          ${property.quartos ? `${property.quartos} quartos` : ''},
          alto padrão,
          corretor Santos,
          ${BROKER_INFO.name}
        `.replace(/\s+/g, ' ').trim()} />
            )}
        </Helmet>
    );
};
