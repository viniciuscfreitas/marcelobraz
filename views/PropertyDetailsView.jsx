import { useState } from 'react';
import { ArrowLeft, MapPin, Bed, Bath, Maximize, Car, Check, Share2, Heart } from 'lucide-react';
import { Button } from '../components/Button';
import { LeadModal } from '../components/LeadModal';

/**
 * Página de Detalhes do Imóvel
 * Design premium inspirado no Imovelweb mas com nossa identidade visual.
 */
export const PropertyDetailsView = ({ property, navigateTo, onOpenLeadModal }) => {
    const [activeImage, setActiveImage] = useState(0);

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
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(val);
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12">
            {/* Breadcrumb / Back */}
            <div className="container mx-auto px-4 md:px-6 mb-6">
                <button
                    onClick={() => navigateTo('portfolio')}
                    className="flex items-center text-gray-500 hover:text-primary transition-colors"
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
                        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                            <div className="aspect-video relative bg-gray-100">
                                <img
                                    src={images[activeImage] || property.image}
                                    alt={property.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <button className="p-2 bg-white/90 backdrop-blur rounded-full hover:bg-white transition-colors text-gray-700">
                                        <Share2 size={20} />
                                    </button>
                                    <button className="p-2 bg-white/90 backdrop-blur rounded-full hover:bg-white transition-colors text-red-500">
                                        <Heart size={20} />
                                    </button>
                                </div>
                            </div>
                            {/* Thumbnails (if multiple images) */}
                            {images.length > 1 && (
                                <div className="p-4 flex gap-2 overflow-x-auto scrollbar-hide">
                                    {images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveImage(idx)}
                                            className={`relative flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all
                                                ${activeImage === idx ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                        >
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Header Info */}
                        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                                <div>
                                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-2 uppercase tracking-wider">
                                        {property.tipo}
                                    </span>
                                    <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-2">
                                        {property.title}
                                    </h1>
                                    <div className="flex items-center text-gray-500">
                                        <MapPin size={18} className="mr-1" />
                                        <p>{property.bairro}, {property.cidade}</p>
                                    </div>
                                </div>
                                <div className="text-left md:text-right">
                                    <p className="text-3xl font-bold text-primary">
                                        {formatPrice(property.price)}
                                    </p>
                                    {property.condominio && (
                                        <p className="text-sm text-gray-500 mt-1">
                                            Condomínio: {formatPrice(property.condominio)}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Key Specs */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-t border-b border-gray-100">
                                <div className="flex items-center gap-3 text-gray-700">
                                    <div className="p-2 bg-gray-50 rounded-lg text-primary">
                                        <Maximize size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Área Útil</p>
                                        <p className="font-semibold">{property.area_util} m²</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-gray-700">
                                    <div className="p-2 bg-gray-50 rounded-lg text-primary">
                                        <Bed size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Quartos</p>
                                        <p className="font-semibold">{property.quartos} {property.suites > 0 && `(${property.suites} suítes)`}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-gray-700">
                                    <div className="p-2 bg-gray-50 rounded-lg text-primary">
                                        <Bath size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Banheiros</p>
                                        <p className="font-semibold">{property.banheiros}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-gray-700">
                                    <div className="p-2 bg-gray-50 rounded-lg text-primary">
                                        <Car size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Vagas</p>
                                        <p className="font-semibold">{property.vagas}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mt-8">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Descrição</h2>
                                <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed whitespace-pre-line">
                                    {property.description || "Sem descrição disponível."}
                                </div>
                            </div>
                        </div>

                        {/* Features */}
                        {(Object.keys(features.common || {}).length > 0 || Object.keys(features.private || {}).length > 0) && (
                            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Características</h2>

                                <div className="grid md:grid-cols-2 gap-8">
                                    {/* Private Features */}
                                    {Object.keys(features.private || {}).length > 0 && (
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-primary"></span>
                                                Privativas
                                            </h3>
                                            <ul className="space-y-2">
                                                {Object.entries(features.private).filter(([, v]) => v).map(([key]) => (
                                                    <li key={key} className="flex items-center text-gray-600">
                                                        <Check size={16} className="text-green-500 mr-2" />
                                                        <span className="capitalize">{key.replace(/_/g, ' ')}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Common Features */}
                                    {Object.keys(features.common || {}).length > 0 && (
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                                                Comuns
                                            </h3>
                                            <ul className="space-y-2">
                                                {Object.entries(features.common).filter(([, v]) => v).map(([key]) => (
                                                    <li key={key} className="flex items-center text-gray-600">
                                                        <Check size={16} className="text-green-500 mr-2" />
                                                        <span className="capitalize">{key.replace(/_/g, ' ')}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Video / Multimedia */}
                        {multimedia.video_url && (
                            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Vídeo</h2>
                                <div className="aspect-video rounded-lg overflow-hidden bg-black">
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
                            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                                <div className="text-center mb-6">
                                    <p className="text-sm text-gray-500 mb-1">Interessado neste imóvel?</p>
                                    <h3 className="text-xl font-bold text-gray-900">Agende uma Visita</h3>
                                </div>

                                <div className="space-y-4">
                                    <Button
                                        variant="primary"
                                        className="w-full justify-center py-4 text-lg shadow-primary/20 shadow-lg"
                                        onClick={() => onOpenLeadModal('whatsapp')}
                                    >
                                        Conversar no WhatsApp
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-center py-3"
                                        onClick={() => onOpenLeadModal('email')}
                                    >
                                        Enviar E-mail
                                    </Button>
                                </div>

                                <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                                    <p className="text-xs text-gray-400">
                                        Código do Imóvel: <span className="font-mono text-gray-600">{property.ref_code || property.id}</span>
                                    </p>
                                </div>
                            </div>

                            {/* Broker Profile (Mini) */}
                            <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                                    {/* Placeholder for broker avatar */}
                                    <img src="https://ui-avatars.com/api/?name=Marcelo+Braz&background=0D8ABC&color=fff" alt="Broker" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">Marcelo Braz</p>
                                    <p className="text-xs text-gray-500">Corretor Especialista</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
