/**
 * Helper para construir queries SQL com filtros dinâmicos
 * Grug gosta: função pequena, faz uma coisa só
 */
function buildPropertyQuery(filters) {
    const whereConditions = [];
    const params = [];

    // Busca (LIKE em múltiplos campos) - Grug gosta: busca completa e simples
    if (filters.search) {
        const searchTerm = `%${filters.search}%`;
        whereConditions.push(`(title LIKE ? OR subtitle LIKE ? OR description LIKE ? OR bairro LIKE ? OR cidade LIKE ? OR tipo LIKE ? OR ref_code LIKE ?)`);
        params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
    }

    // Filtros numéricos
    if (filters.areaMin !== null) {
        whereConditions.push('area_util >= ?');
        params.push(filters.areaMin);
    }
    if (filters.areaMax !== null) {
        whereConditions.push('area_util <= ?');
        params.push(filters.areaMax);
    }
    if (filters.quartosMin !== null) {
        whereConditions.push('quartos >= ?');
        params.push(filters.quartosMin);
    }
    if (filters.quartosMax !== null) {
        whereConditions.push('quartos <= ?');
        params.push(filters.quartosMax);
    }
    if (filters.banheirosMin !== null) {
        whereConditions.push('banheiros >= ?');
        params.push(filters.banheirosMin);
    }
    if (filters.banheirosMax !== null) {
        whereConditions.push('banheiros <= ?');
        params.push(filters.banheirosMax);
    }
    if (filters.vagasMin !== null) {
        whereConditions.push('vagas >= ?');
        params.push(filters.vagasMin);
    }
    if (filters.vagasMax !== null) {
        whereConditions.push('vagas <= ?');
        params.push(filters.vagasMax);
    }

    // Filtro por tipo de transação
    if (filters.transaction_type) {
        whereConditions.push('transaction_type = ?');
        params.push(filters.transaction_type);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    
    return { whereClause, params };
}

module.exports = { buildPropertyQuery };

