-- Tabela para capturas da Landing Page
CREATE TABLE lead_captures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  whatsapp TEXT,                        -- opcional
  origin TEXT,                          -- utm/referrer/canal
  answers JSONB,                        -- respostas do formulário
  status TEXT NOT NULL DEFAULT 'pending', -- pending | email_validated | whatsapp_validated | converted
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  validated_at TIMESTAMPTZ,
  converted_at TIMESTAMPTZ
);

-- Índices úteis
CREATE INDEX lead_captures_created_at_idx ON lead_captures (created_at DESC);
CREATE INDEX lead_captures_status_idx ON lead_captures (status);

-- (Opcional) Constraint para limitar status a valores conhecidos
ALTER TABLE lead_captures
  ADD CONSTRAINT lead_captures_status_chk
  CHECK (status IN ('pending','email_validated','whatsapp_validated','converted'));