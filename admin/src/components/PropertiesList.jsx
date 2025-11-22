import { useState, useEffect, useRef } from 'react';
import { Edit, Trash2, Search, MapPin, Home, Star, Eye, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_URL, SITE_URL } from '../config';
import ConfirmDialog from './ConfirmDialog';
import { useToast } from '../hooks/useToast';
import Toast from './Toast';

export default function PropertiesList({ onEdit, refreshTrigger, searchTerm = '', onTotalChange }) {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, property: null });
    const { token } = useAuth();
    const { toast, showToast, hideToast } = useToast();
    const sentinelRef = useRef(null);
    const loadingRef = useRef(false);
    const lastPageLoadedRef = useRef(0); // Rastrear última página carregada

    // Helper para gerar URL do site público (Grug gosta: simples!)
    const getPropertyPublicUrl = (property) => {
        if (!property) return SITE_URL;
        const slug = property.tipo?.toLowerCase().replace(/\s+/g, '-') || 'imovel';
        const quartos = property.quartos ? `${property.quartos}q-` : '';
        const bairro = property.bairro?.toLowerCase().replace(/\s+/g, '-') || '';
        return `${SITE_URL}/imovel/${slug}-${quartos}${bairro}-${property.id}`;
    };

    const fetchProperties = async (pageNum = 1, append = false) => {
        // Grug gosta: proteção simples contra múltiplas chamadas e duplicatas
        if (loadingRef.current) {
            return; // Silencioso, não logar
        }
        
        // Proteção: não carregar mesma página duas vezes
        if (append && pageNum === lastPageLoadedRef.current) {
            return;
        }
        
        loadingRef.current = true;
        lastPageLoadedRef.current = pageNum;
        setLoading(true);
        
        try {
            const url = `${API_URL}/api/properties?page=${pageNum}&limit=20${searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ''}`;
            const res = await fetch(url);
            
            if (!res.ok) {
                if (res.status === 429) {
                    // Resetar lastPageLoaded para permitir retry depois
                    lastPageLoadedRef.current = 0;
                    return;
                }
                throw new Error('Falha na conexão');
            }
            
            const data = await res.json();
            
            // Se API retorna array (compatibilidade), tratar como página única
            if (Array.isArray(data)) {
                if (append) {
                    setProperties(prev => [...prev, ...data]);
                } else {
                    setProperties(data);
                }
                setHasMore(false);
            } else {
                // API retorna { data, pagination }
                if (append) {
                    setProperties(prev => [...prev, ...data.data]);
                } else {
                    setProperties(data.data);
                }
                setHasMore(data.pagination.hasMore);
                
                // Grug gosta: expor total para Dashboard (evita requisição duplicada)
                if (onTotalChange && !append) {
                    onTotalChange(data.pagination.total);
                }
            }
        } catch (error) {
            console.error('Erro ao buscar imóveis:', error);
            if (!append) setProperties([]);
            // Em erro 429, não resetar lastPageLoaded (rate limit vai resetar)
            // Outros erros: manter lastPageLoaded para não retentar mesma página
            if (error.message?.includes('429')) {
                setHasMore(false);
            } else {
                // Em outros erros, resetar para permitir retry
                lastPageLoadedRef.current = 0;
            }
        } finally {
            setLoading(false);
            // Delay antes de permitir próxima requisição (proteção extra)
            setTimeout(() => {
                loadingRef.current = false;
            }, 300);
        }
    };

    // Throttle persistente (Grug gosta: simples, direto)
    const lastCallTimeRef = useRef(0);

    // Reset quando refreshTrigger ou searchTerm muda
    useEffect(() => {
        setProperties([]);
        setPage(1);
        setHasMore(true);
        lastPageLoadedRef.current = 0;
        fetchProperties(1, false);
    }, [refreshTrigger, searchTerm]);

    // Intersection Observer para scroll infinito
    // Grug gosta: lógica simples, sem abstrações desnecessárias
    useEffect(() => {
        if (!hasMore || loading || !sentinelRef.current) return;

        const throttleDelay = 500;

        const observer = new IntersectionObserver(
            (entries) => {
                if (!entries[0].isIntersecting) return;
                if (loadingRef.current) return;
                
                // Throttle
                const now = Date.now();
                if (now - lastCallTimeRef.current < throttleDelay) return;
                lastCallTimeRef.current = now;

                // Próxima página = última carregada + 1 (Grug gosta: simples e direto!)
                const nextPage = lastPageLoadedRef.current + 1;
                
                setPage(nextPage);
                fetchProperties(nextPage, true);
            },
            { threshold: 0.1, rootMargin: '100px' }
        );

        observer.observe(sentinelRef.current);
        return () => observer.disconnect();
    }, [hasMore, loading, searchTerm]);

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
                showToast('Imóvel excluído com sucesso!', 'success');
            } else {
                showToast('Erro ao excluir imóvel', 'error');
            }
        } catch (error) {
            console.error('Erro:', error);
            showToast('Erro ao excluir imóvel', 'error');
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
                showToast('Curadoria atualizada!', 'success');
            } else {
                const error = await res.json();
                showToast(error.error || 'Erro ao atualizar curadoria', 'error');
            }
        } catch (error) {
            console.error('Erro:', error);
            showToast('Erro ao atualizar curadoria', 'error');
        }
    };

    // Busca já é feita na API, não precisa filtrar localmente
    const filteredProperties = properties;

    if (loading && properties.length === 0) return <div className="p-12 text-center text-gray-500" role="status">Carregando imóveis...</div>;

    return (
        <>
            {filteredProperties.length > 0 && (
                <div className="sr-only" aria-live="polite" aria-atomic="true">
                    {filteredProperties.length} {filteredProperties.length === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}
                </div>
            )}

            {/* Desktop: Container com tabela */}
            <div className="hidden md:flex flex-col h-full min-h-0">
                <div className="flex-1 min-h-0 overflow-auto">
                    <table className="w-full text-left border-collapse">
                        <caption className="sr-only">Lista de imóveis cadastrados</caption>
                        <thead className="sticky top-0 z-10 bg-gray-50 shadow-sm">
                            <tr className="bg-gray-50/50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-600 font-semibold">
                                <th scope="col" className="p-3">Imóvel</th>
                                <th scope="col" className="p-3">Localização</th>
                                <th scope="col" className="p-3">Valor</th>
                                <th scope="col" className="p-3">Tipo</th>
                                <th scope="col" className="p-3 text-center">Views</th>
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
                                                <a
                                                    href={getPropertyPublicUrl(property)}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="font-bold text-primary text-base leading-tight hover:text-primary/80 hover:underline flex items-center gap-1 group/link"
                                                >
                                                    {property.title}
                                                    <ExternalLink size={14} className="opacity-0 group-hover/link:opacity-60 transition-opacity" />
                                                </a>
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
                                        <div className="flex items-center justify-center gap-1 text-gray-600">
                                            <Eye size={14} className="text-gray-400" />
                                            <span className="text-sm font-semibold">{property.views || 0}</span>
                                        </div>
                                    </td>
                                    <td className="p-3 text-center">
                                        <button
                                            onClick={() => handleToggleFeatured(property.id, property.featured)}
                                            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg transition-all border min-w-[44px] min-h-[44px] justify-center ${property.featured
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
            </div>

            {/* Mobile: Cards diretos na tela */}
            <div className="md:hidden space-y-3">
                {filteredProperties.map((property) => (
                    <div key={property.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                        <div className="flex items-start gap-3 mb-3">
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shadow-sm flex-shrink-0 border border-gray-200">
                                <img
                                    src={property.image}
                                    alt=""
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-primary text-base leading-tight mb-1">{property.title}</p>
                                {property.subtitle && (
                                    <p className="text-xs text-gray-600 truncate">{property.subtitle}</p>
                                )}
                                <div className="flex items-center gap-2 mt-2">
                                    <MapPin size={12} className="text-gold-dark" aria-hidden="true" />
                                    <span className="font-medium text-xs text-gray-700">{property.bairro}</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => onEdit(property.id)}
                                    className="p-2 text-gray-600 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                                    aria-label={`Editar ${property.title}`}
                                >
                                    <Edit size={18} aria-hidden="true" />
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(property)}
                                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                    aria-label={`Excluir ${property.title}`}
                                >
                                    <Trash2 size={18} aria-hidden="true" />
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <span className="font-bold text-primary text-base">{property.price}</span>
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-1 bg-primary/5 text-primary rounded-full text-xs font-bold uppercase">
                                    {property.tipo}
                                </span>
                                <button
                                    onClick={() => handleToggleFeatured(property.id, property.featured)}
                                    className={`p-2 rounded-lg transition-all border ${property.featured
                                            ? 'bg-[#d4af37]/10 text-[#d4af37] border-[#d4af37]/30'
                                            : 'bg-gray-50 text-gray-500 border-gray-200'
                                        }`}
                                    aria-label={property.featured ? 'Remover da Curadoria' : 'Adicionar à Curadoria'}
                                >
                                    <Star size={14} className={property.featured ? 'fill-current' : ''} aria-hidden="true" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredProperties.length === 0 && !loading && (
                    <div className="p-8 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-400">
                            <Home size={40} className="mb-3 opacity-20" aria-hidden="true" />
                            <p className="text-base font-medium text-gray-600">Nenhum imóvel encontrado</p>
                            <p className="text-xs text-gray-500 mt-1">Tente buscar por outro termo ou adicione um novo imóvel.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Sentinel único para scroll infinito (Grug gosta: um só!) */}
            {hasMore && <div ref={sentinelRef} className="h-20" />}
            {loading && properties.length > 0 && (
                <div className="text-center py-4 text-gray-500 text-sm">Carregando mais imóveis...</div>
            )}

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
            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
        </>
    );
}
