import { Star, Upload, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useImageUpload } from '../hooks/useImageUpload';
import { useAuth } from '../context/AuthContext';

// Campos do formulário de propriedade - Grug gosta: componente focado, sem lógica complexa
export default function PropertyFormFields({
    register,
    errors,
    imageUrl,
    uploading: parentUploading,
    onImageUpload,
    onRemoveImage,
    loading,
    watch,
    setValue
}) {
    const { token } = useAuth();
    const { uploading, uploadImage } = useImageUpload(token);
    const imagesArray = watch('images') || [];
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
                console.error('Erro ao fazer upload:', error);
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

    const isUploading = uploading || parentUploading;

    return (
        <>
            {/* Upload Múltiplo de Fotos */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fotos do Imóvel *</label>
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
                            disabled={isUploading}
                        />
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (!isUploading) {
                                    document.getElementById('images-upload')?.click();
                                }
                            }}
                            disabled={isUploading}
                            className={`w-full flex justify-center items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors focus:ring-2 focus:ring-gold ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <Upload size={18} />
                            {isUploading ? 'Enviando...' : localImages.length > 0 ? 'Adicionar Mais Fotos' : 'Adicionar Fotos'}
                        </button>
                        <p className="text-xs text-gray-500 mt-1">Primeira foto será a capa. Você pode adicionar várias fotos.</p>
                        {errors.images && <p className="text-red-600 text-xs mt-1">{errors.images.message}</p>}
                    </div>
                </div>
                <input type="hidden" {...register('images', { 
                    validate: (v) => (!v || v.length === 0) && (!imageUrl) ? 'Pelo menos uma foto é obrigatória' : true 
                })} />
                <input type="hidden" {...register('image')} />
            </div>

            <div>
                <label htmlFor="drawer-title" className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
                <input
                    id="drawer-title"
                    {...register('title', { required: 'Título é obrigatório' })}
                    className="input-field"
                    placeholder="Ex: Cobertura Duplex"
                />
                {errors.title && <span className="text-red-600 text-xs mt-1 block">{errors.title.message}</span>}
            </div>

            <div>
                <label htmlFor="drawer-subtitle" className="block text-sm font-medium text-gray-700 mb-1">Subtítulo</label>
                <input
                    id="drawer-subtitle"
                    {...register('subtitle')}
                    className="input-field"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="drawer-price" className="block text-sm font-medium text-gray-700 mb-1">Preço *</label>
                    <input
                        id="drawer-price"
                        {...register('price', { required: 'Obrigatório' })}
                        className="input-field"
                        placeholder="R$ 0,00"
                    />
                    {errors.price && <span className="text-red-600 text-xs mt-1 block">{errors.price.message}</span>}
                </div>
                <div>
                    <label htmlFor="drawer-tipo" className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
                    <select
                        id="drawer-tipo"
                        {...register('tipo', { required: 'Obrigatório' })}
                        className="input-field"
                    >
                        <option value="">Selecione...</option>
                        <option value="Apartamento">Apartamento</option>
                        <option value="Cobertura">Cobertura</option>
                        <option value="Casa">Casa</option>
                        <option value="Garden">Garden</option>
                        <option value="Studio">Studio</option>
                    </select>
                    {errors.tipo && <span className="text-red-600 text-xs mt-1 block">{errors.tipo.message}</span>}
                </div>
            </div>

            <div>
                <label htmlFor="drawer-bairro" className="block text-sm font-medium text-gray-700 mb-1">Bairro *</label>
                <select
                    id="drawer-bairro"
                    {...register('bairro', { required: 'Bairro é obrigatório' })}
                    className="input-field"
                >
                    <option value="">Selecione...</option>
                    <option value="Gonzaga">Gonzaga</option>
                    <option value="Boqueirão">Boqueirão</option>
                    <option value="Ponta da Praia">Ponta da Praia</option>
                    <option value="Embaré">Embaré</option>
                    <option value="Vila Rica">Vila Rica</option>
                    <option value="Vila Belmiro">Vila Belmiro</option>
                    <option value="Morro Sta. Teresinha">Morro Sta. Teresinha</option>
                </select>
                {errors.bairro && <span className="text-red-600 text-xs mt-1 block">{errors.bairro.message}</span>}
            </div>

            <div>
                <label htmlFor="drawer-specs" className="block text-sm font-medium text-gray-700 mb-1">Specs</label>
                <input
                    id="drawer-specs"
                    {...register('specs')}
                    className="input-field"
                    placeholder="Ex: 4 Suítes • 380m²"
                />
            </div>

            <div>
                <label htmlFor="drawer-tags" className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                <input
                    id="drawer-tags"
                    {...register('tags')}
                    className="input-field"
                    placeholder="Separadas por vírgula"
                />
            </div>

            <div className="flex items-center gap-3 p-4 bg-gold/5 rounded-lg border border-gold/20">
                <input
                    type="checkbox"
                    id="drawer-featured"
                    {...register('featured')}
                    className="w-5 h-5 text-gold-dark rounded border-gray-300 focus:ring-gold focus:ring-2"
                />
                <label htmlFor="drawer-featured" className="flex-1 text-sm font-medium text-gray-700 cursor-pointer">
                    <span className="flex items-center gap-2">
                        <Star size={16} className="text-gold-dark" aria-hidden="true" />
                        Adicionar à Curadoria da Semana
                    </span>
                    <span className="block text-xs text-gray-500 mt-1 font-normal">Máximo 4 imóveis podem estar em destaque</span>
                </label>
            </div>
        </>
    );
}

