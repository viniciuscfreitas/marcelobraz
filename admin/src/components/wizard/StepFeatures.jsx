import { useFormContext } from 'react-hook-form';

export default function StepFeatures() {
    const { register } = useFormContext();

    const CheckboxGroup = ({ title, items, prefix }) => (
        <div className="space-y-3">
            <h4 className="font-medium text-gray-900 text-xs md:text-sm uppercase tracking-wide">{title}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
                {items.map((item) => (
                    <div key={item} className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id={`${prefix}.${item}`}
                            {...register(`features.${prefix}.${item}`)}
                            className="rounded border-gray-300 text-gold focus:ring-gold"
                        />
                        <label htmlFor={`${prefix}.${item}`} className="text-sm text-gray-600 cursor-pointer select-none">
                            {item}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="space-y-6 md:space-y-8 animate-fade-in pb-4 md:pb-0">
            {/* Características Gerais */}
            <section className="space-y-4">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">Características Gerais</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="aceita_permuta"
                            {...register('aceita_permuta')}
                            className="rounded border-gray-300 text-gold focus:ring-gold"
                        />
                        <label htmlFor="aceita_permuta" className="text-sm font-medium text-gray-700">Aceita Permuta</label>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="aceita_fgts"
                            {...register('aceita_fgts')}
                            className="rounded border-gray-300 text-gold focus:ring-gold"
                        />
                        <label htmlFor="aceita_fgts" className="text-sm font-medium text-gray-700">Aceita FGTS</label>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                        <label htmlFor="posicao_apto" className="block text-sm font-medium text-gray-700 mb-1.5">Posição do Imóvel</label>
                        <select id="posicao_apto" {...register('posicao_apto')} className="input-field w-full">
                            <option value="">Selecione...</option>
                            <option value="Frente">Frente</option>
                            <option value="Fundos">Fundos</option>
                            <option value="Lateral">Lateral</option>
                            <option value="Meio">Meio</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="andares" className="block text-sm font-medium text-gray-700 mb-1.5">Andares</label>
                        <input id="andares" {...register('andares')} className="input-field w-full" placeholder="Ex: 12 andares" />
                    </div>
                </div>
            </section>

            {/* Áreas Comuns */}
            <section className="space-y-4 md:space-y-6">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">Áreas Comuns e Lazer</h3>
                <CheckboxGroup
                    title="Lazer e Comodidades"
                    prefix="common"
                    items={[
                        'Acesso para deficientes', 'Área de Lazer', 'Área verde', 'Biblioteca', 'Brinquedoteca',
                        'Bicicletário', 'Câmeras de segurança', 'Campo de futebol', 'Campo de golfe', 'Churrasqueira',
                        'Elevador', 'Espaço Gourmet', 'Estacionamento para visitas', 'Fitness/Sala de Ginástica',
                        'Guarita', 'Lavanderia', 'Piscina', 'Playground', 'Portaria 24 horas', 'Quadra poliesportiva',
                        'Salão de festas', 'Salão de jogos', 'Sauna', 'Sistema de alarme', 'Solarium', 'SPA',
                        'Vestiário', 'Vigilância 24h', 'Próximo ao metrô', 'Quadra de Tênis', 'Frente para o mar'
                    ]}
                />
            </section>

            {/* Áreas Privativas */}
            <section className="space-y-4 md:space-y-6">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">Áreas Privativas</h3>
                <CheckboxGroup
                    title="Conforto e Acabamento"
                    prefix="private"
                    items={[
                        'Aquecedor', 'Aquecimento central', 'Ar condicionado', 'Área de serviço', 'Biblioteca',
                        'Churrasqueira', 'Closet', 'Cozinha americana', 'Cozinha Gourmet', 'Cozinha independente',
                        'Dependência de empregados', 'Despensa', 'Entrada de serviço', 'Escritório', 'Espaço Gourmet',
                        'Freezer', 'Geladeira', 'Hidromassagem', 'Internet Wireless', 'Lareira', 'Lava-louça',
                        'Lavanderia', 'Mezanino', 'Microondas', 'Mobiliado', 'Permite animais', 'Piscina',
                        'Playground', 'Roupa de cama', 'Sala de jantar', 'Sistema de alarme', 'Suítes',
                        'Telefone', 'TV', 'Varanda'
                    ]}
                />
            </section>
        </div>
    );
}
