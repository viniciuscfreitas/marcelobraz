require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Routes
const propertiesRouter = require('./routes/properties');
const leadsRouter = require('./routes/leads');
const authRouter = require('./routes/auth');
const uploadRouter = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Servir uploads estaticamente
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/properties', propertiesRouter);
app.use('/api/leads', leadsRouter);
app.use('/api/auth', authRouter);
app.use('/api/upload', uploadRouter);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Grug backend is alive! 🦖' });
});

// Error handler (Grug style - simples!)
app.use((err, req, res, next) => {
    console.error('❌ Error:', err);
    res.status(500).json({ error: 'Algo deu errado! Grug vai investigar.' });
});

app.listen(PORT, () => {
    console.log(`🦖 Grug backend rodando na porta ${PORT}`);
    console.log(`📍 http://localhost:${PORT}/api/health`);
});
