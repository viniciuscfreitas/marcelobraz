import { BROKER_INFO } from '../../data/constants';

/**
 * Componente de Perfil do Corretor
 * Grug gosta: componente focado, < 150 linhas
 */
export const PropertyBrokerProfile = () => {
    return (
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
    );
};





