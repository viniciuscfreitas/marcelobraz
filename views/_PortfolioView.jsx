import React, { useState, useEffect } from 'react';

// ==================================================================================
// 🎨 DESIGN SYSTEM & ASSETS (Coesão com PropertyDetailsView)
// ==================================================================================

const BROKER_INFO = { whatsapp_link: '#' };

// Cores globais para referência:
// Primary (Gold): text-[#856404] / bg-[#856404]
// Dark (Navy): text-[#0f172a] / bg-[#0f172a]

const Icons = {
    Search: ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
    Filter: ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
    MapPin: ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
    Bed: ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>,
    Bath: ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-1C4.5 2 3.5 2.5 3.5 4c0 1.5.5 2.5 1.5 3.5L7.5 10"/><line x1="8" x2="8" y1="19" y2="21"/><line x1="16" x2="16" y1="19" y2="21"/><path d="M2 12h20"/><path d="M7 19v-7a5 5 0 0 1 10 0v7"/></svg>,
    Car: ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M14 14h6"/></svg>,
    Maximize: ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>,
    MessageCircle: ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>,
    Phone: ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
    Grid: ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>,
    List: ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>,
    ChevronDown: ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6 9 6 6 6-6"/></svg>,
};

// --- Componentes UI Internos (Substituindo imports externos para preview) ---

const Button = ({ children, variant = 'primary', className, onClick, ...props }) => {
    const base = "px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-1";
    const variants = {
        primary: "bg-[#856404] text-white hover:bg-[#6d5203] focus:ring-[#856404] shadow-md hover:shadow-lg",
        outline: "bg-white border border-gray-200 text-gray-700 hover:border-[#856404] hover:text-[#856404] focus:ring-gray-200",
        ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
        dark: "bg-[#0f172a] text-white hover:bg-black focus:ring-[#0f172a]"
    };
    return <button onClick={onClick} className={`${base} ${variants[variant]} ${className}`} {...props}>{children}</button>;
};

