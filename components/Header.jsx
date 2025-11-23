import React, { useState, useEffect } from 'react';

// ==================================================================================
// 🎨 ASSETS & CONSTANTS (Autocontidos para o Preview)
// ==================================================================================

const BROKER_INFO = { whatsapp_link: '#' };

const NAV_LINKS = [
  { id: 'home', label: 'Início' },
  { id: 'about', label: 'Sobre' },
  { id: 'properties', label: 'Destaques' },
  { id: 'contact', label: 'Contato' },
];

// --- Ícones SVG Inline (Premium Style - Acessíveis) ---
const Icons = {
    Menu: ({ className }) => <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>,
    X: ({ className }) => <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>,
    WhatsApp: ({ className }) => <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" /></svg>,
    ChevronRight: ({ className }) => <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6"/></svg>,
    ArrowRight: ({ className }) => <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>,
};

// --- Componentes Internos ---

const Button = ({ children, variant = 'primary', className, onClick, ...props }) => {
    // Adicionado focus-visible ring para acessibilidade de teclado
    const base = "px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 text-sm tracking-wide";
    
    const variants = {
        // Cor ajustada para contraste (Gold mais escuro para texto ou fundo)
        primary: "bg-[#856404] text-white hover:bg-[#6d5203] hover:shadow-lg shadow-md focus-visible:ring-[#856404]",
        outline: "bg-transparent border border-current hover:bg-white/10 focus-visible:ring-white/50",
        ghost: "bg-transparent hover:bg-gray-100 text-gray-700 focus-visible:ring-gray-500",
        white: "bg-white text-[#0f172a] hover:bg-gray-50 shadow-sm hover:shadow-md focus-visible:ring-white"
    };

    return (
        <button 
            onClick={onClick} 
            className={`${base} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

const NavLink = ({ item, onClick, isScrolled, isActive }) => (
    <button 
        onClick={onClick}
        className={`group relative px-2 py-1 text-sm font-medium transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-sm ${
            isScrolled 
                ? 'text-gray-700 hover:text-[#856404] focus-visible:ring-[#856404]' 
                : 'text-white/90 hover:text-white focus-visible:ring-white'
        } ${isActive ? (isScrolled ? 'text-[#856404] font-bold' : 'text-white font-bold') : ''}`}
        aria-current={isActive ? 'page' : undefined}
    >
        {item.label}
        <span className={`absolute inset-x-0 bottom-0 h-0.5 transform origin-left transition-transform duration-300 ease-out ${
            isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
        } ${isScrolled ? 'bg-[#856404]' : 'bg-white'}`}></span>
    </button>
);

// ==================================================================================
// 🚀 HEADER PRINCIPAL
// ==================================================================================

export const Header = ({ isScrolled: externalIsScrolled, mobileMenuOpen, setMobileMenuOpen, navigateTo, currentView }) => {
    const [internalIsScrolled, setInternalIsScrolled] = useState(false);
    const isScrolled = externalIsScrolled ?? internalIsScrolled;

    useEffect(() => {
        if (externalIsScrolled === undefined) {
            const handleScroll = () => setInternalIsScrolled(window.scrollY > 20);
            window.addEventListener('scroll', handleScroll);
            return () => window.removeEventListener('scroll', handleScroll);
        }
    }, [externalIsScrolled]);

    const handleNavClick = (view, id) => {
        if (setMobileMenuOpen) setMobileMenuOpen(false);
        navigateTo(view, id);
    };

    return (
        <>
            <header 
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out border-b ${
                    isScrolled 
                        ? 'bg-white/95 backdrop-blur-md border-gray-200/50 py-3 shadow-sm text-[#0f172a]' 
                        : 'bg-gradient-to-b from-black/80 to-transparent border-transparent py-6 text-white'
                }`}
                role="banner"
            >
                <div className="container mx-auto px-6 flex justify-between items-center">
                    
                    {/* LOGO */}
                    <button 
                        onClick={() => handleNavClick('home')} 
                        className="group flex flex-col items-start leading-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#856404] rounded p-1"
                        aria-label="Marcelo Braz Private Broker - Voltar ao início"
                    >
                        <div className="flex items-center gap-0.5" aria-hidden="true">
                            <span className={`text-2xl font-serif font-bold tracking-tight transition-colors ${
                                isScrolled ? 'text-[#0f172a]' : 'text-white'
                            }`}>
                                MARCELO
                            </span>
                            <span className={`text-2xl font-serif font-bold tracking-tight transition-colors ${
                                isScrolled ? 'text-[#856404]' : 'text-[#d4af37]' // Contraste ajustado no dark
                            }`}>
                                BRAZ
                            </span>
                        </div>
                        <span className={`text-[10px] uppercase tracking-[0.25em] font-medium ml-0.5 transition-colors ${
                            isScrolled ? 'text-gray-600' : 'text-gray-300'
                        }`} aria-hidden="true">
                            Private Broker
                        </span>
                    </button>

                    {/* DESKTOP NAV */}
                    <nav className="hidden md:flex items-center gap-8" aria-label="Navegação principal">
                        <div className="flex items-center gap-6 mr-4">
                            {NAV_LINKS.map((item) => (
                                <NavLink
                                    key={item.id}
                                    item={item}
                                    onClick={() => handleNavClick('home', item.id)}
                                    isScrolled={isScrolled}
                                    isActive={false}
                                />
                            ))}
                            
                            <NavLink
                                item={{ label: 'Portfólio Exclusivo' }}
                                onClick={() => handleNavClick('portfolio')}
                                isScrolled={isScrolled}
                                isActive={currentView === 'portfolio'}
                            />
                        </div>

                        <div className="h-8 w-px bg-current opacity-10" aria-hidden="true"></div>

                        <Button 
                            variant={isScrolled ? "primary" : "white"} 
                            onClick={() => window.open(BROKER_INFO.whatsapp_link)}
                            className={!isScrolled ? "text-[#856404]" : ""}
                            aria-label="Falar no WhatsApp"
                        >
                            <Icons.WhatsApp className="w-4 h-4" />
                            <span className="hidden lg:inline">Falar no WhatsApp</span>
                            <span className="lg:hidden">Contato</span>
                        </Button>
                    </nav>

                    {/* MOBILE TOGGLE */}
                    <button 
                        className={`md:hidden p-2 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                            isScrolled 
                                ? 'text-[#0f172a] hover:bg-gray-100 focus-visible:ring-[#0f172a]' 
                                : 'text-white hover:bg-white/10 focus-visible:ring-white'
                        }`} 
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-expanded={mobileMenuOpen}
                        aria-controls="mobile-menu"
                        aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
                    >
                        {mobileMenuOpen ? <Icons.X className="w-7 h-7" /> : <Icons.Menu className="w-7 h-7" />}
                    </button>
                </div>
            </header>

            {/* MOBILE MENU DRAWER */}
            <div 
                className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
                    mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setMobileMenuOpen(false)}
                aria-hidden="true"
            ></div>

            <div 
                id="mobile-menu"
                className={`fixed top-0 right-0 bottom-0 z-50 w-[85%] max-w-sm bg-white shadow-2xl transition-transform duration-300 ease-out transform md:hidden ${
                    mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
                role="dialog"
                aria-modal="true"
                aria-label="Menu de navegação"
            >
                <div className="flex flex-col h-full">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#f8fafc]">
                        <span className="font-serif font-bold text-xl text-[#0f172a]">Menu</span>
                        <button 
                            onClick={() => setMobileMenuOpen(false)}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                            aria-label="Fechar menu"
                        >
                            <Icons.X className="w-6 h-6" />
                        </button>
                    </div>

                    <nav className="flex-1 overflow-y-auto py-6 px-6 flex flex-col gap-2">
                        {NAV_LINKS.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleNavClick('home', item.id)}
                                className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 text-left group transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#856404]"
                            >
                                <span className="font-medium text-gray-700 group-hover:text-[#0f172a] text-lg">
                                    {item.label}
                                </span>
                                <Icons.ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#856404] transition-colors" />
                            </button>
                        ))}
                        
                        <div className="my-2 border-t border-gray-100" aria-hidden="true"></div>

                        <button
                            onClick={() => handleNavClick('portfolio')}
                            className="flex items-center justify-between p-4 rounded-xl bg-[#f8fafc] border border-gray-100 hover:border-[#856404] text-left group transition-all mt-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#856404]"
                        >
                            <span className="font-bold text-[#0f172a] text-lg">
                                Portfólio Completo
                            </span>
                            <Icons.ArrowRight className="w-5 h-5 text-[#856404]" />
                        </button>
                    </nav>

                    <div className="p-6 border-t border-gray-100 bg-gray-50">
                        <Button 
                            variant="primary" 
                            className="w-full py-4 text-base shadow-lg" 
                            onClick={() => window.open(BROKER_INFO.whatsapp_link)}
                        >
                            <Icons.WhatsApp className="w-5 h-5" />
                            Falar com Corretor
                        </Button>
                        <p className="text-center text-xs text-gray-500 mt-4">
                            © 2025 Marcelo Braz. CRECI 12345-F
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;