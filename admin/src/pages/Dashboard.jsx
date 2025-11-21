import { Building, Home, LayoutDashboard, Plus, Search, Users, List, Calendar, BedDouble } from 'lucide-react';
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
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);

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
        <div className="h-screen bg-[#FAFAFA] font-sans text-slate-800 overflow-hidden">
            {/* Skip Link for Accessibility */}
            <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-gold-dark text-white px-4 py-2 rounded-lg z-50">
                Pular para o conteúdo principal
            </a>

            {/* Desktop Sidebar - Compacta Fixa */}
            <aside className="hidden md:flex w-24 bg-white h-screen fixed left-0 top-0 flex-col items-center py-8 shadow-sm border-r border-gray-100 z-20" role="navigation" aria-label="Menu Principal">
                {/* Logo */}
                <div className="mb-10 p-2 bg-gold-dark rounded-xl shadow-lg shadow-gold/20">
                    <Building className="text-white w-6 h-6" aria-hidden="true" />
                </div>

                {/* Navigation */}
                <nav className="flex-1 flex flex-col gap-6 w-full px-4">
                    <button
                        className="w-full aspect-square flex items-center justify-center rounded-xl bg-gold/10 text-gold transition-colors"
                        aria-label="Dashboard"
                        aria-current="page"
                    >
                        <LayoutDashboard className="w-6 h-6" aria-hidden="true" />
                    </button>
                    <button
                        className="w-full aspect-square flex items-center justify-center rounded-xl text-gray-400 hover:bg-gray-50 hover:text-gold transition-colors"
                        aria-label="Leads (Em breve)"
                        disabled
                    >
                        <Users className="w-6 h-6" aria-hidden="true" />
                    </button>
                    <a
                        href={SITE_URL}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full aspect-square flex items-center justify-center rounded-xl text-gray-400 hover:bg-gray-50 hover:text-gold transition-colors"
                        aria-label="Ver Site"
                    >
                        <Home className="w-6 h-6" aria-hidden="true" />
                    </a>
                </nav>

                {/* User Avatar */}
                <button
                    className="mt-auto mb-4 rounded-full border-2 border-gold-dark p-0.5 hover:border-gold transition-colors focus:ring-2 focus:ring-gold focus:ring-offset-2"
                    aria-label="Menu do usuário"
                    onClick={logout}
                >
                    <div className="w-10 h-10 rounded-full bg-gold-dark flex items-center justify-center text-white font-bold text-sm">
                        {user?.username?.[0]?.toUpperCase()}
                    </div>
                </button>
            </aside>

            {/* Main Content */}
            <main id="main-content" className="md:pl-24 h-full flex flex-col overflow-hidden bg-[#FAFAFA]" tabIndex="-1" role="main">
                {/* Header */}
                <header className="bg-white border-b border-gray-100 px-4 md:px-6 py-4 md:py-5 flex-shrink-0">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex-1">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
                                Olá, {user?.username}! <span className="animate-bounce">👋</span>
                            </h1>
                            <p className="text-gray-500 mt-1 text-xs md:text-sm">Aqui está o resumo do seu portfólio hoje</p>
                        </div>

                        {/* Search Bar - Na mesma linha */}
                        <div className={`flex-1 max-w-md transition-all duration-200 ${isSearchOpen ? 'opacity-100' : 'opacity-0 md:opacity-100 pointer-events-none md:pointer-events-auto'}`}>
                            <div className="bg-gray-50 flex items-center px-4 md:px-5 py-3 md:py-4 rounded-2xl border border-gray-100 focus-within:ring-2 focus-within:ring-gold/50 focus-within:border-gold transition-all">
                                <Search className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" aria-hidden="true" />
                                <input
                                    type="text"
                                    placeholder="Busque por título, bairro ou tipo..."
                                    className="w-full outline-none text-sm font-medium text-gray-700 placeholder-gray-400 bg-transparent"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onFocus={() => setIsSearchOpen(true)}
                                    aria-label="Buscar imóveis"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 md:gap-4">
                            <button
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                                className={`md:hidden p-3 rounded-full shadow-sm border transition-colors focus:ring-2 focus:ring-gold focus:ring-offset-2 ${
                                    isSearchOpen 
                                        ? 'bg-gold/10 border-gold text-gold' 
                                        : 'bg-white border-gray-100 hover:bg-gray-50 text-gray-600'
                                }`}
                                aria-label={isSearchOpen ? "Fechar busca" : "Buscar imóveis"}
                                aria-expanded={isSearchOpen}
                            >
                                <Search className="w-5 h-5" aria-hidden="true" />
                            </button>
                            <button
                                onClick={() => handleOpenDrawer()}
                                className="flex items-center gap-2 bg-gold-dark text-white px-4 md:px-6 py-2.5 md:py-3 rounded-full font-medium shadow-lg shadow-gold/20 hover:bg-gold transition-all focus:ring-2 focus:ring-offset-2 focus:ring-gold text-sm md:text-base"
                                aria-label="Adicionar novo imóvel"
                            >
                                <Plus className="w-4 h-4 md:w-5 md:h-5" aria-hidden="true" />
                                <span className="hidden sm:inline">Novo Imóvel</span>
                                <span className="sm:hidden">Novo</span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-hidden flex flex-col px-4 md:px-6 py-4 md:py-6 min-h-0 pb-20 md:pb-6">

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 flex-shrink-0">
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex justify-between items-start relative overflow-hidden group">
                            <div className="z-10">
                                <div className="flex items-center gap-2 mb-4">
                                    <h3 className="font-semibold text-gray-700 text-sm">Total de Imóveis</h3>
                                </div>
                                <div className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">8</div>
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
                                <div className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">0</div>
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-gray-400 font-medium">Aguardando</span>
                                    <span className="text-gray-400">integração</span>
                                </div>
                            </div>
                            <div className="w-24 h-24 rounded-2xl bg-blue-100 flex items-center justify-center transform rotate-12 group-hover:rotate-0 transition-transform duration-300">
                                <Users className="w-12 h-12 text-blue-600" aria-hidden="true" />
                            </div>
                        </div>
                    </div>

                    {/* Properties Section */}
                    <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col flex-1 min-h-0" role="region" aria-labelledby="properties-heading">
                        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 flex-shrink-0">
                            <div>
                                <h3 id="properties-heading" className="text-xl font-bold text-gray-900">Seus Imóveis</h3>
                                <p className="text-sm text-gray-500 mt-1">Gerencie sua lista de propriedades exclusivas.</p>
                            </div>
                        </div>
                        <div className="p-0 flex-1 min-h-0 overflow-hidden">
                            <PropertiesList
                                onEdit={handleOpenDrawer}
                                refreshTrigger={refreshTrigger}
                                searchTerm={searchTerm}
                            />
                        </div>
                    </section>
                </div>
            </main>

            {/* Property Drawer */}
            <PropertyDrawer
                isOpen={isDrawerOpen}
                onClose={handleCloseDrawer}
                propertyId={selectedPropertyId}
                onSuccess={handleSuccess}
            />

            {/* Mobile Bottom Nav */}
            <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 px-6 py-3 pb-6 flex justify-between items-end z-50 rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
                <button className="flex flex-col items-center gap-1 text-gray-800">
                    <LayoutDashboard className="w-6 h-6" strokeWidth={2.5} aria-hidden="true" />
                    <span className="text-[10px] font-bold">Home</span>
                </button>
                
                <button className="flex flex-col items-center gap-1 text-gray-400">
                    <Users className="w-6 h-6" aria-hidden="true" />
                    <span className="text-[10px] font-medium">Leads</span>
                </button>

                {/* FAB Button */}
                <div className="relative -top-6">
                    <button
                        onClick={() => handleOpenDrawer()}
                        className="w-14 h-14 bg-gold-dark rounded-full flex items-center justify-center text-white shadow-xl shadow-gold/20 active:scale-95 transition-transform focus:ring-2 focus:ring-offset-2 focus:ring-gold"
                        aria-label="Adicionar novo imóvel"
                    >
                        <Plus className="w-7 h-7" aria-hidden="true" />
                    </button>
                    <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-[10px] font-bold text-gold-dark whitespace-nowrap">
                        Novo
                    </span>
                </div>

                <a 
                    href={SITE_URL} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex flex-col items-center gap-1 text-gray-400"
                >
                    <Home className="w-6 h-6" aria-hidden="true" />
                    <span className="text-[10px] font-medium">Site</span>
                </a>

                <button 
                    onClick={logout}
                    className="flex flex-col items-center gap-1 text-gray-400"
                    aria-label="Sair"
                >
                    <Building className="w-6 h-6" aria-hidden="true" />
                    <span className="text-[10px] font-medium">Sair</span>
                </button>
            </div>
        </div>
    );
}
