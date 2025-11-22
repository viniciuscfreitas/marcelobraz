import { useEffect, useRef, useState } from 'react';
import { PropertyCard } from './PropertyCard.jsx';

/**
 * Grid virtualizado para imóveis com scroll infinito
 * Grug gosta: simples, direto, funciona bem
 * 
 * @param {Object} props
 * @param {Array} props.items - Lista de imóveis
 * @param {Function} props.onPropertyClick - Callback quando imóvel é clicado
 * @param {Function} props.loadMore - Função para carregar mais itens
 * @param {boolean} props.hasMore - Se há mais itens para carregar
 * @param {boolean} props.loading - Se está carregando
 */
export const VirtualizedGrid = ({ items, onPropertyClick, loadMore, hasMore, loading }) => {
    const sentinelRef = useRef(null);
    const [visibleItems, setVisibleItems] = useState(12);
    const lastCallTimeRef = useRef(0); // Throttle persistente

    // Intersection Observer para scroll infinito
    // Grug gosta: proteção simples, direto
    useEffect(() => {
        if (!hasMore || loading || !sentinelRef.current) return;

        const throttleDelay = 500;

        const observer = new IntersectionObserver(
            (entries) => {
                if (!entries[0].isIntersecting) return;
                if (loading) return; // Proteção extra
                
                // Throttle
                const now = Date.now();
                if (now - lastCallTimeRef.current < throttleDelay) return;
                lastCallTimeRef.current = now;

                loadMore();
            },
            { threshold: 0.1, rootMargin: '100px' }
        );

        observer.observe(sentinelRef.current);
        return () => observer.disconnect();
    }, [hasMore, loading, loadMore]);

    // Renderizar apenas itens visíveis (virtualização simples)
    // Aumenta quantidade visível conforme scroll
    useEffect(() => {
        if (items.length > visibleItems && !loading) {
            // Renderizar mais itens quando necessário
            const timer = setTimeout(() => {
                setVisibleItems(prev => Math.min(prev + 12, items.length));
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [items.length, visibleItems, loading]);

    const displayItems = items.slice(0, visibleItems);

    if (items.length === 0 && !loading) {
        return (
            <div className="text-center py-12 text-gray-500">
                <p>Nenhum imóvel encontrado</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {displayItems.map((property) => (
                    <PropertyCard key={property.id} property={property} onClick={onPropertyClick} />
                ))}
            </div>
            
            {/* Sentinel para detectar fim do scroll */}
            {hasMore && <div ref={sentinelRef} className="h-20" />}
            
            {/* Loading indicator */}
            {loading && (
                <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="text-sm text-gray-500 mt-2">Carregando mais imóveis...</p>
                </div>
            )}
            
            {/* Fim da lista */}
            {!hasMore && items.length > 0 && (
                <div className="text-center py-8 text-gray-500 text-sm">
                    Todos os imóveis foram carregados
                </div>
            )}
        </div>
    );
};
