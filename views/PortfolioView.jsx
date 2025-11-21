import { useMemo, useState } from 'react';
import { ArrowLeft, Filter } from 'lucide-react';
import { PROPERTIES, AVAILABLE_NEIGHBORHOODS, AVAILABLE_TYPES } from '../data/properties.js';
import { BROKER_INFO } from '../data/constants.js';
import { PropertyCard } from '../components/PropertyCard.jsx';
import { Button } from '../components/Button.jsx';

export const PortfolioView = ({ navigateTo, onPropertyClick }) => {
  const [filters, setFilters] = useState({ bairro: 'Todos', tipo: 'Todos' });

  const filteredProperties = useMemo(() => PROPERTIES.filter(prop => {
    const bairroMatch = filters.bairro === 'Todos' || prop.bairro === filters.bairro;
    const tipoMatch = filters.tipo === 'Todos' || prop.tipo === filters.tipo;
    return bairroMatch && tipoMatch;
  }), [filters]);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
        <div className="relative pb-12 pt-32 lg:pt-40">
            <div className="absolute inset-0 z-0 h-[700px] overflow-hidden">
                 <img src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=2000&q=90" className="w-full h-full object-cover" alt="Background Santos" />
                 <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a]/90 via-[#0f172a]/60 to-[#f8fafc]"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                 <div className="text-center mb-10">
                     <button onClick={() => navigateTo('home')} className="text-white/80 hover:text-[#d4af37] flex items-center gap-2 mx-auto mb-4 text-sm font-bold uppercase tracking-widest transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] rounded px-2 py-1">
                        <ArrowLeft size={16}/> Voltar para Home
                     </button>
                     <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4 drop-shadow-md">Portfólio Exclusivo</h1>
                     <p className="text-gray-300 text-lg max-w-2xl mx-auto font-light leading-relaxed">Navegue pela nossa coleção completa de imóveis em Santos. Utilize os filtros para encontrar exatamente o que procura.</p>
                 </div>

                 <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 md:p-8">
                     <div className="flex flex-col md:flex-row gap-6 items-center">
                         <div className="flex items-center gap-2 text-[#0f172a] font-bold whitespace-nowrap"><Filter size={20} /> Filtros:</div>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                             <div className="relative">
                                 <label className="text-xs font-bold text-gray-400 uppercase mb-1 block ml-1">Bairro</label>
                                 <select className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#0f172a]" value={filters.bairro} onChange={(e) => setFilters({...filters, bairro: e.target.value})}>
                                     {AVAILABLE_NEIGHBORHOODS.map(b => <option key={b} value={b}>{b}</option>)}
                                 </select>
                             </div>
                             <div className="relative">
                                 <label className="text-xs font-bold text-gray-400 uppercase mb-1 block ml-1">Tipo</label>
                                 <select className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#0f172a]" value={filters.tipo} onChange={(e) => setFilters({...filters, tipo: e.target.value})}>
                                     {AVAILABLE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                 </select>
                             </div>
                             <div className="relative flex items-end">
                                 <button className="w-full p-3 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors text-sm font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0f172a]" onClick={() => setFilters({ bairro: 'Todos', tipo: 'Todos' })}>Limpar Filtros</button>
                             </div>
                         </div>
                     </div>
                 </div>
            </div>
        </div>

        <div className="container mx-auto px-6 pb-24">
             {filteredProperties.length > 0 ? (
                 <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                     {filteredProperties.map((prop) => (
                         <PropertyCard key={prop.id} property={prop} onClick={onPropertyClick} />
                     ))}
                 </div>
             ) : (
                 <div className="text-center py-20">
                     <p className="text-xl text-gray-500 font-serif">Nenhum imóvel encontrado com esses filtros.</p>
                     <button onClick={() => setFilters({ bairro: 'Todos', tipo: 'Todos' })} className="mt-4 text-[#d4af37] font-bold hover:underline">Limpar Filtros e ver todos</button>
                 </div>
             )}
        </div>

        <section className="py-20 bg-[#0f172a] text-white border-t border-white/10">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-3xl font-serif font-bold mb-6">Ainda não encontrou o ideal?</h2>
                <p className="text-gray-400 max-w-2xl mx-auto mb-8">Muitos imóveis exclusivos são vendidos antes mesmo de serem listados aqui. Entre em contato para acessar o nosso Private Listing.</p>
                <Button variant="gold" className="px-10" onClick={() => window.open(BROKER_INFO.whatsapp_link)}>Falar com Consultor</Button>
            </div>
        </section>
    </div>
  );
};

