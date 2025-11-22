import { Building, Users, Eye, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropertiesList from '../components/PropertiesList';
import Layout from '../components/Layout';
import { API_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import { useMediaQuery } from '../hooks/useMediaQuery';

export default function Dashboard() {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [totalProperties, setTotalProperties] = useState(0);
    const [stats, setStats] = useState(null);
    const isDesktop = useMediaQuery('(min-width: 768px)'); // Grug gosta: renderizar só um componente

    // Buscar estatísticas do dashboard
    useEffect(() => {
        const fetchStats = async () => {
            if (!token) return;
            
            try {
                const statsRes = await fetch(`${API_URL}/api/admin/stats`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (statsRes.ok) {
                    const data = await statsRes.json();
                    setStats(data);
                }
            } catch (err) {
                console.error('Erro ao buscar estatísticas:', err);
            }
        };

        fetchStats();

        // Refresh ao focar na janela
        const handleFocus = () => {
            fetchStats();
        };

        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, [token]);

    const handleEdit = (id) => {
        navigate(`/properties/${id}`);
    };

    return (
        <Layout searchTerm={searchTerm} setSearchTerm={setSearchTerm}>
            <div className="flex-1 overflow-y-auto md:overflow-hidden flex flex-col px-4 md:px-6 py-4 md:py-6 pb-20 md:pb-6 md:min-h-0">

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 flex-shrink-0">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex justify-between items-start relative overflow-hidden group">
                        <div className="z-10">
                            <div className="flex items-center gap-2 mb-4">
                                <h3 className="font-semibold text-gray-700 text-sm">Total de Imóveis</h3>
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">{totalProperties}</div>
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-green-500 font-medium flex items-center">↗ Ativos</span>
                                <span className="text-gray-400">no site</span>
                            </div>
                        </div>
                        <div className="w-24 h-24 rounded-2xl bg-green-100 flex items-center justify-center transform rotate-12 group-hover:rotate-0 transition-transform duration-300">
                            <Building className="w-12 h-12 text-green-600" aria-hidden="true" />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex justify-between items-start relative overflow-hidden group">
                        <div className="z-10">
                            <div className="flex items-center gap-2 mb-4">
                                <h3 className="font-semibold text-gray-700 text-sm">Total de Views</h3>
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">{stats?.total_views || 0}</div>
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-purple-500 font-medium flex items-center">↗ Visualizações</span>
                                <span className="text-gray-400">todas</span>
                            </div>
                        </div>
                        <div className="w-24 h-24 rounded-2xl bg-purple-100 flex items-center justify-center transform rotate-12 group-hover:rotate-0 transition-transform duration-300">
                            <Eye className="w-12 h-12 text-purple-600" aria-hidden="true" />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex justify-between items-start relative overflow-hidden group">
                        <div className="z-10">
                            <div className="flex items-center gap-2 mb-4">
                                <h3 className="font-semibold text-gray-700 text-sm">Leads (7 dias)</h3>
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">{stats?.leads_count || 0}</div>
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-blue-500 font-medium flex items-center">↗ Capturados</span>
                                <span className="text-gray-400">última semana</span>
                            </div>
                        </div>
                        <div className="w-24 h-24 rounded-2xl bg-blue-100 flex items-center justify-center transform rotate-12 group-hover:rotate-0 transition-transform duration-300">
                            <Users className="w-12 h-12 text-blue-600" aria-hidden="true" />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex justify-between items-start relative overflow-hidden group">
                        <div className="z-10">
                            <div className="flex items-center gap-2 mb-4">
                                <h3 className="font-semibold text-gray-700 text-sm">Taxa Conversão</h3>
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">{stats?.conversion_rate || '0.0'}%</div>
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-orange-500 font-medium flex items-center">↗ Eficiência</span>
                                <span className="text-gray-400">views → leads</span>
                            </div>
                        </div>
                        <div className="w-24 h-24 rounded-2xl bg-orange-100 flex items-center justify-center transform rotate-12 group-hover:rotate-0 transition-transform duration-300">
                            <TrendingUp className="w-12 h-12 text-orange-600" aria-hidden="true" />
                        </div>
                    </div>
                </div>

                {/* Top 3 Imóveis Mais Vistos */}
                {stats?.top_properties && stats.top_properties.length > 0 && (
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">🔥 Top 3 Imóveis Mais Vistos</h3>
                        <div className="space-y-3">
                            {stats.top_properties.map((prop, idx) => (
                                <div key={prop.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl font-bold text-primary w-8">#{idx + 1}</span>
                                            <div>
                                                <p className="font-semibold text-gray-900">{prop.title}</p>
                                                <p className="text-sm text-gray-500">
                                                    {prop.views} views • {prop.leads} leads ({prop.conversion_rate}%)
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Properties Section - Grug gosta: renderizar só um componente! */}
                {isDesktop ? (
                    <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col flex-1 min-h-0" role="region" aria-labelledby="properties-heading">
                        <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 flex-shrink-0">
                            <div>
                                <h3 id="properties-heading" className="text-lg md:text-xl font-bold text-gray-900">Seus Imóveis</h3>
                                <p className="text-xs md:text-sm text-gray-500 mt-1">Gerencie sua lista de propriedades exclusivas.</p>
                            </div>
                        </div>
                        <div className="p-0 flex-1 min-h-0 overflow-hidden">
                            <PropertiesList
                                onEdit={handleEdit}
                                refreshTrigger={refreshTrigger}
                                searchTerm={searchTerm}
                                onTotalChange={setTotalProperties}
                            />
                        </div>
                    </section>
                ) : (
                    <div>
                        <PropertiesList
                            onEdit={handleEdit}
                            refreshTrigger={refreshTrigger}
                            searchTerm={searchTerm}
                            onTotalChange={setTotalProperties}
                        />
                    </div>
                )}
            </div>
        </Layout>
    );
}
