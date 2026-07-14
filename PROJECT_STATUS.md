# PROJECT STATUS

**Projeto:** EscalaHub

**Versão atual:** v1.0 RC2

**Status:** pronta para homologação final de produção

**Última atualização:** 13/07/2026

## Objetivo

Construir uma plataforma própria, segura e escalável de venda de produtos digitais, independente de marketplaces e preparada para suportar centenas de produtos.

## Stack

- Next.js 16 com App Router
- React 19 e TypeScript
- Tailwind CSS e Framer Motion
- Mercado Pago
- PostgreSQL

## Funcionalidades concluídas

- Home, página de produto, checkout, blog e páginas institucionais.
- Catálogo tipado e reutilizável de produtos.
- Design System e interface responsiva.
- SEO técnico com metadata, canonical, Open Graph, Twitter Cards, sitemap, robots e JSON-LD.
- Analytics preparado para GA4, GTM e Meta Pixel.
- Checkout próprio com Pix e cartão tokenizado pelo Mercado Pago.js.
- Criação de pagamento idempotente, preço validado pelo catálogo e reconciliação server-to-server.
- Persistência transacional de pedidos em PostgreSQL por meio da abstração `OrderStore`.
- Webhook com assinatura, janela antirreplay, deduplicação persistente e transições de estado protegidas.
- Atualização, liberação e revogação de acesso na mesma transação do pedido.
- Reconciliação ativa pelo endpoint de status quando o webhook atrasa.
- Download protegido por HMAC, expiração curta, validação do pedido e proxy de origem privada.
- Retomada do pedido no navegador sem persistir e-mail, CPF ou dados de cartão.
- Evento `Purchase` ligado somente a pedido aprovado, com identificador estável para deduplicação.

## Ativação operacional obrigatória

Antes de aceitar vendas reais no domínio final:

1. Provisionar PostgreSQL com pooler e executar `db/migrations/001_payment_orders.sql`.
2. Configurar `DATABASE_URL` e todas as credenciais reais do Mercado Pago.
3. Armazenar o produto em origem privada e configurar as variáveis de entrega descritas em `.env.example`.
4. Gerar `DELIVERY_TOKEN_SECRET` com no mínimo 32 caracteres aleatórios.
5. Homologar Pix, cartão aprovado/recusado, webhook, reenvio, reembolso, chargeback e download no ambiente de teste do Mercado Pago.
6. Configurar consentimento e revisar juridicamente a ativação de tags de marketing.

## Prioridades P0 restantes da aplicação

- Proteger o dashboard com autenticação e autorização antes de conectar dados reais.
- Executar a homologação operacional acima no domínio definitivo.
- Validar backup, restauração e alertas do banco de produção.

## Prioridades P1

- Rate limiting distribuído/WAF nos endpoints de pagamento.
- Monitoramento e alertas para falhas de webhook, banco, gateway e entrega.
- E-mail transacional como canal adicional de recuperação do acesso.
- Área do cliente com histórico de pedidos e novo download autenticado.
- Meta Conversions API e Google Enhanced Conversions server-side.
- Testes E2E automatizados no ambiente sandbox do Mercado Pago.

## Decisões técnicas

- A aplicação continua desacoplada do Mercado Pago por `PaymentGateway`.
- O armazenamento continua desacoplado por `OrderStore`.
- Em desenvolvimento sem `DATABASE_URL`, existe fallback em memória; em produção, a aplicação falha de forma segura e recusa o checkout sem banco.
- O arquivo digital nunca fica em `public/`; a rota de entrega valida o acesso antes de buscar a origem privada.
- Dados de cartão nunca passam pelo servidor da EscalaHub.
- Nenhum segredo utiliza prefixo `NEXT_PUBLIC_`.

## Qualidade da RC2

- `npm install`: aprovado, sem vulnerabilidades reportadas.
- `npm run lint`: aprovado.
- `npm run type-check`: aprovado.
- `npm run build`: aprovado.
- Rotas negativas de status, download, webhook e origem do checkout: validadas.
- Checkout revisado em mobile e desktop sem overflow de conteúdo.

Consulte `docs/RC2_REPORT.md` e `docs/MERCADO_PAGO.md` para o fluxo completo, os controles de segurança e os riscos operacionais restantes.
