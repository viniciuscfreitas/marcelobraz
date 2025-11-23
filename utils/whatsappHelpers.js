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
    // Edge case: validar número do WhatsApp
    const phone = CONSTANTS?.WHATSAPP_NUMBER;
    if (!phone || typeof phone !== 'string' || !/^\d+$/.test(phone.replace(/\D/g, ''))) {
        // Fallback: usar número do BROKER_INFO se disponível
        const fallbackPhone = BROKER_INFO?.whatsapp_link?.match(/\d+/)?.[0];
        if (!fallbackPhone) {
            console.warn('WhatsApp number not configured');
            return '#';
        }
        const cleanPhone = fallbackPhone.replace(/\D/g, '');
        return `https://wa.me/${cleanPhone}`;
    }
    
    const cleanPhone = phone.replace(/\D/g, '');

    let message;

    if (customMessage) {
        // Edge case: sanitizar mensagem customizada
        message = String(customMessage).trim() || `Olá ${BROKER_INFO?.name || 'corretor'}!`;
    } else if (property) {
        // Mensagem contextual com informações do imóvel
        const specs = [];
        if (property.quartos) specs.push(`${property.quartos} quartos`);
        if (property.vagas) specs.push(`${property.vagas} vagas`);
        if (property.area_util) specs.push(`${property.area_util}m²`);

        // Edge case: sanitizar título e outros campos
        const title = (property.title || 'Imóvel').trim();
        const refCode = property.ref_code ? String(property.ref_code).trim() : '';
        const price = property.price || 'Sob Consulta';
        
        // Edge case: validar URL antes de incluir
        const shareUrl = generateShareUrl(property);
        const urlLine = shareUrl && shareUrl !== '' ? `🔗 Link: ${shareUrl}` : '';

        message = `Olá ${BROKER_INFO?.name || 'corretor'}! 👋

Tenho interesse neste imóvel:

📍 *${title}*
${refCode ? `🏷️ Código: ${refCode}` : ''}
💰 Valor: ${price}
${specs.length > 0 ? `📏 ${specs.join(' | ')}` : ''}
${urlLine ? `${urlLine}\n` : ''}
Podemos agendar uma visita?`.trim();
    } else {
        // Mensagem genérica
        message = `Olá ${BROKER_INFO?.name || 'corretor'}! Gostaria de mais informações sobre seus imóveis.`;
    }

    // Edge case: garantir que mensagem não está vazia
    if (!message || !message.trim()) {
        message = `Olá ${BROKER_INFO?.name || 'corretor'}!`;
    }

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
};

/**
 * Gera mensagem para agendamento de visita
 */
export const generateScheduleMessage = (property, date, period) => {
    // Edge case: validar número do WhatsApp
    const phone = CONSTANTS?.WHATSAPP_NUMBER;
    if (!phone || typeof phone !== 'string' || !/^\d+$/.test(phone.replace(/\D/g, ''))) {
        const fallbackPhone = BROKER_INFO?.whatsapp_link?.match(/\d+/)?.[0];
        if (!fallbackPhone) {
            console.warn('WhatsApp number not configured');
            return '#';
        }
        const cleanPhone = fallbackPhone.replace(/\D/g, '');
        return `https://wa.me/${cleanPhone}`;
    }
    
    const cleanPhone = phone.replace(/\D/g, '');

    // Edge case: validar property
    if (!property) {
        return `https://wa.me/${cleanPhone}`;
    }

    const periodLabels = {
        'manha': 'Manhã (9h-12h)',
        'tarde': 'Tarde (14h-17h)',
        'noite': 'Noite (18h-20h)'
    };

    // Edge case: validar e formatar data
    let formattedDate = '';
    if (date) {
        try {
            const dateObj = new Date(date);
            if (!isNaN(dateObj.getTime())) {
                formattedDate = dateObj.toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            }
        } catch (e) {
            console.warn('Invalid date:', e);
        }
    }
    
    if (!formattedDate) {
        formattedDate = 'Data a confirmar';
    }

    // Edge case: sanitizar campos
    const title = (property.title || 'Imóvel').trim();
    const refCode = property.ref_code ? String(property.ref_code).trim() : '';
    const periodLabel = periodLabels[period] || (period ? String(period) : 'Período a confirmar');

    const message = `Olá ${BROKER_INFO?.name || 'corretor'}! 👋

Gostaria de agendar visita:

📍 *${title}*
${refCode ? `🏷️ Código: ${refCode}` : ''}
📅 Data: ${formattedDate}
🕐 Período: ${periodLabel}

Confirma disponibilidade?`.trim();

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
};
