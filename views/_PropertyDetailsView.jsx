import React, { useState, useEffect, useRef } from 'react';

// ==================================================================================
// 🚧 COMPONENTES INTERNOS & ÍCONES
// ==================================================================================

const BROKER_INFO = { whatsapp_link: '#' };
const useSEO = () => null;

// --- Ícones SVG Premium (Aria-hidden por padrão pois são decorativos) ---
const Icons = {
    ChevronRight: ({ className }) => <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6"/></svg>,
    Home: ({ className }) => <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    Phone: ({ className }) => <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
    MessageCircle: ({ className }) => <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>,
    Share: ({ className }) => <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>,
    MapPin: ({ className }) => <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
    Maximize: ({ className }) => <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>,
    Bed: ({ className }) => <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>,
    Bath: ({ className }) => <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-1C4.5 2 3.5 2.5 3.5 4c0 1.5.5 2.5 1.5 3.5L7.5 10"/><line x1="8" x2="8" y1="19" y2="21"/><line x1="16" x2="16" y1="19" y2="21"/><path d="M2 12h20"/><path d="M7 19v-7a5 5 0 0 1 10 0v7"/></svg>,
    Car: ({ className }) => <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M14 14h6"/></svg>,
    Check: ({ className }) => <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="20 6 9 17 4 12"/></svg>,
    Lock: ({ className }) => <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
    Image: ({ className }) => <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>,
    Close: ({ className }) => <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
};

// --- Sub-Componentes de UI ---

const Breadcrumbs = ({ property, navigateTo }) => (
    <nav aria-label="Breadcrumb" className="text-xs font-medium text-gray-500 mb-6 flex items-center flex-wrap gap-2">
        <button 
            onClick={() => navigateTo && navigateTo('/')} 
            className="hover:text-[#856404] transition-colors flex items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c5a572] rounded-sm px-1"
            aria-label="Voltar para página inicial"
        >
            <Icons.Home className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform" /> 
            <span className="underline decoration-transparent group-hover:decoration-[#856404] underline-offset-4 transition-all">Início</span>
        </button>
        <Icons.ChevronRight className="w-3 h-3 text-gray-400" />
        <span className="text-gray-600 hover:text-gray-900">{property?.cidade || 'Cidade'}</span>
        <Icons.ChevronRight className="w-3 h-3 text-gray-400" />
        <span className="text-gray-600 hover:text-gray-900">{property?.bairro || 'Bairro'}</span>
        <Icons.ChevronRight className="w-3 h-3 text-gray-400" />
        <span className="text-gray-900 font-semibold truncate max-w-[200px] md:max-w-xs" aria-current="page">
            {property?.title || property?.id}
        </span>
    </nav>
);

