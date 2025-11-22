import { MapPin, Bed, Bath, Maximize, Car, Lock } from 'lucide-react';
import { Button } from '../Button';
import { PropertyBadge } from './PropertyBadge';

/**
 * Componente de Header com Título e Preço
 * Grug gosta: componente focado, < 150 linhas
 */
export const PropertyHeader = ({ property, leadCaptured, onUnlockPrice }) => {
    const formatPrice = (val) => {
        if (!val) return 'R$ 0,00';
        if (typeof val === 'string' && val.includes('R$')) return val;
        const num = typeof val === 'string' ? parseFloat(val) : val;
        if (isNaN(num)) return val;
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num);
    };

    const parseValue = (val) => {
        if (!val) return 0;
        if (typeof val === 'number') return val;
        return parseFloat(val.replace('R$', '').replace(/\./g, '').replace(',', '.').trim()) || 0;
    };

    const priceVal = parseValue(property.price);
    const condoVal = parseValue(property.condominio);
    const iptuVal = parseValue(property.iptu);
    const totalVal = priceVal + condoVal + iptuVal;

    const getTransactionLabel = (transactionType) => {
        const type = transactionType || 'Venda';
        if (type === 'Aluguel') return 'Locação';
        if (type === 'Temporada') return 'Temporada';
        if (type === 'Leilão') return 'Leilão';
        return 'Venda';
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-100">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 mb-8">
                <div className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-3">
                        <PropertyBadge status={property.status} />
                        <span className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-sm">
                            {property.tipo}
                        </span>
                        {property.tags && (Array.isArray(property.tags) ? property.tags : []).map(tag => (
                            <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full uppercase tracking-wider">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <h1 className="text-2xl md:text-4xl font-serif font-bold text-gray-900 mb-2 leading-tight">
                        {property.title}
                    </h1>
                    <div className="flex items-center text-gray-600 font-medium">
                        <MapPin size={18} className="mr-1 text-primary" />
                        <p>{property.bairro}, {property.cidade}</p>
                    </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 min-w-[250px] relative">
                    {!leadCaptured && (
                        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center z-10 p-4 border-2 border-primary/20">
                            <Lock size={32} className="text-primary mb-3" />
                            <p className="text-sm font-bold text-gray-900 mb-2 text-center">Valores Protegidos</p>
                            <p className="text-xs text-gray-600 mb-4 text-center">Cadastre-se para ver o valor e detalhes completos</p>
                            <Button
                                variant="primary"
                                className="w-full justify-center py-2 text-sm"
                                onClick={onUnlockPrice}
                                ariaLabel="Desbloquear valores do imóvel"
                            >
                                Ver Preço Agora
                            </Button>
                        </div>
                    )}
                    <p className="text-sm text-gray-500 mb-1">Valor de {getTransactionLabel(property.transaction_type)}</p>
                    <p className="text-3xl font-bold text-primary mb-2">
                        {leadCaptured ? formatPrice(property.price) : 'R$ ***,***'}
                    </p>
                    <div className="space-y-1 text-sm text-gray-600 pt-2 border-t border-gray-200">
                        {property.condominio && (
                            <div className="flex justify-between">
                                <span>Condomínio:</span>
                                <span className="font-semibold">{leadCaptured ? formatPrice(property.condominio) : 'R$ ***'}</span>
                            </div>
                        )}
                        {property.iptu && (
                            <div className="flex justify-between">
                                <span>IPTU:</span>
                                <span className="font-semibold">{leadCaptured ? formatPrice(property.iptu) : 'R$ ***'}</span>
                            </div>
                        )}
                        <div className="flex justify-between pt-2 border-t border-gray-200 font-bold text-gray-900 mt-2">
                            <span>Total Estimado:</span>
                            <span>{leadCaptured ? formatPrice(totalVal) : 'R$ ***,***'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-t border-b border-gray-100" role="list" aria-label="Características principais do imóvel">
                <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl text-center" role="listitem">
                    <Maximize size={28} className="text-gray-400 mb-2" aria-hidden="true" />
                    <p className="text-2xl font-bold text-gray-900">{property.area_util || 0}<span className="text-sm font-normal text-gray-500">m²</span></p>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Área Útil</p>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl text-center" role="listitem">
                    <Bed size={28} className="text-gray-400 mb-2" aria-hidden="true" />
                    <p className="text-2xl font-bold text-gray-900">{property.quartos || 0}</p>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Quartos</p>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl text-center" role="listitem">
                    <Bath size={28} className="text-gray-400 mb-2" aria-hidden="true" />
                    <p className="text-2xl font-bold text-gray-900">{property.banheiros || 0}</p>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Banheiros</p>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl text-center" role="listitem">
                    <Car size={28} className="text-gray-400 mb-2" aria-hidden="true" />
                    <p className="text-2xl font-bold text-gray-900">{property.vagas || 0}</p>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Vagas</p>
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 font-serif">Sobre o Imóvel</h2>
                <div className="prose prose-lg prose-gray max-w-none text-gray-600 leading-relaxed whitespace-pre-line">
                    {property.description || "Sem descrição disponível."}
                </div>
            </div>
        </div>
    );
};

