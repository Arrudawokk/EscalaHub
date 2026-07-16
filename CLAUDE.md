# CLAUDE.md

# EscalaHub AI Development Guide

Este documento define como qualquer IA deve trabalhar neste projeto.

Estas regras têm prioridade sobre sugestões genéricas.

---

# Objetivo

A EscalaHub é uma plataforma própria de venda de infoprodutos.

O objetivo NÃO é criar apenas um site.

O objetivo é construir uma plataforma SaaS escalável.

Toda alteração deve priorizar:

- organização
- reutilização
- segurança
- manutenção
- escalabilidade
- performance

---

# Filosofia

Sempre melhorar.

Nunca reescrever.

Sempre evoluir.

Nunca destruir arquitetura existente.

---

# Antes de qualquer alteração

Leia todo o projeto.

Entenda a arquitetura.

Entenda a organização.

Mapeie os componentes.

Mapeie as páginas.

Mapeie o fluxo de dados.

Somente depois implemente alterações.

Nunca modifique arquivos sem entender como eles são utilizados.

---

# Arquitetura

Nunca modificar arquitetura sem necessidade.

Nunca reorganizar pastas sem motivo.

Nunca mover componentes apenas por preferência pessoal.

Sempre respeitar a estrutura existente.

---

# Componentes

Sempre reutilizar componentes.

Nunca criar componentes duplicados.

Antes de criar qualquer componente:

Verifique se já existe um equivalente.

Se existir:

Melhore-o.

Não crie outro.

---

# Design System

Sempre manter consistência.

Botões.

Cards.

Inputs.

Badges.

Containers.

Spacing.

Typography.

Nunca utilizar estilos diferentes para resolver o mesmo problema.

---

# TypeScript

Nunca utilizar:

any

ts-ignore

eslint-disable

Sempre utilizar tipagem forte.

Criar interfaces reutilizáveis.

---

# Código

Priorizar:

Legibilidade.

Baixo acoplamento.

Alta coesão.

SOLID.

DRY.

KISS.

Não criar código complexo sem necessidade.

---

# React

Evitar re-renderizações.

Evitar estados desnecessários.

Evitar efeitos redundantes.

Reutilizar hooks.

---

# Next.js

Sempre utilizar:

Next/Image

Next/Link

Server Components quando fizer sentido.

Client Components apenas quando necessário.

---

# Performance

Toda alteração deve considerar:

LCP

CLS

INP

Bundle Size

Lazy Loading

Code Splitting

---

# SEO

Nunca remover metadata.

Sempre preservar:

Open Graph

Twitter Cards

Canonical

JSON-LD

Robots

Sitemap

---

# Responsividade

Toda alteração deve funcionar em:

Desktop.

Notebook.

Tablet.

Mobile.

Nunca aceitar layouts quebrados.

---

# UX

Toda alteração deve responder:

Esta mudança melhora a experiência do usuário?

Se a resposta for não,

não implemente.

---

# Conversão

A EscalaHub vende infoprodutos.

Toda alteração deve aumentar:

clareza

credibilidade

confiança

facilidade de compra

Nunca utilizar técnicas enganosas.

Nunca inventar números.

Nunca inventar avaliações.

Nunca inventar certificados.

---

# Checkout

Nunca alterar a lógica do checkout sem necessidade.

Nunca acoplar o checkout diretamente ao gateway.

Sempre utilizar uma camada de abstração.

---

# Gateway

O projeto deve ser preparado para suportar múltiplos gateways.

Exemplo:

Stripe

Asaas

Mercado Pago (apenas pedidos históricos)

A interface nunca deve depender do gateway.

---

# Analytics

Preparar estrutura para:

Meta Pixel

GA4

Google Tag Manager

Nunca utilizar IDs falsos.

Sempre utilizar variáveis de ambiente.

---

# Segurança

Nunca expor:

Tokens

Secrets

Access Tokens

Nunca colocar credenciais no Front-end.

Sempre validar operações sensíveis no servidor.

---

# Documentação

Toda funcionalidade importante deve atualizar a documentação.

Quando necessário criar:

docs/

Architecture

Payments

Deploy

Analytics

Roadmap

---

# Commits

Sempre utilizar commits pequenos.

Exemplos:

feat(payments)

style(hero)

style(header)

fix(build)

perf(images)

docs(payments)

Nunca fazer um commit gigante.

---

# Qualidade

Antes de finalizar qualquer tarefa execute:

npm install

npm run lint

npm run type-check || npx tsc --noEmit

npm run build

Corrigir automaticamente qualquer erro.

Nunca considerar a tarefa concluída enquanto houver erros.

---

# Proibido

Não recriar o projeto.

Não alterar identidade visual.

Não remover funcionalidades.

Não substituir arquitetura.

Não criar componentes duplicados.

Não utilizar "any".

Não deixar TODOs.

Não deixar console.log.

Não deixar código morto.

---

# Objetivo Final

Construir uma plataforma premium de venda de infoprodutos capaz de crescer para centenas de produtos mantendo uma arquitetura limpa, escalável, segura e fácil de manter.

Toda decisão deve preservar essa visão.
