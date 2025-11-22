import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook para scroll infinito de imóveis
 * Grug gosta: hook simples, direto, funciona
 * 
 * @param {Object} options - Opções de busca e filtros
 * @param {string} options.search - Termo de busca
 * @param {Object} options.filters - Filtros (price_min, area_min, etc)
 * @returns {Object} - { items, loading, hasMore, error, loadMore, reset }
 */
export const useInfiniteProperties = ({ search = '', filters = {} } = {}) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const loadingRef = useRef(false);

    // Construir URL da API com query params
    const buildUrl = useCallback((pageNum) => {
        const isDev = import.meta.env.DEV;
        const apiUrl = import.meta.env.VITE_API_URL
            || (isDev ? 'http://localhost:3001' : '');
        const baseUrl = apiUrl ? `${apiUrl}/api/properties` : '/api/properties';
        
        const params = new URLSearchParams();
        params.append('page', pageNum);
        params.append('limit', '12');
        
        if (search) params.append('search', search);
        
        // Filtros numéricos
        if (filters.area_min) params.append('area_min', filters.area_min);
        if (filters.area_max) params.append('area_max', filters.area_max);
        if (filters.quartos_min) params.append('quartos_min', filters.quartos_min);
        if (filters.quartos_max) params.append('quartos_max', filters.quartos_max);
        if (filters.banheiros_min) params.append('banheiros_min', filters.banheiros_min);
        if (filters.banheiros_max) params.append('banheiros_max', filters.banheiros_max);
        if (filters.vagas_min) params.append('vagas_min', filters.vagas_min);
        if (filters.vagas_max) params.append('vagas_max', filters.vagas_max);
        
        return `${baseUrl}?${params.toString()}`;
    }, [search, filters]);

    // Buscar página
    const fetchPage = useCallback(async (pageNum, append = false) => {
        if (loadingRef.current) return;
        
        loadingRef.current = true;
        setLoading(true);
        setError(null);

        try {
            const url = buildUrl(pageNum);
            const res = await fetch(url);
            
            if (!res.ok) throw new Error('Falha ao buscar imóveis');
            
            const data = await res.json();
            
            // Se API retorna array (compatibilidade), tratar como página única
            if (Array.isArray(data)) {
                setItems(data);
                setHasMore(false);
            } else {
                // API retorna { data, pagination }
                if (append) {
                    setItems(prev => [...prev, ...data.data]);
                } else {
                    setItems(data.data);
                }
                setHasMore(data.pagination.hasMore);
            }
        } catch (err) {
            console.error('Erro na API:', err);
            setError(err);
            if (!append) setItems([]);
        } finally {
            setLoading(false);
            loadingRef.current = false;
        }
    }, [buildUrl]);

    // Carregar mais (próxima página)
    const loadMore = useCallback(() => {
        if (!hasMore || loading || loadingRef.current) return;
        const nextPage = page + 1;
        setPage(nextPage);
        fetchPage(nextPage, true);
    }, [hasMore, loading, page, fetchPage]);

    // Reset e recarregar (quando busca/filtros mudam)
    const reset = useCallback(() => {
        setItems([]);
        setPage(1);
        setHasMore(true);
        fetchPage(1, false);
    }, [fetchPage]);

    // Carregar primeira página ao montar ou quando busca/filtros mudarem
    useEffect(() => {
        reset();
    }, [search, JSON.stringify(filters)]); // eslint-disable-line react-hooks/exhaustive-deps

    return {
        items,
        loading,
        hasMore,
        error,
        loadMore,
        reset
    };
};

