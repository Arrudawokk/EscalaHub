# Integração Stripe

## Visão geral

A EscalaHub mantém seu pré-checkout, pedidos, reconciliação, entrega e analytics. A autorização financeira ocorre em uma página hospedada pela Stripe, criada por `POST /api/payments/create`. Somente `lib/payments/stripe.ts` importa a SDK oficial.

O navegador nunca recebe `STRIPE_SECRET_KEY` ou `STRIPE_WEBHOOK_SECRET`. O acesso ao produto é concedido no servidor somente depois que a Stripe confirma pagamento aprovado.

## Variáveis obrigatórias

| Variável | Origem |
| --- | --- |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard, Developers, API keys, Publishable key. |
| `STRIPE_SECRET_KEY` | Stripe Dashboard, Developers, API keys, Secret key. Somente servidor. |
| `STRIPE_WEBHOOK_SECRET` | Stripe Dashboard, Developers/Workbench, Webhooks, endpoint da EscalaHub, Reveal secret. |
| `PRICE_ID` | Stripe Dashboard, Product catalog, produto, preço único em BRL. |

As chaves pública e secreta precisam pertencer ao mesmo modo. O `PRICE_ID` deve estar ativo, ser do tipo pagamento único, usar BRL e ter exatamente o valor do catálogo da EscalaHub. Teste usa `pk_test_`, `sk_test_`; produção usa `pk_live_`, `sk_live_`.

## Endpoint do webhook

```text
POST https://SEU-DOMINIO/api/payments/webhook
```

Cadastre estes eventos:

- `checkout.session.completed`
- `checkout.session.expired`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `charge.refunded`
- `charge.dispute.created`

Copie o Signing secret do endpoint para `STRIPE_WEBHOOK_SECRET`. Cada ambiente/endpoint possui seu próprio segredo.

## Fluxo

1. A EscalaHub valida origem, produto, nome, e-mail e chave de idempotência.
2. Um pedido pendente é persistido antes da chamada ao gateway.
3. O adaptador consulta o Price e rejeita divergência de valor, moeda, atividade ou recorrência.
4. A Checkout Session recebe o UUID do pedido em `client_reference_id` e metadata.
5. O visitante é redirecionado para a URL temporária da Stripe.
6. Ao retornar, a página consulta o pedido; o retorno de sucesso nunca concede acesso sozinho.
7. O webhook valida o corpo bruto e `Stripe-Signature` com tolerância de cinco minutos.
8. O evento é reconsultado na API, reconciliado com pedido, valor, moeda e e-mail e aplicado de forma idempotente.
9. Apenas pagamento `paid` concede acesso e prepara o evento Purchase. Reembolso ou disputa revoga o acesso.

## URLs de retorno

Sucesso:

```text
https://SEU-DOMINIO/checkout?product={slug}&orderId={uuid}&stripe=success&session_id={CHECKOUT_SESSION_ID}
```

Cancelamento:

```text
https://SEU-DOMINIO/checkout?product={slug}&orderId={uuid}&stripe=cancelled
```

O host é derivado de `NEXT_PUBLIC_SITE_URL` ou, na Vercel, de `VERCEL_PROJECT_PRODUCTION_URL`.

## Persistência

Execute `db/migrations/003_stripe_gateway.sql` depois das migrações 001 e 002. Ela torna Stripe o padrão para novos pedidos e preserva pedidos históricos do gateway anterior.

## Homologação

Antes de aceitar vendas reais:

1. Use somente credenciais de teste e um Price de teste.
2. Teste cartão aprovado, recusado, Pix quando habilitado na conta, cancelamento e expiração.
3. Reenvie o mesmo evento no Workbench e confirme que não existe liberação duplicada nem Purchase duplicado.
4. Teste evento com assinatura inválida e confirme resposta 401.
5. Teste reembolso e disputa, verificando revogação do acesso.
6. Confirme pedido, biblioteca, download protegido e analytics.
7. Repita uma compra controlada com credenciais live e domínio final antes de iniciar tráfego pago.

## Segurança operacional

- Nunca versionar arquivos `.env` reais.
- Nunca registrar chaves, corpo de cartão ou cabeçalho de assinatura.
- Rotacionar imediatamente qualquer Secret Key exposta fora do gerenciador de segredos.
- O webhook é a fonte de verdade da entrega; a página de sucesso serve apenas para feedback e polling.
