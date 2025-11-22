import { useState } from 'react';
import { TrendingUp, DollarSign } from 'lucide-react';

/**
 * Calculadora de Financiamento - Grug Brain Style
 * 50 linhas, zero dependências externas, funciona!
 */
export const FinancingCalculator = ({ property }) => {
    // Parse do preço (remove R$, pontos, etc)
    const propertyPrice = property.price
        ? parseFloat(property.price.replace(/[^0-9]/g, ''))
        : 0;

    if (!propertyPrice || propertyPrice === 0) return null;

    const [entrada, setEntrada] = useState(Math.floor(propertyPrice * 0.2)); // 20% padrão
    const [prazo, setPrazo] = useState(30); // 30 anos padrão
    const taxa = 0.009; // 0.9% ao mês (~11.3% ao ano - média 2025)

    // Tabela Price: P = VP × (i × (1 + i)^n) / ((1 + i)^n - 1)
    const valorFinanciado = propertyPrice - entrada;
    const meses = prazo * 12;
    const parcela = valorFinanciado *
        (taxa * Math.pow(1 + taxa, meses)) /
        (Math.pow(1 + taxa, meses) - 1);

    const totalPago = parcela * meses + entrada;
    const jurosTotal = totalPago - propertyPrice;

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
            <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="text-blue-600" size={24} />
                <h3 className="text-xl font-bold text-gray-900">Simule seu Financiamento</h3>
            </div>

            <div className="space-y-4">
                {/* Entrada */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-gray-700">Entrada (mínimo 20%)</label>
                        <span className="text-lg font-bold text-blue-600">
                            {(entrada / propertyPrice * 100).toFixed(0)}%
                        </span>
                    </div>
                    <input
                        type="range"
                        min={Math.floor(propertyPrice * 0.2)}
                        max={Math.floor(propertyPrice * 0.8)}
                        step={1000}
                        value={entrada}
                        onChange={(e) => setEntrada(Number(e.target.value))}
                        className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <p className="text-sm text-gray-600 mt-1">
                        R$ {entrada.toLocaleString('pt-BR')}
                    </p>
                </div>

                {/* Prazo */}
                <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">
                        Prazo do financiamento
                    </label>
                    <select
                        value={prazo}
                        onChange={(e) => setPrazo(Number(e.target.value))}
                        className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                        <option value={15}>15 anos</option>
                        <option value={20}>20 anos</option>
                        <option value={25}>25 anos</option>
                        <option value={30}>30 anos</option>
                        <option value={35}>35 anos</option>
                    </select>
                </div>

                {/* Resultado */}
                <div className="bg-white rounded-xl p-4 border-2 border-blue-200 mt-6">
                    <div className="text-center">
                        <p className="text-sm text-gray-600 mb-1">Parcela estimada</p>
                        <div className="flex items-center justify-center gap-2">
                            <DollarSign className="text-green-600" size={28} />
                            <p className="text-3xl font-bold text-gray-900">
                                {parcela.toLocaleString('pt-BR', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })}
                            </p>
                            <span className="text-gray-500">/mês</span>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-4 text-xs text-gray-600">
                        <div>
                            <p className="font-medium">Total pago:</p>
                            <p className="font-bold text-gray-900">R$ {totalPago.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}</p>
                        </div>
                        <div>
                            <p className="font-medium">Juros total:</p>
                            <p className="font-bold text-orange-600">R$ {jurosTotal.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}</p>
                        </div>
                    </div>
                </div>

                <p className="text-xs text-center text-gray-500 mt-4">
                    ⚠️ Simulação aproximada com taxa de 0.9% a.m. (11.3% a.a.).<br />
                    Taxa final depende da análise de crédito do banco.
                </p>
            </div>
        </div>
    );
};
