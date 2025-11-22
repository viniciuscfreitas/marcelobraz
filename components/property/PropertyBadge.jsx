import { Star, Clock, EyeOff, CheckCircle, Home } from 'lucide-react';

/**
 * PropertyBadge - Grug Brain Style
 * Mostra badges de status do imóvel (Exclusivo, Em Breve, etc.)
 */
export const PropertyBadge = ({ status }) => {
    if (!status || status === 'disponivel') return null;

    const badges = {
        exclusivo: {
            text: 'Exclusivo',
            icon: Star,
            className: 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white'
        },
        em_breve: {
            text: 'Em Breve',
            icon: Clock,
            className: 'bg-gradient-to-r from-blue-400 to-blue-600 text-white'
        },
        venda_silenciosa: {
            text: 'Venda Silenciosa',
            icon: EyeOff,
            className: 'bg-gradient-to-r from-purple-400 to-purple-600 text-white'
        },
        vendido: {
            text: 'Vendido',
            icon: CheckCircle,
            className: 'bg-gradient-to-r from-green-500 to-green-700 text-white'
        },
        alugado: {
            text: 'Alugado',
            icon: Home,
            className: 'bg-gradient-to-r from-teal-500 to-teal-700 text-white'
        }
    };

    const badge = badges[status];
    if (!badge) return null;

    const Icon = badge.icon;

    return (
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold shadow-lg ${badge.className} animate-pulse`}>
            <Icon size={16} />
            <span>{badge.text}</span>
        </div>
    );
};
