import { useState, useEffect } from 'react';
import { PROPERTIES as STATIC_PROPERTIES } from '../data/properties.js';

/**
 * Hook para buscar imóveis da API
 * Grug gosta: se API falhar, usa dados estáticos (fallback)
 */
export const useProperties = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
                const res = await fetch(`${apiUrl}/api/properties`);
                if (!res.ok) throw new Error('Falha ao buscar imóveis');

                const data = await res.json();
                setProperties(data);
            } catch (err) {
                console.error('Erro na API:', err);
                setError(err);
                // Grug diz: sem fallback! Se quebrar, quebrou.
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, []);

    return { properties, loading, error };
};
