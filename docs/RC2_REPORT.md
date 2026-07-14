# EscalaHub RC2 — Confiabilidade do fluxo de compra

Data: 13 de julho de 2026

Escopo: produto, checkout, Mercado Pago, webhook, confirmação, entrega, analytics, performance e SEO relacionados à jornada de compra.

## Resultado executivo

**Status do código: aprovado para homologação final.**

A RC2 removeu os dois bloqueios arquiteturais centrais da RC1: pedidos em memória e ausência de entrega vinculada à aprovação. O fluxo agora possui persistência PostgreSQL, reconciliação idempotente, deduplicação de webhook e download protegido.

A liberação comercial depende da configuração da infraestrutura real e da homologação com credenciais do proprietário. Nenhum ID, token, arquivo ou credencial fictícia foi inserido.

## Arquivos modificados

- `.env.example`
- `PROJECT_STATUS.md`
- `package.json` e `package-lock.json`
- `app/api/payments/create/route.ts`
- `app/api/payments/status/route.ts`
- `app/api/payments/webhook/route.ts`
- `app/api/delivery/download/route.ts`
- `components/product/Checkout.tsx`
- `lib/analytics.ts`
- `lib/catalog/types.ts` e `lib/catalog/products.ts`
- `lib/payments/types.ts`
- `lib/payments/mercadoPago.ts`
- `lib/payments/orderStore.ts`
- `lib/payments/reconciliation.ts`
- `lib/payments/delivery.ts`
- `lib/server/logger.ts`
- `db/migrations/001_payment_orders.sql`
- `docs/MERCADO_PAGO.md`
- `docs/DEPLOY.md`
- `docs/RC2_REPORT.md`

## Problemas encontrados

1. Pedidos existiam somente na memória de uma instância Node.js.
2. Webhooks repetidos eram idempotentes apenas pelo estado final, sem registro persistente do evento.
3. A confirmação dependia do webhook; o polling não reconsultava o gateway.
4. A aprovação não concedia acesso a nenhum recurso de entrega.
5. Reembolso e chargeback não revogavam acesso porque não existia estado de acesso.
6. A tela afirmava envio de instruções por e-mail sem integração transacional implementada.
7. Fechar a página durante a confirmação perdia a referência local do pedido.
8. `Purchase` dependia do estado visual e não possuía proteção local adicional contra repetição.
9. Webhook sem headers obrigatórios podia chegar à inicialização do gateway antes de ser recusado.
10. Produção podia iniciar o checkout sem uma garantia explícita de persistência durável.

## Problemas corrigidos

### Persistência e estados

- Implementação PostgreSQL adicionada sem quebrar a interface `OrderStore`.
- Referência externa e ID do gateway possuem unicidade no banco.
- Valor é armazenado em centavos inteiros.
- Atualização do pagamento, concessão/revogação de acesso e conclusão do evento ocorrem na mesma transação.
- Estados terminais continuam impedidos de regredir.
- Produção sem `DATABASE_URL` falha de forma segura antes de criar cobrança.

### Mercado Pago e webhook

- Timeout de oito segundos preservado; o SDK instalado possui retry de falhas 5xx.
- Criação continua usando chave idempotente estável.
- Assinatura, request ID, tópico, ID numérico e janela antirreplay são validados.
- O pagamento é sempre reconsultado no Mercado Pago.
- Chave SHA-256 do evento é persistida para deduplicação.
- Status, ID, referência, método, valor, moeda e e-mail são reconciliados.
- Falhas temporárias retornam `503` com `Retry-After` para permitir reenvio.
- Logs estruturados usam apenas identificadores operacionais e status.

### Confirmação e entrega

- Polling reivindica sincronização com intervalo distribuído e consulta o gateway quando necessário.
- Aprovação concede acesso automaticamente.
- Reembolso e chargeback revogam acesso.
- Download usa HMAC SHA-256, expira em 15 minutos e revalida o pedido.
- A origem privada é transmitida por streaming sem expor URL ou autorização.
- Redirecionamentos de origem são recusados.
- O pedido pode ser retomado por 30 dias no mesmo navegador usando apenas o UUID, sem PII.
- Copy e mensagens do checkout agora descrevem o fluxo realmente implementado.

### Analytics, UX, performance e SEO

- `Purchase` usa o ID fornecido pelo estado aprovado do servidor.
- GA4, Meta e GTM recebem o mesmo identificador de deduplicação.
- Repetição no navegador é bloqueada por memória e armazenamento local.
- Loading, foco de erro, estados pendentes e retomada foram refinados.
- Checkout validado em 390 px e 1366 px sem overflow de conteúdo; controles interativos mantêm ao menos 44 px.
- Metadata, canonical, Open Graph, Twitter Cards, robots, sitemap e JSON-LD foram auditados e preservados.
- Nenhum novo Client Component amplo, imagem pesada ou dependência visual foi adicionado.

## Validações

- `npm install`: aprovado; 367 pacotes auditados, zero vulnerabilidades.
- `npm run lint`: aprovado sem erros.
- `npm run type-check`: aprovado sem erros.
- `npm run build`: aprovado no Next.js 16.2.10.
- Rotas geradas: 26, incluindo quatro APIs dinâmicas do fluxo.
- Testes negativos locais:
  - status inválido: `400`;
  - pedido inexistente: `404`;
  - download sem token: `400`;
  - webhook sem assinatura: `401`;
  - criação com origem externa: `403`.

## Riscos restantes

### Bloqueiam ativação comercial

1. O arquivo final do e-book não foi fornecido no repositório nem no ZIP original; somente a capa existe. A origem privada real precisa ser configurada.
2. A migração precisa ser executada no PostgreSQL do ambiente antes do deploy.
3. Credenciais reais e webhook do Mercado Pago precisam ser homologados pelo proprietário no domínio final.
4. Tags de marketing precisam de consentimento e revisão jurídica antes da ativação.
5. O dashboard continua público e não deve receber dados reais.

### Antes de escalar tráfego

- Rate limiting distribuído/WAF.
- Alertas de banco, webhook, gateway e entrega.
- E-mail transacional e área do cliente como recuperação adicional.
- Testes E2E sandbox para Pix, cartão, timeout, replay, reembolso e chargeback.
- Meta Conversions API/Google Enhanced Conversions server-side.
- Backup e restauração do PostgreSQL validados.

## Pendências de homologação

1. Provisionar banco com pooler e aplicar a migração.
2. Subir o e-book para storage privado e configurar as variáveis de entrega.
3. Configurar as credenciais do mesmo ambiente do Mercado Pago.
4. Registrar a URL HTTPS do webhook.
5. Executar a matriz completa de pagamentos no sandbox.
6. Confirmar analytics nas ferramentas de depuração com IDs reais.

## Critério de aprovação

O código da RC2 está aprovado. A publicação comercial deve ocorrer somente depois que todos os itens de ativação operacional forem concluídos e registrados.
