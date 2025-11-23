import { Building, Home, LayoutDashboard, Users } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SITE_URL } from '../config';
import { useAuth } from '../context/AuthContext';

/**
 * Sidebar do Admin
 * Grug gosta: componente focado, < 150 linhas
 */
export const AdminSidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <aside className="hidden md:flex w-24 bg-white h-screen fixed left-0 top-0 flex-col items-center py-8 shadow-sm border-r border-gray-100 z-20" role="navigation" aria-label="Menu Principal">
            <div className="mb-10 p-2 bg-gold-dark rounded-xl shadow-lg shadow-gold/20">
                <Building className="text-white w-6 h-6" aria-hidden="true" />
            </div>

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
    );
};





