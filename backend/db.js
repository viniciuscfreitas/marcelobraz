const Database = require('better-sqlite3');
const path = require('path');

// Grug gosta: 1 arquivo SQLite, simples!
const db = new Database(path.join(__dirname, 'database.sqlite'));

// Configurar para melhor performance
db.pragma('journal_mode = WAL');

// Criar tabelas se não existirem
function initDatabase() {
    // Tabela de propriedades
    db.exec(`
    CREATE TABLE IF NOT EXISTS properties (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      subtitle TEXT,
      price TEXT NOT NULL,
      image TEXT,
      bairro TEXT NOT NULL,
      tipo TEXT NOT NULL,
      specs TEXT,
      tags TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

    // Tabela de leads
    db.exec(`
    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      property_id INTEGER,
      property_title TEXT,
      type TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

    // Tabela de usuário admin (só 1 por enquanto)
    db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

    console.log('✅ Database initialized!');
}

// Inicializar ao importar
initDatabase();

module.exports = db;
