import { Building, Home, LayoutDashboard, Users } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SITE_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import LeadsList from '../components/LeadsList';

export default function Leads() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className="h-screen bg-[#FAFAFA] font-sans text-slate-800 overflow-hidden">
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
                        className={`w-full aspect-square flex items-center justify-center rounded-xl transition-colors ${
                            location.pathname === '/'
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
                        className={`w-full aspect-square flex items-center justify-center rounded-xl transition-colors ${
                            location.pathname === '/leads'
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

            {/* Main Content */}
            <main className="md:pl-24 h-full flex flex-col overflow-hidden bg-[#FAFAFA]" tabIndex="-1" role="main">
                {/* Header */}
                <header className="bg-white border-b border-gray-100 px-4 md:px-6 py-4 md:py-5 flex-shrink-0">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
                            Leads Capturados
                        </h1>
                        <p className="text-gray-500 mt-1 text-xs md:text-sm">Visualize todos os leads capturados no site</p>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-hidden flex flex-col px-4 md:px-6 py-4 md:py-6 min-h-0 pb-20 md:pb-6">
                    {/* Leads Section */}
                    <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col flex-1 min-h-0" role="region" aria-labelledby="leads-heading">
                        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 flex-shrink-0">
                            <div>
                                <h3 id="leads-heading" className="text-xl font-bold text-gray-900">Lista de Leads</h3>
                                <p className="text-sm text-gray-500 mt-1">Gerencie os leads capturados no site.</p>
                            </div>
                        </div>
                        <div className="p-0 flex-1 min-h-0 overflow-hidden">
                            <LeadsList />
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}

