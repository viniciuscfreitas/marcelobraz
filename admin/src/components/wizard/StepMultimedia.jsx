import { useState, useEffect } from 'react';
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
    const { uploading, uploadImage } = useImageUpload(token);

    const imageUrl = watch('image');
    const imagesArray = watch('images') || [];
    const multimedia = watch('multimedia') || {};
    const [localImages, setLocalImages] = useState(imagesArray);

    useEffect(() => {
        setLocalImages(imagesArray);
    }, [imagesArray]);

    const handleMultipleUpload = async (e) => {
        e.stopPropagation();
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        // Upload múltiplo (Grug gosta: simples, uma por vez!)
        for (const file of files) {
            try {
                const url = await uploadImage(file);
                if (url) {
                    const newImages = [...localImages, url];
                    setLocalImages(newImages);
                    setValue('images', newImages, { shouldValidate: false });
                    // image principal = primeira foto
                    if (newImages.length === 1) {
                        setValue('image', url, { shouldValidate: false });
                    }
                }
            } catch (error) {
                showToast('Erro ao enviar imagem', 'error');
            }
        }
        e.target.value = '';
    };

    const handleRemoveImageAt = (index) => {
        const newImages = localImages.filter((_, i) => i !== index);
        setLocalImages(newImages);
        setValue('images', newImages, { shouldValidate: false });
        // image principal = primeira foto
        if (newImages.length > 0) {
            setValue('image', newImages[0], { shouldValidate: false });
        } else {
            setValue('image', '', { shouldValidate: false });
        }
    };

    return (
        <div className="space-y-6 md:space-y-8 animate-fade-in pb-4 md:pb-0">
            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

            {/* Fotos do Imóvel */}
            <section className="space-y-4">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">Fotos do Imóvel *</h3>

                <div className="space-y-4">
                    {/* Grid de fotos */}
                    {localImages.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {localImages.map((img, idx) => (
                                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                                    <img src={img} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                                    {idx === 0 && (
                                        <div className="absolute top-1 left-1 bg-primary text-white text-xs px-2 py-1 rounded font-bold">
                                            Capa
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImageAt(idx)}
                                        className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                                        aria-label={`Remover foto ${idx + 1}`}
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Upload */}
                    <div>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleMultipleUpload}
                            className="hidden"
                            id="images-upload"
                            disabled={uploading}
                        />
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (!uploading) {
                                    document.getElementById('images-upload')?.click();
                                }
                            }}
                            disabled={uploading}
                            className={`btn-secondary inline-flex items-center gap-2 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <Upload size={18} />
                            {uploading ? 'Enviando...' : localImages.length > 0 ? 'Adicionar Mais Fotos' : 'Adicionar Fotos'}
                        </button>
                        <p className="text-xs text-gray-500 mt-2">Primeira foto será a capa. Você pode adicionar várias fotos.</p>
                        {errors.images && <p className="text-red-600 text-xs mt-1">{errors.images.message}</p>}
                    </div>
                </div>
                <input type="hidden" {...register('images', { 
                    validate: (v) => (!v || v.length === 0) && (!imageUrl) ? 'Pelo menos uma foto é obrigatória' : true 
                })} />
                <input type="hidden" {...register('image')} />
            </section>

            {/* Links de Mídia */}
            <section className="space-y-4">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">Links de Mídia</h3>

                <div className="grid grid-cols-1 gap-4 md:gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
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
                        <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
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
