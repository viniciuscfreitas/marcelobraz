import { useState } from 'react';

/**
 * Hook simples para buscar endereço por CEP via ViaCEP
 * Grug gosta: hook pequeno, faz uma coisa só
 */
export function useViaCep() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const buscarCep = async (cep) => {
        // Remove formatação
        const cepLimpo = cep.replace(/\D/g, '');
        
        // Valida formato (8 dígitos)
        if (cepLimpo.length !== 8) {
            return null;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
            const data = await response.json();

            if (data.erro) {
                setError('CEP não encontrado');
                return null;
            }

            return {
                endereco: data.logradouro || '',
                bairro: data.bairro || '',
                cidade: data.localidade || '',
                estado: data.uf || '',
                cep: data.cep || cepLimpo
            };
        } catch (err) {
            setError('Erro ao buscar CEP');
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { buscarCep, loading, error };
}

