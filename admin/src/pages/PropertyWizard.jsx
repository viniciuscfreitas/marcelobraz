import { useEffect, useRef } from 'react';
import { FormProvider } from 'react-hook-form';
import { Save, ArrowRight } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import { usePropertyWizard } from '../hooks/usePropertyWizard';
import Toast from '../components/Toast';
import Layout from '../components/Layout';
import { WizardHeader } from '../components/wizard/WizardHeader';

import StepInfo from '../components/wizard/StepInfo';
import StepFeatures from '../components/wizard/StepFeatures';
import StepMultimedia from '../components/wizard/StepMultimedia';

const STEPS = [
    { id: 1, title: 'Informações Principais', component: StepInfo },
    { id: 2, title: 'Características', component: StepFeatures },
    { id: 3, title: 'Multimídia', component: StepMultimedia },
];

export default function PropertyWizard() {
    const { toast, showToast, hideToast } = useToast();
    const { isEditing, currentStep, loading, methods, onSubmit, nextStep, prevStep, fetchProperty } = usePropertyWizard();
    const formRef = useRef(null);

    useEffect(() => {
        if (isEditing) {
            fetchProperty().catch(() => {
                showToast('Erro ao carregar dados do imóvel', 'error');
            });
        }
    }, [isEditing]);

    const handleSubmit = async (data) => {
        await onSubmit(data, 
            (msg) => showToast(msg, 'success'),
            (msg) => showToast(msg, 'error')
        );
    };

    const handleNextStep = async () => {
        await nextStep((msg) => showToast(msg, 'error'));
    };

    const handleFabSubmit = () => {
        if (formRef.current) {
            formRef.current.requestSubmit();
        }
    };

    const CurrentComponent = STEPS[currentStep - 1].component;

    // FAB customizado para mobile: botão "Próximo" ou "Finalizar"
    // Grug gosta: botão contextual, simples e direto
    const fabButton = (
        <>
            {currentStep < STEPS.length ? (
                <button
                    type="button"
                    onClick={handleNextStep}
                    className="w-14 h-14 bg-gold-dark rounded-full flex items-center justify-center text-white shadow-xl shadow-gold/20 active:scale-95 transition-transform focus:ring-2 focus:ring-offset-2 focus:ring-gold"
                    aria-label="Próximo passo"
                >
                    <ArrowRight className="w-7 h-7" aria-hidden="true" />
                </button>
            ) : (
                <button
                    type="button"
                    onClick={handleFabSubmit}
                    disabled={loading}
                    className="w-14 h-14 bg-green-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-green-600/20 active:scale-95 transition-transform focus:ring-2 focus:ring-offset-2 focus:ring-green-600 disabled:opacity-50"
                    aria-label="Finalizar anúncio"
                >
                    <Save className="w-7 h-7" aria-hidden="true" />
                </button>
            )}
            <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-[10px] font-bold text-gold-dark whitespace-nowrap">
                {currentStep < STEPS.length ? 'Próximo' : 'Finalizar'}
            </span>
        </>
    );

    return (
        <Layout showSearch={false} fabButton={fabButton}>
            <div className="flex-1 overflow-y-auto bg-background pb-12 px-4 md:px-6 py-8">
                <WizardHeader isEditing={isEditing} currentStep={currentStep} />

                <main className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-200 bg-gray-50">
                            <h2 className="text-lg font-semibold text-gray-800">
                                {STEPS[currentStep - 1].title}
                            </h2>
                            <p className="text-sm text-gray-500">Passo {currentStep} de {STEPS.length}</p>
                        </div>

                        <FormProvider {...methods}>
                            <form ref={formRef} onSubmit={methods.handleSubmit(handleSubmit)} className="p-6">
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
                                            onClick={handleNextStep}
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
        </Layout>
    );
}
