import { useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { Button } from '../Button';
import { generateScheduleMessage } from '../../utils/whatsappHelpers';

/**
 * Componente de Agendamento de Visita - Grug Brain Style
 * Simples, direto, funciona!
 */
export const ScheduleVisit = ({ property }) => {
    const [date, setDate] = useState('');
    const [period, setPeriod] = useState('manha');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!date) {
            alert('Por favor, selecione uma data');
            return;
        }

        const whatsappUrl = generateScheduleMessage(property, date, period);
        window.open(whatsappUrl, '_blank');
    };

    // Data mínima = hoje
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
                <Calendar className="text-primary" size={20} />
                <h3 className="text-lg font-bold text-gray-900">Agendar Visita</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="visit-date" className="block text-sm font-medium text-gray-700 mb-2">
                        Data da Visita
                    </label>
                    <input
                        id="visit-date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        min={today}
                        required
                        className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    />
                </div>

                <div>
                    <label htmlFor="visit-period" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Clock size={16} />
                        Período
                    </label>
                    <select
                        id="visit-period"
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    >
                        <option value="manha">Manhã (9h-12h)</option>
                        <option value="tarde">Tarde (14h-17h)</option>
                        <option value="noite">Noite (18h-20h)</option>
                    </select>
                </div>

                <Button
                    type="submit"
                    variant="primary"
                    className="w-full justify-center py-3"
                    ariaLabel="Solicitar agendamento via WhatsApp"
                >
                    Solicitar Agendamento
                </Button>

                <p className="text-xs text-center text-gray-500">
                    Você será redirecionado para o WhatsApp para confirmar o agendamento
                </p>
            </form>
        </div>
    );
};

