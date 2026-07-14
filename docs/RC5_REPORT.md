# RC5 — Production Readiness Report

**Data:** 14/07/2026  
**Escopo:** estabilidade, conversão, checkout, SEO, performance, segurança e mensuração  
**Branch:** `main`

## Resumo executivo

A RC5 refinou a jornada pública sem alterar a arquitetura, o Design System ou as regras de negócio. A Landing Page comunica oferta, preço, garantia e acesso com mais clareza; o checkout reage corretamente à disponibilidade do SDK do Mercado Pago; e a URL canônica deixou de depender exclusivamente de uma variável manual na Vercel.

O código está compilável e preparado para produção. A ativação de vendas e tráfego pago ainda depende da configuração e homologação das credenciais reais listadas em **Pendências P0**. Nenhum ID, depoimento, contador, certificação ou promessa foi inventado.

## Arquivos modificados

- `.env.example`
- `PROJECT_STATUS.md`
- `RELEASE_NOTES.md`
- `app/api/payments/create/route.ts`
- `app/globals.css`
- `app/template.tsx`
- `components/layout/Header.tsx`
- `components/marketing/CTA.tsx`
- `components/marketing/FAQ.tsx`
- `components/marketing/Hero.tsx`
- `components/product/Checkout.tsx`
- `docs/DEPLOY.md`
- `docs/RC5_REPORT.md`
- `lib/catalog/products.ts`
- `lib/site.ts`
- `next.config.ts`

## Melhorias implementadas

### Landing Page e conversão

- Correção da pontuação da headline principal.
- Remoção da expressão “campanhas lucrativas”, evitando promessa implícita de resultado financeiro.
- Oferta final passou a exibir preço, pagamento único, ausência de mensalidade, garantia e acesso após confirmação.
- CTA final ganhou texto mais explícito sobre conteúdo e acesso.
- FAQ da Home passou a consumir o catálogo do produto, mantendo a copy consistente entre Home e página de venda.
- Prova social continua oculta enquanto não houver depoimentos reais e autorizados.
- Nenhuma urgência artificial, escassez falsa ou contador foi adicionado.

### Checkout e Mercado Pago

- O SDK client-side usa `onReady`, cobrindo o primeiro carregamento e remontagens após navegação.
- Estados de carregamento, disponibilidade e falha do SDK de cartão foram tratados.
- Cartão fica indisponível até o SDK estar pronto; Pix permanece utilizável quando o script ou a Public Key estiverem ausentes.
- Mensagem acessível informa a indisponibilidade temporária do cartão sem interromper o restante do checkout.
- Nome, e-mail, número do cartão, validade e CVV receberam limites e validações antes da tokenização.
- Cartão vencido é bloqueado antes da chamada ao SDK.
- PAN e CVV continuam restritos ao navegador e não são enviados ao servidor da EscalaHub.
- A criação de pagamento continua passando exclusivamente pela abstração `PaymentGateway`.

### SEO e deploy

- `NEXT_PUBLIC_SITE_URL` continua tendo prioridade para o domínio definitivo.
- Na Vercel, `VERCEL_PROJECT_PRODUCTION_URL` e, como contingência, `VERCEL_URL` fornecem a URL pública quando a variável manual não existe.
- Canonical, Open Graph, robots e sitemap foram validados localmente usando `https://teste-site-qnxk.vercel.app`.
- O callback do webhook usa a mesma origem HTTPS validada e deixa de ficar indisponível apenas pela ausência de `NEXT_PUBLIC_SITE_URL` na Vercel.
- Valores inválidos ou HTTP fora de desenvolvimento são rejeitados pela normalização da URL.

### Performance e UX

- O template raiz deixou de hidratar toda a aplicação apenas para aplicar um fade de página.
- Framer Motion foi removido do Header; a entrada do menu mobile foi preservada com CSS e respeita `prefers-reduced-motion`.
- Server Components, `next/image`, lazy loading padrão, imagens com dimensões e code splitting por rota foram preservados.
- A imagem LCP do Hero continua marcada para preload; imagens abaixo da dobra continuam sob carregamento tardio do Next/Image.

### Segurança

- URLs de produção são normalizadas e limitadas a HTTPS, com HTTP permitido somente em localhost durante desenvolvimento.
- Headers `Cross-Origin-Opener-Policy: same-origin-allow-popups` e `X-Permitted-Cross-Domain-Policies: none` foram adicionados.
- CSP, HSTS, proteção contra framing, webhook assinado, janela antirreplay, idempotência persistente e validação autoritativa junto ao gateway foram preservados.
- Nenhum segredo foi encontrado versionado; `.env*` permanece ignorado, exceto `.env.example`.

