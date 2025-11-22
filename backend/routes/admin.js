const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

/**
 * GET /api/admin/stats - Estatísticas do dashboard
 * Grug gosta: queries simples, diretas, funcionam!
 */
router.get('/stats', requireAuth, (req, res) => {
    try {
        // Total de views (últimos 7 dias - usando views total por enquanto, Grug gosta simples!)
        const totalViewsResult = db.prepare('SELECT SUM(views) as total FROM properties').get();
        const totalViews = totalViewsResult.total || 0;

        // Total de leads (últimos 7 dias)
        const leadsResult = db.prepare(`
            SELECT COUNT(*) as count 
            FROM leads 
            WHERE created_at > datetime('now', '-7 days')
        `).get();
        const leadsCount = leadsResult.count || 0;

        // Taxa de conversão (leads / views * 100)
        const conversionRate = totalViews > 0 ? ((leadsCount / totalViews) * 100).toFixed(1) : '0.0';

        // Top 3 imóveis mais vistos
        const topProperties = db.prepare(`
            SELECT 
                p.id, 
                p.title, 
                p.views,
                COUNT(l.id) as leads
            FROM properties p
            LEFT JOIN leads l ON l.property_id = p.id
            GROUP BY p.id
            ORDER BY p.views DESC
            LIMIT 3
        `).all();

        // Formatar top properties
        const formattedTopProperties = topProperties.map(p => ({
            id: p.id,
            title: p.title,
            views: p.views || 0,
            leads: p.leads || 0,
            conversion_rate: p.views > 0 ? ((p.leads / p.views) * 100).toFixed(1) : '0.0'
        }));

        res.json({
            total_views: totalViews,
            leads_count: leadsCount,
            conversion_rate: conversionRate,
            top_properties: formattedTopProperties
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Erro ao buscar estatísticas' });
    }
});

module.exports = router;

