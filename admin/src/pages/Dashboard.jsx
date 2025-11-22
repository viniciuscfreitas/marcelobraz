import { Building, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropertiesList from '../components/PropertiesList';
import Layout from '../components/Layout';
import { API_URL } from '../config';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [totalProperties, setTotalProperties] = useState(0);
    const [totalLeads, setTotalLeads] = useState(0);

    // Buscar apenas leads (imóveis vem do PropertiesList via onTotalChange)
    // Grug gosta: uma requisição a menos!
    useEffect(() => {
        const fetchLeads = async () => {
            if (!token) return;
            
            try {
                const leadsRes = await fetch(`${API_URL}/api/leads`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (leadsRes.ok) {
                    const leads = await leadsRes.json();
                    setTotalLeads(leads.length);
                }
            } catch (err) {
                console.error('Erro ao buscar leads:', err);
            }
        };

        fetchLeads();

        // Refresh ao focar na janela
        const handleFocus = () => {
            fetchLeads();
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 flex-shrink-0">
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
                                <h3 className="font-semibold text-gray-700 text-sm">Leads Capturados</h3>
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">{totalLeads}</div>
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-blue-500 font-medium flex items-center">↗ Capturados</span>
                                <span className="text-gray-400">no site</span>
                            </div>
                        </div>
                        <div className="w-24 h-24 rounded-2xl bg-blue-100 flex items-center justify-center transform rotate-12 group-hover:rotate-0 transition-transform duration-300">
                            <Users className="w-12 h-12 text-blue-600" aria-hidden="true" />
                        </div>
                    </div>
                </div>

                {/* Properties Section */}
                <section className="hidden md:block bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden md:flex md:flex-col md:flex-1 md:min-h-0" role="region" aria-labelledby="properties-heading">
                    <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 flex-shrink-0">
                        <div>
                            <h3 id="properties-heading" className="text-lg md:text-xl font-bold text-gray-900">Seus Imóveis</h3>
                            <p className="text-xs md:text-sm text-gray-500 mt-1 hidden md:block">Gerencie sua lista de propriedades exclusivas.</p>
                        </div>
                    </div>
                    <div className="p-0 md:flex-1 md:min-h-0 md:overflow-hidden">
                        <PropertiesList
                            onEdit={handleEdit}
                            refreshTrigger={refreshTrigger}
                            searchTerm={searchTerm}
                            onTotalChange={setTotalProperties}
                        />
                    </div>
                </section>

                {/* Mobile: Cards diretos na tela */}
                <div className="md:hidden">
                    <PropertiesList
                        onEdit={handleEdit}
                        refreshTrigger={refreshTrigger}
                        searchTerm={searchTerm}
                        onTotalChange={setTotalProperties}
                    />
                </div>
            </div>
        </Layout>
    );
}
