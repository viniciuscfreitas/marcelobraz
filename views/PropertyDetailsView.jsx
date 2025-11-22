import { useState, useEffect, useRef } from 'react';
import { LeadModal } from '../components/LeadModal';
import { PropertyGallery } from '../components/property/PropertyGallery';
import { PropertyHeader } from '../components/property/PropertyHeader';
import { PropertyFeatures } from '../components/property/PropertyFeatures';
import { PropertyMap } from '../components/property/PropertyMap';
import { PropertyMultimedia } from '../components/property/PropertyMultimedia';
import { PropertyContact } from '../components/property/PropertyContact';
import { PropertyBrokerProfile } from '../components/property/PropertyBrokerProfile';
import { FinancingCalculator } from '../components/property/FinancingCalculator';
import { useSEO } from '../hooks/useSEO.jsx';
import { BROKER_INFO } from '../data/constants';
import { generateShareUrl } from '../utils/urlHelpers';

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

    // SEO dinâmico com Schema.org
    const getTransactionLabel = (type) => {
        if (type === 'Aluguel') return 'Locação';
        if (type === 'Temporada') return 'Temporada';
        if (type === 'Leilão') return 'Leilão';
        return 'Venda';
    };

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

    return (
        <div className="min-h-screen bg-[#f8fafc] pt-20 pb-12 font-sans">
            {seoMeta}
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <main className="lg:col-span-2 space-y-8" role="main">
                        <PropertyGallery property={property} images={images} onShare={handleShare} />
                        <PropertyHeader
                            property={property}
                            leadCaptured={leadCaptured}
                            onUnlockPrice={() => setShowLeadModal(true)}
                        />
                        <FinancingCalculator property={property} />
                        <PropertyFeatures features={features} />
                        {leadCaptured && <PropertyMap property={property} />}
                        <PropertyMultimedia multimedia={multimedia} property={property} />
                    </main>

                    <aside className="lg:col-span-1" role="complementary" aria-label="Informações de contato e perfil do corretor">
                        <div className="sticky top-24 space-y-6">
                            <PropertyContact property={property} onOpenLeadModal={onOpenLeadModal} />
                            <PropertyBrokerProfile />
                        </div>
                    </aside>
                </div>
            </div>

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