// --- Property Card (Estilo Imovelweb / Dashboard) ---
const PropertyCard = ({ property, onClick }) => {
    return (
        <article 
            className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-[#856404]/30 transition-all duration-300 flex flex-col h-full relative cursor-pointer"
            onClick={() => onClick && onClick(property)}
        >
            {/* Image & Badges */}
            <div className="relative h-64 overflow-hidden bg-gray-100">
                <img 
                    src={property.image} 
                    alt={property.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                />
                <div className="absolute top-3 left-3 flex flex-col gap-1">
                    {property.featured && <span className="bg-[#856404] text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-sm">Destaque</span>}
                    <span className="bg-white/90 backdrop-blur text-gray-800 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-sm">{property.tipo}</span>
                </div>
                
                {/* Price Tag Overlay (Imovelweb style) */}
                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                    <p className="text-xs text-white/90 font-medium uppercase mb-0.5">Venda</p>
                    <p className="text-2xl font-bold text-white tracking-tight">{property.price}</p>
                </div>
                
                {/* Botão de favorito removido conforme solicitado */}
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-grow">
                <div className="mb-4">
                    <h3 className="font-serif text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-[#856404] transition-colors">{property.title}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <Icons.MapPin className="w-3.5 h-3.5 text-[#856404]" /> {property.bairro}, Santos
                    </p>
                </div>

                {/* Features Strip */}
                <div className="flex items-center justify-between py-3 border-y border-gray-100 text-sm text-gray-600 mb-4 bg-gray-50/50 -mx-5 px-5">
                    <div className="flex items-center gap-1.5" title="Área Útil"><Icons.Maximize className="w-4 h-4 text-gray-400" /> <b>{property.area}</b><span className="text-xs">m²</span></div>
                    <div className="flex items-center gap-1.5" title="Quartos"><Icons.Bed className="w-4 h-4 text-gray-400" /> <b>{property.quartos}</b></div>
                    <div className="flex items-center gap-1.5" title="Banheiros"><Icons.Bath className="w-4 h-4 text-gray-400" /> <b>{property.banheiros}</b></div>
                    <div className="flex items-center gap-1.5" title="Vagas"><Icons.Car className="w-4 h-4 text-gray-400" /> <b>{property.vagas}</b></div>
                </div>

                <p className="text-xs text-gray-500 line-clamp-2 mb-5 leading-relaxed flex-grow">
                    {property.description || "Imóvel de alto padrão com acabamento impecável. Localização privilegiada e infraestrutura completa..."}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-auto">
                    <button 
                        onClick={(e) => { e.stopPropagation(); window.open(BROKER_INFO.whatsapp_link); }}
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

// --- Sticky Filter Bar ---
const FilterBar = ({ resultCount, onSortChange }) => (
    <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 md:px-6 py-3">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                    <span className="text-sm font-bold text-gray-900 whitespace-nowrap mr-2">{resultCount} Imóveis</span>
                    <Button variant="outline" className="py-1.5 text-xs whitespace-nowrap">Bairro <Icons.ChevronDown className="w-3 h-3 ml-1"/></Button>
                    <Button variant="outline" className="py-1.5 text-xs whitespace-nowrap">Preço <Icons.ChevronDown className="w-3 h-3 ml-1"/></Button>
                    <Button variant="outline" className="py-1.5 text-xs whitespace-nowrap">Quartos <Icons.ChevronDown className="w-3 h-3 ml-1"/></Button>
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    <span className="text-xs text-gray-500 hidden sm:inline">Ordenar por:</span>
                    <select 
                        className="form-select text-sm bg-gray-50 border-gray-200 rounded-lg py-2 pl-3 pr-8 focus:ring-[#856404] focus:border-[#856404]"
                        onChange={(e) => onSortChange(e.target.value)}
                    >
                        <option value="relevance">Mais Relevantes</option>
                        <option value="price_asc">Menor Preço</option>
                        <option value="price_desc">Maior Preço</option>
                    </select>
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        <button className="p-1.5 bg-white shadow-sm rounded text-gray-900"><Icons.Grid className="w-4 h-4"/></button>
                        <button className="p-1.5 text-gray-400 hover:text-gray-600"><Icons.List className="w-4 h-4"/></button>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// --- Hook Mock (Simulando o hook original) ---
const useInfiniteProperties = (search, filters) => {
    // Dados simulados para o preview
    const allItems = [
        { id: 1, title: 'Mansão no Jardim Acapulco', bairro: 'Jardim Acapulco', tipo: 'Casa', price: 'R$ 12.500.000', quartos: 5, banheiros: 6, vagas: 4, area: 850, featured: true, image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80' },
        { id: 2, title: 'Penthouse com Vista Mar', bairro: 'Gonzaga', tipo: 'Apartamento', price: 'R$ 5.200.000', quartos: 4, banheiros: 5, vagas: 3, area: 420, featured: true, image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80' },
        { id: 3, title: 'Casa Moderna Alto Padrão', bairro: 'Embaré', tipo: 'Casa', price: 'R$ 3.800.000', quartos: 3, banheiros: 4, vagas: 2, area: 280, featured: false, image: 'https://images.unsplash.com/photo-1600596542815-2255d72ec8e3?auto=format&fit=crop&w=800&q=80' },
        { id: 4, title: 'Cobertura Duplex Exclusiva', bairro: 'Ponta da Praia', tipo: 'Cobertura', price: 'R$ 2.900.000', quartos: 3, banheiros: 3, vagas: 2, area: 190, featured: false, image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80' },
        { id: 5, title: 'Garden Suspenso', bairro: 'Boqueirão', tipo: 'Apartamento', price: 'R$ 1.750.000', quartos: 2, banheiros: 2, vagas: 1, area: 110, featured: false, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80' },
        { id: 6, title: 'Studio Design Luxo', bairro: 'Vila Rica', tipo: 'Studio', price: 'R$ 850.000', quartos: 1, banheiros: 1, vagas: 1, area: 55, featured: false, image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80' },
    ];
    
    // Filtragem básica client-side para o preview
    const items = allItems.filter(p => 
        (search ? p.title.toLowerCase().includes(search.toLowerCase()) : true) &&
        (filters.bairro !== 'Todos' ? p.bairro === filters.bairro : true)
    );

    return { items, loading: false, hasMore: false, loadMore: () => {} };
};

// ==================================================================================
// 🚀 VIEW PRINCIPAL (Mantendo assinatura e lógica do arquivo original)
// ==================================================================================

export const PortfolioView = ({ navigateTo, onPropertyClick = () => {} }) => {
    const [filters, setFilters] = useState({ bairro: 'Todos', tipo: 'Todos', transaction_type: 'Todos' });
    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState(''); 
    const [sortBy, setSortBy] = useState('relevance');

    useEffect(() => {
        const timer = setTimeout(() => setSearch(searchInput), 300);
        return () => clearTimeout(timer);
    }, [searchInput]);
    
    const apiFilters = { ...filters };
    if (filters.transaction_type === 'Todos') delete apiFilters.transaction_type;
    
    const { items, loading } = useInfiniteProperties(search, apiFilters);

    // Ordenação Client-side para preview
    const sortedItems = [...items].sort((a, b) => {
        const getPrice = p => parseInt(p.price.replace(/\D/g, ''));
        if (sortBy === 'price_asc') return getPrice(a) - getPrice(b);
        if (sortBy === 'price_desc') return getPrice(b) - getPrice(a);
        return 0;
    });

    return (
        <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900">
            {/* Hero Simplificado e Elegante */}
            <div className="bg-[#0f172a] text-white pt-28 pb-16 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/80 to-transparent"></div>
                
                <div className="container mx-auto px-4 md:px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="max-w-2xl">
                        <h1 className="text-3xl md:text-5xl font-serif font-bold mb-4 leading-tight">
                            Portfólio Exclusivo
                        </h1>
                        <p className="text-gray-400 text-lg">
                            Acesse a coleção mais refinada de imóveis de alto padrão em Santos.
                        </p>
                    </div>
                    
                    {/* Quick Search Box no Hero */}
                    <div className="w-full md:w-96 bg-white p-2 rounded-xl shadow-xl flex items-center gap-2">
                        <Icons.Search className="w-5 h-5 text-gray-400 ml-2" />
                        <input 
                            type="text" 
                            placeholder="Buscar condomínio ou código..." 
                            className="flex-1 bg-transparent border-none focus:ring-0 text-gray-900 placeholder-gray-500"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                        <button className="bg-[#856404] text-white p-2.5 rounded-lg hover:bg-[#6d5203] transition-colors">
                            <Icons.Search className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Sticky Filter Bar */}
            <FilterBar resultCount={sortedItems.length} onSortChange={setSortBy} />

            {/* Main Content */}
            <div className="container mx-auto px-4 md:px-6 py-8 min-h-[600px]">
                {loading ? (
                    <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#856404]"></div></div>
                ) : sortedItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {sortedItems.map(property => (
                            <PropertyCard 
                                key={property.id} 
                                property={property} 
                                onClick={onPropertyClick} 
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Icons.Search className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Nenhum imóvel encontrado</h3>
                        <p className="text-gray-500 mt-2">Tente ajustar seus termos de busca.</p>
                        <Button variant="outline" className="mt-6 mx-auto" onClick={() => setSearchInput('')}>Limpar Busca</Button>
                    </div>
                )}
            </div>

            {/* Private Listing CTA */}
            <section className="py-16 bg-white border-t border-gray-100">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="bg-[#0f172a] rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
                        <div className="relative z-10 max-w-xl">
                            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-4">Acesso Restrito</h2>
                            <p className="text-gray-400">Temos um portfólio "Off-Market" exclusivo para clientes cadastrados. Imóveis que não estão na vitrine pública.</p>
                        </div>
                        <div className="relative z-10">
                            <Button variant="primary" className="px-8 py-4 text-base shadow-xl shadow-[#856404]/20" onClick={() => window.open(BROKER_INFO.whatsapp_link)}>
                                Consultar Private Listing
                            </Button>
                        </div>
                        {/* Background FX */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#856404] opacity-10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PortfolioView;