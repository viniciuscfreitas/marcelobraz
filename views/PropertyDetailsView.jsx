import { useState, useEffect, useRef } from 'react';
import { LeadModal } from '../components/LeadModal';
import { PropertyFeatures } from '../components/property/PropertyFeatures';
import { PropertyMap } from '../components/property/PropertyMap';
import { PropertyMultimedia } from '../components/property/PropertyMultimedia';
import { PropertyContact } from '../components/property/PropertyContact';
import { PropertyBrokerProfile } from '../components/property/PropertyBrokerProfile';
import { useSEO } from '../hooks/useSEO.jsx';
import { BROKER_INFO } from '../data/constants';
import { generateShareUrl } from '../utils/urlHelpers';
import { generateWhatsAppLink } from '../utils/whatsappHelpers';

// ==================================================================================
// 🎨 COMPONENTES VISUAIS INLINE (UI/UX Premium)
// ==================================================================================

const Icons = {
    Phone: ({ className }) => <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
    MessageCircle: ({ className }) => <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>,
    Share: ({ className }) => <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>,
    MapPin: ({ className }) => <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
    Maximize: ({ className }) => <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>,
    Bed: ({ className }) => <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>,
    Bath: ({ className }) => <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-1C4.5 2 3.5 2.5 3.5 4c0 1.5.5 2.5 1.5 3.5L7.5 10"/><line x1="8" x2="8" y1="19" y2="21"/><line x1="16" x2="16" y1="19" y2="21"/><path d="M2 12h20"/><path d="M7 19v-7a5 5 0 0 1 10 0v7"/></svg>,
    Car: ({ className }) => <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M14 14h6"/></svg>,
    Check: ({ className }) => <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="20 6 9 17 4 12"/></svg>,
    Lock: ({ className }) => <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
    Image: ({ className }) => <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
};

