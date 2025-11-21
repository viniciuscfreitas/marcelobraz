const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

// GET /api/properties - Listar todas as propriedades (público)
router.get('/', (req, res) => {
    try {
        const properties = db.prepare('SELECT * FROM properties ORDER BY created_at DESC').all();

        // Parser tags de JSON string para array
        const parsedProperties = properties.map(prop => ({
            ...prop,
            tags: prop.tags ? JSON.parse(prop.tags) : []
        }));

        res.json(parsedProperties);
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

        property.tags = property.tags ? JSON.parse(property.tags) : [];
        res.json(property);
    } catch (error) {
        console.error('Error fetching property:', error);
        res.status(500).json({ error: 'Erro ao buscar imóvel' });
    }
});

// POST /api/properties - Criar propriedade (protegido)
router.post('/', requireAuth, (req, res) => {
    try {
        const { title, subtitle, price, image, bairro, tipo, specs, tags } = req.body;

        // Validação básica
        if (!title || !price || !bairro || !tipo) {
            return res.status(400).json({ error: 'Campos obrigatórios: title, price, bairro, tipo' });
        }

        // Inserir no banco
        const insert = db.prepare(`
      INSERT INTO properties (title, subtitle, price, image, bairro, tipo, specs, tags)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

        const result = insert.run(
            title,
            subtitle || null,
            price,
            image || null,
            bairro,
            tipo,
            specs || null,
            tags ? JSON.stringify(tags) : null
        );

        // Buscar o imóvel criado
        const newProperty = db.prepare('SELECT * FROM properties WHERE id = ?').get(result.lastInsertRowid);
        newProperty.tags = newProperty.tags ? JSON.parse(newProperty.tags) : [];

        res.status(201).json(newProperty);
    } catch (error) {
        console.error('Error creating property:', error);
        res.status(500).json({ error: 'Erro ao criar imóvel' });
    }
});

// PUT /api/properties/:id - Atualizar propriedade (protegido)
router.put('/:id', requireAuth, (req, res) => {
    try {
        const { title, subtitle, price, image, bairro, tipo, specs, tags } = req.body;

        // Verificar se existe
        const existing = db.prepare('SELECT * FROM properties WHERE id = ?').get(req.params.id);
        if (!existing) {
            return res.status(404).json({ error: 'Imóvel não encontrado' });
        }

        // Atualizar
        const update = db.prepare(`
      UPDATE properties
      SET title = ?, subtitle = ?, price = ?, image = ?, bairro = ?, tipo = ?, specs = ?, tags = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

        update.run(
            title,
            subtitle || null,
            price,
            image || null,
            bairro,
            tipo,
            specs || null,
            tags ? JSON.stringify(tags) : null,
            req.params.id
        );

        // Retornar atualizado
        const updated = db.prepare('SELECT * FROM properties WHERE id = ?').get(req.params.id);
        updated.tags = updated.tags ? JSON.parse(updated.tags) : [];

        res.json(updated);
    } catch (error) {
        console.error('Error updating property:', error);
        res.status(500).json({ error: 'Erro ao atualizar imóvel' });
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
