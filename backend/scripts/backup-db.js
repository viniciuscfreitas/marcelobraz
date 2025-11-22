const fs = require('fs');
const path = require('path');

/**
 * Script de backup do SQLite
 * Grug gosta: simples, direto, funciona
 */
function backupDatabase() {
    try {
        const dbPath = path.join(__dirname, '../database.sqlite');
        const backupsDir = path.join(__dirname, '../backups');

        // Criar diretório de backups se não existir
        if (!fs.existsSync(backupsDir)) {
            fs.mkdirSync(backupsDir, { recursive: true });
        }

        // Verificar se database existe
        if (!fs.existsSync(dbPath)) {
            console.log('⚠️ Database não encontrado:', dbPath);
            return;
        }

        // Nome do backup: database-YYYYMMDD-HHMMSS.sqlite
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        const backupFileName = `database-${timestamp}.sqlite`;
        const backupPath = path.join(backupsDir, backupFileName);

        // Copiar arquivo
        fs.copyFileSync(dbPath, backupPath);
        console.log(`✅ Backup criado: ${backupFileName}`);

        // Manter apenas últimos 30 dias de backups (Grug gosta: limpeza automática!)
        const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
        const backups = fs.readdirSync(backupsDir)
            .filter(f => f.startsWith('database-') && f.endsWith('.sqlite'))
            .map(f => ({
                name: f,
                path: path.join(backupsDir, f),
                time: fs.statSync(path.join(backupsDir, f)).mtime
            }));

        // Deletar backups mais antigos que 30 dias
        backups.forEach(backup => {
            if (backup.time.getTime() < thirtyDaysAgo) {
                fs.unlinkSync(backup.path);
                console.log(`🗑️ Backup antigo removido: ${backup.name}`);
            }
        });
    } catch (error) {
        console.error('❌ Erro ao criar backup:', error);
    }
}

// Se executado diretamente, fazer backup
if (require.main === module) {
    backupDatabase();
}

module.exports = backupDatabase;

