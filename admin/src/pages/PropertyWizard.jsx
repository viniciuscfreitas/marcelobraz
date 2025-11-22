import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';

import StepInfo from '../components/wizard/StepInfo';
import StepFeatures from '../components/wizard/StepFeatures';
import StepMultimedia from '../components/wizard/StepMultimedia';

const STEPS = [
    { id: 1, title: 'Informações Principais', component: StepInfo },
    { id: 2, title: 'Características', component: StepFeatures },
    { id: 3, title: 'Multimídia', component: StepMultimedia },
];

export default function PropertyWizard() {
    const { id } = useParams();
    const isEditing = !!id;
    const navigate = useNavigate();
    const { token } = useAuth();
    const { toast, showToast, hideToast } = useToast();
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

    useEffect(() => {
        if (isEditing) {
            fetchProperty();
        }
    }, [id]);

    const fetchProperty = async () => {
        try {
            const res = await fetch(`${API_URL}/api/properties/${id}`);
            const data = await res.json();

            // Transformar tags array -> string se necessário (embora o backend já mande array)
            // O backend manda features e multimedia como objetos já parseados

            methods.reset(data);
        } catch (error) {
            console.error('Erro ao buscar imóvel:', error);
            showToast('Erro ao carregar dados do imóvel', 'error');
        }
    };

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            // Preparar dados
            const payload = {
                ...data,
                // Garantir tipos corretos
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
            };

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
                showToast('Imóvel salvo com sucesso! 🦖', 'success');
                setTimeout(() => navigate('/'), 1500);
            } else {
                const errorData = await res.json().catch(() => ({ error: 'Erro ao salvar' }));
                showToast(errorData.error || 'Erro ao salvar imóvel', 'error');
            }
        } catch (error) {
            console.error('Erro:', error);
            showToast('Erro de conexão ao salvar', 'error');
        } finally {
            setLoading(false);
        }
    };

    const nextStep = async () => {
        const isValid = await methods.trigger(); // Valida todos os campos do form
        // Idealmente validaríamos apenas os campos do passo atual, mas por simplicidade validamos tudo
        // Se quiser validar só o passo atual, precisaria listar os campos de cada passo.

        if (isValid) {
            setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
            window.scrollTo(0, 0);
        } else {
            showToast('Preencha os campos obrigatórios antes de prosseguir', 'error');
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
        window.scrollTo(0, 0);
    };

    const CurrentComponent = STEPS[currentStep - 1].component;

    return (
        <div className="min-h-screen bg-background pb-12">
            {/* Header de Navegação */}
            <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <Link to="/" className="text-gray-500 hover:text-primary transition-colors p-2 rounded-full hover:bg-gray-100">
                                <ArrowLeft size={20} />
                            </Link>
                            <h1 className="text-xl font-bold text-primary font-serif hidden sm:block">
                                {isEditing ? 'Editar Imóvel' : 'Anunciar Imóvel'}
                            </h1>
                        </div>

                        {/* Steps Indicator */}
                        <div className="flex items-center gap-2">
                            {STEPS.map((step) => (
                                <div key={step.id} className="flex items-center">
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors
                                            ${currentStep === step.id ? 'bg-primary text-white' :
                                                currentStep > step.id ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'}`}
                                    >
                                        {currentStep > step.id ? <Check size={16} /> : step.id}
                                    </div>
                                    {step.id < STEPS.length && (
                                        <div className={`w-8 h-0.5 mx-1 ${currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'}`} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-200 bg-gray-50">
                        <h2 className="text-lg font-semibold text-gray-800">
                            {STEPS[currentStep - 1].title}
                        </h2>
                        <p className="text-sm text-gray-500">Passo {currentStep} de {STEPS.length}</p>
                    </div>

                    <FormProvider {...methods}>
                        <form onSubmit={methods.handleSubmit(onSubmit)} className="p-6">
                            <CurrentComponent />

                            <div className="flex justify-between pt-8 mt-8 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    disabled={currentStep === 1}
                                    className={`px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium transition-colors
                                        ${currentStep === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 hover:text-primary'}`}
                                >
                                    Voltar
                                </button>

                                {currentStep < STEPS.length ? (
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="btn-primary flex items-center gap-2 px-6 py-2"
                                    >
                                        Próximo
                                        <ArrowRight size={18} />
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="btn-primary flex items-center gap-2 px-8 py-2 bg-green-600 hover:bg-green-700 border-green-600"
                                    >
                                        <Save size={18} />
                                        {loading ? 'Salvando...' : 'Finalizar Anúncio'}
                                    </button>
                                )}
                            </div>
                        </form>
                    </FormProvider>
                </div>
            </main>

            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
        </div>
    );
}
