/**
 * Helpers para transformação e validação de propriedades
 * Grug gosta: funções pequenas e focadas
 */

/**
 * Parse JSON fields do banco para objetos JavaScript
 * @param {Object} property - Property do banco
 * @returns {Object} - Property com JSON fields parseados
 */
function parseProperty(property) {
    if (!property) return null;

    try {
        return {
            ...property,
            tags: property.tags ? JSON.parse(property.tags) : [],
            features: property.features ? JSON.parse(property.features) : {},
            multimedia: property.multimedia ? JSON.parse(property.multimedia) : {},
            featured: property.featured === 1,
            transaction_type: property.transaction_type || 'Venda'
        };
    } catch (error) {
        console.error('Error parsing property JSON fields:', error);
        // Retornar com defaults seguros
        return {
            ...property,
            tags: [],
            features: {},
            multimedia: {},
            featured: property.featured === 1,
            transaction_type: property.transaction_type || 'Venda'
        };
    }
}

/**
 * Transformar array de properties
 * @param {Array} properties - Array de properties do banco
 * @returns {Array} - Array de properties parseadas
 */
function parseProperties(properties) {
    return properties.map(prop => parseProperty(prop));
}

/**
 * Preparar dados para inserção no banco (converter objetos para JSON strings)
 * @param {Object} data - Dados da propriedade
 * @returns {Array} - Array de valores prontos para prepared statement
 */
function preparePropertyData(data) {
    return [
        data.title,
        data.subtitle || null,
        data.price,
        data.image || null,
        data.bairro,
        data.tipo,
        data.specs || null,
        data.tags ? JSON.stringify(data.tags) : null,
        data.featured ? 1 : 0,
        data.description || null,
        data.subtype || null,
        data.age || null,
        data.quartos || 0,
        data.vagas || 0,
        data.banheiros || 0,
        data.suites || 0,
        data.condominio || null,
        data.iptu || null,
        data.area_util || 0,
        data.area_total || 0,
        data.cep || null,
        data.estado || null,
        data.cidade || null,
        data.endereco || null,
        data.complemento || null,
        data.mostrar_endereco !== undefined ? (data.mostrar_endereco ? 1 : 0) : 1,
        data.ref_code || null,
        data.aceita_permuta ? 1 : 0,
        data.aceita_fgts ? 1 : 0,
        data.posicao_apto || null,
        data.andares || null,
        data.features ? JSON.stringify(data.features) : '{}',
        data.multimedia ? JSON.stringify(data.multimedia) : '{}',
        data.transaction_type || 'Venda',
        data.status || 'disponivel'
    ];
}

module.exports = {
    parseProperty,
    parseProperties,
    preparePropertyData
};


