import { useState, useEffect } from 'react';
import { Share2, ChevronLeft, ChevronRight, Eye, X, Maximize2 } from 'lucide-react';

/**
 * Componente de Galeria de Imagens do Imóvel
 * Grug gosta: estilo Imovelweb, simples e direto!
 */
export const PropertyGallery = ({ property, images = [], onShare }) => {
    const [activeImage, setActiveImage] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    const goToPrevious = () => setActiveImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    const goToNext = () => setActiveImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));

    // Navegação por teclado no lightbox (Grug gosta: simples!)
    useEffect(() => {
        if (!isLightboxOpen) return;

        const handleKeyPress = (e) => {
            if (e.key === 'ArrowLeft') {
                setActiveImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
            }
            if (e.key === 'ArrowRight') {
                setActiveImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
            }
            if (e.key === 'Escape') {
                setIsLightboxOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [isLightboxOpen, images.length]);

    const currentImage = images[activeImage] || property.image || '';

    if (!currentImage) return null;

    return (
        <>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Imagem Principal - Grande e Clicável */}
                <div className="relative bg-gray-100 group">
                    <div className="aspect-[16/10] relative overflow-hidden">
                        <img
                            src={currentImage}
                            alt={`Imagem ${activeImage + 1} de ${images.length} - ${property.title}`}
                            className="w-full h-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
                            onClick={() => setIsLightboxOpen(true)}
                        />

                        {/* Overlay ao hover - botão fullscreen clicável */}
                        <div 
                            className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center cursor-pointer"
                            onClick={() => setIsLightboxOpen(true)}
                        >
                            <button
                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white hover:scale-110 focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsLightboxOpen(true);
                                }}
                                aria-label="Abrir galeria em tela cheia"
                            >
                                <Maximize2 size={24} className="text-primary" />
                            </button>
                        </div>

                        {/* Contador de fotos */}
                        {images.length > 1 && (
                            <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium">
                                {activeImage + 1} / {images.length}
                            </div>
                        )}

                        {/* Botão Compartilhar */}
                        <div className="absolute top-4 right-4">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onShare();
                                }}
                                className="p-3 min-w-[44px] min-h-[44px] bg-white/90 backdrop-blur rounded-full hover:bg-white transition-colors text-gray-700 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 flex items-center justify-center"
                                aria-label="Compartilhar este imóvel"
                            >
                                <Share2 size={20} />
                            </button>
                        </div>

                        {/* Navegação lateral */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        goToPrevious();
                                    }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 min-w-[44px] min-h-[44px] bg-white/90 backdrop-blur rounded-full hover:bg-white transition-colors text-gray-700 shadow-lg opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 flex items-center justify-center"
                                    aria-label="Imagem anterior"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        goToNext();
                                    }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 min-w-[44px] min-h-[44px] bg-white/90 backdrop-blur rounded-full hover:bg-white transition-colors text-gray-700 shadow-lg opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 flex items-center justify-center"
                                    aria-label="Próxima imagem"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </>
                        )}

                        {/* Views */}
                        <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2">
                            <Eye size={16} className="text-green-300" />
                            <span>{property.views || 0} {property.views === 1 ? 'visualização' : 'visualizações'}</span>
                        </div>
                    </div>
                </div>

                {/* Grid de Thumbnails - Sempre Visível */}
                {images.length > 1 && (
                    <div className="p-4 bg-white border-t border-gray-100">
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(idx)}
                                    aria-label={`Ver imagem ${idx + 1} de ${images.length}`}
                                    aria-current={activeImage === idx ? "true" : "false"}
                                    className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 group cursor-pointer
                                            ${activeImage === idx ? 'border-primary ring-2 ring-primary/20 shadow-md' : 'border-gray-200 hover:border-gray-300 hover:shadow-md'}`}
                                >
                                    <img
                                        src={img}
                                        alt={`Miniatura ${idx + 1} de ${images.length}`}
                                        className={`w-full h-full object-cover transition-transform duration-300 ${activeImage === idx ? '' : 'group-hover:scale-110 opacity-90 group-hover:opacity-100'}`}
                                    />
                                    {activeImage === idx && (
                                        <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                                            <div className="bg-primary text-white rounded-full px-2 py-1 text-xs font-bold">
                                                {idx + 1}
                                            </div>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Lightbox Fullscreen - Estilo Imovelweb */}
            {isLightboxOpen && (
                <div
                    className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
                    onClick={() => setIsLightboxOpen(false)}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Galeria de imagens em tela cheia"
                >
                    {/* Botão Fechar */}
                    <button
                        onClick={() => setIsLightboxOpen(false)}
                        className="absolute top-4 right-4 p-3 min-w-[44px] min-h-[44px] bg-white/10 hover:bg-white/20 backdrop-blur rounded-full text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white z-10"
                        aria-label="Fechar galeria"
                    >
                        <X size={24} />
                    </button>

                    {/* Imagem em Fullscreen */}
                    <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
                        <img
                            src={currentImage}
                            alt={`Imagem ${activeImage + 1} de ${images.length} - ${property.title}`}
                            className="max-w-full max-h-full object-contain"
                            onClick={(e) => e.stopPropagation()}
                        />

                        {/* Contador */}
                        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                            {activeImage + 1} / {images.length}
                        </div>

                        {/* Navegação */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        goToPrevious();
                                    }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 p-4 min-w-[48px] min-h-[48px] bg-white/10 hover:bg-white/20 backdrop-blur rounded-full text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                                    aria-label="Imagem anterior"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        goToNext();
                                    }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-4 min-w-[48px] min-h-[48px] bg-white/10 hover:bg-white/20 backdrop-blur rounded-full text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                                    aria-label="Próxima imagem"
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </>
                        )}
                    </div>

                    {/* Grid de thumbnails no lightbox (opcional) */}
                    {images.length > 1 && images.length <= 12 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm rounded-lg p-3 max-w-4xl w-full mx-4">
                            <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveImage(idx);
                                        }}
                                        className={`relative aspect-video rounded overflow-hidden border-2 transition-all ${
                                            activeImage === idx ? 'border-white ring-2 ring-white/50' : 'border-white/30 hover:border-white/60'
                                        }`}
                                        aria-label={`Ver imagem ${idx + 1}`}
                                    >
                                        <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};
