# Relatório — migração para Stripe

## Alterações realizadas

- SDK oficial Stripe adicionada como única dependência do gateway.
- Adaptador `PaymentGateway` substituído sem alterar pedidos, reconciliação, entrega, conta ou analytics.
- Stripe Checkout Session com Price pré-configurado, cartão e Pix, retorno de sucesso/cancelamento e idempotência.
- Verificação do `PRICE_ID` contra valor, moeda e tipo do produto antes da cobrança.
- Webhook com assinatura oficial sobre corpo bruto, tolerância antirreplay e idempotência por Event ID.
- Eventos de conclusão, sucesso, falha, expiração, reembolso e disputa normalizados.
- Checkout atual preservado como pré-checkout; dados financeiros são coletados exclusivamente pela Stripe.
- Persistência atualizada para novos pedidos Stripe sem apagar o histórico anterior.
- CSP limpa de origens que não são mais carregadas pelo navegador.

## Pendência externa

`STRIPE_WEBHOOK_SECRET` não foi fornecida. O checkout permanece protegido e não inicia sessões enquanto a variável estiver ausente, porque a entrega confiável depende da verificação do webhook. O valor deve ser obtido no endpoint cadastrado no Stripe Dashboard/Workbench.

## Risco de credencial

A Secret Key de teste foi compartilhada fora de um gerenciador de segredos. Ela deve ser rotacionada no Stripe Dashboard antes de qualquer configuração definitiva, e o novo valor deve existir apenas nas variáveis protegidas do ambiente.
