import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import LeadsList from '../components/LeadsList';
import { AdminSidebar } from '../components/AdminSidebar';
import { SearchHeader } from '../components/SearchHeader';
import { MobileBottomNav } from '../components/MobileBottomNav';

export default function Leads() {
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    return (
        <div className="h-screen bg-[#FAFAFA] font-sans text-slate-800 overflow-hidden">
            <AdminSidebar />

            <main className="md:pl-24 h-full flex flex-col overflow-hidden md:overflow-hidden overflow-y-auto bg-[#FAFAFA]" tabIndex="-1" role="main">
                <SearchHeader
                    title="Leads Capturados"
                    subtitle="Visualize todos os leads capturados no site"
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    isSearchOpen={isSearchOpen}
                    setIsSearchOpen={setIsSearchOpen}
                />

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto md:overflow-hidden flex flex-col px-4 md:px-6 py-4 md:py-6 pb-20 md:pb-6">
                    {/* Desktop: Leads Section */}
                    <section className="hidden md:block bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col flex-1 min-h-0" role="region" aria-labelledby="leads-heading">
                        <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 flex-shrink-0">
                            <div>
                                <h3 id="leads-heading" className="text-lg md:text-xl font-bold text-gray-900">Lista de Leads</h3>
                                <p className="text-xs md:text-sm text-gray-500 mt-1 hidden md:block">Gerencie os leads capturados no site.</p>
                            </div>
                        </div>
                        <div className="p-0 flex-1 min-h-0 overflow-hidden">
                            <LeadsList searchTerm={searchTerm} />
                        </div>
                    </section>

                    {/* Mobile: Cards diretos na tela */}
                    <div className="md:hidden">
                        <LeadsList searchTerm={searchTerm} />
                    </div>
                </div>
            </main>

            <MobileBottomNav currentPath={location.pathname} />
        </div>
    );
}

