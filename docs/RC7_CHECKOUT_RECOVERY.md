# RC7 — Recuperação de checkout pendente

## Objetivo

Impedir que um visitante fique preso depois de abandonar ou interromper o Checkout hospedado da Stripe, sem criar cobranças duplicadas e sem alterar webhook, entrega, conta ou armazenamento.

## Fluxo implementado

1. O navegador recupera o UUID do pedido armazenado para o produto.
2. `GET /api/payments/status` busca o pedido e consulta a Checkout Session na Stripe.
3. A resposta autoritativa é reconciliada com o pedido antes de chegar ao navegador.
4. Uma sessão aberta devolve sua própria URL e apresenta **Continuar pagamento**.
5. **Cancelar pagamento** chama a Stripe para expirar a sessão e somente depois marca o pedido como cancelado.
6. Uma sessão expirada ou cancelada apresenta **Gerar novo pagamento**.
7. A renovação reconsulta a sessão anterior e cria outro pedido apenas quando ela não está aberta, usando uma nova chave idempotente.
8. Pedidos pendentes são consultados a cada 10 segundos.
9. Quando o pagamento é aprovado, a sessão da área do cliente é emitida e o navegador segue automaticamente para `/account`.

## Contratos da API

### Consultar

```text
GET /api/payments/status?orderId={uuid}
```

A resposta inclui `status`, `checkoutUrl`, `expired`, `cancelled`, `approved`, `canResume`, `canRenew`, `delivery`, `purchaseEventId` e `accountUrl`.

### Cancelar

```text
POST /api/payments/status
Content-Type: application/json

{"orderId":"{uuid}","action":"cancel"}
```

A origem é validada. A sessão Stripe aberta é expirada antes da transição para `cancelled`. O histórico nunca é apagado.

### Renovar

```text
POST /api/payments/status
Content-Type: application/json
X-Idempotency-Key: {uuid-v4}

{"orderId":"{uuid}","action":"renew"}
```

Se a sessão anterior ainda estiver aberta, a API retorna a mesma sessão. Se estiver expirada ou cancelada, a API cria um novo pedido e uma nova Checkout Session. Repetir a mesma requisição com a mesma chave retorna o mesmo resultado.

## Segurança e consistência

- Nenhuma Secret Key chega ao cliente.
- URLs de checkout são geradas e consultadas somente pela camada `PaymentGateway`.
- O cliente aceita redirecionamento apenas para `https://checkout.stripe.com`.
- Ações mutáveis validam origem, tamanho do corpo, UUID do pedido e chave idempotente.
- Uma corrida entre aprovação e cancelamento é resolvida por uma nova consulta à Stripe; pagamento aprovado não é sobrescrito por cancelamento.
- Pedidos e eventos históricos são preservados.

## Compatibilidade

Webhook, reconciliação, liberação do produto, Purchase, área do cliente, download protegido e Cloudflare R2 continuam utilizando os contratos existentes.
