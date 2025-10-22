# 🚀 CONFIGURAÇÃO SUBPATH NO VERCEL

## ✅ CONFIGURADO: `stuudia.com/bonus-gratis`

### **O que foi configurado:**

1. **Next.js Base Path**: `/bonus-gratis`
2. **Asset Prefix**: `/bonus-gratis`
3. **URLs atualizadas**:
   - Sitemap: `https://stuudia.com/bonus-gratis/sitemap.xml`
   - Metadata: `https://stuudia.com/bonus-gratis`
   - Canonical: `/bonus-gratis/`

### **Como configurar no Vercel:**

#### **1. Domain Settings**
```
Domain: stuudia.com
Redirect: stuudia.com → https://stuudia.com (se necessário)
```

#### **2. Deploy Settings**
```
Framework Preset: Next.js
Root Directory: ./ (padrão)
Build Command: npm run build
Output Directory: .next (padrão)
```

#### **3. Environment Variables**
```bash
# Adicionar no Vercel:
NEXT_PUBLIC_SITE_URL=https://stuudia.com/bonus-gratis
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
GOOGLE_SITE_VERIFICATION=seu-codigo
```

#### **4. Custom Domain (Importante!)**
```
Add Domain: stuudia.com
Type: Redirect (se já existir)
OU
Type: Production (para subpath)
```

### **URLs que funcionarão:**
- ✅ `https://stuudia.com/bonus-gratis` (homepage)
- ✅ `https://stuudia.com/bonus-gratis/sitemap.xml`
- ✅ `https://stuudia.com/bonus-gratis/api/health`
- ✅ `https://stuudia.com/bonus-gratis/api/cms/content`

### **Teste após deploy:**
```bash
# Verificar se funciona:
curl https://stuudia.com/bonus-gratis
curl https://stuudia.com/bonus-gratis/sitemap.xml
curl https://stuudia.com/bonus-gratis/api/health
```

### **URLs de redirecionamento:**
- `/bonus-gratis/home` → `/bonus-gratis/`
- `/bonus-gratis/inicio` → `/bonus-gratis/`

### **Google Search Console:**
1. Adicionar propriedade: `https://stuudia.com/bonus-gratis`
2. Enviar sitemap: `https://stuudia.com/bonus-gratis/sitemap.xml`
3. Verificar canonical URLs

### **Analytics:**
- GA4 property para: `stuudia.com/bonus-gratis`
- Configurar goals para conversões
- Cross-domain tracking se necessário

---

**Status**: ✅ **Subpath configurado e pronto para deploy no Vercel**
