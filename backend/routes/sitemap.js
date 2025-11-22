const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * GET /sitemap.xml - Gerar sitemap dinâmico
 * Grug gosta: simples, direto, funciona
 */
router.get('/', (req, res) => {
    try {
        // Buscar todos imóveis (apenas id, title, updated_at)
        const properties = db.prepare(`
            SELECT id, updated_at 
            FROM properties 
            ORDER BY updated_at DESC
        `).all();

        // URL base (pegar do host ou usar padrão)
        const baseUrl = req.protocol + '://' + req.get('host');
        
        // Gerar XML
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
        
        // URL principal (home)
        xml += '  <url>\n';
        xml += `    <loc>${baseUrl}/</loc>\n`;
        xml += '    <changefreq>daily</changefreq>\n';
        xml += '    <priority>1.0</priority>\n';
        xml += '  </url>\n';
        
        // URL do portfólio
        xml += '  <url>\n';
        xml += `    <loc>${baseUrl}/#portfolio</loc>\n`;
        xml += '    <changefreq>daily</changefreq>\n';
        xml += '    <priority>0.9</priority>\n';
        xml += '  </url>\n';
        
        // URLs dos imóveis
        properties.forEach(property => {
            const lastmod = property.updated_at ? new Date(property.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
            xml += '  <url>\n';
            xml += `    <loc>${baseUrl}/?property=${property.id}</loc>\n`;
            xml += `    <lastmod>${lastmod}</lastmod>\n`;
            xml += '    <changefreq>weekly</changefreq>\n';
            xml += '    <priority>0.8</priority>\n';
            xml += '  </url>\n';
        });
        
        xml += '</urlset>';
        
        res.set('Content-Type', 'application/xml');
        res.send(xml);
    } catch (error) {
        console.error('Error generating sitemap:', error);
        res.status(500).send('<?xml version="1.0" encoding="UTF-8"?><error>Erro ao gerar sitemap</error>');
    }
});

module.exports = router;

