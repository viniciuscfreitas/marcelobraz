import { useState, useEffect } from 'react';
import { Button } from '../components/Button.jsx';
import { PortfolioEmptyState } from '../components/PortfolioEmptyState.jsx';
import { PortfolioFilters } from '../components/PortfolioFilters.jsx';
import { VirtualizedGrid } from '../components/VirtualizedGrid.jsx';
import { useInfiniteProperties } from '../hooks/useInfiniteProperties.js';
import { BROKER_INFO } from '../data/constants.js';

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

