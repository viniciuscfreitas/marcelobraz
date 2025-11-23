/**
 * Filtros avançados (área, quartos, banheiros, vagas)
 * Grug gosta: componente pequeno, faz uma coisa
 */
export const AdvancedFilters = ({ filters, onFilterChange }) => {
    const handleChange = (key, value) => {
        onFilterChange({ ...filters, [key]: value || undefined });
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-4 border-t border-gray-200">
            <div>
                <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Área (m²) Mín</label>
                <input
                    type="number"
                    value={filters.area_min || ''}
                    onChange={(e) => handleChange('area_min', e.target.value ? parseFloat(e.target.value) : undefined)}
                    placeholder="Ex: 50"
                    className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                />
            </div>
            <div>
                <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Área (m²) Máx</label>
                <input
                    type="number"
                    value={filters.area_max || ''}
                    onChange={(e) => handleChange('area_max', e.target.value ? parseFloat(e.target.value) : undefined)}
                    placeholder="Ex: 200"
                    className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                />
            </div>
            <div>
                <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Quartos Mín</label>
                <input
                    type="number"
                    min="0"
                    value={filters.quartos_min || ''}
                    onChange={(e) => handleChange('quartos_min', e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="Ex: 2"
                    className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                />
            </div>
            <div>
                <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Banheiros Mín</label>
                <input
                    type="number"
                    min="0"
                    value={filters.banheiros_min || ''}
                    onChange={(e) => handleChange('banheiros_min', e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="Ex: 2"
                    className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                />
            </div>
            <div>
                <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Vagas Mín</label>
                <input
                    type="number"
                    min="0"
                    value={filters.vagas_min || ''}
                    onChange={(e) => handleChange('vagas_min', e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="Ex: 1"
                    className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                />
            </div>
        </div>
    );
};




