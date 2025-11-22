import { useState } from 'react';
import { Share2, Eye, ChevronLeft, ChevronRight, Check } from 'lucide-react';

/**
 * Componente de Galeria de Imagens
 * Grug gosta: componente focado, < 150 linhas
 */
export const PropertyGallery = ({ property, images, onShare }) => {
    const [activeImage, setActiveImage] = useState(0);

    const goToPrevious = () => setActiveImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    const goToNext = () => setActiveImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group relative">
            <div className="aspect-video relative bg-gray-100">
                <img
                    src={images[activeImage] || property.image}
                    alt={`Imagem ${activeImage + 1} de ${images.length} - ${property.title}`}
                    className="w-full h-full object-cover transition-transform duration-500"
                />
                
                {images.length > 1 && (
                    <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2">
                        <span>{activeImage + 1} / {images.length}</span>
                    </div>
                )}
                
                <div className="absolute top-4 right-4">
                    <button
                        onClick={onShare}
                        className="p-3 min-w-[44px] min-h-[44px] bg-white/90 backdrop-blur rounded-full hover:bg-white transition-colors text-gray-700 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 flex items-center justify-center"
                        aria-label="Compartilhar este imóvel"
                    >
                        <Share2 size={20} />
                    </button>
                </div>
                
                {images.length > 1 && (
                    <>
                        <button
                            onClick={goToPrevious}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 min-w-[44px] min-h-[44px] bg-white/90 backdrop-blur rounded-full hover:bg-white transition-colors text-gray-700 shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 flex items-center justify-center"
                            aria-label="Imagem anterior"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={goToNext}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 min-w-[44px] min-h-[44px] bg-white/90 backdrop-blur rounded-full hover:bg-white transition-colors text-gray-700 shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 flex items-center justify-center"
                            aria-label="Próxima imagem"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </>
                )}
                
                <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2">
                    <Eye size={16} className="text-green-300" />
                    <span>{Math.floor(Math.random() * (150 - 20 + 1)) + 20} pessoas visualizaram hoje</span>
                </div>
            </div>
            
            {images.length > 1 && (
                <div className="p-4 bg-white border-t border-gray-100">
                    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                        {images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveImage(idx)}
                                aria-label={`Ver imagem ${idx + 1} de ${images.length}`}
                                aria-current={activeImage === idx ? "true" : "false"}
                                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 min-h-[44px] group
                                    ${activeImage === idx ? 'border-primary ring-2 ring-primary/20' : 'border-transparent opacity-70 hover:opacity-100 hover:border-gray-300'}`}
                            >
                                <img 
                                    src={img} 
                                    alt={`Miniatura ${idx + 1} de ${images.length}`} 
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                                />
                                {activeImage === idx && (
                                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                            <Check size={16} className="text-white" />
                                        </div>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

