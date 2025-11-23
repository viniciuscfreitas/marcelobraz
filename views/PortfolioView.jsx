import { useState, useEffect, useRef } from 'react';
import { Button } from '../components/Button.jsx';
import { PortfolioEmptyState } from '../components/PortfolioEmptyState.jsx';
import { PortfolioFilters } from '../components/PortfolioFilters.jsx';
import { useInfiniteProperties } from '../hooks/useInfiniteProperties.js';
import { BROKER_INFO } from '../data/constants.js';
import { generateWhatsAppLink } from '../utils/whatsappHelpers.js';

const Icons = {
    MapPin: ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
    Bed: ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>,
    Bath: ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-1C4.5 2 3.5 2.5 3.5 4c0 1.5.5 2.5 1.5 3.5L7.5 10"/><line x1="8" x2="8" y1="19" y2="21"/><line x1="16" x2="16" y1="19" y2="21"/><path d="M2 12h20"/><path d="M7 19v-7a5 5 0 0 1 10 0v7"/></svg>,
    Car: ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M14 14h6"/></svg>,
    Maximize: ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>,
    MessageCircle: ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>,
    Phone: ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
};

const getTransactionLabel = (type) => {
    if (type === 'Aluguel') return 'Locação';
    if (type === 'Temporada') return 'Temporada';
    if (type === 'Leilão') return 'Leilão';
    return 'Venda';
};

const PropertyCard = ({ property, onClick }) => {
    const transactionLabel = getTransactionLabel(property?.transaction_type);
    const area = property?.area_util || property?.area || '--';
    const whatsappUrl = generateWhatsAppLink(property);

    return (
        <article 
            className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-[#856404]/30 transition-all duration-300 flex flex-col h-full relative cursor-pointer"
            onClick={() => onClick && onClick(property)}
        >
            {/* Image & Badges */}
            <div className="relative h-64 overflow-hidden bg-gray-100">
                <img 
                    src={property?.image || "https://via.placeholder.com/800x600?text=Sem+Foto"} 
                    alt={property?.title || 'Imóvel'}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                />
                <div className="absolute top-3 left-3 flex flex-col gap-1">
                    {property?.featured && <span className="bg-[#856404] text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-sm">Destaque</span>}
                    <span className="bg-white/90 backdrop-blur text-gray-800 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-sm">{property?.tipo || 'Imóvel'}</span>
                </div>
                
                {/* Price Tag Overlay */}
                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                    <p className="text-xs text-white/90 font-medium uppercase mb-0.5">{transactionLabel}</p>
                    <p className="text-2xl font-bold text-white tracking-tight">{property?.price || 'Sob Consulta'}</p>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-grow">
                <div className="mb-4">
                    <h3 className="font-serif text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-[#856404] transition-colors">{property?.title || 'Imóvel'}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <Icons.MapPin className="w-3.5 h-3.5 text-[#856404]" /> {property?.bairro || ''}{property?.cidade ? `, ${property.cidade}` : ''}
                    </p>
                </div>

                {/* Features Strip */}
                <div className="flex items-center justify-between py-3 border-y border-gray-100 text-sm text-gray-600 mb-4 bg-gray-50/50 -mx-5 px-5">
                    <div className="flex items-center gap-1.5" title="Área Útil"><Icons.Maximize className="w-4 h-4 text-gray-400" /> <b>{area}</b><span className="text-xs">m²</span></div>
                    <div className="flex items-center gap-1.5" title="Quartos"><Icons.Bed className="w-4 h-4 text-gray-400" /> <b>{property?.quartos || '--'}</b></div>
                    <div className="flex items-center gap-1.5" title="Banheiros"><Icons.Bath className="w-4 h-4 text-gray-400" /> <b>{property?.banheiros || '--'}</b></div>
                    <div className="flex items-center gap-1.5" title="Vagas"><Icons.Car className="w-4 h-4 text-gray-400" /> <b>{property?.vagas || '--'}</b></div>
                </div>

                <p className="text-xs text-gray-500 line-clamp-2 mb-5 leading-relaxed flex-grow">
                    {property?.description || "Imóvel de alto padrão com acabamento impecável. Localização privilegiada e infraestrutura completa..."}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-auto">
                    <button 
                        onClick={(e) => { e.stopPropagation(); window.open(whatsappUrl, '_blank'); }}
                        className="flex-1 bg-[#25D366] hover:bg-[#1ebc57] text-white text-sm font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
                    >
                        <Icons.MessageCircle className="w-4 h-4" /> WhatsApp
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); onClick && onClick(property); }}
                        className="flex-1 bg-white border border-gray-200 hover:border-[#856404] hover:text-[#856404] text-gray-700 text-sm font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm"
                    >
                        <Icons.Phone className="w-4 h-4" /> Detalhes
                    </button>
                </div>
            </div>
        </article>
    );
};

