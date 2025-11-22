import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';

/**
 * Hook para lógica do Property Wizard
 * Grug gosta: lógica isolada, componente focado
 */
export const usePropertyWizard = () => {
    const { id } = useParams();
    const isEditing = !!id;
    const navigate = useNavigate();
    const { token } = useAuth();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const methods = useForm({
        defaultValues: {
            features: { common: {}, private: {} },
            multimedia: {},
            mostrar_endereco: true,
            featured: false
        }
    });

    // Fetch property será chamado externamente quando necessário

    const fetchProperty = async () => {
        try {
            const res = await fetch(`${API_URL}/api/properties/${id}`);
            const data = await res.json();
            methods.reset(data);
        } catch (error) {
            console.error('Erro ao buscar imóvel:', error);
            throw error;
        }
    };

    const preparePayload = (data) => ({
        ...data,
        price: data.price,
        quartos: Number(data.quartos) || 0,
        vagas: Number(data.vagas) || 0,
        banheiros: Number(data.banheiros) || 0,
        suites: Number(data.suites) || 0,
        area_util: Number(data.area_util) || 0,
        area_total: Number(data.area_total) || 0,
        featured: !!data.featured,
        aceita_permuta: !!data.aceita_permuta,
        aceita_fgts: !!data.aceita_fgts,
        mostrar_endereco: !!data.mostrar_endereco
    });

    const onSubmit = async (data, onSuccess, onError) => {
        setLoading(true);
        try {
            const payload = preparePayload(data);
            const url = isEditing
                ? `${API_URL}/api/properties/${id}`
                : `${API_URL}/api/properties`;
            const method = isEditing ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                onSuccess('Imóvel salvo com sucesso! 🦖');
                setTimeout(() => navigate('/'), 1500);
            } else {
                const errorData = await res.json().catch(() => ({ error: 'Erro ao salvar' }));
                onError(errorData.error || 'Erro ao salvar imóvel');
            }
        } catch (error) {
            console.error('Erro:', error);
            onError('Erro de conexão ao salvar');
        } finally {
            setLoading(false);
        }
    };

    const nextStep = async (onError) => {
        const isValid = await methods.trigger();
        if (isValid) {
            setCurrentStep(prev => Math.min(prev + 1, 3));
            window.scrollTo(0, 0);
        } else {
            onError('Preencha os campos obrigatórios antes de prosseguir');
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
        window.scrollTo(0, 0);
    };

    return {
        isEditing,
        currentStep,
        loading,
        methods,
        onSubmit,
        nextStep,
        prevStep,
        fetchProperty
    };
};

