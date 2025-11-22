/**
 * URL Helpers - Grug Brain Style
 * Funções simples para gerar URLs amigáveis pro Google
 */

/**
 * Gera slug SEO-friendly a partir de string
 * Exemplo: "Cobertura 4 Suítes - Ponta da Praia" → "cobertura-4-suites-ponta-da-praia"
 */
export const generateSlug = (text) => {
    if (!text) return '';

    return text
        .toString()
        .toLowerCase()
        .normalize('NFD') // Decompõe caracteres acentuados
        .replace(/[\u0300-\u036f]/g, '') // Remove acentos
        .replace(/[^a-z0-9]+/g, '-') // Substitui espaços e caracteres especiais por -
        .replace(/^-+|-+$/g, ''); // Remove - do início/fim
};

/**
 * Gera URL amigável para imóvel
 * Formato: /imovel/{tipo}-{quartos}q-{bairro}-{id}
 * Exemplo: /imovel/apartamento-3q-ponta-da-praia-santos-123
 */
export const generatePropertyUrl = (property) => {
    if (!property) return '/';

    const parts = [];

    // Tipo de imóvel
    if (property.tipo) {
        parts.push(generateSlug(property.tipo));
    }

    // Quartos (se tiver)
    if (property.quartos) {
        parts.push(`${property.quartos}q`);
    }

    // Bairro
    if (property.bairro) {
        parts.push(generateSlug(property.bairro));
    }

    // Cidade (se não for Santos, adiciona)
    if (property.cidade && property.cidade.toLowerCase() !== 'santos') {
        parts.push(generateSlug(property.cidade));
    }

    // ID sempre no final
    parts.push(property.id);

    return `/imovel/${parts.join('-')}`;
};

/**
 * Extrai ID do imóvel de uma URL amigável
 * Exemplo: "/imovel/apartamento-3q-pinheiros-123" → "123"
 */
export const extractPropertyIdFromUrl = (url) => {
    if (!url) return null;

    // Pega a última parte da URL (sempre o ID)
    const parts = url.split('/').filter(Boolean);
    const lastPart = parts[parts.length - 1];
    const segments = lastPart.split('-');
    const id = segments[segments.length - 1];

    // Verifica se é número
    return /^\d+$/.test(id) ? parseInt(id, 10) : null;
};

/**
 * Gera URL completa para compartilhamento
 */
export const generateShareUrl = (property) => {
    const baseUrl = window.location.origin;
    const propertyUrl = generatePropertyUrl(property);
    return `${baseUrl}${propertyUrl}`;
};
