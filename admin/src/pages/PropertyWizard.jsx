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
            {/* Header fixo no mobile */}
            <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-100 z-30 px-4 py-3 shadow-sm">
                <WizardHeader 
                    isEditing={isEditing} 
                    currentStep={currentStep}
                    onBack={prevStep}
                    canGoBack={currentStep > 1}
                />
            </div>

            <div className="flex-1 overflow-y-auto bg-background pb-24 md:pb-12 px-4 md:px-6 pt-20 md:pt-8">
                {/* Header desktop - não fixo */}
                <div className="hidden md:block">
                    <WizardHeader 
                        isEditing={isEditing} 
                        currentStep={currentStep}
                        onBack={prevStep}
                        canGoBack={currentStep > 1}
                    />
                </div>

                <main className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-4 md:p-6 border-b border-gray-200 bg-gray-50">
                            <h2 className="text-base md:text-lg font-semibold text-gray-800">
                                {STEPS[currentStep - 1].title}
                            </h2>
                            <p className="text-xs md:text-sm text-gray-500">Passo {currentStep} de {STEPS.length}</p>
                        </div>

                        <FormProvider {...methods}>
                            <form ref={formRef} onSubmit={methods.handleSubmit(handleSubmit)} className="p-4 md:p-6">
                                <CurrentComponent />

                                {/* Botões apenas no desktop - mobile usa bottom nav */}
                                <div className="hidden md:flex justify-end pt-8 mt-8 border-t border-gray-100">
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
