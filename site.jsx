import { MessageCircle } from 'lucide-react';
import React, { useState, useEffect, useCallback } from 'react';
import { Footer } from './components/Footer.jsx';
import { Header } from './components/Header.jsx';
import { LeadModal } from './components/LeadModal.jsx';
import { Toast } from './components/Toast.jsx';
import { BROKER_INFO } from './data/constants.js';
import { useModalLogic } from './hooks/useModalLogic.js';
import { useNavigation } from './hooks/useNavigation.js';
import { useProperties } from './hooks/useProperties.js';
import { AboutSection } from './sections/AboutSection.jsx';
import { CollectionSection } from './sections/CollectionSection.jsx';
import { HeroSection } from './sections/HeroSection.jsx';
import { TestimonialsSection } from './sections/TestimonialsSection.jsx';
import { ValuationSection } from './sections/ValuationSection.jsx';
import { WhatsappCaptureSection } from './sections/WhatsappCaptureSection.jsx';
import { PortfolioView } from './views/PortfolioView.jsx';
import { PropertyDetailsView } from './views/PropertyDetailsView.jsx';
import { generatePropertyUrl, extractPropertyIdFromUrl } from './utils/urlHelpers.js';

export default function RealEstateSite() {
  const nav = useNavigation();
  const { modalState, openModal, closeModal } = useModalLogic();
  const { properties } = useProperties();
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [hasInitializedFromUrl, setHasInitializedFromUrl] = useState(false);

  // Função helper para sincronizar view com URL (Grug gosta: memoizada!)
  const syncViewWithUrl = useCallback(() => {
    if (properties.length === 0) return;
    
    const path = window.location.pathname;
    const hash = window.location.hash.substring(1);
    let propertyId = null;
    
    if (path.startsWith('/imovel/')) {
      // URL amigável: /imovel/tipo-quartos-bairro-id
      propertyId = extractPropertyIdFromUrl(path);
    } else if (path === '/portfolio') {
      // URL para portfolio
      nav.navigateTo('portfolio');
      setSelectedProperty(null);
      return;
    } else {
      // Fallback: query param antigo (?property=123)
      const urlParams = new URLSearchParams(window.location.search);
      propertyId = urlParams.get('property');
    }
    
    if (propertyId) {
      const property = properties.find(p => p.id === parseInt(propertyId));
      if (property) {
        setSelectedProperty(property);
        nav.navigateTo('property');
      }
    } else {
      // Se não tem property na URL e não é /portfolio, é home
      nav.navigateTo('home', hash || null);
      setSelectedProperty(null);
    }
  }, [properties, nav]);

  // Inicialização a partir da URL
  useEffect(() => {
    if (hasInitializedFromUrl || properties.length === 0) return;
    syncViewWithUrl();
    setHasInitializedFromUrl(true);
  }, [properties, hasInitializedFromUrl, syncViewWithUrl]);

  // Listener para botão voltar/avançar do navegador (popstate)
  useEffect(() => {
    if (!hasInitializedFromUrl) return;
    
    const handlePopState = () => {
      syncViewWithUrl();
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [hasInitializedFromUrl, syncViewWithUrl]);

  const handlePropertyClick = (prop) => {
    setSelectedProperty(prop);
    nav.navigateTo('property');
    // Atualizar URL para amigável (Grug gosta: SEO!)
    const friendlyUrl = generatePropertyUrl(prop);
    window.history.pushState({}, '', friendlyUrl);
  };

  // Handler para navegação do header - limpa selectedProperty quando sai da página de detalhes
  const handleNavigate = (view, sectionId) => {
    if (view !== 'property') {
      setSelectedProperty(null);
    }
    nav.navigateTo(view, sectionId);
    
    // Atualizar URL conforme a view (Grug gosta: URL sempre sincronizada!)
    // Nota: property é atualizado em handlePropertyClick, não aqui
    if (view === 'portfolio') {
      window.history.pushState({}, '', '/portfolio');
    } else if (view === 'home') {
      // Para home, usar '/' ou '/' + hash se tiver sectionId
      const url = sectionId ? `/#${sectionId}` : '/';
      window.history.pushState({}, '', url);
    }
  };

  const handleModalSuccess = (msg) => {
    setToastMessage(msg);
    // Disparar evento para atualizar componentes que verificam lead capturado
    window.dispatchEvent(new Event('leadCaptured'));
  };

  const renderContent = () => {
    switch (nav.currentView) {
      case 'home':
        return (
          <main>
            <HeroSection navigateTo={nav.navigateTo} />
            <CollectionSection navigateTo={nav.navigateTo} onPropertyClick={handlePropertyClick} properties={properties} />
            <AboutSection />
            <ValuationSection />
            <TestimonialsSection />
            <WhatsappCaptureSection />
          </main>
        );
      case 'portfolio':
        return (
          <PortfolioView
            properties={properties}
            navigateTo={nav.navigateTo}
            onPropertyClick={handlePropertyClick}
          />
        );
      case 'property':
        return (
          <PropertyDetailsView
            property={selectedProperty}
            navigateTo={nav.navigateTo}
            onOpenLeadModal={(type) => {
              // Se for whatsapp, abre direto. Se for email, abre modal.
              if (type === 'whatsapp') {
                const link = BROKER_INFO?.whatsapp_link;
                if (link && typeof link === 'string' && (link.startsWith('https://wa.me/') || link.startsWith('http://wa.me/'))) {
                  window.open(link, '_blank', 'noopener,noreferrer');
                }
              } else {
                openModal('contact'); // Reutilizando modal de contato/gate
              }
            }}
            onShareSuccess={(msg) => setToastMessage(msg)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="font-sans text-gray-900 selection:bg-[#d4af37] selection:text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap');
      `}</style>

      <Header
        isScrolled={nav.isScrolled}
        mobileMenuOpen={nav.mobileMenuOpen}
        setMobileMenuOpen={nav.setMobileMenuOpen}
        navigateTo={handleNavigate}
        currentView={nav.currentView}
      />

      {renderContent()}

      {nav.currentView !== 'property' && <Footer navigateTo={nav.navigateTo} />}

      <a href={BROKER_INFO?.whatsapp_link || '#'} target="_blank" rel="noreferrer" className="fixed bottom-6 right-6 z-50 group flex items-center justify-end focus:outline-none focus-visible:ring-4 focus-visible:ring-green-400 rounded-full" aria-label="Falar no WhatsApp">
        <div className="absolute right-16 bg-white py-2 px-4 rounded-lg shadow-xl text-xs font-bold text-[#0f172a] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 mr-2 hidden md:block border border-gray-100" aria-hidden="true">Falar com Marcelo</div>
        <div className="bg-[#25D366] text-white p-4 rounded-full shadow-2xl shadow-green-500/30 hover:scale-110 transition-transform duration-300 flex items-center justify-center w-14 h-14"><MessageCircle size={30} /></div>
      </a>

      <LeadModal
        isOpen={modalState.isOpen}
        onClose={() => { closeModal(); }}
        property={selectedProperty}
        type={modalState.type}
        onSuccess={handleModalSuccess}
      />

      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
    </div>
  );
}
