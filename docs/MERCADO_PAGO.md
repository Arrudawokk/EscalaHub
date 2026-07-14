# Integração com o Mercado Pago

## Visão geral

O checkout processa Pix e cartão pela camada abstrata `PaymentGateway`. Somente `lib/payments/mercadoPago.ts` importa o SDK do Mercado Pago. Rotas, componentes, persistência e entrega dependem apenas dos contratos internos.

```text
lib/payments/
  types.ts            tipos de domínio
  interfaces.ts       contrato do gateway
  gateway.ts          ponto único de acesso ao gateway
  mercadoPago.ts      adaptador do Mercado Pago
  orderStore.ts       contrato e implementações de persistência
  reconciliation.ts   comparação e aplicação autoritativa
  delivery.ts         autorização de download protegido
```

## Fluxo de compra

1. O navegador gera uma referência UUID v4 e a preserva durante reenvios incertos.
2. O backend valida origem, tamanho, produto, valor, nome, e-mail, CPF, método e token do cartão.
3. O pedido `pending` é persistido antes de chamar o gateway.
4. O Mercado Pago cria o pagamento com chave de idempotência determinística.
5. A resposta é comparada com o pedido: referência, ID, método, moeda, valor e e-mail precisam coincidir.
6. A atualização é aplicada em transação. `approved` concede acesso; `refunded` e `charged_back` revogam acesso.
7. O webhook valida assinatura e janela de cinco minutos, consulta o pagamento diretamente no gateway e registra uma chave de evento persistente.
8. O polling consulta o banco e, quando necessário, reconcilia diretamente com o Mercado Pago. Assim, a confirmação não depende exclusivamente do webhook.
9. Um pedido aprovado recebe um link HMAC temporário para `/api/delivery/download`.
10. A entrega revalida assinatura, expiração, pedido, status e acesso antes de transmitir a origem privada.
11. O navegador registra `Purchase` com a referência autoritativa do pedido como `transaction_id`/`eventID`.

## Persistência

Produção exige PostgreSQL por `DATABASE_URL`. O driver usa uma conexão por instância, sem prepared statements, para funcionar com poolers de ambientes serverless.

Execute a migração antes do deploy:

```bash
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f db/migrations/001_payment_orders.sql
```

A migração cria:

- `payment_orders`, com referência UUID primária e ID do gateway único;
- estados normalizados de pagamento e acesso;
- timestamps de concessão e sincronização;
- `payment_webhook_events`, com chave SHA-256 única e processamento transacional.

Sem `DATABASE_URL`, o fallback em memória existe somente em desenvolvimento. Em produção, o checkout retorna indisponibilidade e não cria cobrança sem persistência.

## Segurança

- PAN, validade e CVV são tokenizados pelo Mercado Pago.js e nunca chegam ao backend.
- Preço e moeda sempre vêm do catálogo no servidor.
- POST de criação exige origem autorizada em produção.
- O SDK usa timeout de oito segundos e retry para falhas 5xx; reenvios de criação reutilizam a mesma chave idempotente.
- Webhook sem `x-signature` e `x-request-id` é recusado antes de acessar gateway ou banco.
- O payload do webhook nunca é fonte de verdade.
- Eventos repetidos e transições fora de ordem não duplicam a liberação nem regridem estados terminais.
- Logs estruturados não registram CPF, e-mail, token, assinatura ou credenciais.
- Links de download expiram em 15 minutos e usam comparação criptográfica constante.
- A rota de download não segue redirecionamentos da origem privada e nunca expõe sua URL ou autorização.

## Variáveis obrigatórias em produção

| Variável | Uso |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | URL HTTPS canônica e webhook. |
| `NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY` | Tokenização no navegador. |
| `MERCADO_PAGO_ACCESS_TOKEN` | API server-to-server. |
| `MERCADO_PAGO_WEBHOOK_SECRET` | Validação HMAC. |
| `DATABASE_URL` | PostgreSQL com pooler. |
| `DELIVERY_TOKEN_SECRET` | Assinatura dos downloads; mínimo de 32 caracteres aleatórios. |
| `PRODUCT_TRAFEGO_DOWNLOAD_URL` | URL HTTPS privada do arquivo. |

`PRODUCT_TRAFEGO_DOWNLOAD_AUTHORIZATION` é opcional e recebe o valor completo do header `Authorization` exigido pela origem.

## Analytics

- `ViewContent`: visita ao produto.
- `InitiateCheckout`: abertura do checkout.
- `Purchase`: somente depois de status `approved` persistido com acesso concedido.
- GA4 recebe `transaction_id`; Meta recebe `eventID`; GTM recebe `event_id`.
- O navegador também evita repetir o mesmo pedido localmente.

## Riscos operacionais restantes

- Executar a migração e configurar banco, storage e credenciais reais.
- Homologar todos os estados no ambiente de teste do Mercado Pago e depois uma compra controlada no domínio final.
- Adicionar rate limiting distribuído/WAF e alertas antes de escalar campanhas.
- Adicionar e-mail transacional e área do cliente como canais alternativos de recuperação.
- Implementar Conversions API/Enhanced Conversions server-side e consentimento conforme a base legal adotada.