const GalleryHero = ({ property, images, onShare }) => {
    const displayImages = images && images.length > 0 ? images : [property?.image || "https://via.placeholder.com/1200x800?text=Sem+Foto"];
    const gridImages = [...displayImages, ...Array(5).fill("https://via.placeholder.com/800?text=Foto")].slice(0, 5);

    return (
        <section aria-label="Galeria de fotos" className="relative mb-8 group">
            <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-2 h-[40vh] min-h-[300px] md:h-[500px] rounded-xl overflow-hidden shadow-sm">
                <button 
                    className="md:col-span-2 md:row-span-2 relative overflow-hidden cursor-pointer group/img focus:outline-none focus-visible:ring-4 focus-visible:ring-[#c5a572] w-full h-full p-0 border-0"
                    aria-label="Ver foto principal em tela cheia"
                >
                    <img 
                        src={gridImages[0]} 
                        alt={`Foto principal de ${property?.title}`} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300"></div>
                </button>

                {[1, 2, 3].map((idx) => (
                    <button 
                        key={idx}
                        className="hidden md:block relative overflow-hidden cursor-pointer w-full h-full p-0 border-0 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#c5a572]"
                        aria-label={`Ver foto ${idx + 1}`}
                    >
                        <img src={gridImages[idx]} alt={`Foto do imóvel ${idx + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    </button>
                ))}
                
                <button 
                    className="hidden md:block relative overflow-hidden cursor-pointer w-full h-full p-0 border-0 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#c5a572]"
                    aria-label="Ver todas as fotos"
                >
                    <img src={gridImages[4]} alt="Ver mais fotos" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[1px] hover:bg-black/50 transition-colors">
                        <span className="text-white font-bold flex items-center gap-2 text-lg">
                            <Icons.Image className="w-5 h-5" />
                            Ver todas
                        </span>
                    </div>
                </button>
            </div>

            <div className="absolute top-4 right-4 flex gap-2">
                <button 
                    onClick={onShare}
                    className="bg-white/90 backdrop-blur-md hover:bg-white text-gray-800 px-4 py-2 rounded-lg shadow-lg text-sm font-semibold flex items-center gap-2 transition-all hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
                    aria-label="Compartilhar este imóvel"
                >
                    <Icons.Share className="w-4 h-4" /> 
                    <span className="hidden sm:inline">Compartilhar</span>
                </button>
            </div>
            
            <div className="absolute top-4 left-4 md:hidden">
                <span className="bg-[#856404] text-white px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider shadow-md">
                    {property?.tipo || 'Destaque'}
                </span>
            </div>
        </section>
    );
};

const PropertyInfoCard = ({ property, leadCaptured, onUnlockPrice }) => {
    const formatPrice = (val) => {
        if (!val) return 'R$ 0,00';
        if (typeof val === 'string' && val.includes('R$')) return val;
        const num = typeof val === 'string' ? parseFloat(val.replace(/[^0-9,]/g, '').replace(',', '.')) : val;
        if (isNaN(num)) return val;
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num);
    };

    return (
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-blue-100">
                            {getTransactionLabel(property?.transaction_type) || 'Venda'}
                        </span>
                        {property?.condominio && (
                            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium border border-gray-200">
                                Cond. {formatPrice(property.condominio)}
                            </span>
                        )}
                    </div>
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 leading-tight">
                        {property?.title || 'Imóvel Exclusivo'}
                    </h1>
                    <p className="text-gray-600 flex items-center gap-2 text-sm md:text-base mt-2">
                        <Icons.MapPin className="w-4 h-4 text-[#856404]" /> 
                        {property?.endereco_completo || `${property?.bairro}, ${property?.cidade} - SP`}
                    </p>
                </div>
                <div className="text-left md:text-right mt-2 md:mt-0 bg-gray-50 md:bg-transparent p-4 md:p-0 rounded-xl w-full md:w-auto border md:border-0 border-gray-100">
                    <p className="text-xs text-gray-600 uppercase tracking-wider font-semibold mb-1">Valor de {getTransactionLabel(property?.transaction_type)}</p>
                    <div className="text-3xl md:text-4xl font-bold text-[#856404] tracking-tight">
                        {leadCaptured ? (formatPrice(property?.price) || 'Sob Consulta') : 'Sob Consulta'}
                    </div>
                </div>
            </div>

            <ul className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-y border-gray-100" aria-label="Detalhes principais">
                <li className="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                    <Icons.Bed className="text-gray-500 mb-2 w-6 h-6" />
                    <span className="font-bold text-gray-900 text-lg">{property?.quartos || '--'}</span>
                    <span className="text-xs text-gray-600 uppercase tracking-wide font-medium">Quartos</span>
                </li>
                <li className="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                    <Icons.Bath className="text-gray-500 mb-2 w-6 h-6" />
                    <span className="font-bold text-gray-900 text-lg">{property?.banheiros || '--'}</span>
                    <span className="text-xs text-gray-600 uppercase tracking-wide font-medium">Banheiros</span>
                </li>
                <li className="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                    <Icons.Car className="text-gray-500 mb-2 w-6 h-6" />
                    <span className="font-bold text-gray-900 text-lg">{property?.vagas || '--'}</span>
                    <span className="text-xs text-gray-600 uppercase tracking-wide font-medium">Vagas</span>
                </li>
                <li className="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                    <Icons.Maximize className="text-gray-500 mb-2 w-6 h-6" />
                    <span className="font-bold text-gray-900 text-lg">{property?.area_util || property?.area || '--'}</span>
                    <span className="text-xs text-gray-600 uppercase tracking-wide font-medium">m² Úteis</span>
                </li>
            </ul>

            <div className="mt-8">
                <h2 className="text-lg font-serif font-bold text-gray-900 mb-4 flex items-center gap-2">
                    Sobre o imóvel
                    <div className="h-px flex-1 bg-gray-200 ml-4" aria-hidden="true"></div>
                </h2>
                <div className="prose prose-slate prose-sm sm:prose-base max-w-none text-gray-700 leading-relaxed">
                    {property?.description || "Descrição detalhada indisponível para este imóvel no momento."}
                </div>
            </div>
        </div>
    );
};

const MobileActionBar = ({ onWhatsApp, onContact }) => (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 p-4 z-50 md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.05)] safe-area-bottom">
        <div className="flex gap-3">
            <button 
                onClick={onWhatsApp}
                className="flex-1 bg-[#128c7e] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#128c7e]"
                aria-label="WhatsApp"
            >
                <Icons.MessageCircle className="w-5 h-5" />
                WhatsApp
            </button>
            <button 
                onClick={onContact}
                className="flex-1 bg-[#0f172a] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0f172a]"
            >
                <Icons.Phone className="w-5 h-5" />
                Contatar
            </button>
        </div>
    </div>
);

// Helper compartilhado (Grug gosta: função simples, reutilizável)
const getTransactionLabel = (type) => {
    if (type === 'Aluguel') return 'Locação';
    if (type === 'Temporada') return 'Temporada';
    if (type === 'Leilão') return 'Leilão';
    return 'Venda';
};

/**
 * Página de Detalhes do Imóvel
 * Grug gosta: orquestrador simples, componentes pequenos
 */
export const PropertyDetailsView = ({ property, navigateTo, onOpenLeadModal, onShareSuccess }) => {
    const [leadCaptured, setLeadCaptured] = useState(false);
    const [showLeadModal, setShowLeadModal] = useState(false);
    const viewTrackedRef = useRef(false);

    // Helper: copiar URL para clipboard (fallback)
    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch {
            // Fallback: método antigo
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.cssText = 'position:fixed;top:0;left:0;width:2em;height:2em;padding:0;border:none;outline:none;box-shadow:none;background:transparent;opacity:0;';
            textArea.readOnly = true;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                const success = document.execCommand('copy');
                document.body.removeChild(textArea);
                return success;
            } catch {
                document.body.removeChild(textArea);
                return false;
            }
        }
    };

    // Função de compartilhar (Grug gosta: simples, direto, sempre funciona)
    const handleShare = async () => {
        if (!property?.id) {
            alert('Erro: Imóvel não encontrado');
            return;
        }

        const shareUrl = generateShareUrl(property);
        const shareData = {
            title: property.title || 'Imóvel',
            text: `${property.title || 'Imóvel'} - ${property.bairro || ''}, ${property.cidade || ''}`,
            url: shareUrl
        };

        // Tentar Web Share API primeiro
        if (navigator.share) {
            try {
                if (navigator.canShare && !navigator.canShare(shareData)) {
                    throw new Error('Cannot share');
                }
                await navigator.share(shareData);
                if (onShareSuccess) onShareSuccess('Link compartilhado!');
                return;
            } catch (err) {
                if (err.name === 'AbortError' || err.name === 'NotAllowedError') return;
                // Continuar para fallback se erro não for de cancelamento
            }
        }

        // Fallback: copiar para clipboard
        const copied = await copyToClipboard(shareUrl);
        if (copied) {
            if (onShareSuccess) {
                onShareSuccess('Link copiado para área de transferência!');
                    } else {
                        alert('Link copiado!');
                    }
                } else {
                    prompt('Copie o link:', shareUrl);
        }
    };

    // Helper: verifica se lead foi capturado
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

        let timer = null;
        if (!isCaptured && property) {
            timer = setTimeout(() => setShowLeadModal(true), 500);
        }

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
        window.scrollTo(0, 0);
    }, [property]);

    // Registrar view quando página carrega (Grug gosta: simples, uma vez por visita!)
    useEffect(() => {
        if (!property?.id) return;
        
        // Resetar ref quando muda de imóvel (Grug gosta: cada imóvel conta uma vez!)
        viewTrackedRef.current = false;
        
        const trackView = async () => {
            // Proteção: só conta uma vez por imóvel
            if (viewTrackedRef.current) return;
            viewTrackedRef.current = true;
            
            try {
                const isDev = import.meta.env.DEV;
                const apiUrl = import.meta.env.VITE_API_URL || (isDev ? 'http://localhost:3001' : '');
                const endpoint = apiUrl ? `${apiUrl}/api/properties/${property.id}/view` : `/api/properties/${property.id}/view`;
                
                await fetch(endpoint, { method: 'POST' });
            } catch (err) {
                // Silencioso - não quebrar UX se falhar
                console.error('Erro ao registrar view:', err);
                // Resetar ref se falhar para permitir retry
                viewTrackedRef.current = false;
            }
        };
        
        trackView();
    }, [property?.id]);

    // Renderizar SEO (Grug gosta: componente dentro do render!)
    const seoMeta = useSEO({
        title: property.title,
        description: property.description
            ? property.description.substring(0, 155)
            : `${property.title} em ${property.bairro || ''}, ${property.cidade || 'Santos'}. ${getTransactionLabel(property.tipo)}. ${property.quartos ? `${property.quartos} quartos` : ''} ${property.area_util ? `${property.area_util}m²` : ''}`.trim(),
        image: property.image,
        url: window.location.href,
        property: property // Passa property inteira para gerar Schema.org
    });

    if (!property) return null;

    // Helper para parsing JSON
    const parseJsonField = (field, defaultValue = {}) => {
        if (!field) return defaultValue;
        if (typeof field !== 'string') return field || defaultValue;
        try {
            return JSON.parse(field) || defaultValue;
        } catch (error) {
            console.error('Error parsing field:', error);
            return defaultValue;
        }
    };

    const features = parseJsonField(property.features, {});
    const multimedia = parseJsonField(property.multimedia, {});

    // Coletar todas as imagens disponíveis (Grug gosta: simples, direto!)
    const allImages = [];
    const addUnique = (img) => {
        if (img && typeof img === 'string' && img.trim() && !allImages.includes(img)) {
            allImages.push(img);
        }
    };

    // Prioridade: images array > image > multimedia.photos > multimedia.images
    if (Array.isArray(property.images) && property.images.length > 0) {
        property.images.forEach(addUnique);
    } else {
        // Fallback: usar image principal se não tem array
    if (property.image) addUnique(property.image);
    if (Array.isArray(multimedia.photos)) multimedia.photos.forEach(addUnique);
    if (Array.isArray(multimedia.images)) multimedia.images.forEach(addUnique);
    }

    // Garantir pelo menos uma imagem
    const images = allImages.length > 0 ? allImages : (property.image ? [property.image] : []);

    const handleWhatsApp = () => {
        const whatsappUrl = generateWhatsAppLink(property);
        window.open(whatsappUrl, '_blank');
    };

    const handleContact = () => {
        if (onOpenLeadModal) {
            onOpenLeadModal('email');
        } else {
            setShowLeadModal(true);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-24 md:pb-12 font-sans text-slate-900">
            {seoMeta}
            <div className="h-20 bg-white shadow-sm mb-8 hidden md:block" aria-hidden="true"></div> 
            <div className="h-4 md:hidden" aria-hidden="true"></div>

            <div className="container mx-auto px-4 md:px-6 max-w-7xl">
                <GalleryHero property={property} images={images} onShare={handleShare} />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
                    
                    <main className="lg:col-span-8 space-y-8" role="main">
                        <PropertyInfoCard 
                            property={property} 
                            leadCaptured={leadCaptured}
                            onUnlockPrice={() => setShowLeadModal(true)} 
                        />
                        
                        <PropertyFeatures features={features} />
                        
                        {leadCaptured && <PropertyMap property={property} />}
                        
                        <PropertyMultimedia multimedia={multimedia} property={property} />
                    </main>

                    <aside className="lg:col-span-4 relative" role="complementary" aria-label="Informações de contato e perfil do corretor">
                        <div className="sticky top-24 space-y-6">
                            <PropertyContact property={property} onOpenLeadModal={onOpenLeadModal} />
                            <PropertyBrokerProfile />
                        </div>
                    </aside>

                </div>
            </div>

            <MobileActionBar 
                onWhatsApp={handleWhatsApp} 
                onContact={handleContact} 
            />

            <LeadModal
                isOpen={showLeadModal}
                onClose={() => setShowLeadModal(false)}
                property={property}
                type="gate"
                onSuccess={(msg) => {
                    setLeadCaptured(true);
                    window.dispatchEvent(new Event('leadCaptured'));
                    setShowLeadModal(false);
                }}
            />
        </div>
    );
};
