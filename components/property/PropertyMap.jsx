import { Map as MapIcon } from 'lucide-react';

/**
 * Componente de Mapa de Localização
 * Grug gosta: componente focado, < 150 linhas
 */
export const PropertyMap = ({ property }) => {
    if (property.mostrar_endereco !== 1) {
        return null;
    }

    return (
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
    );
};





