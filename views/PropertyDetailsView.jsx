import { useState, useEffect } from 'react';
import { MapPin, Bed, Bath, Maximize, Car, Check, Share2, Eye, Map as MapIcon, MessageCircle, Mail, Calendar, Lock } from 'lucide-react';
import { Button } from '../components/Button';
import { LeadModal } from '../components/LeadModal';
import { BROKER_INFO, COLORS } from '../data/constants';

/**
 * Página de Detalhes do Imóvel
 * Design premium inspirado no Imovelweb mas com nossa identidade visual.
 */
export const PropertyDetailsView = ({ property, navigateTo, onOpenLeadModal, onShareSuccess }) => {
    const [activeImage, setActiveImage] = useState(0);
    const [viewCount, setViewCount] = useState(0);
    const [leadCaptured, setLeadCaptured] = useState(false);
    const [showLeadModal, setShowLeadModal] = useState(false);

    // Função de compartilhar (Grug gosta: simples e direto)
    const handleShare = async () => {
        if (!property?.id) return;
        
        const shareUrl = `${window.location.origin}?property=${property.id}`;
        const shareData = {
            title: property.title,
            text: `${property.title} - ${property.bairro}, ${property.cidade}`,
            url: shareUrl
        };

        // Tenta usar Web Share API se disponível (mobile principalmente)
        if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
            try {
                await navigator.share(shareData);
                if (onShareSuccess) onShareSuccess('Link compartilhado!');
                return;
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('Erro ao compartilhar:', err);
                } else {
                    // Usuário cancelou, não fazer nada
                    return;
                }
            }
        }

        // Fallback: copiar para clipboard
        try {
            await navigator.clipboard.writeText(shareUrl);
            if (onShareSuccess) onShareSuccess('Link copiado para área de transferência!');
        } catch (err) {
            console.error('Erro ao copiar:', err);
            // Fallback final: tentar método antigo
            const textArea = document.createElement('textarea');
            textArea.value = shareUrl;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            textArea.style.pointerEvents = 'none';
            document.body.appendChild(textArea);
            textArea.select();
            try {
                const success = document.execCommand('copy');
                if (success && onShareSuccess) {
                    onShareSuccess('Link copiado!');
                } else {
                    alert('Erro ao copiar. Tente novamente.');
                }
            } catch (fallbackErr) {
                console.error('Erro ao copiar (fallback):', fallbackErr);
                alert('Erro ao compartilhar. Tente novamente.');
            }
            document.body.removeChild(textArea);
        }
    };

    // Helper simples: verifica se lead foi capturado (Grug gosta: função pequena, sem over-engineering)
    const checkLeadCaptured = (propId) => {
        const capturedLeads = JSON.parse(localStorage.getItem('leads_captured') || '[]');
        const globalCaptured = localStorage.getItem('lead_captured') === 'true';
        return propId ? (capturedLeads.includes(propId) || globalCaptured) : globalCaptured;
    };

    // Verificar se lead foi capturado
    useEffect(() => {
        const propertyId = property?.id;
        const isCaptured = checkLeadCaptured(propertyId);
        setLeadCaptured(isCaptured);
        
        // Se não foi capturado, abrir modal automaticamente após um breve delay
        let timer = null;
        if (!isCaptured && property) {
            timer = setTimeout(() => setShowLeadModal(true), 500);
        }
        
        // Handler único para atualizar estado quando lead é capturado
        const updateLeadState = () => {
            const newIsCaptured = checkLeadCaptured(propertyId);
            setLeadCaptured(newIsCaptured);
        };
        
        window.addEventListener('storage', updateLeadState);
        window.addEventListener('leadCaptured', updateLeadState);
        
        return () => {
            if (timer) clearTimeout(timer);
            window.removeEventListener('storage', updateLeadState);
            window.removeEventListener('leadCaptured', updateLeadState);
        };
    }, [property]);

    useEffect(() => {
        // View count (pode ser conectado à API no futuro)
        setViewCount(Math.floor(Math.random() * (150 - 20 + 1)) + 20);
        window.scrollTo(0, 0);
    }, [property]);

    if (!property) return null;

    // Parse features if string (legacy/safety check)
    let features = {};
    try {
        features = typeof property.features === 'string'
            ? JSON.parse(property.features || '{}')
            : property.features || {};
    } catch (error) {
        console.error('Error parsing features:', error);
        features = {};
    }

    let multimedia = {};
    try {
        multimedia = typeof property.multimedia === 'string'
            ? JSON.parse(property.multimedia || '{}')
            : property.multimedia || {};
    } catch (error) {
        console.error('Error parsing multimedia:', error);
        multimedia = {};
    }

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
            {/* Main Content Grid */}
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Gallery & Details (2/3 width) */}
                    <main className="lg:col-span-2 space-y-8" role="main">

                        {/* Gallery */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group relative">
                            <div className="aspect-video relative bg-gray-100">
                                <img
                                    src={images[activeImage] || property.image}
                                    alt={`Imagem ${activeImage + 1} de ${images.length} - ${property.title}`}
                                    className="w-full h-full object-cover transition-transform duration-500"
                                />
                                <div className="absolute top-4 right-4">
                                    <button
                                        onClick={handleShare}
                                        className="p-3 min-w-[44px] min-h-[44px] bg-white/90 backdrop-blur rounded-full hover:bg-white transition-colors text-gray-700 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 flex items-center justify-center"
                                        aria-label="Compartilhar este imóvel"
                                    >
                                        <Share2 size={20} />
                                    </button>
                                </div>
                                <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2">
                                    <Eye size={16} className="text-green-300" />
                                    <span>{viewCount} pessoas visualizaram hoje</span>
                                </div>
                            </div>
                            {/* Thumbnails */}
                            {images.length > 1 && (
                                <div className="p-4 flex gap-2 overflow-x-auto scrollbar-hide bg-white border-t border-gray-100">
                                    {images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveImage(idx)}
                                            aria-label={`Ver imagem ${idx + 1} de ${images.length}`}
                                            aria-current={activeImage === idx ? "true" : "false"}
                                            className={`relative flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 min-h-[44px]
                                                ${activeImage === idx ? 'border-primary ring-2 ring-primary/20' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                        >
                                            <img src={img} alt={`Miniatura ${idx + 1} de ${images.length}`} className="w-full h-full object-cover" />
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
                                                onClick={() => setShowLeadModal(true)}
                                                ariaLabel="Desbloquear valores do imóvel"
                                            >
                                                Ver Preço Agora
                                            </Button>
                                        </div>
                                    )}
                                    <p className="text-sm text-gray-500 mb-1">Valor de {property.tipo === 'Aluguel' ? 'Locação' : 'Venda'}</p>
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

                            {/* Key Specs */}
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
                        {property.mostrar_endereco === 1 && leadCaptured && (
                            <section className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-100 overflow-hidden" aria-labelledby="location-heading">
                                <h2 id="location-heading" className="text-xl font-bold text-gray-900 mb-6 font-serif flex items-center gap-2">
                                    <MapIcon size={24} className="text-primary" aria-hidden="true" /> Localização
                                </h2>
                                <p className="text-gray-600 mb-4">{property.endereco} - {property.bairro}, {property.cidade} - {property.estado}</p>
                                <div className="aspect-[21/9] rounded-xl overflow-hidden bg-gray-100 relative" role="region" aria-label="Mapa de localização do imóvel">
                                    <iframe
                                        title={`Mapa de localização: ${property.endereco}, ${property.bairro}, ${property.cidade}`}
                                        width="100%"
                                        height="100%"
                                        frameBorder="0"
                                        style={{ border: 0 }}
                                        src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_KEY || ''}&q=${encodeURIComponent(`${property.endereco}, ${property.bairro}, ${property.cidade}`)}`}
                                        allowFullScreen
                                        aria-label={`Mapa interativo mostrando a localização do imóvel em ${property.endereco}, ${property.bairro}, ${property.cidade}`}
                                    ></iframe>
                                    {!import.meta.env.VITE_GOOGLE_MAPS_KEY && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400" role="alert" aria-live="polite">
                                            <p>Mapa indisponível (Chave de API não configurada)</p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}

                        {/* Video / Multimedia */}
                        {multimedia.video_url && (
                            <section className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-100" aria-labelledby="video-heading">
                                <h2 id="video-heading" className="text-xl font-bold text-gray-900 mb-6 font-serif">Vídeo do Imóvel</h2>
                                <div className="aspect-video rounded-xl overflow-hidden bg-black shadow-lg">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={multimedia.video_url.replace('watch?v=', 'embed/')}
                                        title={`Vídeo do imóvel: ${property.title}`}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        aria-label={`Vídeo apresentando o imóvel ${property.title}`}
                                    ></iframe>
                                </div>
                            </section>
                        )}

                    </main>

                    {/* Right Column: Sticky Sidebar (1/3 width) */}
                    <aside className="lg:col-span-1" role="complementary" aria-label="Informações de contato e perfil do corretor">
                        <div className="sticky top-24 space-y-6">
                            {/* Contact Card */}
                            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0f172a] to-[#d4af37]"></div>
                                <div className="text-center mb-6">
                                    <p className="text-sm font-bold text-primary uppercase tracking-widest mb-2">Interessado?</p>
                                    <h3 className="text-2xl font-serif font-bold text-gray-900">Agende sua Visita</h3>
                                    <p className="text-gray-500 text-sm mt-2">Fale diretamente com o especialista deste imóvel.</p>
                                </div>

                                <div className="space-y-3">
                                    <Button
                                        variant="primary"
                                        className="w-full justify-center py-4 text-lg shadow-lg border-none"
                                        style={{ backgroundColor: COLORS.WHATSAPP }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.WHATSAPP_HOVER}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = COLORS.WHATSAPP}
                                        onClick={() => onOpenLeadModal('whatsapp')}
                                        ariaLabel="Abrir conversa no WhatsApp"
                                    >
                                        <MessageCircle className="mr-2" />
                                        Conversar no WhatsApp
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-center py-3 hover:bg-gray-50"
                                        onClick={() => onOpenLeadModal('email')}
                                        ariaLabel="Enviar mensagem por e-mail"
                                    >
                                        <Mail className="mr-2" size={18} />
                                        Enviar Mensagem
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-center py-3 text-gray-600 hover:text-primary"
                                        onClick={() => onOpenLeadModal('visit')}
                                        ariaLabel="Agendar visita ao imóvel"
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
                                        <img src="https://ui-avatars.com/api/?name=Marcelo+Braz&background=0D8ABC&color=fff" alt="Foto de Marcelo Braz, Corretor Especialista CRECI 12345-F" className="w-full h-full object-cover" />
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
                                    className="text-sm font-bold text-primary hover:underline flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md px-2 py-1 min-h-[44px]"
                                    aria-label="Ver todos os anúncios do corretor (abre em nova aba)"
                                >
                                    Ver todos os anúncios do corretor
                                </a>
                            </div>
                        </div>
                    </aside>

                </div>
            </div>

            {/* Lead Modal */}
            <LeadModal
                isOpen={showLeadModal}
                onClose={() => setShowLeadModal(false)}
                property={property}
                type="gate"
                onSuccess={(msg) => {
                    setLeadCaptured(true);
                    // Disparar evento para atualizar outros componentes
                    window.dispatchEvent(new Event('leadCaptured'));
                    setShowLeadModal(false);
                }}
            />
        </div>
    );
};
