import { MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../components/Button.jsx';

export const WhatsappCaptureSection = () => {
  const [loading, setLoading] = useState(false);
  const [phoneValue, setPhoneValue] = useState('');
  const [success, setSuccess] = useState(false);

  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, '').slice(0, 11);
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value);
    setPhoneValue(formatted);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.target);
      const name = formData.get('name') || '';
      const bairro = formData.get('bairro') || '';
      const valor = formData.get('valor') || '';
      const phone = phoneValue.replace(/\D/g, '');

      // Montar property_title com bairro + valor
      const propertyTitle = [bairro, valor].filter(Boolean).join(' • ') || null;

      // Usar mesma lógica de URL do useProperties (dev vs prod)
      const isDev = import.meta.env.DEV;
      const apiUrl = import.meta.env.VITE_API_URL
          || (isDev ? 'http://localhost:3001' : '');
      const endpoint = apiUrl ? `${apiUrl}/api/leads` : '/api/leads';

      const leadData = {
        name: name.trim(),
        phone: phone.trim(),
        property_id: null,
        property_title: propertyTitle,
        type: 'whatsapp'
      };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(leadData)
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erro ao salvar lead');
      }

      setSuccess(true);
      e.target.reset();
      setPhoneValue('');
      
      // Reset success message após 5s
      setTimeout(() => setSuccess(false), 5000);

      // Disparar evento para atualizar componentes
      window.dispatchEvent(new Event('leadCaptured'));
    } catch (err) {
      console.error('Erro ao salvar lead:', err);
      alert(err.message || 'Erro ao enviar seus dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-[#0f172a] text-white">
      <div className="container mx-auto px-6">
        <div className="bg-white/5 rounded-3xl p-8 md:p-12 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-4 text-[#d4af37]">
              <MessageCircle size={24} />
              <span className="text-sm font-bold uppercase tracking-widest">Alerta de Oportunidade</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-serif font-bold mb-4">Não achou o que procurava?</h3>
            <p className="text-gray-400 leading-relaxed">Receba no seu WhatsApp uma seleção personalizada de imóveis "Off-Market".</p>
          </div>
          <form className="w-full md:w-auto flex flex-col gap-4 min-w-[350px]" onSubmit={handleSubmit}>
            <input 
              type="text" 
              name="name"
              placeholder="Seu nome" 
              className="bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d4af37]" 
              required 
              disabled={loading}
            />
            <input 
              type="tel" 
              name="phone"
              inputMode="numeric"
              value={phoneValue}
              onChange={handlePhoneChange}
              placeholder="(11) 99999-9999" 
              className="bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d4af37]" 
              required 
              disabled={loading}
            />
            <input 
              type="text" 
              name="bairro"
              placeholder="Bairro de preferência" 
              className="bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d4af37]" 
              disabled={loading}
            />
            <input 
              type="text" 
              name="valor"
              placeholder="Até qual valor? (Ex: 2M)" 
              className="bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d4af37]" 
              disabled={loading}
            />
            {success && (
              <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-3 text-green-200 text-sm text-center">
                Enviado! Entraremos em contato via WhatsApp.
              </div>
            )}
            <Button 
              variant="gold" 
              className="w-full text-base shadow-lg shadow-[#d4af37]/20" 
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Receber Lista no WhatsApp'}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

