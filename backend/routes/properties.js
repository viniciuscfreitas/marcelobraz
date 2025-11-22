const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAuth } = require('../middleware/auth');
const { parseProperty, parseProperties, preparePropertyData } = require('../utils/propertyHelpers');
const { validateProperty, handleValidationErrors } = require('../validators/propertyValidator');
const { buildPropertyQuery } = require('../utils/queryBuilder');

// GET /api/properties - Listar todas as propriedades (público)
// Grug gosta: SELECT específico para performance (não SELECT *)
// Suporta: paginação (?page=1&limit=12), busca (?search=termo), filtros
router.get('/', (req, res) => {
    try {
        const page = parseInt(req.query.page) || null;
        const limit = parseInt(req.query.limit) || null;
        
        // Extrair filtros da query
        const filters = {
            search: req.query.search?.trim() || null,
            areaMin: req.query.area_min ? parseFloat(req.query.area_min) : null,
            areaMax: req.query.area_max ? parseFloat(req.query.area_max) : null,
            quartosMin: req.query.quartos_min ? parseInt(req.query.quartos_min) : null,
            quartosMax: req.query.quartos_max ? parseInt(req.query.quartos_max) : null,
            banheirosMin: req.query.banheiros_min ? parseInt(req.query.banheiros_min) : null,
            banheirosMax: req.query.banheiros_max ? parseInt(req.query.banheiros_max) : null,
            vagasMin: req.query.vagas_min ? parseInt(req.query.vagas_min) : null,
            vagasMax: req.query.vagas_max ? parseInt(req.query.vagas_max) : null,
            transaction_type: req.query.transaction_type?.trim() || null
        };

        const { whereClause, params } = buildPropertyQuery(filters);
        
        const baseQuery = `
            SELECT id, title, subtitle, price, image, bairro, tipo, specs, tags, featured,
                   quartos, vagas, banheiros, area_util, cidade, created_at, description, transaction_type
            FROM properties 
            ${whereClause}
            ORDER BY featured DESC, created_at DESC
        `;

        // Se não tem paginação, retorna tudo (compatibilidade)
        if (!page && !limit) {
            const properties = db.prepare(baseQuery).all(...params);
            return res.json(parseProperties(properties));
        }

        // Com paginação
        const validPage = Math.max(1, page || 1);
        const validLimit = Math.max(1, Math.min(100, limit || 12));
        const offset = (validPage - 1) * validLimit;

        const countQuery = `SELECT COUNT(*) as count FROM properties ${whereClause}`;
        const totalResult = db.prepare(countQuery).get(...params);
        const total = totalResult.count;

        const paginatedQuery = `${baseQuery} LIMIT ? OFFSET ?`;
        const properties = db.prepare(paginatedQuery).all(...params, validLimit, offset);

        const totalPages = Math.ceil(total / validLimit);
        const hasMore = validPage < totalPages;

        res.json({
            data: parseProperties(properties),
            pagination: { page: validPage, limit: validLimit, total, totalPages, hasMore }
        });
    } catch (error) {
        console.error('Error fetching properties:', error);
        res.status(500).json({ error: 'Erro ao buscar imóveis' });
    }
});

// GET /api/properties/:id - Buscar uma propriedade
router.get('/:id', (req, res) => {
    try {
        // Incrementar views (Grug gosta: simples, direto!)
        db.prepare('UPDATE properties SET views = views + 1 WHERE id = ?').run(req.params.id);
        
        const property = db.prepare('SELECT * FROM properties WHERE id = ?').get(req.params.id);

        if (!property) {
            return res.status(404).json({ error: 'Imóvel não encontrado' });
        }

        res.json(parseProperty(property));
    } catch (error) {
        console.error('Error fetching property:', error);
        res.status(500).json({ error: 'Erro ao buscar imóvel' });
    }
});

