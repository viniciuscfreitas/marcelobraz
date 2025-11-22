import { useFormContext } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useViaCep } from '../../hooks/useViaCep';

export default function StepInfo() {
    const { register, formState: { errors }, watch, setValue } = useFormContext();
    const tipo = watch('tipo');
    const transactionType = watch('transaction_type') || 'Venda';
    const cepValue = watch('cep');
    const { buscarCep, loading: cepLoading } = useViaCep();
    const [cepProcessado, setCepProcessado] = useState('');

    // Formata CEP enquanto digita
    const formatarCep = (value) => {
        const cepLimpo = value.replace(/\D/g, '');
        if (cepLimpo.length <= 5) return cepLimpo;
        return `${cepLimpo.slice(0, 5)}-${cepLimpo.slice(5, 8)}`;
    };

    // Busca endereço quando CEP completo (debounce simples)
    useEffect(() => {
        const cepLimpo = cepValue?.replace(/\D/g, '') || '';
        
        // Reset ao limpar CEP
        if (!cepValue || cepLimpo.length < 8) {
            setCepProcessado('');
            return;
        }

        // Debounce simples: só busca após 500ms sem digitar
        const timer = setTimeout(() => {
            if (cepLimpo.length === 8 && cepLimpo !== cepProcessado) {
                buscarCep(cepValue).then((endereco) => {
                    if (endereco) {
                        setCepProcessado(cepLimpo);
                        if (endereco.endereco) setValue('endereco', endereco.endereco);
                        if (endereco.bairro) setValue('bairro', endereco.bairro);
                        if (endereco.cidade) setValue('cidade', endereco.cidade);
                        if (endereco.estado) setValue('estado', endereco.estado);
                        if (endereco.cep) setValue('cep', formatarCep(endereco.cep));
                    }
                });
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [cepValue, buscarCep, setValue, cepProcessado]);

    return (
        <div className="space-y-6 md:space-y-8 animate-fade-in pb-4 md:pb-0">
            {/* Seção 1: Informações Principais */}
            <section className="space-y-4">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">Informações Principais</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="col-span-1 md:col-span-2">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1.5">Título do Anúncio *</label>
                        <input
                            id="title"
                            {...register('title', { required: 'Título é obrigatório' })}
                            className="input-field"
                            placeholder="Ex: Apartamento com 3 suítes no Gonzaga"
                        />
                        {errors.title && <span className="text-red-600 text-xs mt-1 block">{errors.title.message}</span>}
                        <p className="text-xs text-gray-500 mt-1">Inclua o tipo de propriedade e sua principal característica.</p>
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">Descrição</label>
                        <textarea
                            id="description"
                            {...register('description')}
                            rows={4}
                            className="input-field resize-y"
                            placeholder="Conte-nos sobre seu imóvel. Inclua todos os detalhes que o tornam mais atraente..."
                        />
                    </div>

                    <div className="col-span-1">
                        <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-1.5">Tipo de Imóvel *</label>
                        <select
                            id="tipo"
                            {...register('tipo', { required: 'Tipo é obrigatório' })}
                            className="input-field"
                        >
                            <option value="">Selecione...</option>
                            <option value="Apartamento">Apartamento</option>
                            <option value="Casa">Casa</option>
                            <option value="Terreno">Terreno</option>
                            <option value="Rural">Rural</option>
                            <option value="Comercial">Comercial</option>
                        </select>
                        {errors.tipo && <span className="text-red-600 text-xs mt-1 block">{errors.tipo.message}</span>}
                    </div>

                    <div className="col-span-1">
                        <label htmlFor="subtype" className="block text-sm font-medium text-gray-700 mb-1.5">Subtipo</label>
                        <select
                            id="subtype"
                            {...register('subtype')}
                            className="input-field"
                        >
                            <option value="">Selecione...</option>
                            <option value="Padrão">Padrão</option>
                            <option value="Kitnet/Studio">Kitnet/Studio</option>
                            <option value="Loft">Loft</option>
                            <option value="Flat">Flat</option>
                            <option value="Cobertura">Cobertura</option>
                            <option value="Duplex">Duplex</option>
                            <option value="Triplex">Triplex</option>
                            <option value="Garden">Garden</option>
                        </select>
                    </div>

                    <div className="col-span-1">
                        <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1.5">Idade do Imóvel</label>
                        <select
                            id="age"
                            {...register('age')}
                            className="input-field"
                        >
                            <option value="">Selecione...</option>
                            <option value="Breve Lançamento">Breve Lançamento</option>
                            <option value="Na Planta">Na Planta</option>
                            <option value="Em Construção">Em Construção</option>
                            <option value="Novo">Novo</option>
                            <option value="Até 5 anos">Até 5 anos</option>
                            <option value="Entre 5 e 10 anos">Entre 5 e 10 anos</option>
                            <option value="Entre 10 e 20 anos">Entre 10 e 20 anos</option>
                            <option value="Mais de 20 anos">Mais de 20 anos</option>
                        </select>
                    </div>

                    <div className="col-span-1">
                        <label htmlFor="ref_code" className="block text-sm font-medium text-gray-700 mb-1.5">Código de Referência</label>
                        <input
                            id="ref_code"
                            {...register('ref_code')}
                            className="input-field"
                            placeholder="Ex: REF-1234"
                        />
                    </div>
                </div>
            </section>

            {/* Seção 2: Detalhes */}
            <section className="space-y-4">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">Detalhes</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    <div>
                        <label htmlFor="quartos" className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5">Quartos</label>
                        <input type="number" id="quartos" {...register('quartos')} className="input-field" min="0" />
                    </div>
                    <div>
                        <label htmlFor="suites" className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5">Suítes</label>
                        <input type="number" id="suites" {...register('suites')} className="input-field" min="0" />
                    </div>
                    <div>
                        <label htmlFor="banheiros" className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5">Banheiros</label>
                        <input type="number" id="banheiros" {...register('banheiros')} className="input-field" min="0" />
                    </div>
                    <div>
                        <label htmlFor="vagas" className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5">Vagas</label>
                        <input type="number" id="vagas" {...register('vagas')} className="input-field" min="0" />
                    </div>
                    <div>
                        <label htmlFor="area_util" className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5">Área Útil (m²)</label>
                        <input type="number" id="area_util" {...register('area_util')} className="input-field" min="0" step="0.01" />
                    </div>
                    <div>
                        <label htmlFor="area_total" className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5">Área Total (m²)</label>
                        <input type="number" id="area_total" {...register('area_total')} className="input-field" min="0" step="0.01" />
                    </div>
                </div>
            </section>

            {/* Seção 3: Valores */}
            <section className="space-y-4">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">Valores</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    <div>
                        <label htmlFor="transaction_type" className="block text-sm font-medium text-gray-700 mb-1.5">Tipo de Anúncio *</label>
                        <select
                            id="transaction_type"
                            {...register('transaction_type', { required: 'Tipo de anúncio é obrigatório' })}
                            className="input-field"
                            defaultValue="Venda"
                        >
                            <option value="Venda">Venda</option>
                            <option value="Aluguel">Aluguel</option>
                            <option value="Temporada">Temporada</option>
                            <option value="Leilão">Leilão</option>
                        </select>
                        {errors.transaction_type && <span className="text-red-600 text-xs mt-1 block">{errors.transaction_type.message}</span>}
                    </div>
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1.5">
                            Valor de {transactionType === 'Aluguel' ? 'Locação' : transactionType === 'Temporada' ? 'Temporada' : transactionType === 'Leilão' ? 'Leilão' : 'Venda'} *
                        </label>
                        <input
                            id="price"
                            {...register('price', { required: 'Preço é obrigatório' })}
                            className="input-field"
                            placeholder="R$ 0,00"
                        />
                        {errors.price && <span className="text-red-600 text-xs mt-1 block">{errors.price.message}</span>}
                    </div>
                    <div>
                        <label htmlFor="condominio" className="block text-sm font-medium text-gray-700 mb-1.5">Condomínio</label>
                        <input
                            id="condominio"
                            {...register('condominio')}
                            className="input-field"
                            placeholder="R$ 0,00"
                        />
                    </div>
                    <div>
                        <label htmlFor="iptu" className="block text-sm font-medium text-gray-700 mb-1.5">IPTU</label>
                        <input
                            id="iptu"
                            {...register('iptu')}
                            className="input-field"
                            placeholder="R$ 0,00"
                        />
                    </div>
                </div>
            </section>

            {/* Seção 4: Localização */}
            <section className="space-y-4">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">Localização</h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6">
                    <div className="md:col-span-3">
                        <label htmlFor="cep" className="block text-sm font-medium text-gray-700 mb-1.5">
                            CEP
                            {cepLoading && <span className="ml-2 text-xs text-gray-500">(buscando...)</span>}
                        </label>
                        <input 
                            id="cep" 
                            {...register('cep')} 
                            className="input-field" 
                            placeholder="00000-000"
                            maxLength={9}
                            onChange={(e) => {
                                const formatted = formatarCep(e.target.value);
                                setValue('cep', formatted, { shouldValidate: false, shouldDirty: true });
                            }}
                        />
                        <p className="text-xs text-gray-500 mt-1">Digite o CEP para preencher automaticamente</p>
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="bairro" className="block text-sm font-medium text-gray-700 mb-1.5">Bairro *</label>
                        <input
                            id="bairro"
                            {...register('bairro', { required: 'Bairro é obrigatório' })}
                            className="input-field"
                            placeholder="Ex: Gonzaga"
                        />
                        {errors.bairro && <span className="text-red-600 text-xs mt-1 block">{errors.bairro.message}</span>}
                    </div>
                    <div className="md:col-span-3">
                        <label htmlFor="cidade" className="block text-sm font-medium text-gray-700 mb-1.5">Cidade</label>
                        <input id="cidade" {...register('cidade')} className="input-field" placeholder="Ex: Santos" />
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1.5">Estado</label>
                        <input id="estado" {...register('estado')} className="input-field" placeholder="Ex: SP" maxLength={2} />
                    </div>
                    <div className="col-span-1 md:col-span-5">
                        <label htmlFor="endereco" className="block text-sm font-medium text-gray-700 mb-1.5">Endereço</label>
                        <input id="endereco" {...register('endereco')} className="input-field" placeholder="Rua, Número" />
                    </div>
                    <div className="col-span-1 md:col-span-5">
                        <label htmlFor="complemento" className="block text-sm font-medium text-gray-700 mb-1.5">Complemento</label>
                        <input id="complemento" {...register('complemento')} className="input-field" placeholder="Apto, Bloco" />
                    </div>
                    <div className="col-span-1 md:col-span-5">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="mostrar_endereco"
                                {...register('mostrar_endereco')}
                                className="rounded border-gray-300 text-gold focus:ring-gold"
                            />
                            <label htmlFor="mostrar_endereco" className="text-sm text-gray-700">Mostrar endereço exato no site</label>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
