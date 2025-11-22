import { useFormContext } from 'react-hook-form';
import { Upload, X, Image as ImageIcon, Video, Map } from 'lucide-react';
import { useImageUpload } from '../../hooks/useImageUpload';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';
import Toast from '../Toast';

export default function StepMultimedia() {
    const { register, watch, setValue, formState: { errors } } = useFormContext();
    const { token } = useAuth();
    const { toast, showToast, hideToast } = useToast();
    const { uploading, uploadImage } = useImageUpload(token, (url) => {
        // Callback genérico, vamos lidar com cada campo individualmente
    });

    const imageUrl = watch('image');
    const multimedia = watch('multimedia') || {};

    const handleMainImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const url = await uploadImage(file);
            setValue('image', url);
        } catch (error) {
            showToast('Erro ao enviar imagem', 'error');
        }
    };

    // Grug note: Por enquanto, apenas URLs para vídeos e tour, e upload simples para planta
    // No futuro, podemos implementar upload múltiplo de fotos (galeria)

    return (
        <div className="space-y-8 animate-fade-in">
            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

            {/* Imagem Principal */}
            <section className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">Imagem Principal (Capa)</h3>

                <div className="flex items-start gap-6">
                    {imageUrl ? (
                        <div className="relative w-64 h-40 rounded-lg overflow-hidden border border-gray-200 group">
                            <img src={imageUrl} alt="Capa" className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => setValue('image', '')}
                                className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ) : (
                        <div className="w-64 h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 bg-gray-50">
                            <ImageIcon size={32} className="mb-2" />
                            <span className="text-sm">Nenhuma imagem</span>
                        </div>
                    )}

                    <div className="flex-1">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleMainImageUpload}
                            className="hidden"
                            id="main-image-upload"
                            disabled={uploading}
                        />
                        <label
                            htmlFor="main-image-upload"
                            className={`btn-secondary inline-flex items-center gap-2 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <Upload size={18} />
                            {uploading ? 'Enviando...' : 'Escolher Capa'}
                        </label>
                        {errors.image && <p className="text-red-600 text-xs mt-2">{errors.image.message}</p>}
                    </div>
                </div>
            </section>

            {/* Links de Mídia */}
            <section className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">Links de Mídia</h3>

                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                            <Video size={16} />
                            Link do Vídeo (YouTube/Vimeo)
                        </label>
                        <input
                            {...register('multimedia.video_url')}
                            className="input-field"
                            placeholder="https://youtube.com/watch?v=..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                            <Map size={16} />
                            Link do Tour Virtual 360º
                        </label>
                        <input
                            {...register('multimedia.tour_url')}
                            className="input-field"
                            placeholder="https://matterport.com/..."
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}
