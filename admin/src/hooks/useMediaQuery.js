import { useState, useEffect } from 'react';

/**
 * Hook simples para detectar tamanho da tela
 * Grug gosta: simples, direto, funciona
 * 
 * @param {string} query - Media query (ex: '(min-width: 768px)')
 * @returns {boolean} - true se query match
 */
export function useMediaQuery(query) {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const media = window.matchMedia(query);
        if (media.matches !== matches) {
            setMatches(media.matches);
        }
        
        const listener = () => setMatches(media.matches);
        media.addEventListener('change', listener);
        return () => media.removeEventListener('change', listener);
    }, [matches, query]);

    return matches;
}




