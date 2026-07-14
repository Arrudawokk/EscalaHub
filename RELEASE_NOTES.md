# EscalaHub 1.0 — Release Notes

**Versão:** 1.0 RC5  
**Data:** 14/07/2026

## Visão geral

A EscalaHub 1.0 consolida a recuperação do projeto, o endurecimento do fluxo de pagamento, a mensuração de campanhas, a entrega protegida e o refinamento final de produção em uma única base publicada pela branch `main`.

## O que está incluído

- Landing Page premium, responsiva e orientada a clareza de oferta.
- Catálogo reutilizável para múltiplos produtos digitais.
- Página de produto com benefícios, módulos, público, garantia, FAQ e CTAs.
- Checkout próprio com Pix e cartão via Mercado Pago.
- Preço validado no servidor, idempotência e tratamento de estados de pagamento.
- Webhook assinado, antirreplay, deduplicação persistente e reconciliação autoritativa.
- PostgreSQL para pedidos, acessos, contas e sessões.
- Entrega automática após aprovação e download protegido.
- Área do cliente com biblioteca, histórico de pedidos e perfil preparado.
- Analytics centralizado para GA4, GTM e Meta Pixel.
- Eventos `PageView`, `ViewContent`, `InitiateCheckout` e `Purchase` com deduplicação.
- Preservação de UTMs, `gclid` e `fbclid` durante a jornada.
- SEO técnico com canonical, Open Graph, Twitter Cards, JSON-LD, robots, sitemap, favicon e manifest.
- Blog baseado em arquivos, páginas institucionais e políticas.
- Estados de loading, erro, vazio e 404 consistentes.
- Headers de segurança e separação entre dados públicos e segredos.

## Refinamentos da RC5

- Copy da Home revisada para evitar promessas implícitas de rentabilidade.
- Oferta final com preço, garantia, acesso e ausência de mensalidade.
- FAQ conectado ao catálogo, sem conteúdo duplicado.
- URL canônica e callback do webhook compatíveis com variáveis automáticas da Vercel.
- Menor hidratação global e menu mobile sem dependência de Framer Motion.
- Checkout com estado explícito do SDK de cartão e Pix preservado como alternativa.
- Validação antecipada dos dados do cartão antes da tokenização.
- Headers adicionais de isolamento e política cross-domain.

## Qualidade

- Dependências auditadas sem vulnerabilidades reportadas.
- ESLint aprovado.
- TypeScript aprovado.
- Build Next.js aprovado com 33 rotas.
- Home, produto, checkout, blog e conta validados.
- 404, canonical, robots e sitemap validados no build de produção.

## Antes de vender

Preencha as credenciais reais da Vercel, execute as migrações, conecte a origem privada do produto, homologue o Mercado Pago no sandbox e valide GA4, GTM e Meta Pixel no domínio definitivo. Consulte `docs/RC5_REPORT.md` e `docs/DEPLOY.md` para o checklist operacional.