// Grid virtualizado com scroll infinito (Grug gosta: simples, direto, funciona bem)
const VirtualizedGrid = ({ items, onPropertyClick, loadMore, hasMore, loading }) => {
    const sentinelRef = useRef(null);
    const [visibleItems, setVisibleItems] = useState(12);
    const lastCallTimeRef = useRef(0);

    // Intersection Observer para scroll infinito
    useEffect(() => {
        if (!hasMore || loading || !sentinelRef.current) return;

        const throttleDelay = 500;

        const observer = new IntersectionObserver(
            (entries) => {
                if (!entries[0].isIntersecting) return;
                if (loading) return;
                
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
    useEffect(() => {
        if (items.length > visibleItems && !loading) {
            const timer = setTimeout(() => {
                setVisibleItems(prev => Math.min(prev + 12, items.length));
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [items.length, visibleItems, loading]);

    const displayItems = items.slice(0, visibleItems);

    if (items.length === 0 && !loading) {
        return null;
    }

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayItems.map((property) => (
                    <PropertyCard key={property.id} property={property} onClick={onPropertyClick} />
                ))}
            </div>
            
            {/* Sentinel para detectar fim do scroll */}
            {hasMore && <div ref={sentinelRef} className="h-20" />}
            
            {/* Loading indicator */}
            {loading && (
                <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#856404]"></div>
                    <p className="text-sm text-gray-500 mt-2">Carregando mais imóveis...</p>
                </div>
            )}
        </div>
    );
};

/**
 * View principal do portfólio de imóveis
 * Grug gosta: view simples que orquestra componentes menores
 *
 * @param {Object} props
 * @param {Function} props.navigateTo - Função para navegar entre views
 * @param {Function} props.onPropertyClick - Callback quando imóvel é clicado
 */
export const PortfolioView = ({ navigateTo, onPropertyClick }) => {
    const [filters, setFilters] = useState({ bairro: 'Todos', tipo: 'Todos', transaction_type: 'Todos' });
    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState(''); // Debounced search
    
    // Debounce search (300ms)
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearch(searchInput);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchInput]);
    
    // Preparar filtros para API (remover 'Todos' e converter para formato da API)
    const apiFilters = {};
    if (filters.area_min) apiFilters.area_min = filters.area_min;
    if (filters.area_max) apiFilters.area_max = filters.area_max;
    if (filters.quartos_min) apiFilters.quartos_min = filters.quartos_min;
    if (filters.quartos_max) apiFilters.quartos_max = filters.quartos_max;
    if (filters.banheiros_min) apiFilters.banheiros_min = filters.banheiros_min;
    if (filters.banheiros_max) apiFilters.banheiros_max = filters.banheiros_max;
    if (filters.vagas_min) apiFilters.vagas_min = filters.vagas_min;
    if (filters.vagas_max) apiFilters.vagas_max = filters.vagas_max;
    if (filters.transaction_type && filters.transaction_type !== 'Todos') {
        apiFilters.transaction_type = filters.transaction_type;
    }
    
    // Usar hook de scroll infinito
    const { items, loading, hasMore, loadMore } = useInfiniteProperties({
        search,
        filters: apiFilters
    });

    // Filtros básicos (bairro e tipo) - ainda aplicados localmente por enquanto
    // transaction_type já é filtrado na API
    const filteredItems = items.filter(prop => {
        const bairroMatch = filters.bairro === 'Todos' || prop.bairro === filters.bairro;
        const tipoMatch = filters.tipo === 'Todos' || prop.tipo === filters.tipo;
        return bairroMatch && tipoMatch;
    });

    // Calcular filtros disponíveis baseado nos itens carregados
    const availableNeighborhoods = ['Todos', ...new Set(items.map(p => p.bairro).filter(Boolean))];
    const availableTypes = ['Todos', ...new Set(items.map(p => p.tipo).filter(Boolean))];

    const handleClearFilters = () => {
        setFilters({ bairro: 'Todos', tipo: 'Todos', transaction_type: 'Todos' });
        setSearchInput('');
        setSearch('');
    };

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            {/* Hero Header */}
            <div className="relative pb-12 pt-24 lg:pt-32">
                <div className="absolute inset-0 z-0 h-[700px] overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=2000&q=90"
                        className="w-full h-full object-cover"
                        alt="Background Santos"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a]/90 via-[#0f172a]/60 to-[#f8fafc]"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4 drop-shadow-md">
                            Portfólio Exclusivo
                        </h1>
                        <p className="text-gray-300 text-lg max-w-2xl mx-auto font-light leading-relaxed">
                            Navegue pela nossa coleção completa de imóveis em Santos. Utilize os filtros para encontrar exatamente o que procura.
                        </p>
                    </div>

                    <PortfolioFilters
                        filters={filters}
                        onFilterChange={setFilters}
                        onClearFilters={handleClearFilters}
                        neighborhoods={availableNeighborhoods}
                        types={availableTypes}
                        search={searchInput}
                        onSearchChange={setSearchInput}
                    />
                </div>
            </div>

            {/* Properties Grid or Empty State */}
            <div className="container mx-auto px-6 pb-24">
                {filteredItems.length > 0 || loading ? (
                    <VirtualizedGrid
                        items={filteredItems}
                        onPropertyClick={onPropertyClick}
                        loadMore={loadMore}
                        hasMore={hasMore}
                        loading={loading}
                    />
                ) : (
                    <PortfolioEmptyState onClearFilters={handleClearFilters} />
                )}
            </div>

            {/* CTA Section */}
            <section className="py-20 bg-[#0f172a] text-white border-t border-white/10">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl font-serif font-bold mb-6">Ainda não encontrou o ideal?</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto mb-8">
                        Muitos imóveis exclusivos são vendidos antes mesmo de serem listados aqui. Entre em contato para acessar o nosso Private Listing.
                    </p>
                    <Button
                        variant="gold"
                        className="px-10"
                        onClick={() => window.open(BROKER_INFO.whatsapp_link)}
                        ariaLabel="Falar com consultor no WhatsApp"
                    >
                        Falar com Consultor
                    </Button>
                </div>
            </section>
        </div>
    );
};

