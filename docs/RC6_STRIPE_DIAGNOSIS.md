# RC6 — Diagnóstico definitivo da Stripe

**Data:** 18/07/2026  
**Endpoint:** `POST /api/payments/create`  
**Ambiente validado:** `https://escala-hub-six.vercel.app`

## Sintoma

O endpoint retornava HTTP 502 e registrava apenas `payment.gateway_unavailable`, ocultando a resposta original da SDK da Stripe.

## Diagnóstico implementado

O `catch` de `StripeGateway.createPayment()` passou a registrar no servidor:

- o objeto de erro original;
- `type`;
- `code`;
- `message`;
- `param`;
- `decline_code`;
- `request_id`;
- `statusCode`;
- `raw`;
- `stack`.

A resposta pública permaneceu genérica e não expõe esses dados ao navegador.

## Erros confirmados

### 1. Pix inativo

- Tipo: `StripeInvalidRequestError`
- Status Stripe: HTTP 400
- Parâmetro: `payment_method_types`
- Mensagem: o método `pix` é inválido porque não está ativado na conta.
- Decisão: remover `pix` da sessão. Nenhuma hipótese foi usada; a causa veio da resposta da Stripe.

### 2. Métodos dinâmicos indisponíveis

Depois de remover a lista manual, a Stripe informou que não havia nenhum método dinâmico válido para a moeda e orientou a informar `payment_method_types` explicitamente.

- Tipo: `StripeInvalidRequestError`
- Status Stripe: HTTP 400
- Mensagem: nenhum método de pagamento válido estava disponível para a Checkout Session.
- Decisão: informar somente `card`, o método aceito pela conta na primeira validação.

## Correção final

`StripeGateway.createPayment()` cria a Checkout Session com:

```ts
payment_method_types: ["card"]
```

Nenhuma regra de pedido, webhook, entrega, analytics ou reconciliação foi alterada.

## Validação

- `npm run lint`: aprovado.
- `npm run type-check`: aprovado.
- `npm run build`: aprovado.
- Next.js 16.2.10: 33 rotas geradas.
- Deploy Vercel do commit `d28dd33`: `Ready`.
- Requisição real ao endpoint publicado: HTTP 201.
- Pedido criado com estado `pending`.
- Checkout Session criada e URL em `checkout.stripe.com` retornada.
- Nenhum pagamento foi concluído durante o diagnóstico.

## Estado operacional

- Cartão: criação de sessão validada.
- Pix: indisponível até ser ativado na conta Stripe; não é enviado pelo código atual.
- Webhook e confirmação: não foram acionados porque nenhuma compra foi concluída nesta RC.
- Existem três projetos Vercel conectados ao mesmo repositório. O ambiente que reproduziu e resolveu o 502 foi `escala-hub`; os demais não devem ser usados como evidência do checkout operacional sem configurar as mesmas variáveis.
