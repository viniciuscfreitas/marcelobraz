export const PROPERTIES = [
  { id: 1, title: "Cobertura Duplex Gonzaga", subtitle: "A vista mais exclusiva do bairro", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80", tags: ["Frente Mar", "Exclusivo"], specs: "4 Suítes • 380m²", bairro: "Gonzaga", tipo: "Cobertura" },
  { id: 2, title: "Unlimited Ocean Front", subtitle: "Lazer de resort na Ponta da Praia", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80", tags: ["Oportunidade"], specs: "3 Suítes • 160m²", bairro: "Ponta da Praia", tipo: "Apartamento" },
  { id: 3, title: "Mansão Suspensa", subtitle: "Privacidade total no Morro Sta. Teresinha", image: "https://images.unsplash.com/photo-1600596542815-22519fec27e6?auto=format&fit=crop&w=1000&q=80", tags: ["Off-Market"], specs: "5 Suítes • 600m²", bairro: "Morro Sta. Teresinha", tipo: "Casa" },
  { id: 4, title: "Garden Boqueirão", subtitle: "Sensação de casa, segurança de prédio", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80", tags: ["Quadra da Praia"], specs: "3 Dorms • 140m²", bairro: "Boqueirão", tipo: "Garden" },
  { id: 5, title: "Vila Rica Concept", subtitle: "Arquitetura moderna no coração do bairro", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80", tags: ["Lançamento"], specs: "4 Dorms • 210m²", bairro: "Boqueirão", tipo: "Apartamento" },
  { id: 6, title: "Penthouse Embaré", subtitle: "Vista 360º da orla", image: "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1000&q=80", tags: ["Vista Mar"], specs: "3 Suítes • 240m²", bairro: "Embaré", tipo: "Cobertura" },
  { id: 7, title: "Casa Neo-Clássica", subtitle: "Reformada na Vila Belmiro", image: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=1000&q=80", tags: ["Oportunidade"], specs: "3 Dorms • 180m²", bairro: "Vila Belmiro", tipo: "Casa" },
  { id: 8, title: "Studio Premium Gonzaga", subtitle: "Rentabilidade garantida para investidor", image: "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=1000&q=80", tags: ["Investimento"], specs: "1 Suíte • 45m²", bairro: "Gonzaga", tipo: "Studio" }
];

export const AVAILABLE_NEIGHBORHOODS = ['Todos', ...new Set(PROPERTIES.map(p => p.bairro))];
export const AVAILABLE_TYPES = ['Todos', ...new Set(PROPERTIES.map(p => p.tipo))];