### Analytics

- `PageView`, `ViewContent`, `InitiateCheckout` e `Purchase` permanecem centralizados.
- `Purchase` continua restrito a pedidos aprovados e deduplicado pelo identificador estável do pedido.
- UTMs, `gclid` e `fbclid` continuam preservados durante a sessão.
- GA4 direto e GTM continuam mutuamente exclusivos por configuração documentada para impedir duplicação.

## Problemas corrigidos

1. Canonical e Open Graph do deploy operacional apontavam para `escalahub.com`, que atualmente hospeda outra aplicação.
2. A URL de webhook dependia exclusivamente de `NEXT_PUBLIC_SITE_URL`, deixando o checkout indisponível quando essa variável não estava definida.
3. O SDK de cartão não tratava erro de carregamento nem remontagem de rota.
4. O checkout permitia selecionar cartão antes de o SDK estar pronto.
5. Validações de validade e formato do cartão dependiam excessivamente do retorno do SDK.
6. A Home duplicava perguntas do catálogo.
7. A aplicação hidratava um template global apenas para uma animação de opacidade.
8. A copy “campanhas lucrativas” podia sugerir resultado financeiro garantido.

## Validação executada

- `npm install`: aprovado; 367 pacotes auditados e 0 vulnerabilidades.
- `npm run lint`: aprovado.
- `npm run type-check`: aprovado.
- `npm run build`: aprovado com Next.js 16.2.10.
- Build de produção com `VERCEL_PROJECT_PRODUCTION_URL`: aprovado.
- 33 rotas geradas.
- `/`, produto, checkout, blog e conta: HTTP 200 no servidor compilado.
- rota inexistente: HTTP 404 com fallback próprio.
- canonical da Home e produto: origem operacional correta no build Vercel-equivalente.
- robots e sitemap: origem operacional correta.
- busca por `console.log`, `TODO`, `FIXME`, `ts-ignore` e `eslint-disable`: nenhum resultado relevante.

## Pendências P0 antes de tráfego pago

1. Configurar e validar na Vercel `NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY`, `MERCADO_PAGO_ACCESS_TOKEN`, `MERCADO_PAGO_WEBHOOK_SECRET`, `DATABASE_URL`, `DELIVERY_TOKEN_SECRET` e a origem privada do produto.
2. Executar as migrações `001_payment_orders.sql` e `002_customer_accounts.sql` no PostgreSQL de produção.
3. Homologar Pix, cartão aprovado/recusado, webhook, reenvio, reembolso, chargeback e download usando credenciais de teste do Mercado Pago.
4. Ativar ao menos uma rota de mensuração para GA4 (`NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` ou GTM) e configurar `NEXT_PUBLIC_META_PIXEL_ID` com IDs reais.
5. Validar Meta Test Events, GA4 DebugView e GTM Preview no domínio definitivo.
6. Apontar o domínio definitivo para este projeto. Em 14/07/2026, `escalahub.com` ainda publicava outra aplicação.
7. Consolidar os projetos Vercel duplicados após comparar domínios e variáveis.
8. Confirmar que `contato@escalahub.com` recebe solicitações de suporte e garantia.

Na auditoria externa anterior ao deploy RC5, o HTML público não continha o SDK do Mercado Pago, GA4, GTM ou Meta Pixel. Isso indica variáveis públicas ausentes ou inválidas; valores secretos não foram inspecionados nem inferidos.

## Recomendações

- Ativar rate limiting distribuído ou regras WAF nos endpoints de criação e consulta de pagamentos.
- Configurar monitoramento para falhas de banco, gateway, webhook e entrega.
- Executar testes E2E no sandbox do Mercado Pago antes de cada release de pagamentos.
- Coletar Core Web Vitals reais após iniciar tráfego e priorizar dados de campo sobre simulações.
- Conectar o provedor de e-mail transacional já abstraído e processar envios com fila persistente.
- Manter depoimentos ocultos até existir consentimento e comprovação.

## Decisão de release

**Código RC5: aprovado.**  
**Ativação de vendas reais: condicionada às pendências P0.**

A aplicação pode ser publicada para validação técnica e editorial. Campanhas com investimento e cobranças reais só devem começar depois da homologação operacional das credenciais, banco, webhook, entrega e mensuração.
