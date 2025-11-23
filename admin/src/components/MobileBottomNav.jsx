import { Building, Home, LayoutDashboard, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SITE_URL } from '../config';
import { useAuth } from '../context/AuthContext';

/**
 * Navegação mobile inferior
 * Grug gosta: componente focado, < 150 linhas
 */
export const MobileBottomNav = ({ currentPath }) => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    return (
        <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 px-6 py-3 pb-6 flex justify-between items-end z-50 rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
            <button
                onClick={() => navigate('/')}
                className="flex flex-col items-center gap-1 text-gray-400"
            >
                <LayoutDashboard className="w-6 h-6" aria-hidden="true" />
                <span className="text-[10px] font-medium">Home</span>
            </button>

            <button
                onClick={() => navigate('/leads')}
                className="flex flex-col items-center gap-1 text-gray-800"
            >
                <Users className="w-6 h-6" strokeWidth={2.5} aria-hidden="true" />
                <span className="text-[10px] font-bold">Leads</span>
            </button>

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
    );
};





