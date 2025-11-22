import { useState, useEffect } from 'react';
import { LeadModal } from '../components/LeadModal';
import { PropertyGallery } from '../components/property/PropertyGallery';
import { PropertyHeader } from '../components/property/PropertyHeader';
import { PropertyFeatures } from '../components/property/PropertyFeatures';
import { PropertyMap } from '../components/property/PropertyMap';
import { PropertyMultimedia } from '../components/property/PropertyMultimedia';
import { PropertyContact } from '../components/property/PropertyContact';
import { PropertyBrokerProfile } from '../components/property/PropertyBrokerProfile';
import { useSEO } from '../hooks/useSEO';
import { BROKER_INFO } from '../data/constants';

/**
 * Página de Detalhes do Imóvel
 * Grug gosta: orquestrador simples, componentes pequenos
 */
export const PropertyDetailsView = ({ property, navigateTo, onOpenLeadModal, onShareSuccess }) => {
    const [leadCaptured, setLeadCaptured] = useState(false);
    const [showLeadModal, setShowLeadModal] = useState(false);

    // Função de compartilhar (Grug gosta: simples e direto, sempre funciona)
    const handleShare = async () => {
        if (!property?.id) {
            alert('Erro: Imóvel não encontrado');
            return;
        }

        const shareUrl = `${window.location.origin}?property=${property.id}`;
        const shareData = {
            title: property.title || 'Imóvel',
            text: `${property.title || 'Imóvel'} - ${property.bairro || ''}, ${property.cidade || ''}`,
            url: shareUrl
        };

        if (navigator.share) {
            try {
                if (navigator.canShare && !navigator.canShare(shareData)) {
                    throw new Error('Cannot share');
                }
                await navigator.share(shareData);
                if (onShareSuccess) onShareSuccess('Link compartilhado!');
                return;
            } catch (err) {
                if (err.name === 'AbortError' || err.name === 'NotAllowedError') {
                    return;
                }
            }
        }

        // Fallback: copiar para clipboard
        try {
            await navigator.clipboard.writeText(shareUrl);
            if (onShareSuccess) {
                onShareSuccess('Link copiado para área de transferência!');
            } else {
                alert('Link copiado!');
            }
        } catch (err) {
            // Fallback final: método antigo
            const textArea = document.createElement('textarea');
            textArea.value = shareUrl;
            textArea.style.position = 'fixed';
            textArea.style.top = '0';
            textArea.style.left = '0';
            textArea.style.width = '2em';
            textArea.style.height = '2em';
            textArea.style.padding = '0';
            textArea.style.border = 'none';
            textArea.style.outline = 'none';
            textArea.style.boxShadow = 'none';
            textArea.style.background = 'transparent';
            textArea.style.opacity = '0';
            textArea.readOnly = true;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            textArea.setSelectionRange(0, shareUrl.length);

            try {
                const success = document.execCommand('copy');
                document.body.removeChild(textArea);

                if (success) {
                    if (onShareSuccess) {
                        onShareSuccess('Link copiado!');
                    } else {
                        alert('Link copiado!');
                    }
                } else {
                    prompt('Copie o link:', shareUrl);
                }
            } catch (fallbackErr) {
                document.body.removeChild(textArea);
                prompt('Copie o link:', shareUrl);
            }
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

    // Coletar todas as imagens disponíveis
    const allImages = [];
    const addUnique = (img) => {
        if (img && !allImages.includes(img)) allImages.push(img);
    };

    if (property.image) addUnique(property.image);
    if (Array.isArray(property.images)) property.images.forEach(addUnique);
    if (Array.isArray(multimedia.photos)) multimedia.photos.forEach(addUnique);
    if (Array.isArray(multimedia.images)) multimedia.images.forEach(addUnique);

    const images = allImages.length > 0 ? allImages : [property.image].filter(Boolean);

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12 font-sans">
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
