import { useState, useEffect } from 'react';
import { Edit, Trash2, Search, MapPin, Home, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';

export default function PropertiesList({ onEdit, refreshTrigger }) {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { token } = useAuth();

    // Contar quantos featured temos
    const featuredCount = properties.filter(p => p.featured).length;

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

    const handleDelete = async (id) => {
        if (!confirm('Tem certeza que deseja excluir este imóvel?')) return;

        try {
            const res = await fetch(`${API_URL}/api/properties/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                setProperties(properties.filter(p => p.id !== id));
            } else {
                alert('Erro ao excluir imóvel');
            }
        } catch (error) {
            console.error('Erro:', error);
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
            {/* Header com contador de Curadoria */}
            {featuredCount > 0 && (
                <div className="p-4 bg-[#d4af37]/5 border-b border-[#d4af37]/20 flex-shrink-0">
                    <p className="text-sm text-gray-700 text-center">
                        <span className="font-bold text-[#d4af37]">{featuredCount}</span> de <span className="font-bold">4</span> imóveis selecionados para Curadoria da Semana
                    </p>
                </div>
            )}

            {/* Search Bar */}
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex-shrink-0">
                <div className="relative max-w-md">
                    <label htmlFor="search-properties" className="sr-only">Buscar imóveis</label>
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search size={18} className="text-gray-500" aria-hidden="true" />
                    </div>
                    <input
                        id="search-properties"
                        type="text"
                        placeholder="Buscar por título, bairro..."
                        className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none transition-all text-sm text-gray-900"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex-1 min-h-0 overflow-auto">
                <table className="w-full text-left border-collapse">
                    <caption className="sr-only">Lista de imóveis cadastrados</caption>
                    <thead className="sticky top-0 z-10 bg-gray-50 shadow-sm">
                        <tr className="bg-gray-50/50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-600 font-semibold">
                            <th scope="col" className="p-6">Imóvel</th>
                            <th scope="col" className="p-6">Localização</th>
                            <th scope="col" className="p-6">Valor</th>
                            <th scope="col" className="p-6">Tipo</th>
                            <th scope="col" className="p-6 text-center">Curadoria</th>
                            <th scope="col" className="p-6 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredProperties.map((property) => (
                            <tr key={property.id} className="group hover:bg-gray-50/80 transition-colors">
                                <td className="p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shadow-sm flex-shrink-0 border border-gray-200">
                                            <img
                                                src={property.image}
                                                alt=""
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-bold text-primary text-lg leading-tight">{property.title}</p>
                                            <p className="text-xs text-gray-600 mt-1 truncate max-w-[200px]">{property.subtitle}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <MapPin size={16} className="text-gold-dark" aria-hidden="true" />
                                        <span className="font-medium">{property.bairro}</span>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <span className="font-bold text-primary text-lg">
                                        {property.price}
                                    </span>
                                </td>
                                <td className="p-6">
                                    <div className="flex items-center gap-2">
                                        <span className="px-3 py-1 bg-primary/5 text-primary rounded-full text-xs font-bold uppercase tracking-wide border border-primary/10">
                                            {property.tipo}
                                        </span>
                                    </div>
                                </td>
                                <td className="p-6 text-center">
                                    <button
                                        onClick={() => handleToggleFeatured(property.id, property.featured)}
                                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all border ${
                                            property.featured
                                                ? 'bg-[#d4af37]/10 text-[#d4af37] border-[#d4af37]/30 hover:bg-[#d4af37]/20'
                                                : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                                        }`}
                                        title={property.featured ? 'Remover da Curadoria' : 'Adicionar à Curadoria da Semana'}
                                        aria-label={property.featured ? 'Remover da Curadoria' : 'Adicionar à Curadoria da Semana'}
                                    >
                                        <Star size={16} className={property.featured ? 'fill-current' : ''} aria-hidden="true" />
                                        <span className="text-xs font-medium">{property.featured ? 'Em destaque' : 'Destacar'}</span>
                                    </button>
                                </td>
                                <td className="p-6 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
                                        <button
                                            onClick={() => onEdit(property.id)}
                                            className="p-2 text-gray-600 hover:text-primary hover:bg-white rounded-lg transition-all border border-transparent hover:border-gray-200 shadow-sm focus:ring-2 focus:ring-gold"
                                            title="Editar"
                                            aria-label={`Editar ${property.title}`}
                                        >
                                            <Edit size={18} aria-hidden="true" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(property.id)}
                                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-white rounded-lg transition-all border border-transparent hover:border-gray-200 shadow-sm focus:ring-2 focus:ring-red-500"
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
                                <td colSpan="6" className="p-12 text-center">
                                    <div className="flex flex-col items-center justify-center text-gray-400">
                                        <Home size={48} className="mb-4 opacity-20" aria-hidden="true" />
                                        <p className="text-lg font-medium text-gray-600">Nenhum imóvel encontrado</p>
                                        <p className="text-sm text-gray-500">Tente buscar por outro termo ou adicione um novo imóvel.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
