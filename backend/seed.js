const db = require('./db');

const NEIGHBORHOODS = [
    "Gonzaga", "Boqueirão", "Embaré", "Ponta da Praia", "Vila Rica",
    "Campo Grande", "Marapé", "Aparecida", "Vila Belmiro", "José Menino"
];

const TYPES = ["Apartamento", "Casa", "Cobertura", "Garden", "Studio", "Flat"];

const SUBTYPES = {
    "Apartamento": ["Padrão", "Duplex", "Triplex", "Loft"],
    "Casa": ["Térrea", "Sobrado", "Condomínio Fechado", "Sobreposta Alta", "Sobreposta Baixa"],
    "Cobertura": ["Duplex", "Linear", "Triplex"],
    "Garden": ["Padrão"],
    "Studio": ["Padrão"],
    "Flat": ["Padrão"]
};

const FEATURES_LIST = {
    common: [
        "Piscina", "Churrasqueira", "Academia", "Salão de Festas", "Playground",
        "Sauna", "Quadra Poliesportiva", "Espaço Gourmet", "Portaria 24h",
        "Elevador", "Bicicletário", "Brinquedoteca", "Coworking", "Lavanderia"
    ],
    private: [
        "Varanda Gourmet", "Ar Condicionado", "Mobiliado", "Vista Mar",
        "Closet", "Hidromassagem", "Lareira", "Escritório", "Cozinha Americana",
        "Armários Embutidos", "Gás Encanado", "Depósito"
    ]
};

const IMAGES = [
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1600596542815-22519fec27e6?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1600607687644-c7171b42498b?auto=format&fit=crop&w=1000&q=80"
];

function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFeatures(list) {
    const result = {};
    list.forEach(f => {
        if (Math.random() > 0.5) result[f.toLowerCase().replace(/ /g, '_')] = true;
    });
    return result;
}

function generateProperty(index) {
    const tipo = getRandom(TYPES);
    const bairro = getRandom(NEIGHBORHOODS);
    const quartos = getRandomInt(1, 5);
    const suites = getRandomInt(0, quartos);
    const vagas = getRandomInt(0, 4);
    const area = getRandomInt(40, 400);
    const price = area * getRandomInt(5000, 12000);

    const features = {
        common: getRandomFeatures(FEATURES_LIST.common),
        private: getRandomFeatures(FEATURES_LIST.private)
    };

    return {
        title: `${tipo} ${getRandom(['Incrível', 'Espaçoso', 'Moderno', 'Luxuoso', 'Aconchegante'])} no ${bairro}`,
        subtitle: `Oportunidade única com ${quartos} quartos e ${vagas} vagas`,
        price: `R$ ${price.toLocaleString('pt-BR')}`,
        image: getRandom(IMAGES),
        bairro: bairro,
        tipo: tipo,
        specs: `${quartos} Dorms • ${area}m²`,
        tags: JSON.stringify([getRandom(['Vista Mar', 'Lançamento', 'Oportunidade', 'Exclusivo']), getRandom(['Novo', 'Reformado'])]),
        featured: Math.random() > 0.8 ? 1 : 0,
        description: `Excelente ${tipo.toLowerCase()} localizado no bairro ${bairro}. \n\nImóvel com ${area}m², ${quartos} quartos sendo ${suites} suítes. \n\nPossui acabamento de alto padrão, varanda espaçosa e ótima iluminação natural. \n\nO condomínio oferece lazer completo e segurança 24h. \n\nAgende sua visita e venha conhecer!`,
        subtype: getRandom(SUBTYPES[tipo]),
        age: getRandomInt(0, 30).toString(),
        quartos: quartos,
        vagas: vagas,
        banheiros: suites + getRandomInt(1, 3),
        suites: suites,
        condominio: `R$ ${getRandomInt(500, 3000).toLocaleString('pt-BR')}`,
        iptu: `R$ ${getRandomInt(100, 1000).toLocaleString('pt-BR')}`,
        area_util: area,
        area_total: area + getRandomInt(0, 50),
        cep: "11000-000",
        estado: "SP",
        cidade: "Santos",
        endereco: `Rua Exemplo, ${getRandomInt(10, 900)}`,
        complemento: `Apto ${getRandomInt(11, 154)}`,
        mostrar_endereco: 1,
        ref_code: `MB-${getRandomInt(1000, 9999)}`,
        aceita_permuta: Math.random() > 0.7 ? 1 : 0,
        aceita_fgts: Math.random() > 0.5 ? 1 : 0,
        posicao_apto: getRandom(['Frente', 'Fundos', 'Lateral']),
        andares: getRandomInt(5, 25).toString(),
        features: JSON.stringify(features),
        multimedia: JSON.stringify({
            video_url: Math.random() > 0.7 ? "https://www.youtube.com/watch?v=dQw4w9WgXcQ" : "",
            tour_url: ""
        })
    };
}

function seed() {
    console.log('🌱 Seeding database with Grug Power...');

    // Limpar tabela existente
    db.prepare('DELETE FROM properties').run();

    const insert = db.prepare(`
    INSERT INTO properties (
        title, subtitle, price, image, bairro, tipo, specs, tags, featured,
        description, subtype, age, quartos, vagas, banheiros, suites,
        condominio, iptu, area_util, area_total, cep, estado, cidade,
        endereco, complemento, mostrar_endereco, ref_code, aceita_permuta,
        aceita_fgts, posicao_apto, andares, features, multimedia
    )
    VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?
    )
  `);

    let count = 0;
    const TOTAL_PROPS = 50;

    db.transaction(() => {
        for (let i = 0; i < TOTAL_PROPS; i++) {
            const prop = generateProperty(i);
            insert.run(
                prop.title, prop.subtitle, prop.price, prop.image, prop.bairro, prop.tipo, prop.specs, prop.tags, prop.featured,
                prop.description, prop.subtype, prop.age, prop.quartos, prop.vagas, prop.banheiros, prop.suites,
                prop.condominio, prop.iptu, prop.area_util, prop.area_total, prop.cep, prop.estado, prop.cidade,
                prop.endereco, prop.complemento, prop.mostrar_endereco, prop.ref_code, prop.aceita_permuta,
                prop.aceita_fgts, prop.posicao_apto, prop.andares, prop.features, prop.multimedia
            );
            count++;
        }
    })();

    console.log(`✅ Seeded ${count} properties with rich data! 🦖`);
}

seed();
