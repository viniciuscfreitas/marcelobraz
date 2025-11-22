import { Building, Home, LayoutDashboard, Plus, Search, Users } from 'lucide-react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SITE_URL } from '../config';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children, searchTerm, setSearchTerm, showSearch = true, fabButton }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const handleOpenWizard = () => {
        navigate('/properties/new');
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
                        onClick={() => navigate('/')}
                        className={`w-full aspect-square flex items-center justify-center rounded-xl transition-colors ${location.pathname === '/'
                                ? 'bg-gold/10 text-gold'
                                : 'text-gray-400 hover:bg-gray-50 hover:text-gold'
                            }`}
                        aria-label="Dashboard"
                        aria-current={location.pathname === '/' ? 'page' : undefined}
                    >
                        <LayoutDashboard className="w-6 h-6" aria-hidden="true" />
                    </button>
                    <button
                        onClick={() => navigate('/leads')}
                        className={`w-full aspect-square flex items-center justify-center rounded-xl transition-colors ${location.pathname === '/leads'
                                ? 'bg-gold/10 text-gold'
                                : 'text-gray-400 hover:bg-gray-50 hover:text-gold'
                            }`}
                        aria-label="Leads"
                        aria-current={location.pathname === '/leads' ? 'page' : undefined}
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
                        {user?.name?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase()}
                    </div>
                </button>
            </aside>

            {/* Main Content Wrapper */}
            <div className="md:pl-24 h-full flex flex-col overflow-hidden bg-[#FAFAFA]">
                {/* Header */}
                <header className="bg-white border-b border-gray-100 px-4 md:px-6 py-2 md:py-5 flex-shrink-0">
                    <div className="flex flex-row md:flex-row items-center gap-2 md:gap-4">
                        {/* Saudação - Esconde quando busca expandida */}
                        <div className={`flex-1 transition-all duration-300 ${isSearchOpen ? 'opacity-0 md:opacity-100 scale-95 md:scale-100 max-w-0 md:max-w-none overflow-hidden md:overflow-visible' : 'opacity-100 scale-100 max-w-full'}`}>
                            <h1 className="text-lg md:text-3xl font-bold text-gray-900 flex items-center gap-2 whitespace-nowrap">
                                Olá, {user?.name}! <span className="animate-bounce hidden md:inline">👋</span>
                            </h1>
                            <p className="text-gray-500 text-xs md:text-sm hidden md:block">Aqui está o resumo do seu portfólio hoje</p>
                        </div>

                        {/* Botão/Busca */}
                        {showSearch && (
                            <div className={`transition-all duration-300 ease-in-out ${isSearchOpen
                                    ? 'flex-1 md:flex-[2] min-w-0 md:min-w-[calc(50%+390px)]'
                                    : 'w-auto'
                                }`}>
                                {isSearchOpen ? (
                                    <div className="bg-gray-50 flex items-center px-4 md:px-5 h-10 md:h-12 rounded-2xl border border-gray-100 transition-all duration-300 ease-in-out">
                                        <Search className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" aria-hidden="true" />
                                        <input
                                            id="search-bar-input"
                                            type="text"
                                            placeholder="Busque por título, bairro, tipo ou preço..."
                                            className="w-full outline-none text-sm font-medium text-gray-700 placeholder-gray-400 bg-transparent transition-all h-full"
                                            style={{ outline: 'none', boxShadow: 'none' }}
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm && setSearchTerm(e.target.value)}
                                            autoFocus
                                            aria-label="Buscar imóveis"
                                        />
                                        <button
                                            onClick={() => {
                                                setIsSearchOpen(false);
                                                if (setSearchTerm) setSearchTerm('');
                                            }}
                                            className="ml-2 p-1.5 rounded-full hover:bg-gray-200 transition-colors"
                                            aria-label="Fechar busca"
                                        >
                                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setIsSearchOpen(true)}
                                        className="p-2 md:p-3 rounded-full shadow-sm border border-gray-100 bg-white hover:bg-gray-50 text-gray-600 transition-all focus:ring-2 focus:ring-gold focus:ring-offset-2"
                                        aria-label="Buscar imóveis"
                                        aria-expanded={false}
                                    >
                                        <Search className="w-4 h-4 md:w-5 md:h-5" aria-hidden="true" />
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Botão Novo Imóvel - Oculto no mobile */}
                        <div className={`hidden md:flex items-center gap-3 md:gap-4 transition-all duration-300 ${isSearchOpen ? 'opacity-0 md:opacity-100 scale-95 md:scale-100 max-w-0 md:max-w-none overflow-hidden md:overflow-visible' : 'opacity-100 scale-100 max-w-full'}`}>
                            <button
                                onClick={handleOpenWizard}
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

                {/* Main Content Injection */}
                <main id="main-content" className="flex-1 overflow-hidden flex flex-col" role="main">
                    {children}
                </main>
            </div>

            {/* Mobile Bottom Nav */}
            <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 px-6 py-3 pb-6 flex justify-between items-end z-50 rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
                <button
                    onClick={() => navigate('/')}
                    className={`flex flex-col items-center gap-1 ${location.pathname === '/' ? 'text-gray-800' : 'text-gray-400'}`}
                >
                    <LayoutDashboard className="w-6 h-6" strokeWidth={2.5} aria-hidden="true" />
                    <span className="text-[10px] font-bold">Home</span>
                </button>

                <button
                    onClick={() => navigate('/leads')}
                    className={`flex flex-col items-center gap-1 ${location.pathname === '/leads' ? 'text-gray-800' : 'text-gray-400'}`}
                >
                    <Users className="w-6 h-6" aria-hidden="true" />
                    <span className="text-[10px] font-medium">Leads</span>
                </button>

                {/* FAB Button - Customizado no wizard, padrão nas outras páginas */}
                <div className="relative -top-6">
                    {fabButton ? (
                        fabButton
                    ) : (
                        <>
                            <button
                                onClick={handleOpenWizard}
                                className="w-14 h-14 bg-gold-dark rounded-full flex items-center justify-center text-white shadow-xl shadow-gold/20 active:scale-95 transition-transform focus:ring-2 focus:ring-offset-2 focus:ring-gold"
                                aria-label="Adicionar novo imóvel"
                            >
                                <Plus className="w-7 h-7" aria-hidden="true" />
                            </button>
                            <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-[10px] font-bold text-gold-dark whitespace-nowrap">
                                Novo
                            </span>
                        </>
                    )}
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
