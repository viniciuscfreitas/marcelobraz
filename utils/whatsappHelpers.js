/**
 * WhatsApp Helpers - Grug Brain Style
 * Gera mensagens contextuais para WhatsApp
 */

import { BROKER_INFO, CONSTANTS } from '../data/constants.js';
import { generateShareUrl } from './urlHelpers.js';

/**
 * Gera link do WhatsApp com mensagem pré-formatada
 * Grug gosta: Cliente já manda contexto completo!
 */
export const generateWhatsAppLink = (property, customMessage = null) => {
    const phone = CONSTANTS.WHATSAPP_NUMBER; // Já vem sem formatação

    let message;

    if (customMessage) {
        message = customMessage;
    } else if (property) {
        // Mensagem contextual com informações do imóvel
        const specs = [];
        if (property.quartos) specs.push(`${property.quartos} quartos`);
        if (property.vagas) specs.push(`${property.vagas} vagas`);
        if (property.area_util) specs.push(`${property.area_util}m²`);

        message = `Olá ${BROKER_INFO.name}! 👋

Tenho interesse neste imóvel:

📍 *${property.title}*
${property.ref_code ? `🏷️ Código: ${property.ref_code}` : ''}
💰 Valor: ${property.price || 'Sob Consulta'}
${specs.length > 0 ? `📏 ${specs.join(' | ')}` : ''}

🔗 Link: ${generateShareUrl(property)}

Podemos agendar uma visita?`;
    } else {
        // Mensagem genérica
        message = `Olá ${BROKER_INFO.name}! Gostaria de mais informações sobre seus imóveis.`;
    }

    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
};

/**
 * Gera mensagem para agendamento de visita
 */
export const generateScheduleMessage = (property, date, period) => {
    const phone = CONSTANTS.WHATSAPP_NUMBER; // Já vem sem formatação

    const periodLabels = {
        'manha': 'Manhã (9h-12h)',
        'tarde': 'Tarde (14h-17h)',
        'noite': 'Noite (18h-20h)'
    };

    const formattedDate = new Date(date).toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const message = `Olá ${BROKER_INFO.name}! 👋

Gostaria de agendar visita:

📍 *${property.title}*
${property.ref_code ? `🏷️ Código: ${property.ref_code}` : ''}
📅 Data: ${formattedDate}
🕐 Período: ${periodLabels[period] || period}

Confirma disponibilidade?`;

    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
};
