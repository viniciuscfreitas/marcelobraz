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
        <div className="min-h-screen bg-background flex flex-col md:flex-row">
            {/* Skip Link for Accessibility */}
            <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-gold-dark text-white px-4 py-2 rounded-lg z-50">
                Pular para o conteúdo principal
            </a>

            {/* Sidebar / Navigation */}
            <aside className="w-full md:w-72 bg-primary text-white flex-shrink-0 md:min-h-screen" aria-label="Menu Principal">
                <div className="p-8 border-b border-white/10">
                    <h1 className="text-2xl font-bold text-gold">Marcelo Braz</h1>
                    <p className="text-gray-300 text-sm mt-1">Painel Administrativo</p>
                </div>

                <nav className="p-4 space-y-2">
                    <a href="#" className="flex items-center gap-3 px-4 py-3 bg-white/10 text-white rounded-lg transition-colors" aria-current="page">
                        <LayoutDashboard size={20} className="text-gold" aria-hidden="true" />
                        <span className="font-medium">Dashboard</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors">
                        <Users size={20} aria-hidden="true" />
                        <span className="font-medium">Leads (Em breve)</span>
                    </a>
                    <a href={SITE_URL} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors mt-8">
                        <Home size={20} aria-hidden="true" />
                        <span className="font-medium">Ver Site</span>
                    </a>
                </nav>

                <div className="p-4 mt-auto border-t border-white/10">
                    <div className="flex items-center gap-3 px-4 py-3">
                        <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center text-primary font-bold" aria-hidden="true">
                            {user?.username?.[0]?.toUpperCase()}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium truncate text-white">{user?.username}</p>
                            <button
                                onClick={logout}
                                className="text-xs text-gray-300 hover:text-red-400 flex items-center gap-1 mt-0.5 transition-colors focus:outline-none focus:underline"
                                aria-label="Sair da conta"
                            >
                                <LogOut size={12} aria-hidden="true" /> Sair
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main id="main-content" className="flex-1 p-6 md:p-12 flex flex-col overflow-hidden" tabIndex="-1">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h2 className="text-3xl font-bold text-primary">Visão Geral</h2>
                        <p className="text-gray-600 mt-1">Bem-vindo ao seu painel de controle.</p>
                    </div>
                    <button
                        onClick={() => handleOpenDrawer()}
                        className="btn-gold shadow-xl shadow-gold/20"
                    >
                        <Plus size={20} aria-hidden="true" />
                        Novo Imóvel
                    </button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {/* Stats Cards */}
                    <div className="card relative overflow-hidden group hover:shadow-2xl transition-all duration-300 border-l-4 border-gold">
                        <div className="absolute right-0 top-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity" aria-hidden="true">
                            <Building size={64} className="text-primary" />
                        </div>
                        <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">Total de Imóveis</p>
                        <p className="text-4xl font-bold text-primary mt-2">8</p>
                        <p className="text-sm text-green-700 mt-2 font-medium flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-600" aria-hidden="true"></span> Ativos no site
                        </p>
                    </div>

                    <div className="card relative overflow-hidden group hover:shadow-2xl transition-all duration-300 border-l-4 border-gray-300">
                        <div className="absolute right-0 top-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity" aria-hidden="true">
                            <Users size={64} className="text-primary" />
                        </div>
                        <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">Leads Capturados</p>
                        <p className="text-4xl font-bold text-primary mt-2">0</p>
                        <p className="text-sm text-gray-500 mt-2 font-medium">
                            Aguardando integração
                        </p>
                    </div>
                </div>

                <section className="bg-white rounded-2xl shadow-xl shadow-gray-100 border border-gray-100 overflow-hidden flex flex-col flex-1 min-h-0" aria-labelledby="properties-heading">
                    <div className="p-8 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-shrink-0">
                        <div>
                            <h3 id="properties-heading" className="text-xl font-bold text-primary">Seus Imóveis</h3>
                            <p className="text-sm text-gray-600 mt-1">Gerencie sua lista de propriedades exclusivas.</p>
                        </div>
                    </div>
                    <div className="p-0 flex-1 min-h-0">
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
