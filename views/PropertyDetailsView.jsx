import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Bed, Bath, Maximize, Car, Check, Share2, Heart, Eye, Map as MapIcon, MessageCircle, Mail, Calendar } from 'lucide-react';
import { Button } from '../components/Button';
import { LeadModal } from '../components/LeadModal';
import { BROKER_INFO } from '../data/constants';

/**
 * Página de Detalhes do Imóvel
 * Design premium inspirado no Imovelweb mas com nossa identidade visual.
 */
export const PropertyDetailsView = ({ property, navigateTo, onOpenLeadModal }) => {
    const [activeImage, setActiveImage] = useState(0);
    const [viewCount, setViewCount] = useState(0);

    useEffect(() => {
        // Grug Fake Urgency: Random number between 20 and 150
        setViewCount(Math.floor(Math.random() * (150 - 20 + 1)) + 20);
        window.scrollTo(0, 0);
    }, [property]);

    if (!property) return null;

    // Parse features if string (legacy/safety check)
    const features = typeof property.features === 'string'
        ? JSON.parse(property.features || '{}')
        : property.features || {};

    const multimedia = typeof property.multimedia === 'string'
        ? JSON.parse(property.multimedia || '{}')
        : property.multimedia || {};

    // Mock images if none provided (fallback)
    const images = property.images || [property.image];

    // Format currency
    const formatPrice = (val) => {
        if (!val) return 'R$ 0,00';
        if (typeof val === 'string' && val.includes('R$')) return val;
        const num = typeof val === 'string' ? parseFloat(val) : val;
        if (isNaN(num)) return val;
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num);
    };

    // Calculate Total (Approximate)
    const parseValue = (val) => {
        if (!val) return 0;
        if (typeof val === 'number') return val;
        return parseFloat(val.replace('R$', '').replace(/\./g, '').replace(',', '.').trim()) || 0;
    };

    const priceVal = parseValue(property.price);
    const condoVal = parseValue(property.condominio);
    const iptuVal = parseValue(property.iptu);
    const totalVal = priceVal + condoVal + iptuVal;

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12 font-sans">
            {/* Breadcrumb / Back */}
            <div className="container mx-auto px-4 md:px-6 mb-6">
                <button
                    onClick={() => navigateTo('portfolio')}
                    className="flex items-center text-gray-500 hover:text-primary transition-colors font-medium"
                >
                    <ArrowLeft size={20} className="mr-2" />
                    Voltar para o Portfólio
                </button>
            </div>

            {/* Main Content Grid */}
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Gallery & Details (2/3 width) */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Gallery */}
                        <div className="bg-white rounded-2xl shadow-sm overflow-hidden group relative">
                            <div className="aspect-video relative bg-gray-100">
                                <img
                                    src={images[activeImage] || property.image}
                                    alt={property.title}
                                    className="w-full h-full object-cover transition-transform duration-500"
                                />
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <button className="p-2 bg-white/90 backdrop-blur rounded-full hover:bg-white transition-colors text-gray-700 shadow-sm">
                                        <Share2 size={20} />
                                    </button>
                                    <button className="p-2 bg-white/90 backdrop-blur rounded-full hover:bg-white transition-colors text-red-500 shadow-sm">
                                        <Heart size={20} />
                                    </button>
                                </div>
                                <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                                    <Eye size={16} className="text-green-400" />
                                    {viewCount} pessoas visualizaram hoje
                                </div>
                            </div>
                            {/* Thumbnails */}
                            {images.length > 1 && (
                                <div className="p-4 flex gap-2 overflow-x-auto scrollbar-hide bg-white border-t border-gray-100">
                                    {images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveImage(idx)}
                                            className={`relative flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all
                                                ${activeImage === idx ? 'border-primary ring-2 ring-primary/20' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                        >
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Header Info & Price */}
                        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-100">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 mb-8">
                                <div className="flex-1">
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        <span className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-sm">
                                            {property.tipo}
                                        </span>
                                        {property.tags && (typeof property.tags === 'string' ? JSON.parse(property.tags) : property.tags).map(tag => (
                                            <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full uppercase tracking-wider">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <h1 className="text-2xl md:text-4xl font-serif font-bold text-gray-900 mb-2 leading-tight">
                                        {property.title}
                                    </h1>
                                    <div className="flex items-center text-gray-500 font-medium">
                                        <MapPin size={18} className="mr-1 text-primary" />
                                        <p>{property.bairro}, {property.cidade}</p>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 min-w-[250px]">
                                    <p className="text-sm text-gray-500 mb-1">Valor de {property.tipo === 'Aluguel' ? 'Locação' : 'Venda'}</p>
                                    <p className="text-3xl font-bold text-primary mb-2">
                                        {formatPrice(property.price)}
                                    </p>
                                    <div className="space-y-1 text-sm text-gray-600 pt-2 border-t border-gray-200">
                                        {property.condominio && (
                                            <div className="flex justify-between">
                                                <span>Condomínio:</span>
                                                <span className="font-semibold">{formatPrice(property.condominio)}</span>
                                            </div>
                                        )}
                                        {property.iptu && (
                                            <div className="flex justify-between">
                                                <span>IPTU:</span>
                                                <span className="font-semibold">{formatPrice(property.iptu)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between pt-2 border-t border-gray-200 font-bold text-gray-900 mt-2">
                                            <span>Total Estimado:</span>
                                            <span>{formatPrice(totalVal)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Key Specs */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-t border-b border-gray-100">
                                <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl text-center hover:bg-primary/5 transition-colors group">
                                    <Maximize size={28} className="text-gray-400 group-hover:text-primary mb-2" />
                                    <p className="text-2xl font-bold text-gray-900">{property.area_util}<span className="text-sm font-normal text-gray-500">m²</span></p>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Área Útil</p>
                                </div>
                                <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl text-center hover:bg-primary/5 transition-colors group">
                                    <Bed size={28} className="text-gray-400 group-hover:text-primary mb-2" />
                                    <p className="text-2xl font-bold text-gray-900">{property.quartos}</p>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Quartos</p>
                                </div>
                                <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl text-center hover:bg-primary/5 transition-colors group">
                                    <Bath size={28} className="text-gray-400 group-hover:text-primary mb-2" />
                                    <p className="text-2xl font-bold text-gray-900">{property.banheiros}</p>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Banheiros</p>
                                </div>
                                <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl text-center hover:bg-primary/5 transition-colors group">
                                    <Car size={28} className="text-gray-400 group-hover:text-primary mb-2" />
                                    <p className="text-2xl font-bold text-gray-900">{property.vagas}</p>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Vagas</p>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mt-8">
                                <h2 className="text-xl font-bold text-gray-900 mb-4 font-serif">Sobre o Imóvel</h2>
                                <div className="prose prose-lg prose-gray max-w-none text-gray-600 leading-relaxed whitespace-pre-line">
                                    {property.description || "Sem descrição disponível."}
                                </div>
                            </div>
                        </div>

                        {/* Features */}
                        {(Object.keys(features.common || {}).length > 0 || Object.keys(features.private || {}).length > 0) && (
                            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-100">
                                <h2 className="text-xl font-bold text-gray-900 mb-6 font-serif">Características</h2>

                                <div className="grid md:grid-cols-2 gap-8">
                                    {/* Private Features */}
                                    {Object.keys(features.private || {}).length > 0 && (
                                        <div>
                                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 pb-2 border-b border-gray-100">
                                                <span className="w-2 h-2 rounded-full bg-primary"></span>
                                                Do Imóvel
                                            </h3>
                                            <ul className="space-y-3">
                                                {Object.entries(features.private).filter(([, v]) => v).map(([key]) => (
                                                    <li key={key} className="flex items-center text-gray-600 group">
                                                        <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center mr-3 group-hover:bg-green-100 transition-colors">
                                                            <Check size={12} className="text-green-600" />
                                                        </div>
                                                        <span className="capitalize font-medium">{key.replace(/_/g, ' ')}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Common Features */}
                                    {Object.keys(features.common || {}).length > 0 && (
                                        <div>
                                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 pb-2 border-b border-gray-100">
                                                <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                                                Do Condomínio
                                            </h3>
                                            <ul className="space-y-3">
                                                {Object.entries(features.common).filter(([, v]) => v).map(([key]) => (
                                                    <li key={key} className="flex items-center text-gray-600 group">
                                                        <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center mr-3 group-hover:bg-gray-200 transition-colors">
                                                            <Check size={12} className="text-gray-600" />
                                                        </div>
                                                        <span className="capitalize font-medium">{key.replace(/_/g, ' ')}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Map Section */}
                        {property.mostrar_endereco === 1 && (
                            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-100 overflow-hidden">
                                <h2 className="text-xl font-bold text-gray-900 mb-6 font-serif flex items-center gap-2">
                                    <MapIcon size={24} className="text-primary" /> Localização
                                </h2>
                                <p className="text-gray-600 mb-4">{property.endereco} - {property.bairro}, {property.cidade} - {property.estado}</p>
                                <div className="aspect-[21/9] rounded-xl overflow-hidden bg-gray-100 relative">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        frameBorder="0"
                                        style={{ border: 0 }}
                                        src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_KEY || ''}&q=${encodeURIComponent(`${property.endereco}, ${property.bairro}, ${property.cidade}`)}`}
                                        allowFullScreen
                                    ></iframe>
                                    {!import.meta.env.VITE_GOOGLE_MAPS_KEY && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
                                            <p>Mapa indisponível (Chave de API não configurada)</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Video / Multimedia */}
                        {multimedia.video_url && (
                            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-100">
                                <h2 className="text-xl font-bold text-gray-900 mb-6 font-serif">Vídeo do Imóvel</h2>
                                <div className="aspect-video rounded-xl overflow-hidden bg-black shadow-lg">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={multimedia.video_url.replace('watch?v=', 'embed/')}
                                        title="Property Video"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Right Column: Sticky Sidebar (1/3 width) */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            {/* Contact Card */}
                            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-yellow-400"></div>
                                <div className="text-center mb-6">
                                    <p className="text-sm font-bold text-primary uppercase tracking-widest mb-2">Interessado?</p>
                                    <h3 className="text-2xl font-serif font-bold text-gray-900">Agende sua Visita</h3>
                                    <p className="text-gray-500 text-sm mt-2">Fale diretamente com o especialista deste imóvel.</p>
                                </div>

                                <div className="space-y-3">
                                    <Button
                                        variant="primary"
                                        className="w-full justify-center py-4 text-lg shadow-lg shadow-green-500/20 bg-[#25D366] hover:bg-[#128C7E] border-none"
                                        onClick={() => onOpenLeadModal('whatsapp')}
                                    >
                                        <MessageCircle className="mr-2" />
                                        Conversar no WhatsApp
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-center py-3 hover:bg-gray-50"
                                        onClick={() => onOpenLeadModal('email')}
                                    >
                                        <Mail className="mr-2" size={18} />
                                        Enviar Mensagem
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-center py-3 text-gray-600 hover:text-primary"
                                        onClick={() => onOpenLeadModal('visit')}
                                    >
                                        <Calendar className="mr-2" size={18} />
                                        Agendar Visita
                                    </Button>
                                </div>

                                <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                                    <p className="text-xs text-gray-400">
                                        Código do Imóvel: <span className="font-mono font-bold text-gray-600">{property.ref_code || property.id}</span>
                                    </p>
                                </div>
                            </div>

                            {/* Broker Profile (Enhanced) */}
                            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden ring-2 ring-primary ring-offset-2">
                                        <img src="https://ui-avatars.com/api/?name=Marcelo+Braz&background=0D8ABC&color=fff" alt="Broker" className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-lg">Marcelo Braz</p>
                                        <p className="text-xs font-bold text-primary uppercase tracking-wide">Corretor Especialista</p>
                                        <p className="text-xs text-gray-500 mt-1">CRECI: 12345-F</p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 italic mb-4">
                                    "Especialista em imóveis de alto padrão em Santos. Vou te ajudar a encontrar o lar dos seus sonhos."
                                </p>
                                <a
                                    href={BROKER_INFO.whatsapp_link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-sm font-bold text-primary hover:underline flex items-center justify-center"
                                >
                                    Ver todos os anúncios do corretor
                                </a>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
