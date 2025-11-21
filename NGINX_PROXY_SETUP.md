# Configuração no Nginx Proxy Manager

## Problema: Porta 3000 já em uso

✅ **Solução aplicada:** Porta alterada para **38291** no docker-compose.yml

## Passo 1: No Servidor - Fazer pull e subir o container

```bash
cd ~/www/marcelobraz
git pull origin main
docker compose down
docker compose up --build -d
```

O container estará rodando na porta **38291**.

## Passo 2: Configurar no Nginx Proxy Manager

### Aba "Details":

**Domain Names:**
```
marcelobraz.com.br
www.marcelobraz.com.br
```
*(Adicione os dois domínios)*

**Scheme:**
```
http
```

**Forward Hostname / IP:**
```
marcelobraz-site
```
*(Use o nome do container, não o IP)*

**Forward Port:**
```
80
```
*(Porta interna do Nginx no container, não a externa 38291)*

**Access List:**
```
Publicly Accessible
```

**Options:**
- ✅ **Websockets Support:** Ativar (para React funcionar bem)
- ⚠️ Cache Assets: Desativar (pode causar problemas em dev)
- ✅ Block Common Exploits: Ativar

### Aba "SSL":

**SSL Certificate:**
```
Request a new SSL Certificate
```

**Options:**
- ✅ **Force SSL:** Ativar
- ✅ **HTTP/2 Support:** Ativar
- ✅ **HSTS Enabled:** Ativar
- ✅ **HSTS Sub-domains:** Ativar

### Aba "Custom Locations:**
Deixar vazio (padrão já funciona)

---

## ⚠️ IMPORTANTE: Rede Docker

Se o Nginx Proxy Manager não conseguir resolver `marcelobraz-site`, você tem 2 opções:

### Opção A: Conectar container à mesma rede do NPM

1. Descobrir a rede do NPM:
```bash
docker inspect npm | grep NetworkMode
# ou
docker network ls | grep npm
```

2. Adicionar o container à mesma rede:
```yaml
# No docker-compose.yml, adicionar:
networks:
  broker-network:
    driver: bridge
  npm_default:  # nome da rede do NPM
    external: true
```

E no serviço:
```yaml
services:
  broker-site:
    # ...
    networks:
      - broker-network
      - npm_default  # adicionar esta rede
```

### Opção B: Usar IP do host (172.17.0.1)

Se preferir manter redes separadas:

**Forward Hostname / IP:**
```
172.17.0.1
```

**Forward Port:**
```
38291
```
*(Porta externa mapeada do Docker)*

---

## Resumo da Configuração Recomendada

```
Domain Names:     marcelobraz.com.br, www.marcelobraz.com.br
Scheme:           http
Forward Hostname: marcelobraz-site  (ou 172.17.0.1 se rede diferente)
Forward Port:     80  (ou 38291 se usar IP do host)
SSL:              Let's Encrypt
Force SSL:        ✅ Ativo
Websockets:       ✅ Ativo
```

## Testar

Após configurar, teste:
```bash
# Verificar se container está rodando
docker ps | grep marcelobraz

# Ver logs
docker logs marcelobraz-site

# Testar acesso local
curl http://localhost:38291
```

## Troubleshooting

**Container não acessível pelo nome:**
→ Use `172.17.0.1:38291` no Forward Hostname/IP

**SSL não funciona:**
→ Verifique se o DNS está apontando para o servidor

**Página em branco:**
→ Verifique logs: `docker logs marcelobraz-site`

