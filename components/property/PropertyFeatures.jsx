import { Check } from 'lucide-react';

/**
 * Componente de Características do Imóvel
 * Grug gosta: componente focado, < 150 linhas
 */
export const PropertyFeatures = ({ features }) => {
    if (Object.keys(features.common || {}).length === 0 && Object.keys(features.private || {}).length === 0) {
        return null;
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 font-serif">Características</h2>

            <div className="grid md:grid-cols-2 gap-8">
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
    );
};




