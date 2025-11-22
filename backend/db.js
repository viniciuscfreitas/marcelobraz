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
      featured INTEGER DEFAULT 0,
      
      -- Novos campos Imovelweb
      description TEXT,
      subtype TEXT,
      age TEXT,
      quartos INTEGER,
      vagas INTEGER,
      banheiros INTEGER,
      suites INTEGER,
      
      condominio TEXT,
      iptu TEXT,
      area_util REAL,
      area_total REAL,
      
      cep TEXT,
      estado TEXT,
      cidade TEXT,
      endereco TEXT,
      complemento TEXT,
      mostrar_endereco INTEGER DEFAULT 1, -- 1: Exato, 0: Não mostrar
      ref_code TEXT,
      
      aceita_permuta INTEGER DEFAULT 0,
      aceita_fgts INTEGER DEFAULT 0,
      posicao_apto TEXT,
      andares TEXT,
      
      features TEXT, -- JSON com checkboxes
      multimedia TEXT, -- JSON com fotos, vídeos, tour
      
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Migrações: adicionar colunas se não existirem
  const columnsToAdd = [
    { name: 'featured', type: 'INTEGER DEFAULT 0' },
    { name: 'description', type: 'TEXT' },
    { name: 'subtype', type: 'TEXT' },
    { name: 'age', type: 'TEXT' },
    { name: 'quartos', type: 'INTEGER' },
    { name: 'vagas', type: 'INTEGER' },
    { name: 'banheiros', type: 'INTEGER' },
    { name: 'suites', type: 'INTEGER' },
    { name: 'condominio', type: 'TEXT' },
    { name: 'iptu', type: 'TEXT' },
    { name: 'area_util', type: 'REAL' },
    { name: 'area_total', type: 'REAL' },
    { name: 'cep', type: 'TEXT' },
    { name: 'estado', type: 'TEXT' },
    { name: 'cidade', type: 'TEXT' },
    { name: 'endereco', type: 'TEXT' },
    { name: 'complemento', type: 'TEXT' },
    { name: 'mostrar_endereco', type: 'INTEGER DEFAULT 1' },
    { name: 'ref_code', type: 'TEXT' },
    { name: 'aceita_permuta', type: 'INTEGER DEFAULT 0' },
    { name: 'aceita_fgts', type: 'INTEGER DEFAULT 0' },
    { name: 'posicao_apto', type: 'TEXT' },
    { name: 'andares', type: 'TEXT' },
    { name: 'features', type: 'TEXT' },
    { name: 'multimedia', type: 'TEXT' },
    { name: 'transaction_type', type: "TEXT DEFAULT 'Venda'" },
    // Grug gosta: novas colunas Fase 1
    { name: 'status', type: "TEXT DEFAULT 'disponivel'" },
    { name: 'views', type: 'INTEGER DEFAULT 0' }
  ];

  columnsToAdd.forEach(col => {
    try {
      db.exec(`ALTER TABLE properties ADD COLUMN ${col.name} ${col.type}`);
      console.log(`✅ Migration: campo ${col.name} adicionado`);
    } catch (error) {
      // Campo já existe, ignora
    }
  });

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

  // Tabela de usuário admin
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Migração: adicionar campo name se não existir
  try {
    db.exec(`ALTER TABLE users ADD COLUMN name TEXT`);
    console.log('✅ Migration: campo name adicionado');
  } catch (error) {
    // Campo já existe, ignora
  }

  console.log('✅ Database initialized!');
}

// Inicializar ao importar
initDatabase();

module.exports = db;
