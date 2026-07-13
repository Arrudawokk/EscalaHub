# EscalaHub Architecture

## Projeto

EscalaHub é uma plataforma própria de venda de infoprodutos desenvolvida em Next.js.

O objetivo é possuir uma plataforma escalável, independente de marketplaces como Kiwify ou Hotmart.

O projeto deve permitir adicionar novos produtos sem alterar sua arquitetura.

---

# Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion

---

# Estrutura

app/

Rotas da aplicação.

components/

Componentes reutilizáveis da interface.

lib/

Lógica compartilhada.

public/

Imagens e arquivos estáticos.

---

# Princípios

Nunca recriar componentes existentes.

Sempre reutilizar componentes.

Nunca alterar a arquitetura sem necessidade.

Sempre manter o Design System.

Evitar código duplicado.

Utilizar TypeScript fortemente tipado.

---

# Produtos

Todos os produtos devem utilizar o catálogo existente.

Nunca criar produtos hardcoded.

A Home e a Página do Produto devem consumir os dados do catálogo.

---

# Checkout

O checkout pertence à EscalaHub.

Não utilizar checkout hospedado por terceiros.

A interface do checkout nunca deve depender diretamente do gateway de pagamento.

---

# Gateway

O projeto utiliza uma camada de abstração.

lib/payments/

gateway.ts

mercadoPago.ts

types.ts

interfaces.ts

utils.ts

orderStore.ts

O restante da aplicação nunca conversa diretamente com o Mercado Pago — apenas com `getPaymentGateway()` em `gateway.ts`.

Isso permite adicionar Stripe futuramente sem alterar a interface. Ver `docs/MERCADO_PAGO.md` para detalhes do fluxo, segurança e limitações conhecidas.

---

# Eventos

Toda compra deve permitir integração com:

Meta Pixel

Google Analytics 4

Google Tag Manager

---

# Objetivo

Construir uma plataforma escalável capaz de vender centenas de produtos digitais utilizando a mesma arquitetura.

Toda modificação deve preservar:

- organização
- escalabilidade
- legibilidade
- reutilização
- segurança

Nunca fazer alterações que comprometam esses princípios.
