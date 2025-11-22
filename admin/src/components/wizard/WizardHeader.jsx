import { ArrowLeft, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Header do Wizard com indicador de steps
 * Grug gosta: componente focado, < 150 linhas
 */
export const WizardHeader = ({ isEditing, currentStep, onBack, canGoBack = true }) => {
    const navigate = useNavigate();
    const STEPS = [
        { id: 1, title: 'Informações Principais' },
        { id: 2, title: 'Características' },
        { id: 3, title: 'Multimídia' },
    ];

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate('/');
        }
    };

    return (
        <div className="max-w-4xl mx-auto mb-6 md:mb-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 md:gap-4">
                    {canGoBack && (
                        <button
                            onClick={handleBack}
                            className="text-gray-500 hover:text-primary transition-colors p-2 rounded-full hover:bg-gray-100 focus:ring-2 focus:ring-gold focus:ring-offset-2"
                            aria-label="Voltar"
                        >
                            <ArrowLeft size={20} />
                        </button>
                    )}
                    <h1 className="text-lg md:text-xl font-bold text-primary font-serif">
                        {isEditing ? 'Editar Imóvel' : 'Anunciar Imóvel'}
                    </h1>
                </div>

                <div className="flex items-center gap-1 md:gap-2">
                    {STEPS.map((step) => (
                        <div key={step.id} className="flex items-center">
                            <div
                                className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-medium transition-colors
                                    ${currentStep === step.id ? 'bg-primary text-white' :
                                        currentStep > step.id ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'}`}
                            >
                                {currentStep > step.id ? <Check size={14} className="md:w-4 md:h-4" /> : step.id}
                            </div>
                            {step.id < STEPS.length && (
                                <div className={`w-6 md:w-8 h-0.5 mx-0.5 md:mx-1 ${currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'}`} />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

