const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAuth } = require('../middleware/auth');
const { parseProperty, parseProperties, preparePropertyData } = require('../utils/propertyHelpers');
const { validateProperty, handleValidationErrors } = require('../validators/propertyValidator');

// GET /api/properties - Listar todas as propriedades (público)
// Grug gosta: SELECT específico para performance (não SELECT *)
router.get('/', (req, res) => {
    try {
        const properties = db.prepare(`
            SELECT id, title, subtitle, price, image, bairro, tipo, specs, tags, featured,
                   quartos, vagas, banheiros, area_util, cidade, created_at
            FROM properties 
            ORDER BY featured DESC, created_at DESC
        `).all();
        res.json(parseProperties(properties));
    } catch (error) {
        console.error('Error fetching properties:', error);
        res.status(500).json({ error: 'Erro ao buscar imóveis' });
    }
});

// GET /api/properties/:id - Buscar uma propriedade
router.get('/:id', (req, res) => {
    try {
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
                features, multimedia
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
                features = ?, multimedia = ?,
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
