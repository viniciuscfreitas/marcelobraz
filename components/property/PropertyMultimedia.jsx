import { Map as MapIcon } from 'lucide-react';

/**
 * Componente de Multimídia (Vídeo e Tour Virtual)
 * Grug gosta: componente focado, < 150 linhas
 */
export const PropertyMultimedia = ({ multimedia, property }) => {
    if (!multimedia.video_url && !multimedia.tour_url) {
        return null;
    }

    return (
        <section className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-100 space-y-6" aria-labelledby="multimedia-heading">
            <h2 id="multimedia-heading" className="text-xl font-bold text-gray-900 mb-6 font-serif">Multimídia</h2>
            
            {multimedia.tour_url && (
                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <MapIcon size={20} className="text-primary" />
                        Tour Virtual 360º
                    </h3>
                    <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                        <iframe
                            width="100%"
                            height="100%"
                            src={multimedia.tour_url}
                            title={`Tour virtual do imóvel: ${property.title}`}
                            frameBorder="0"
                            allow="fullscreen"
                            allowFullScreen
                            aria-label={`Tour virtual 360º do imóvel ${property.title}`}
                            className="w-full h-full"
                        ></iframe>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Explore o imóvel em 360º</p>
                </div>
            )}

            {multimedia.video_url && (
                <div>
                    {multimedia.tour_url && <h3 className="text-lg font-bold text-gray-900 mb-3">Vídeo do Imóvel</h3>}
                    <div className="aspect-video rounded-xl overflow-hidden bg-black shadow-lg">
                        <iframe
                            width="100%"
                            height="100%"
                            src={multimedia.video_url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                            title={`Vídeo do imóvel: ${property.title}`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            aria-label={`Vídeo apresentando o imóvel ${property.title}`}
                        ></iframe>
                    </div>
                </div>
            )}
        </section>
    );
};





