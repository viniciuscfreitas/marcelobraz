import { MessageCircle } from 'lucide-react';
import React, { useState } from 'react';
import { Footer } from './components/Footer.jsx';
import { Header } from './components/Header.jsx';
import { LeadModal } from './components/LeadModal.jsx';
import { Toast } from './components/Toast.jsx';
import { BROKER_INFO } from './data/constants.js';
import { useModalLogic } from './hooks/useModalLogic.js';
import { useNavigation } from './hooks/useNavigation.js';
import { AboutSection } from './sections/AboutSection.jsx';
import { CollectionSection } from './sections/CollectionSection.jsx';
import { HeroSection } from './sections/HeroSection.jsx';
import { TestimonialsSection } from './sections/TestimonialsSection.jsx';
import { ValuationSection } from './sections/ValuationSection.jsx';
import { WhatsappCaptureSection } from './sections/WhatsappCaptureSection.jsx';
import { PortfolioView } from './views/PortfolioView.jsx';

export default function RealEstateSite() {
  const nav = useNavigation();
  const { modalState, openModal, closeModal } = useModalLogic();
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const handlePropertyClick = (prop) => {
      setSelectedProperty(prop);
    openModal('gate');
  };

  const handleModalSuccess = (msg) => {
    setToastMessage(msg);
  };

  return (
    <div className="font-sans text-[#0f172a] bg-[#FAFAFA] selection:bg-[#0f172a] selection:text-white overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
        :focus-visible { outline: 3px solid #0f172a; outline-offset: 2px; }
        .dark-bg-focus :focus-visible { outline-color: #d4af37; }
        .skip-link { position: absolute; top: -40px; left: 0; background: #0f172a; color: white; padding: 8px; z-index: 100; transition: top 0.3s; }
        .skip-link:focus { top: 0; }
      `}</style>

      <a href="#main-content" className="skip-link">Pular para o conteúdo principal</a>

      <Header {...nav} />

      <main id="main-content">
        {nav.currentView === 'home' ? (
          <>
            <HeroSection navigateTo={nav.navigateTo} />
            <CollectionSection onPropertyClick={handlePropertyClick} navigateTo={nav.navigateTo} />
            <WhatsappCaptureSection />
            <AboutSection />
            <TestimonialsSection />
            <ValuationSection />
          </>
        ) : (
          <PortfolioView navigateTo={nav.navigateTo} onPropertyClick={handlePropertyClick} />
        )}
      </main>

      <Footer />

      <a href={BROKER_INFO.whatsapp_link} target="_blank" rel="noreferrer" className="fixed bottom-6 right-6 z-50 group flex items-center justify-end focus:outline-none focus-visible:ring-4 focus-visible:ring-green-400 rounded-full" aria-label="Falar no WhatsApp">
        <div className="absolute right-16 bg-white py-2 px-4 rounded-lg shadow-xl text-xs font-bold text-[#0f172a] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 mr-2 hidden md:block border border-gray-100" aria-hidden="true">Falar com Marcelo</div>
        <div className="bg-[#25D366] text-white p-4 rounded-full shadow-2xl shadow-green-500/30 hover:scale-110 transition-transform duration-300 flex items-center justify-center w-14 h-14"><MessageCircle size={30} /></div>
      </a>

      <LeadModal
        isOpen={modalState.isOpen}
        onClose={() => { closeModal(); setSelectedProperty(null); }}
        property={selectedProperty}
        type={modalState.type}
        onSuccess={handleModalSuccess}
      />

      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
    </div>
  );
}
