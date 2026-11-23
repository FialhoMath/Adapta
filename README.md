# Adapta — Landing Page + contador de cliques do CTA

Stack: **Next.js 15 (App Router) + TypeScript + Tailwind v4 + PostgreSQL**.

- Front e back no mesmo projeto: deploy em 1 clique na Vercel.
- Postgres garante persistência real e incremento atômico (sem perder cliques simultâneos).
- Em produção: Neon ou Vercel Postgres (gratuitos). Localmente: Docker.

## Estrutura

```
adapta-landing/
├── docker-compose.yml          # Postgres local
├── .env.example                # DATABASE_URL
├── public/logo.png             # ← coloque aqui a logo oficial
└── src/
    ├── app/
    │   ├── layout.tsx          # metadados, fonte
    │   ├── page.tsx            # landing page
    │   ├── demonstracao/page.tsx  # destino do CTA (página de teste)
    │   ├── globals.css         # cores da marca (@theme)
    │   └── api/cta-clicks/route.ts   # GET total | POST clique
    ├── components/
    │   ├── CtaCounter.tsx      # botão, contador, retry, fila offline
    │   └── Logo.tsx
    └── lib/
        ├── db.ts               # pool pg, schema automático, SQL atômico
        └── contact.ts          # WhatsApp, e-mail, Instagram
```

## Rodar localmente

```bash
npm install
cp .env.example .env
docker compose up -d db        # sobe o Postgres
npm run dev                    # http://localhost:3000
```

As tabelas são criadas automaticamente na primeira requisição.

## Deploy (Vercel + Neon)

1. Crie um banco em https://neon.tech e copie a connection string.
2. Importe o repositório na Vercel e defina `DATABASE_URL` em *Environment Variables*.
3. Faça o deploy.

## Como o contador funciona

| Proteção | Onde |
|---|---|
| Cooldown de 1,5 s contra clique duplo | `CtaCounter.tsx` |
| Atualização otimista (+1 na hora) | `CtaCounter.tsx` |
| Retry com backoff (3 tentativas) | `sendClick()` |
| Idempotência: cada clique tem um UUID; reenvio não conta 2x | `cta_clicks.id` (PK) + `ON CONFLICT DO NOTHING` |
| Fila offline (localStorage), reenviada no evento `online` | `CtaCounter.tsx` |
| Incremento atômico em uma única query | `registerClick()` em `db.ts` |
| Atualização ao vivo entre visitantes (polling 5 s, pausa com aba oculta) | `CtaProvider` |

API:
- `GET /api/cta-clicks` → `{ "total": 42 }`
- `POST /api/cta-clicks` com `{ "clickId": "<uuid>" }` → `{ "total": 43, "duplicate": false }`

## Personalizar

- Cores: `src/app/globals.css` (`--color-brand`, `--color-accent`…)
- Contatos: `src/lib/contact.ts`
- Página de destino do CTA: `src/app/demonstracao/page.tsx`
