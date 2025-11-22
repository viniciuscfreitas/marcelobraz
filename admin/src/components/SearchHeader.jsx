import { Search } from 'lucide-react';

/**
 * Header com busca expansível
 * Grug gosta: componente focado, < 150 linhas
 */
export const SearchHeader = ({ title, subtitle, searchTerm, setSearchTerm, isSearchOpen, setIsSearchOpen }) => {
    return (
        <header className="bg-white border-b border-gray-100 px-4 md:px-6 py-2 md:py-5 flex-shrink-0">
            <div className="flex flex-row md:flex-row items-center gap-2 md:gap-4">
                <div className={`flex-1 transition-all duration-300 ${isSearchOpen ? 'opacity-0 md:opacity-100 scale-95 md:scale-100 max-w-0 md:max-w-none overflow-hidden md:overflow-visible' : 'opacity-100 scale-100 max-w-full'}`}>
                    <h1 className="text-lg md:text-3xl font-bold text-gray-900 flex items-center gap-2 whitespace-nowrap">
                        {title}
                    </h1>
                    {subtitle && <p className="text-gray-500 text-xs md:text-sm hidden md:block">{subtitle}</p>}
                </div>

                <div className={`transition-all duration-300 ease-in-out ${
                    isSearchOpen
                        ? 'flex-1 md:flex-[2] min-w-0 md:min-w-[calc(50%+390px)]'
                        : 'w-auto'
                }`}>
                    {isSearchOpen ? (
                        <div className="bg-gray-50 flex items-center px-4 md:px-5 h-10 md:h-12 rounded-2xl border border-gray-100 transition-all duration-300 ease-in-out">
                            <Search className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" aria-hidden="true" />
                            <input
                                id="search-bar-input"
                                type="text"
                                placeholder="Busque por nome, telefone, imóvel ou tipo..."
                                className="w-full outline-none text-sm font-medium text-gray-700 placeholder-gray-400 bg-transparent transition-all h-full"
                                style={{ outline: 'none', boxShadow: 'none' }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                autoFocus
                                aria-label="Buscar leads"
                            />
                            <button
                                onClick={() => {
                                    setIsSearchOpen(false);
                                    setSearchTerm('');
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
                            aria-label="Buscar leads"
                            aria-expanded={false}
                        >
                            <Search className="w-4 h-4 md:w-5 md:h-5" aria-hidden="true" />
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};

