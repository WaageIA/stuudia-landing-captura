# API de Captura de Leads - Documentação

## ✅ Fase 2 - Endpoints da API - CONCLUÍDA

### 🚀 Endpoints Implementados

#### 1. **POST /api/leads/capture**
Endpoint principal para captura de leads.

**Request Body:**
```json
{
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "whatsapp": "(11) 99999-9999",
  "origin": "google_ads",
  "answers": {
    "is_store_owner": true,
    "store_type": "ecommerce",
    "current_tools": ["shopify"],
    "main_challenge": "product_photos",
    "budget_range": "100_500",
    "timeline": "this_month"
  }
}
```

**Response Success (201):**
```json
{
  "ok": true,
  "leadId": "uuid",
  "emailSent": true,
  "message": "Lead capturado com sucesso! Verifique seu email para continuar.",
  "rateLimit": {
    "remaining": 2,
    "resetTime": 1640995200000
  }
}
```

**Response Error (409 - Email já existe):**
```json
{
  "ok": false,
  "error": "Este email já foi cadastrado. Use outro email ou faça login.",
  "code": "EMAIL_EXISTS"
}
```

---

#### 2. **GET /api/leads/check-email**
Verifica se um email já está cadastrado.

**Query Parameters:**
- `email` (obrigatório): Email a ser verificado

**Example:** `/api/leads/check-email?email=joao@exemplo.com`

**Response Success (200):**
```json
{
  "ok": true,
  "available": true,
  "email": "joao@exemplo.com",
  "message": "Email disponível",
  "rateLimit": {
    "remaining": 9,
    "resetTime": 1640995200000
  }
}
```

---

#### 3. **POST /api/leads/link-profile**
Vincula um lead com o profile do usuário após criação da conta.

**Request Body:**
```json
{
  "email": "joao@exemplo.com",
  "user_id": "user_uuid"
}
```

**Response Success (200):**
```json
{
  "ok": true,
  "leadId": "lead_uuid",
  "userId": "user_uuid",
  "status": "email_validated",
  "message": "Lead vinculado com sucesso! Bem-vindo ao Meu Studio AI."
}
```

---

#### 4. **GET /api/leads/analytics**
Endpoint para estatísticas e relatórios (requer autorização).

**Query Parameters:**
- `type`: `stats` (estatísticas) ou `leads` (lista de leads)
- `status`: Para type=leads, status específico (pending, email_validated, etc.)

**Headers:**
- `Authorization: Bearer {ADMIN_API_KEY}` (opcional em desenvolvimento)

**Response Stats (200):**
```json
{
  "ok": true,
  "data": {
    "total": 150,
    "pending": 45,
    "email_validated": 80,
    "whatsapp_validated": 15,
    "converted": 10
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

#### 5. **GET /api/health**
Endpoint de verificação de saúde da API. f

**Response (200):**
```json
{
  "ok": true,
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "config": {
    "supabase": { "url": true, "anonKey": true, "serviceKey": true },
    "resend": { "apiKey": true, "fromEmail": true },
    "app": { "landingUrl": true, "apiUrl": true },
    "environment": "development"
  },
  "imports": {
    "supabase": true,
    "resend": true,
    "zod": true,
    "validation": true,
    "queries": true
  }
}
```

---

### 🛡️ Recursos de Segurança Implementados

#### Rate Limiting
- **Captura de leads**: 3 tentativas/hora por IP
- **Verificação de email**: 10 tentativas/15min por IP
- **Vinculação**: 5 tentativas/hora por IP

#### Validações
- ✅ Validação Zod completa
- ✅ Sanitização de inputs
- ✅ Verificação de email único
- ✅ Detecção de atividade suspeita
- ✅ Validação de origem

#### Logs de Auditoria
- ✅ Log de captura de leads
- ✅ Log de verificações de email
- ✅ Log de vinculações
- ✅ Log de atividades suspeitas

---

### 📊 Códigos de Status HTTP

| Código | Descrição |
|--------|-----------|
| 200 | Sucesso |
| 201 | Lead criado com sucesso |
| 400 | Dados inválidos |
| 401 | Não autorizado |
| 404 | Lead não encontrado |
| 409 | Conflito (email já existe, lead já processado) |
| 429 | Rate limit excedido |
| 500 | Erro interno do servidor |

---

### 🔧 Configurações Necessárias

Adicione ao `.env.local`:

```env
# Admin API Key (opcional)
ADMIN_API_KEY=your_admin_api_key_here
```

---

### 🧪 Testando a API

1. **Teste de saúde:**
   ```bash
   curl http://localhost:3000/api/health
   ```

2. **Teste de captura:**
   ```bash
   curl -X POST http://localhost:3000/api/leads/capture \
     -H "Content-Type: application/json" \
     -d '{"name":"Teste","email":"teste@exemplo.com","origin":"other","answers":{"is_store_owner":true,"store_type":"none","main_challenge":"product_photos","budget_range":"under_100","timeline":"immediate"}}'
   ```

3. **Teste de verificação:**
   ```bash
   curl http://localhost:3000/api/leads/check-email?email=teste@exemplo.com
   ```

---

**Status**: ✅ Fase 2 Concluída
**Próxima**: Fase 3 - Sistema de Email (já implementado)
