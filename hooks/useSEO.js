import { useEffect } from 'react';

/**
 * Hook simples para atualizar SEO dinâmico
 * Grug gosta: manipulação direta do DOM, sem bibliotecas pesadas
 * 
 * @param {Object} seoData - Dados para SEO
 * @param {string} seoData.title - Título da página
 * @param {string} seoData.description - Descrição da página
 * @param {string} seoData.image - URL da imagem (Open Graph)
 * @param {string} seoData.url - URL canônica
 */
export const useSEO = ({ title, description, image, url }) => {
    useEffect(() => {
        // Atualizar título
        if (title) {
            document.title = title;
        }

        // Helper para atualizar ou criar meta tag
        const updateMetaTag = (property, content) => {
            if (!content) return;
            
            let meta = document.querySelector(`meta[property="${property}"]`) || 
                      document.querySelector(`meta[name="${property}"]`);
            
            if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute(property.startsWith('og:') || property.startsWith('twitter:') ? 'property' : 'name', property);
                document.head.appendChild(meta);
            }
            meta.setAttribute('content', content);
        };

        // Meta description
        if (description) {
            updateMetaTag('description', description);
        }

        // Open Graph
        if (url) updateMetaTag('og:url', url);
        if (title) updateMetaTag('og:title', title);
        if (description) updateMetaTag('og:description', description);
        if (image) updateMetaTag('og:image', image);
        updateMetaTag('og:type', 'website');

        // Twitter Card
        if (title) updateMetaTag('twitter:title', title);
        if (description) updateMetaTag('twitter:description', description);
        if (image) updateMetaTag('twitter:image', image);
        updateMetaTag('twitter:card', 'summary_large_image');

        // Limpar ao desmontar (restaurar valores padrão)
        return () => {
            document.title = 'Marcelo Braz - Private Broker';
            updateMetaTag('description', 'Marcelo Braz - Consultor Private em Santos. Imóveis exclusivos na baixada santista.');
            updateMetaTag('og:title', 'Marcelo Braz - Private Broker');
            updateMetaTag('og:description', 'Consultor Private em Santos. Imóveis exclusivos na baixada santista.');
            updateMetaTag('og:url', window.location.origin);
        };
    }, [title, description, image, url]);
};

