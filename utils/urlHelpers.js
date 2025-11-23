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
    
    const str = String(text).trim();
    if (!str) return '';

    const slug = str
        .toLowerCase()
        .normalize('NFD') // Decompõe caracteres acentuados
        .replace(/[\u0300-\u036f]/g, '') // Remove acentos
        .replace(/[^a-z0-9]+/g, '-') // Substitui espaços e caracteres especiais por -
        .replace(/^-+|-+$/g, ''); // Remove - do início/fim
    
    // Edge case: se após normalização ficou vazio, retorna string vazia
    return slug || '';
};

/**
 * Gera URL amigável para imóvel
 * Formato: /imovel/{tipo}-{quartos}q-{bairro}-{id}
 * Exemplo: /imovel/apartamento-3q-ponta-da-praia-santos-123
 */
export const generatePropertyUrl = (property) => {
    if (!property) return '/';
    
    // Edge case: ID é obrigatório
    const id = property.id;
    if (!id || (typeof id !== 'number' && typeof id !== 'string')) {
        return '/';
    }
    
    const idStr = String(id).trim();
    if (!idStr || !/^\d+$/.test(idStr)) {
        return '/';
    }

    const parts = [];

    // Tipo de imóvel (só adiciona se slug válido)
    if (property.tipo) {
        const tipoSlug = generateSlug(property.tipo);
        if (tipoSlug) parts.push(tipoSlug);
    }

    // Quartos (só adiciona se válido)
    if (property.quartos && (typeof property.quartos === 'number' || /^\d+$/.test(String(property.quartos)))) {
        parts.push(`${property.quartos}q`);
    }

    // Bairro (só adiciona se slug válido)
    if (property.bairro) {
        const bairroSlug = generateSlug(property.bairro);
        if (bairroSlug) parts.push(bairroSlug);
    }

    // Cidade (se não for Santos, adiciona)
    if (property.cidade && property.cidade.toLowerCase() !== 'santos') {
        const cidadeSlug = generateSlug(property.cidade);
        if (cidadeSlug) parts.push(cidadeSlug);
    }

    // ID sempre no final
    parts.push(idStr);

    // Edge case: se não tem nenhuma parte além do ID, retorna formato mínimo
    if (parts.length === 1) {
        return `/imovel/${idStr}`;
    }

    return `/imovel/${parts.join('-')}`;
};

/**
 * Extrai ID do imóvel de uma URL amigável
 * Exemplo: "/imovel/apartamento-3q-pinheiros-123" → 123
 */
export const extractPropertyIdFromUrl = (url) => {
    if (!url || typeof url !== 'string') return null;
    
    // Edge case: URL deve começar com /imovel/
    if (!url.startsWith('/imovel/')) return null;

    // Pega a última parte da URL (sempre o ID)
    const parts = url.split('/').filter(Boolean);
    if (parts.length < 2 || parts[0] !== 'imovel') return null;
    
    const lastPart = parts[parts.length - 1];
    if (!lastPart) return null;
    
    const segments = lastPart.split('-');
    if (segments.length === 0) return null;
    
    const id = segments[segments.length - 1];
    if (!id) return null;

    // Verifica se é número válido
    if (!/^\d+$/.test(id)) return null;
    
    const parsedId = parseInt(id, 10);
    return isNaN(parsedId) || parsedId <= 0 ? null : parsedId;
};

/**
 * Gera URL completa para compartilhamento
 */
export const generateShareUrl = (property) => {
    if (!property) return '';
    
    // Edge case: SSR ou window não disponível
    if (typeof window === 'undefined' || !window.location) {
        // Fallback: retorna URL relativa (será resolvida pelo navegador)
        return generatePropertyUrl(property);
    }
    
    const baseUrl = window.location.origin;
    const propertyUrl = generatePropertyUrl(property);
    
    // Edge case: se propertyUrl é inválido, retorna home
    if (propertyUrl === '/') {
        return baseUrl;
    }
    
    return `${baseUrl}${propertyUrl}`;
};