const GalleryHero = ({ property, images, onShare }) => {
    const displayImages = images && images.length > 0 ? images : [property?.image || "https://via.placeholder.com/1200x800?text=Sem+Foto"];
    const gridImages = [...displayImages, ...Array(5).fill("https://via.placeholder.com/800?text=Foto")].slice(0, 5);

    return (
        <section aria-label="Galeria de fotos" className="relative mb-8 group">
            {/* Grid de Mosaico - Agora usando BUTTONS para acessibilidade de teclado */}
            <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-2 h-[40vh] min-h-[300px] md:h-[500px] rounded-xl overflow-hidden shadow-sm">
                
                {/* Foto Principal */}
                <button 
                    className="md:col-span-2 md:row-span-2 relative overflow-hidden cursor-pointer group/img focus:outline-none focus-visible:ring-4 focus-visible:ring-[#c5a572] w-full h-full p-0 border-0"
                    aria-label="Ver foto principal em tela cheia"
                >
                    <img 
                        src={gridImages[0]} 
                        alt={`Foto principal de ${property?.title}`} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300"></div>
                </button>

                {/* Fotos Secundárias */}
                {[1, 2, 3].map((idx) => (
                    <button 
                        key={idx}
                        className="hidden md:block relative overflow-hidden cursor-pointer w-full h-full p-0 border-0 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#c5a572]"
                        aria-label={`Ver foto ${idx + 1}`}
                    >
                        <img src={gridImages[idx]} alt={`Foto do imóvel ${idx + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    </button>
                ))}
                
                {/* Última Foto com Overlay "+Mais" */}
                <button 
                    className="hidden md:block relative overflow-hidden cursor-pointer w-full h-full p-0 border-0 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#c5a572]"
                    aria-label="Ver todas as fotos"
                >
                    <img src={gridImages[4]} alt="Ver mais fotos" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[1px] hover:bg-black/50 transition-colors">
                        <span className="text-white font-bold flex items-center gap-2 text-lg">
                            <Icons.Image className="w-5 h-5" />
                            Ver todas
                        </span>
                    </div>
                </button>
            </div>

            {/* Botões Flutuantes */}
            <div className="absolute top-4 right-4 flex gap-2">
                <button 
                    onClick={onShare}
                    className="bg-white/90 backdrop-blur-md hover:bg-white text-gray-800 px-4 py-2 rounded-lg shadow-lg text-sm font-semibold flex items-center gap-2 transition-all hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
                    aria-label="Compartilhar este imóvel"
                >
                    <Icons.Share className="w-4 h-4" /> 
                    <span className="hidden sm:inline">Compartilhar</span>
                </button>
            </div>
            
            <div className="absolute top-4 left-4 md:hidden">
                <span className="bg-[#856404] text-white px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider shadow-md">
                    {property?.tipo || 'Destaque'}
                </span>
            </div>
        </section>
    );
};

const PropertyInfoCard = ({ property, onUnlockPrice }) => (
    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
            <div className="space-y-2">
                <div className="flex items-center gap-2 mb-1">
                    <span className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-blue-100">
                        {property?.transaction_type || 'Venda'}
                    </span>
                    {property?.condominio && (
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium border border-gray-200">
                            Cond. R$ {property.condominio}
                        </span>
                    )}
                </div>
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 leading-tight">
                    {property?.title || 'Imóvel Exclusivo'}
                </h1>
                <p className="text-gray-600 flex items-center gap-2 text-sm md:text-base mt-2">
                    <Icons.MapPin className="w-4 h-4 text-[#856404]" /> 
                    {property?.endereco_completo || `${property?.bairro}, ${property?.cidade} - SP`}
                </p>
            </div>
            <div className="text-left md:text-right mt-2 md:mt-0 bg-gray-50 md:bg-transparent p-4 md:p-0 rounded-xl w-full md:w-auto border md:border-0 border-gray-100">
                <p className="text-xs text-gray-600 uppercase tracking-wider font-semibold mb-1">Valor de Venda</p>
                <div className="text-3xl md:text-4xl font-bold text-[#856404] tracking-tight">
                    {property?.price || 'Sob Consulta'}
                </div>
            </div>
        </div>

        {/* Key Metrics Grid - Accessible */}
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-y border-gray-100" aria-label="Detalhes principais">
            <li className="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                <Icons.Bed className="text-gray-500 mb-2 w-6 h-6" />
                <span className="font-bold text-gray-900 text-lg">{property?.quartos || '--'}</span>
                <span className="text-xs text-gray-600 uppercase tracking-wide font-medium">Quartos</span>
            </li>
            <li className="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                <Icons.Bath className="text-gray-500 mb-2 w-6 h-6" />
                <span className="font-bold text-gray-900 text-lg">{property?.banheiros || '--'}</span>
                <span className="text-xs text-gray-600 uppercase tracking-wide font-medium">Banheiros</span>
            </li>
            <li className="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                <Icons.Car className="text-gray-500 mb-2 w-6 h-6" />
                <span className="font-bold text-gray-900 text-lg">{property?.vagas || '--'}</span>
                <span className="text-xs text-gray-600 uppercase tracking-wide font-medium">Vagas</span>
            </li>
            <li className="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                <Icons.Maximize className="text-gray-500 mb-2 w-6 h-6" />
                <span className="font-bold text-gray-900 text-lg">{property?.area || '--'}</span>
                <span className="text-xs text-gray-600 uppercase tracking-wide font-medium">m² Úteis</span>
            </li>
        </ul>

        <div className="mt-8">
            <h2 className="text-lg font-serif font-bold text-gray-900 mb-4 flex items-center gap-2">
                Sobre o imóvel
                <div className="h-px flex-1 bg-gray-200 ml-4" aria-hidden="true"></div>
            </h2>
            <div className="prose prose-slate prose-sm sm:prose-base max-w-none text-gray-700 leading-relaxed">
                {property?.description || "Descrição detalhada indisponível para este imóvel no momento."}
            </div>
        </div>
    </div>
);

const FeaturesGrid = ({ features }) => (
    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
        <h2 className="text-lg font-serif font-bold text-gray-900 mb-6 flex items-center gap-2">
            Comodidades e Diferenciais
            <div className="h-px flex-1 bg-gray-200 ml-4" aria-hidden="true"></div>
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8">
            {(features && Object.keys(features).length > 0 ? Object.keys(features) : [
                'Ar Condicionado', 'Piscina Privativa', 'Varanda Gourmet', 
                'Vista Panorâmica', 'Portaria 24h', 'Academia', 
                'Salão de Festas', 'Churrasqueira', 'Closet'
            ]).map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 group">
                    <div className="mt-1 min-w-[18px]">
                        <Icons.Check className="w-4 h-4 text-[#856404] group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="text-gray-700 text-sm group-hover:text-gray-900 transition-colors font-medium">{item}</span>
                </li>
            ))}
        </ul>
    </div>
);

const LocationCard = ({ address, isLocked, onUnlock }) => (
    <section aria-label="Mapa de localização" className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full">
        <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-serif font-bold text-gray-900">Localização</h2>
            <p className="text-gray-600 text-sm mt-1">{address}</p>
        </div>
        
        <div className="relative w-full h-64 bg-slate-100 flex items-center justify-center group overflow-hidden">
            <div className="absolute inset-0 opacity-50 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=-23.9618,-46.3322&zoom=13&size=600x300&sensor=false&key=YOUR_KEY')] bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-700" role="img" aria-label="Mapa estático mostrando a região aproximada"></div>
            
            {isLocked ? (
                <div className="absolute inset-0 backdrop-blur-sm bg-white/70 flex flex-col items-center justify-center p-6 text-center z-10">
                    <div className="bg-white p-4 rounded-full shadow-xl mb-4">
                        <Icons.Lock className="w-6 h-6 text-[#856404]" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">Localização Exata Protegida</h3>
                    <p className="text-xs text-gray-600 mb-4 max-w-xs">Cadastre-se gratuitamente para visualizar o endereço exato.</p>
                    <button 
                        onClick={onUnlock}
                        className="bg-[#0f172a] text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black"
                    >
                        Desbloquear Mapa
                    </button>
                </div>
            ) : (
                <div className="z-10 flex flex-col items-center">
                    <Icons.MapPin className="w-10 h-10 text-[#e11d48] drop-shadow-xl animate-bounce" />
                    <span className="bg-white px-3 py-1 rounded-full text-xs font-bold shadow-lg mt-2 text-gray-800">Localização Aproximada</span>
                </div>
            )}
        </div>
    </section>
);

const SidebarContact = ({ property, onContact }) => (
    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 space-y-6 sticky top-24">
        <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Consultor Responsável</p>
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gray-200 rounded-full overflow-hidden border-2 border-white shadow-md">
                    <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200" alt="Foto do Corretor Carlos Mendes" className="w-full h-full object-cover" />
                </div>
                <div>
                    <h4 className="font-bold text-gray-900">Carlos Mendes</h4>
                    <p className="text-xs text-[#856404] font-bold">Especialista em Luxo</p>
                    <p className="text-xs text-gray-500 mt-0.5">CRECI 12345-F</p>
                </div>
            </div>
        </div>

        <div className="h-px bg-gray-100 w-full" aria-hidden="true"></div>

        <div className="space-y-3">
            <button 
                onClick={() => window.open(BROKER_INFO.whatsapp_link)}
                className="w-full bg-[#128c7e] hover:bg-[#075e54] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md active:scale-95 group focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#128c7e]"
                aria-label="Conversar com corretor no WhatsApp"
            >
                <Icons.MessageCircle className="w-5 h-5" />
                Conversar no WhatsApp
            </button>
            <button 
                onClick={onContact}
                className="w-full bg-[#0f172a] hover:bg-slate-800 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0f172a]"
            >
                <Icons.Phone className="w-5 h-5" />
                Agendar Visita
            </button>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
            <p className="text-xs text-gray-600 leading-relaxed">
                <span className="font-bold text-gray-800">Gostou deste imóvel?</span><br/>
                Agende uma visita hoje mesmo.
            </p>
        </div>
    </div>
);

const MobileActionBar = ({ onWhatsApp, onContact }) => (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 p-4 z-50 md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.05)] safe-area-bottom">
        <div className="flex gap-3">
            <button 
                onClick={onWhatsApp}
                className="flex-1 bg-[#128c7e] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#128c7e]"
                aria-label="WhatsApp"
            >
                <Icons.MessageCircle className="w-5 h-5" />
                WhatsApp
            </button>
            <button 
                onClick={onContact}
                className="flex-1 bg-[#0f172a] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0f172a]"
            >
                <Icons.Phone className="w-5 h-5" />
                Contatar
            </button>
        </div>
    </div>
);

const LeadModal = ({ isOpen, onClose, onSuccess }) => {
    const modalRef = useRef(null);
    
    // Focus Trap simples para acessibilidade
    useEffect(() => {
        if (isOpen) {
            const focusableElements = modalRef.current?.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            const firstElement = focusableElements?.[0];
            firstElement?.focus();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-[60] flex items-center justify-center p-4" 
            role="dialog" 
            aria-modal="true" 
            aria-labelledby="modal-title"
        >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity" onClick={onClose} aria-hidden="true"></div>
            <div 
                ref={modalRef}
                className="bg-white p-8 rounded-2xl max-w-md w-full shadow-2xl relative z-10 animate-in fade-in zoom-in duration-300 border border-gray-100"
            >
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
                    aria-label="Fechar modal"
                >
                    <Icons.Close className="w-5 h-5" />
                </button>

                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-[#856404]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icons.Lock className="w-8 h-8 text-[#856404]" />
                    </div>
                    <h2 id="modal-title" className="text-2xl font-serif font-bold text-gray-900 mb-2">Acesso Exclusivo</h2>
                    <p className="text-gray-600 text-sm leading-relaxed">Cadastre-se para desbloquear o endereço exato, fotos em alta resolução e valores detalhados.</p>
                </div>
                
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onSuccess('Lead capturado'); }}>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Seu Nome</label>
                        <input id="name" type="text" placeholder="Ex: João Silva" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#856404] focus:ring-2 focus:ring-[#856404]/20 outline-none transition-all text-gray-900 placeholder-gray-400" required />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Seu E-mail</label>
                        <input id="email" type="email" placeholder="Ex: joao@email.com" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#856404] focus:ring-2 focus:ring-[#856404]/20 outline-none transition-all text-gray-900 placeholder-gray-400" required />
                    </div>
                    <button 
                        type="submit"
                        className="w-full bg-[#856404] hover:bg-[#6d5203] text-white py-3.5 rounded-xl font-bold transition-colors shadow-lg shadow-[#856404]/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#856404]"
                    >
                        Ver Todas as Informações
                    </button>
                </form>
                <button onClick={onClose} className="w-full mt-4 text-gray-500 hover:text-gray-800 text-sm font-medium underline decoration-transparent hover:decoration-gray-800 underline-offset-2 transition-all">Talvez depois</button>
            </div>
        </div>
    );
};

// ==================================================================================
// 🚀 VIEW PRINCIPAL (CONTROLLER)
// ==================================================================================

export const PropertyDetailsView = ({ property: initialProperty, navigateTo, onOpenLeadModal, onShareSuccess }) => {
    // Mock Property para Preview
    const property = initialProperty || {
        id: 'REF-LUX-089',
        title: 'Mansão Contemporânea no Jardim Acapulco',
        bairro: 'Jardim Acapulco',
        cidade: 'Guarujá',
        tipo: 'Casa de Condomínio',
        transaction_type: 'Venda',
        price: 'R$ 12.500.000',
        condominio: '1.800',
        quartos: 5,
        banheiros: 7,
        vagas: 6,
        area: 850,
        endereco_completo: 'Av. das Américas, Jardim Acapulco, Guarujá - SP',
        description: 'Uma obra-prima da arquitetura moderna. Esta residência dispõe de acabamentos em mármore importado, automação total, home cinema, adega climatizada e uma área de lazer espetacular com piscina de borda infinita e spa integrado. Paisagismo assinado e total privacidade.',
        image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80'
    };

    const [leadCaptured, setLeadCaptured] = useState(false);
    const [showLeadModal, setShowLeadModal] = useState(false);
    const viewTrackedRef = useRef(false);

    const handleShare = async () => {
        const shareUrl = window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({ title: property.title, url: shareUrl });
            } catch (err) { console.log(err); }
        } else {
            alert('Link copiado para área de transferência!');
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!leadCaptured) setShowLeadModal(true);
        }, 8000);
        return () => clearTimeout(timer);
    }, [leadCaptured]);

    useEffect(() => window.scrollTo(0, 0), [property]);

    const images = [
        property.image,
        'https://images.unsplash.com/photo-1600596542815-2255d72ec8e3?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80'
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-24 md:pb-12 font-sans text-slate-900">
            <div className="h-20 bg-white shadow-sm mb-8 hidden md:block" aria-hidden="true"></div> 
            <div className="h-4 md:hidden" aria-hidden="true"></div>

            <div className="container mx-auto px-4 md:px-6 max-w-7xl">
                <Breadcrumbs property={property} navigateTo={navigateTo} />

                <GalleryHero property={property} images={images} onShare={handleShare} />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
                    
                    <main className="lg:col-span-8 space-y-8">
                        <PropertyInfoCard 
                            property={property} 
                            onUnlockPrice={() => setShowLeadModal(true)} 
                        />
                        
                        <FeaturesGrid features={{}} />
                        
                        <div className="h-[400px]">
                            <LocationCard 
                                address={property.endereco_completo} 
                                isLocked={!leadCaptured} 
                                onUnlock={() => setShowLeadModal(true)} 
                            />
                        </div>
                    </main>

                    <aside className="lg:col-span-4 relative">
                        <div className="sticky top-24 space-y-6">
                            <SidebarContact 
                                property={property} 
                                onContact={() => setShowLeadModal(true)} 
                            />
                            
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h3 className="font-bold text-gray-900 mb-4">Simulação de Financiamento</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Entrada (20%)</span>
                                        <span className="font-bold text-gray-900">R$ 2.500.000</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100">
                                        <div className="bg-[#856404] h-2 rounded-full w-[20%]"></div>
                                    </div>
                                    <button className="text-[#856404] text-sm font-bold hover:underline w-full text-center mt-2 focus:outline-none focus:ring-2 focus:ring-[#856404] rounded-sm">
                                        Ver simulação completa
                                    </button>
                                </div>
                            </div>
                        </div>
                    </aside>

                </div>
            </div>

            <MobileActionBar 
                onWhatsApp={() => window.open(BROKER_INFO.whatsapp_link)} 
                onContact={() => setShowLeadModal(true)} 
            />

            <LeadModal
                isOpen={showLeadModal}
                onClose={() => setShowLeadModal(false)}
                property={property}
                type="gate"
                onSuccess={(msg) => {
                    setLeadCaptured(true);
                    setShowLeadModal(false);
                }}
            />
        </div>
    );
};

export default PropertyDetailsView;