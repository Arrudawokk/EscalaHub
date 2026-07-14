# PROJECT STATUS

**Projeto:** EscalaHub

**Versão atual:** v1.0 RC3

**Status:** pronta para homologação de analytics e produção

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
- Camada centralizada de analytics para GA4, Meta Pixel e Google Tag Manager.
- Eventos `page_view`, `view_item`, `begin_checkout` e `purchase` padronizados no Data Layer.
- Meta Pixel com `currency`, `value`, `content_ids`, `content_type` e `eventID` em todos os eventos relevantes.
- UTMs, `gclid` e `fbclid` preservados durante a sessão e associados aos eventos até a confirmação da compra.
- Fila segura para eventos do Meta Pixel disparados antes do carregamento do script.
- Eventos `Search` e `Lead` preparados sem gerar conversões artificiais em fluxos que ainda não os confirmam.

## Ativação operacional obrigatória

Antes de aceitar vendas reais no domínio final:

1. Provisionar PostgreSQL com pooler e executar `db/migrations/001_payment_orders.sql`.
2. Configurar `DATABASE_URL` e todas as credenciais reais do Mercado Pago.
3. Armazenar o produto em origem privada e configurar as variáveis de entrega descritas em `.env.example`.
4. Gerar `DELIVERY_TOKEN_SECRET` com no mínimo 32 caracteres aleatórios.
5. Homologar Pix, cartão aprovado/recusado, webhook, reenvio, reembolso, chargeback e download no ambiente de teste do Mercado Pago.
6. Configurar consentimento e revisar juridicamente a ativação de tags de marketing.
7. Escolher uma única rota de envio ao GA4: integração direta ou tags do GTM, nunca ambas para a mesma propriedade.
8. Validar todos os eventos no Meta Test Events, GA4 DebugView e modo Preview do GTM no domínio definitivo.

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

## Qualidade da RC3

- Eventos iniciais e de navegação centralizados, sem disparo automático duplicado dos scripts de terceiros.
- `Purchase` permanece bloqueado para pedidos pendentes, recusados, cancelados, reembolsados ou contestados.
- Data Layer disponível mesmo quando o GTM ainda não terminou de carregar.
- Falhas de scripts e integrações são isoladas e registradas como `analytics_error`, sem interromper a aplicação.
- SEO técnico, imagens, fontes, hidratação e fronteiras entre Server e Client Components revisados sem regressões.
- `npm install`, `npm run lint`, `npm run type-check` e `npm run build`: aprovados na RC3.

Consulte `docs/RC3_ANALYTICS.md`, `docs/RC3_REPORT.md`, `docs/RC2_REPORT.md` e `docs/MERCADO_PAGO.md` para a configuração, o fluxo completo e os riscos operacionais restantes.
