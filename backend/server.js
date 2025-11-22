require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Routes
const propertiesRouter = require('./routes/properties');
const leadsRouter = require('./routes/leads');
const authRouter = require('./routes/auth');
const uploadRouter = require('./routes/upload');
const sitemapRouter = require('./routes/sitemap');
const adminRouter = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3001;

const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cron = require('node-cron');
const backupDatabase = require('./scripts/backup-db');

// Rate limiting (Grug gosta: proteção simples contra DDoS)
// Aumentado para scroll infinito funcionar melhor
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 200, // máximo 200 requests por IP (aumentado de 100)
    message: 'Muitas requisições deste IP, tente novamente em 15 minutos.',
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false, // Contar todas as requisições
    skipFailedRequests: false
});

// Middleware
app.use(helmet()); // Security headers
app.use(morgan('dev')); // Logging (Grug likes logs)
app.use('/api/', limiter); // Rate limit em todas as rotas API
// CORS: Grug gosta de segurança! Sem '*' em produção
// Permite admin e site em produção
let corsOrigins;
if (process.env.CORS_ORIGIN && process.env.CORS_ORIGIN.trim()) {
    corsOrigins = process.env.CORS_ORIGIN.split(',').map(o => o.trim()).filter(o => o);
} else if (process.env.NODE_ENV === 'development') {
    corsOrigins = ['*'];
} else {
    // Produção: domínios padrão se CORS_ORIGIN não estiver definido
    corsOrigins = ['https://marcelobraz.vinicius.xyz', 'https://admin.marcelobraz.vinicius.xyz'];
}

const corsOptions = {
    origin: corsOrigins.includes('*') ? '*' : corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

console.log(`🌐 CORS configurado para: ${corsOrigins.includes('*') ? '*' : corsOrigins.join(', ')}`);
app.use(cors(corsOptions));

// Servir uploads estaticamente (antes de json para não interferir)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rota de upload (antes de express.json para FormData funcionar)
app.use('/api/upload', uploadRouter);

// Express JSON apenas para rotas JSON (não interfere em FormData)
app.use(express.json());

// Routes JSON
app.use('/api/properties', propertiesRouter);
app.use('/api/leads', leadsRouter);
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/sitemap.xml', sitemapRouter);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Grug backend is alive! 🦖' });
});

// Error handler (Grug style - melhorado mas ainda simples!)
app.use((err, req, res, next) => {
    console.error('❌ Error:', err);

    // Erro do Multer (upload)
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'Arquivo muito grande. Tamanho máximo: 5MB.' });
    }
    if (err.message && err.message.includes('imagens')) {
        return res.status(400).json({ error: err.message });
    }

    // Erro de JSON inválido
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ error: 'JSON inválido' });
    }

    // Erro padrão
    res.status(err.status || 500).json({
        error: err.message || 'Algo deu errado! Grug vai investigar.',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// Backup automático diário às 02:00 AM (Grug gosta: backup simples e automático)
cron.schedule('0 2 * * *', () => {
    console.log('🔄 Iniciando backup automático...');
    backupDatabase();
}, {
    scheduled: true,
    timezone: "America/Sao_Paulo"
});

// Backup na inicialização (opcional, mas útil)
if (process.env.NODE_ENV === 'production') {
    console.log('🔄 Criando backup inicial...');
    backupDatabase();
}

app.listen(PORT, () => {
    console.log(`🦖 Grug backend rodando na porta ${PORT}`);
    console.log(`📍 http://localhost:${PORT}/api/health`);
    console.log(`💾 Backup automático agendado: diariamente às 02:00 AM`);
});
