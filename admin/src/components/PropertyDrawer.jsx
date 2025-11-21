import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { Save, Upload, X } from 'lucide-react';
import { API_URL } from '../config';

export default function PropertyDrawer({ isOpen, onClose, propertyId, onSuccess }) {
    const isEditing = !!propertyId;
    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Observar o campo de imagem para preview
    const imageUrl = watch('image');

    useEffect(() => {
        if (isOpen) {
            if (isEditing) {
                fetchProperty();
            } else {
                reset({
                    title: '',
                    subtitle: '',
                    price: '',
                    bairro: '',
                    tipo: '',
                    specs: '',
                    tags: '',
                    image: ''
                });
            }
        }
    }, [isOpen, propertyId]);

    const fetchProperty = async () => {
        try {
            const res = await fetch(`${API_URL}/api/properties/${propertyId}`);
            const data = await res.json();

            if (data.tags && Array.isArray(data.tags)) {
                data.tags = data.tags.join(', ');
            }

            reset(data);
        } catch (error) {
            console.error('Erro ao buscar imóvel:', error);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await fetch(`${API_URL}/api/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!res.ok) throw new Error('Falha no upload');

            const data = await res.json();
            setValue('image', data.url);
        } catch (error) {
            console.error('Erro no upload:', error);
            alert('Erro ao fazer upload da imagem. Tente novamente.');
        } finally {
            setUploading(false);
        }
    };

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            if (data.tags && typeof data.tags === 'string') {
                data.tags = data.tags.split(',').map(t => t.trim()).filter(t => t);
            }

            const url = isEditing
                ? `${API_URL}/api/properties/${propertyId}`
                : `${API_URL}/api/properties`;

            const method = isEditing ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                onSuccess();
                onClose();
            } else {
                alert('Erro ao salvar imóvel');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao salvar imóvel');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
            <div className="absolute inset-0 overflow-hidden">
                {/* Background overlay */}
                <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} aria-hidden="true"></div>

                <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                    <div className="pointer-events-auto w-screen max-w-md transform transition-transform sm:duration-700">
                        <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                            <div className="px-4 py-6 sm:px-6 border-b border-gray-200">
                                <div className="flex items-start justify-between">
                                    <h2 className="text-lg font-medium text-gray-900" id="slide-over-title">
                                        {isEditing ? 'Editar Imóvel' : 'Novo Imóvel'}
                                    </h2>
                                    <div className="ml-3 flex h-7 items-center">
                                        <button
                                            type="button"
                                            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2"
                                            onClick={onClose}
                                        >
                                            <span className="sr-only">Fechar painel</span>
                                            <X size={24} aria-hidden="true" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="relative mt-6 flex-1 px-4 sm:px-6">
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                    {/* Upload de Imagem */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Imagem Principal *</label>
                                        <div className="space-y-4">
                                            {imageUrl ? (
                                                <div className="relative h-48 rounded-lg overflow-hidden border border-gray-200 group">
                                                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={() => setValue('image', '')}
                                                        className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                                                        aria-label="Remover imagem"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 bg-gray-50">
                                                    <Upload size={32} className="mb-2" />
                                                    <span className="text-sm">Nenhuma imagem</span>
                                                </div>
                                            )}

                                            <div>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="hidden"
                                                    id="drawer-image-upload"
                                                    disabled={uploading}
                                                />
                                                <label
                                                    htmlFor="drawer-image-upload"
                                                    className={`w-full flex justify-center items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors focus-within:ring-2 focus-within:ring-gold ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    tabIndex="0"
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' || e.key === ' ') {
                                                            document.getElementById('drawer-image-upload').click();
                                                        }
                                                    }}
                                                >
                                                    <Upload size={18} />
                                                    {uploading ? 'Enviando...' : 'Escolher Arquivo'}
                                                </label>
                                                {errors.image && <p className="text-red-600 text-xs mt-1">{errors.image.message}</p>}
                                            </div>
                                        </div>
                                        <input type="hidden" {...register('image', { required: 'Imagem é obrigatória' })} />
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

                                    <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium focus:ring-2 focus:ring-gold"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading || uploading}
                                            className="btn-primary flex items-center gap-2"
                                        >
                                            <Save size={18} aria-hidden="true" />
                                            {loading ? 'Salvando...' : 'Salvar'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
