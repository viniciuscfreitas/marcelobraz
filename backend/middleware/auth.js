const jwt = require('jsonwebtoken');

// Middleware de autenticação (Grug style - simples!)
const jwt = require('jsonwebtoken');

// Middleware de autenticação (Grug style - simples!)
function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    const token = authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ error: 'Token inválido' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token expirado ou inválido' });
    }
}

module.exports = { authenticateToken };
const authHeader = req.headers.authorization;

if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido' });
}

const token = authHeader.split(' ')[1]; // Bearer TOKEN

if (!token) {
    return res.status(401).json({ error: 'Token inválido' });
}

try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
} catch (error) {
    return res.status(401).json({ error: 'Token expirado ou inválido' });
}
}

module.exports = { requireAuth };
