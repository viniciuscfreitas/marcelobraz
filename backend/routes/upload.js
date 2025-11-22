const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { authenticateToken } = require('../middleware/auth');

// Configuração do Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        // Nome único: timestamp + extensão original
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Apenas imagens são permitidas!'));
        }
    }
});

// Rota de upload (Protegida) - Grug gosta: simples e direto
router.post('/', authenticateToken, upload.single('image'), (req, res) => {
    console.log('📤 Upload recebido:', req.file ? `Arquivo: ${req.file.filename}` : 'Sem arquivo');
    
    try {
        if (!req.file) {
            console.log('❌ Upload falhou: Nenhum arquivo enviado');
            return res.status(400).json({ error: 'Nenhum arquivo enviado' });
        }

        // Grug fix: HTTPS em produção (verifica host, não localhost)
        const host = req.get('host') || req.hostname;
        const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1') || host.includes(':3001');
        const protocol = isLocalhost ? (req.protocol || 'http') : 'https';
        const imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
        
        console.log('✅ Upload concluído:', imageUrl);
        res.json({ url: imageUrl });
    } catch (error) {
        console.error('❌ Erro no upload:', error);
        res.status(500).json({ error: 'Erro ao fazer upload da imagem' });
    }
});

module.exports = router;