// POST /api/properties - Criar propriedade (protegido)
router.post('/', requireAuth, validateProperty, handleValidationErrors, (req, res) => {
    try {
        const insert = db.prepare(`
            INSERT INTO properties (
                title, subtitle, price, image, bairro, tipo, specs, tags, featured,
                description, subtype, age, quartos, vagas, banheiros, suites,
                condominio, iptu, area_util, area_total,
                cep, estado, cidade, endereco, complemento, mostrar_endereco, ref_code,
                aceita_permuta, aceita_fgts, posicao_apto, andares,
                features, multimedia, transaction_type
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const values = preparePropertyData(req.body);
        const result = insert.run(...values);

        const newProperty = db.prepare('SELECT * FROM properties WHERE id = ?').get(result.lastInsertRowid);
        res.status(201).json(parseProperty(newProperty));
    } catch (error) {
        console.error('Error creating property:', error);
        res.status(500).json({ error: 'Erro ao criar imóvel' });
    }
});

// PUT /api/properties/:id - Atualizar propriedade (protegido)
router.put('/:id', requireAuth, validateProperty, handleValidationErrors, (req, res) => {
    try {
        const existing = db.prepare('SELECT * FROM properties WHERE id = ?').get(req.params.id);
        if (!existing) {
            return res.status(404).json({ error: 'Imóvel não encontrado' });
        }

        const update = db.prepare(`
            UPDATE properties
            SET title = ?, subtitle = ?, price = ?, image = ?, bairro = ?, tipo = ?, specs = ?, tags = ?, featured = ?,
                description = ?, subtype = ?, age = ?, quartos = ?, vagas = ?, banheiros = ?, suites = ?,
                condominio = ?, iptu = ?, area_util = ?, area_total = ?,
                cep = ?, estado = ?, cidade = ?, endereco = ?, complemento = ?, mostrar_endereco = ?, ref_code = ?,
                aceita_permuta = ?, aceita_fgts = ?, posicao_apto = ?, andares = ?,
                features = ?, multimedia = ?, transaction_type = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `);

        const values = [...preparePropertyData(req.body), req.params.id];
        update.run(...values);

        const updated = db.prepare('SELECT * FROM properties WHERE id = ?').get(req.params.id);
        res.json(parseProperty(updated));
    } catch (error) {
        console.error('Error updating property:', error);
        res.status(500).json({ error: 'Erro ao atualizar imóvel' });
    }
});

// PATCH /api/properties/:id/featured - Toggle featured (protegido, limite 4)
router.patch('/:id/featured', requireAuth, (req, res) => {
    try {
        const property = db.prepare('SELECT * FROM properties WHERE id = ?').get(req.params.id);
        if (!property) {
            return res.status(404).json({ error: 'Imóvel não encontrado' });
        }

        const currentFeatured = property.featured === 1;
        const newFeatured = !currentFeatured;

        // Se está marcando como featured, verificar se já existem 4
        if (newFeatured) {
            const featuredCount = db.prepare('SELECT COUNT(*) as count FROM properties WHERE featured = 1').get();
            if (featuredCount.count >= 4) {
                return res.status(409).json({
                    error: 'Limite de 4 imóveis na Curadoria da Semana atingido. Desmarque um imóvel primeiro.'
                });
            }
        }

        db.prepare('UPDATE properties SET featured = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(
            newFeatured ? 1 : 0,
            req.params.id
        );

        const updated = db.prepare('SELECT * FROM properties WHERE id = ?').get(req.params.id);
        res.json(parseProperty(updated));
    } catch (error) {
        console.error('Error toggling featured:', error);
        res.status(500).json({ error: 'Erro ao atualizar curadoria' });
    }
});

// DELETE /api/properties/:id - Deletar propriedade (protegido)
router.delete('/:id', requireAuth, (req, res) => {
    try {
        const existing = db.prepare('SELECT * FROM properties WHERE id = ?').get(req.params.id);

        if (!existing) {
            return res.status(404).json({ error: 'Imóvel não encontrado' });
        }

        db.prepare('DELETE FROM properties WHERE id = ?').run(req.params.id);

        res.json({ message: 'Imóvel deletado com sucesso! 🦖' });
    } catch (error) {
        console.error('Error deleting property:', error);
        res.status(500).json({ error: 'Erro ao deletar imóvel' });
    }
});

module.exports = router;
