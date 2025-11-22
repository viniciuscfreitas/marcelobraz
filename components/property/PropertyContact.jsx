import { MessageCircle, Mail, Calendar } from 'lucide-react';
import { Button } from '../Button';
import { COLORS, BROKER_INFO } from '../../data/constants';

/**
 * Componente de Card de Contato
 * Grug gosta: componente focado, < 150 linhas
 */
export const PropertyContact = ({ property, onOpenLeadModal }) => {
    return (
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
                    className="w-full justify-center py-4 text-lg shadow-lg border-none hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: COLORS.WHATSAPP }}
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
    );
};

