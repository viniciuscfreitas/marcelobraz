# Guia de Deploy - Marcelo Braz Site

## Opção 1: Docker (Recomendado para Produção)

### Build e Executar

```bash
# Build da imagem
docker-compose build

# Iniciar container
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar
docker-compose down
```

O site estará disponível em: `http://localhost:3000`

### Para usar domínio customizado

1. **Configure o Nginx reverso proxy no servidor:**

```nginx
# /etc/nginx/sites-available/marcelobraz
server {
    listen 80;
    server_name marcelobraz.com.br www.marcelobraz.com.br;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

2. **Ative o site:**
```bash
sudo ln -s /etc/nginx/sites-available/marcelobraz /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

3. **Configure SSL com Let's Encrypt:**
```bash
sudo certbot --nginx -d marcelobraz.com.br -d www.marcelobraz.com.br
```

## Opção 2: NPM direto (Desenvolvimento)

### Instalar dependências
```bash
npm install
```

### Desenvolvimento
```bash
npm run dev
```

### Preview produção
```bash
npm run build
npm run preview
```

### Para usar domínio customizado no NPM

1. **Edite `vite.config.js` e adicione:**
```js
server: {
  host: '0.0.0.0',
  port: 5173,
  strictPort: true,
}
```

2. **Configure o Nginx reverso proxy:**
```nginx
server {
    listen 80;
    server_name marcelobraz.com.br;

    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Estrutura de Deploy

```
Servidor (srv1106773)
├── Nginx (porta 80/443) → Reversa proxy
└── Docker Container (porta 3000) → Aplicação React
```

## Variáveis de Ambiente (Opcional)

Crie `.env` se precisar:
```env
VITE_API_URL=https://api.marcelobraz.com.br
VITE_WHATSAPP_NUMBER=5513999998888
```

## Comandos Úteis

```bash
# Rebuild após mudanças
docker-compose up -d --build

# Ver status
docker-compose ps

# Entrar no container
docker exec -it marcelobraz-site sh

# Ver logs do nginx
docker exec marcelobraz-site tail -f /var/log/nginx/access.log
```

