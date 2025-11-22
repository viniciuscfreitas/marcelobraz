import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { AdvancedFilters } from './filters/AdvancedFilters.jsx';

/**
 * Componente de filtros para o portfólio de imóveis
 * Grug gosta: componente focado, < 150 linhas
 * 
 * @param {Object} props
 * @param {Object} props.filters - Estado atual dos filtros
 * @param {Function} props.onFilterChange - Callback para atualizar filtros
 * @param {Function} props.onClearFilters - Callback para limpar todos os filtros
 * @param {string[]} props.neighborhoods - Lista de bairros disponíveis
 * @param {string[]} props.types - Lista de tipos de imóveis disponíveis
 * @param {string} props.search - Termo de busca
 * @param {Function} props.onSearchChange - Callback para atualizar busca
 */
export const PortfolioFilters = ({ 
    filters, 
    onFilterChange, 
    onClearFilters, 
    neighborhoods, 
    types,
    search = '',
    onSearchChange 
}) => {
    const [showAdvanced, setShowAdvanced] = useState(false);

    const handleFilterChange = (key, value) => {
        onFilterChange({ ...filters, [key]: value || undefined });
    };

    return (
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 md:p-8">
            {/* Busca */}
            {onSearchChange && (
                <div className="mb-6">
                    <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">
                        Buscar
                    </label>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Buscar por nome, bairro, cidade..."
                        className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                        aria-label="Buscar imóveis"
                    />
                </div>
            )}

            {/* Filtros Básicos */}
            <div className="flex flex-col md:flex-row gap-6 items-center mb-4">
                <div className="flex items-center gap-2 text-[#0f172a] font-bold whitespace-nowrap">
                    <Filter size={20} /> Filtros:
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
                    <div className="relative">
                        <label className="text-xs font-bold text-gray-400 uppercase mb-1 block ml-1">
                            Bairro
                        </label>
                        <select
                            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                            value={filters.bairro || 'Todos'}
                            onChange={(e) => handleFilterChange('bairro', e.target.value === 'Todos' ? undefined : e.target.value)}
                            aria-label="Filtrar por bairro"
                        >
                            {neighborhoods.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                    </div>
                    <div className="relative">
                        <label className="text-xs font-bold text-gray-400 uppercase mb-1 block ml-1">
                            Tipo
                        </label>
                        <select
                            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                            value={filters.tipo || 'Todos'}
                            onChange={(e) => handleFilterChange('tipo', e.target.value === 'Todos' ? undefined : e.target.value)}
                            aria-label="Filtrar por tipo de imóvel"
                        >
                            {types.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div className="relative">
                        <label className="text-xs font-bold text-gray-400 uppercase mb-1 block ml-1">
                            Anúncio
                        </label>
                        <select
                            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                            value={filters.transaction_type || 'Todos'}
                            onChange={(e) => handleFilterChange('transaction_type', e.target.value === 'Todos' ? undefined : e.target.value)}
                            aria-label="Filtrar por tipo de anúncio"
                        >
                            <option value="Todos">Todos</option>
                            <option value="Venda">Venda</option>
                            <option value="Aluguel">Aluguel</option>
                            <option value="Temporada">Temporada</option>
                            <option value="Leilão">Leilão</option>
                        </select>
                    </div>
                    <div className="relative flex items-end gap-2">
                        <button
                            className="flex-1 p-3 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors text-sm font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0f172a]"
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            aria-label={showAdvanced ? "Ocultar filtros avançados" : "Mostrar filtros avançados"}
                        >
                            {showAdvanced ? 'Menos' : 'Mais'} Filtros
                        </button>
                        <button
                            className="p-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                            onClick={onClearFilters}
                            aria-label="Limpar todos os filtros"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Filtros Avançados */}
            {showAdvanced && <AdvancedFilters filters={filters} onFilterChange={onFilterChange} />}
        </div>
    );
};
