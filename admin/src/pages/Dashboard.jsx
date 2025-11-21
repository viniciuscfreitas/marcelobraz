import { Building, Home, LayoutDashboard, LogOut, Plus, Users } from 'lucide-react';
import { useState } from 'react';
import PropertiesList from '../components/PropertiesList';
import PropertyDrawer from '../components/PropertyDrawer';
import { SITE_URL } from '../config';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
    const { user, logout } = useAuth();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedPropertyId, setSelectedPropertyId] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleOpenDrawer = (id = null) => {
        setSelectedPropertyId(id);
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
        setSelectedPropertyId(null);
    };

    const handleSuccess = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div className="h-screen bg-background flex flex-col md:flex-row overflow-hidden">
            {/* Skip Link for Accessibility */}
            <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-gold-dark text-white px-4 py-2 rounded-lg z-50">
                Pular para o conteúdo principal
            </a>

            {/* Sidebar / Navigation */}
            <aside className="w-full md:w-72 bg-primary text-white flex-shrink-0 h-full overflow-y-auto" role="navigation" aria-label="Menu Principal">
                <div className="p-4 border-b border-white/10">
                    <h1 className="text-xl font-bold text-gold">Marcelo Braz</h1>
                    <p className="text-gray-300 text-xs mt-0.5">Painel Administrativo</p>
                </div>

                <nav className="p-3 space-y-1">
                    <a href="#" className="flex items-center gap-2 px-3 py-2 bg-white/10 text-white rounded-lg transition-colors" aria-current="page">
                        <LayoutDashboard size={18} className="text-gold" aria-hidden="true" />
                        <span className="font-medium text-sm">Dashboard</span>
                    </a>
                    <a href="#" className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors">
                        <Users size={18} aria-hidden="true" />
                        <span className="font-medium text-sm">Leads (Em breve)</span>
                    </a>
                    <a href={SITE_URL} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors mt-4">
                        <Home size={18} aria-hidden="true" />
                        <span className="font-medium text-sm">Ver Site</span>
                    </a>
                </nav>

                <div className="p-3 mt-auto border-t border-white/10">
                    <div className="flex items-center gap-2 px-2 py-2">
                        <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-primary font-bold text-sm" aria-hidden="true">
                            {user?.username?.[0]?.toUpperCase()}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-xs font-medium truncate text-white">{user?.username}</p>
                            <button
                                onClick={logout}
                                className="text-xs text-gray-300 hover:text-red-400 flex items-center gap-1 transition-colors focus:outline-none focus:underline"
                                aria-label="Sair da conta"
                            >
                                <LogOut size={11} aria-hidden="true" /> Sair
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main id="main-content" className="flex-1 p-4 md:p-6 flex flex-col overflow-hidden h-full min-h-0" tabIndex="-1" role="main">
                <header className="flex justify-between items-center mb-4 flex-shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold text-primary">Visão Geral</h2>
                        <p className="text-gray-600 text-sm mt-0.5">Bem-vindo ao seu painel de controle.</p>
                    </div>
                    <button
                        onClick={() => handleOpenDrawer()}
                        className="btn-gold shadow-xl shadow-gold/20"
                        aria-label="Adicionar novo imóvel"
                    >
                        <Plus size={18} aria-hidden="true" />
                        Novo Imóvel
                    </button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 flex-shrink-0">
                    {/* Stats Cards */}
                    <div className="bg-white p-4 rounded-xl shadow-lg shadow-gray-100 border border-gray-100 relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-l-4 border-gold">
                        <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity" aria-hidden="true">
                            <Building size={48} className="text-primary" />
                        </div>
                        <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">Total de Imóveis</p>
                        <p className="text-3xl font-bold text-primary mt-1">8</p>
                        <p className="text-xs text-green-700 mt-1 font-medium flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-600" aria-hidden="true"></span> Ativos no site
                        </p>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow-lg shadow-gray-100 border border-gray-100 relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-l-4 border-gray-300">
                        <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity" aria-hidden="true">
                            <Users size={48} className="text-primary" />
                        </div>
                        <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">Leads Capturados</p>
                        <p className="text-3xl font-bold text-primary mt-1">0</p>
                        <p className="text-xs text-gray-500 mt-1 font-medium">
                            Aguardando integração
                        </p>
                    </div>
                </div>

                <section className="bg-white rounded-2xl shadow-xl shadow-gray-100 border border-gray-100 overflow-hidden flex flex-col flex-1 min-h-0" role="region" aria-labelledby="properties-heading">
                    <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 flex-shrink-0">
                        <div>
                            <h3 id="properties-heading" className="text-lg font-bold text-primary">Seus Imóveis</h3>
                            <p className="text-xs text-gray-600 mt-0.5">Gerencie sua lista de propriedades exclusivas.</p>
                        </div>
                    </div>
                    <div className="p-0 flex-1 min-h-0 overflow-hidden">
                        <PropertiesList
                            onEdit={handleOpenDrawer}
                            refreshTrigger={refreshTrigger}
                        />
                    </div>
                </section>
            </main>

            {/* Property Drawer */}
            <PropertyDrawer
                isOpen={isDrawerOpen}
                onClose={handleCloseDrawer}
                propertyId={selectedPropertyId}
                onSuccess={handleSuccess}
            />
        </div>
    );
}
