import { useState, useEffect } from 'react';
import { Edit, Trash2, Search, MapPin, Home, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';
import ConfirmDialog from './ConfirmDialog';

export default function PropertiesList({ onEdit, refreshTrigger }) {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, property: null });
    const { token } = useAuth();

    useEffect(() => {
        fetchProperties();
    }, [refreshTrigger]);

    const fetchProperties = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/properties`);
            if (!res.ok) throw new Error('Falha na conexão');
            const data = await res.json();
            setProperties(data);
        } catch (error) {
            console.error('Erro ao buscar imóveis:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (property) => {
        setDeleteConfirm({ isOpen: true, property });
    };

    const handleDelete = async () => {
        const { property } = deleteConfirm;
        if (!property) return;

        try {
            const res = await fetch(`${API_URL}/api/properties/${property.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                setProperties(properties.filter(p => p.id !== property.id));
            } else {
                alert('Erro ao excluir imóvel');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao excluir imóvel');
        }
    };

    const handleToggleFeatured = async (id, currentFeatured) => {
        try {
            const res = await fetch(`${API_URL}/api/properties/${id}/featured`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (res.ok) {
                const updated = await res.json();
                setProperties(properties.map(p => p.id === id ? updated : p));
            } else {
                const error = await res.json();
                alert(error.error || 'Erro ao atualizar curadoria');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao atualizar curadoria');
        }
    };

    const filteredProperties = properties.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.bairro.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && properties.length === 0) return <div className="p-12 text-center text-gray-500" role="status">Carregando imóveis...</div>;

    return (
        <div className="flex flex-col h-full min-h-0">
            {/* Search Bar */}
            <div className="p-3 border-b border-gray-100 bg-gray-50/50 flex-shrink-0">
                <div className="relative max-w-md mx-auto">
                    <label htmlFor="search-properties" className="sr-only">Buscar imóveis</label>
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search size={18} className="text-gray-500" aria-hidden="true" />
                    </div>
                    <input
                        id="search-properties"
                        type="text"
                        placeholder="Buscar por título, bairro..."
                        className="w-full pl-11 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none transition-all text-sm text-gray-900 min-h-[44px]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        aria-label="Buscar imóveis por título ou bairro"
                    />
                    {filteredProperties.length > 0 && (
                        <div className="sr-only" aria-live="polite" aria-atomic="true">
                            {filteredProperties.length} {filteredProperties.length === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-1 min-h-0 overflow-auto">
                <table className="w-full text-left border-collapse">
                    <caption className="sr-only">Lista de imóveis cadastrados</caption>
                    <thead className="sticky top-0 z-10 bg-gray-50 shadow-sm">
                        <tr className="bg-gray-50/50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-600 font-semibold">
                            <th scope="col" className="p-3">Imóvel</th>
                            <th scope="col" className="p-3">Localização</th>
                            <th scope="col" className="p-3">Valor</th>
                            <th scope="col" className="p-3">Tipo</th>
                            <th scope="col" className="p-3 text-center">Curadoria</th>
                            <th scope="col" className="p-3 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredProperties.map((property) => (
                            <tr key={property.id} className="group hover:bg-gray-50/80 transition-colors">
                                <td className="p-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shadow-sm flex-shrink-0 border border-gray-200">
                                            <img
                                                src={property.image}
                                                alt=""
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-bold text-primary text-base leading-tight">{property.title}</p>
                                            <p className="text-xs text-gray-600 mt-0.5 truncate max-w-[200px]">{property.subtitle}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-3">
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <MapPin size={14} className="text-gold-dark" aria-hidden="true" />
                                        <span className="font-medium text-sm">{property.bairro}</span>
                                    </div>
                                </td>
                                <td className="p-3">
                                    <span className="font-bold text-primary text-base">
                                        {property.price}
                                    </span>
                                </td>
                                <td className="p-3">
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-1 bg-primary/5 text-primary rounded-full text-xs font-bold uppercase tracking-wide border border-primary/10">
                                            {property.tipo}
                                        </span>
                                    </div>
                                </td>
                                <td className="p-3 text-center">
                                    <button
                                        onClick={() => handleToggleFeatured(property.id, property.featured)}
                                        className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg transition-all border min-w-[44px] min-h-[44px] justify-center ${
                                            property.featured
                                                ? 'bg-[#d4af37]/10 text-[#d4af37] border-[#d4af37]/30 hover:bg-[#d4af37]/20'
                                                : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                                        }`}
                                        title={property.featured ? 'Remover da Curadoria' : 'Adicionar à Curadoria da Semana'}
                                        aria-label={property.featured ? 'Remover da Curadoria' : 'Adicionar à Curadoria da Semana'}
                                    >
                                        <Star size={14} className={property.featured ? 'fill-current' : ''} aria-hidden="true" />
                                        <span className="text-xs font-medium">{property.featured ? 'Em destaque' : 'Destacar'}</span>
                                    </button>
                                </td>
                                <td className="p-3 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
                                        <button
                                            onClick={() => onEdit(property.id)}
                                            className="p-2.5 text-gray-600 hover:text-primary hover:bg-white rounded-lg transition-all border border-transparent hover:border-gray-200 shadow-sm focus:ring-2 focus:ring-gold min-w-[44px] min-h-[44px] flex items-center justify-center"
                                            title="Editar"
                                            aria-label={`Editar ${property.title}`}
                                        >
                                            <Edit size={18} aria-hidden="true" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(property)}
                                            className="p-2.5 text-gray-500 hover:text-red-600 hover:bg-white rounded-lg transition-all border border-transparent hover:border-gray-200 shadow-sm focus:ring-2 focus:ring-red-500 min-w-[44px] min-h-[44px] flex items-center justify-center"
                                            title="Excluir"
                                            aria-label={`Excluir ${property.title}`}
                                        >
                                            <Trash2 size={18} aria-hidden="true" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {filteredProperties.length === 0 && !loading && (
                            <tr>
                                <td colSpan="6" className="p-8 text-center">
                                    <div className="flex flex-col items-center justify-center text-gray-400">
                                        <Home size={40} className="mb-3 opacity-20" aria-hidden="true" />
                                        <p className="text-base font-medium text-gray-600">Nenhum imóvel encontrado</p>
                                        <p className="text-xs text-gray-500 mt-1">Tente buscar por outro termo ou adicione um novo imóvel.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Dialog de Confirmação */}
            <ConfirmDialog
                isOpen={deleteConfirm.isOpen}
                onClose={() => setDeleteConfirm({ isOpen: false, property: null })}
                onConfirm={handleDelete}
                title="Excluir Imóvel"
                message={`Tem certeza que deseja excluir "${deleteConfirm.property?.title}"? Esta ação não pode ser desfeita.`}
                confirmText="Excluir"
                cancelText="Cancelar"
                variant="danger"
            />
        </div>
    );
}
