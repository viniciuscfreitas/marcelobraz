# 🎯 Configurar Admin Panel no Nginx Proxy Manager

Guia rápido para colocar o painel admin no NPM com domínio.

## 📋 Pré-requisitos

- Admin rodando no Docker (container `marcelobraz-admin`)
- Container na rede `npm_default`
- NPM rodando e acessível

---

## ✅ Passo 1: Verificar Container Admin

```bash
# Verificar se admin está rodando
docker ps | grep marcelobraz-admin

# Verificar se está na rede npm_default
docker inspect marcelobraz-admin | grep -A 10 "npm_default"

# Se não estiver, conectar:
docker network connect npm_default marcelobraz-admin
```

---

## 🌐 Passo 2: Criar Proxy Host no NPM

1. Acesse NPM: `http://seu-ip:8181` (ou seu domínio do NPM)

2. Clique em **"Proxy Hosts"** → **"Add Proxy Host"**

3. **Tab "Details":**
   - ✅ **Domain Names:** `admin.marcelobraz.vinicius.xyz` (ou seu subdomínio preferido)
   - ✅ **Scheme:** `http`
   - ✅ **Forward Hostname / IP:** `marcelobraz-admin`
   - ✅ **Forward Port:** `5173`
   - ✅ **Cache Assets:** ❌ OFF
   - ✅ **Block Common Exploits:** ✅ ON
   - ✅ **Websockets Support:** ✅ ON (se usar WebSockets)

4. Clique em **"Save"**

---

## 🔒 Passo 3: Configurar SSL

1. Ainda no Proxy Host criado, clique na tab **"SSL"**

2. Configure:
   - ✅ **SSL Certificate:** Clique em **"Request a new SSL Certificate"**
   - ✅ **Force SSL:** ✅ ON
   - ✅ **HTTP/2 Support:** ✅ ON
   - ✅ **HSTS Enabled:** ✅ ON
   - ✅ **HSTS Sub-domains:** ✅ ON (se usar subdomínios)

3. Marque **"I Agree to the Let's Encrypt Terms of Service"**

4. Clique em **"Save"**

5. Aguarde alguns segundos para o certificado ser gerado

---

## ✅ Passo 4: Verificar Configuração

```bash
# Testar acesso do NPM ao admin
docker exec npm-app-1 sh -c "curl -s -o /dev/null -w '%{http_code}' http://marcelobraz-admin:5173"

# Testar HTTPS (se configurado)
curl -I https://admin.marcelobraz.vinicius.xyz
```

---

## 🎯 Resultado Final

**URL do Admin:** `https://admin.marcelobraz.vinicius.xyz`

---

## 🔧 Troubleshooting

### Admin não aparece no NPM?

```bash
# 1. Verificar se container está rodando
docker ps | grep marcelobraz-admin

# 2. Verificar se está na rede npm_default
docker inspect marcelobraz-admin | grep npm_default

# 3. Se não estiver, reconectar:
docker network connect npm_default marcelobraz-admin

# 4. Reiniciar admin
docker restart marcelobraz-admin
```

### Erro 502 Bad Gateway?

```bash
# Verificar logs do admin
docker logs marcelobraz-admin

# Verificar se porta 5173 está respondendo
docker exec marcelobraz-admin sh -c "wget -qO- http://localhost:5173"
```

### SSL não funciona?

- Verifique se o domínio aponta para o IP do servidor
- Aguarde DNS propagar (pode levar até 24h)
- Verifique logs do NPM para erros de certificado

---

## 📝 Checklist

- [ ] Container admin rodando
- [ ] Admin na rede `npm_default`
- [ ] Proxy Host criado no NPM
- [ ] Domínio configurado corretamente
- [ ] SSL certificado gerado
- [ ] Acesso HTTPS funcionando
- [ ] Admin acessível via domínio

---

## 🚀 Pronto!

Agora você pode acessar o admin em: `https://admin.marcelobraz.vinicius.xyz`

**Não esqueça de criar o usuário admin pela primeira vez:**

```bash
docker exec marcelobraz-backend node create-admin.js
```

Ou faça login via API:
```bash
curl -X POST http://localhost:3040/api/auth/setup \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"suasenha123"}'
```

