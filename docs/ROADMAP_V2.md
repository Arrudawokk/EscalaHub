# EscalaHub — Roadmap v2

## Objetivo

Evoluir a EscalaHub de uma vitrine front-end de um produto para uma plataforma transacional de produtos digitais, com operação segura, autosserviço e canais de crescimento mensuráveis.

## Fase 0 — Fundação obrigatória

- Autenticação segura, recuperação de conta e RBAC.
- Banco de dados com migrações, auditoria e política de backups.
- Checkout hospedado ou tokenizado, webhooks idempotentes e conciliação.
- Entrega protegida de arquivos, expiração de links e controle de acesso.
- Consentimento LGPD, Política de Privacidade, Termos e reembolso.
- Observabilidade: erros, logs, métricas, tracing e Core Web Vitals.

Critério de saída: uma compra real deve gerar pedido, acesso, e-mail, analytics e trilha de auditoria exatamente uma vez.

## Fase 1 — Sistema de Produtos e Categorias

- CRUD completo de produtos digitais.
- Rascunho, publicação, arquivamento e versionamento.
- Preço, mídia, arquivos, garantia e disponibilidade.
- Categorias e tags administráveis.
- Slugs, SEO e imagens sociais por produto.
- Inventário lógico de produtos e relatórios por item.

Critério de saída: a equipe administra o catálogo sem alterar código.

## Fase 2 — Área do Cliente e Área Premium

- Biblioteca de compras do cliente.
- Download protegido e histórico de acessos.
- Reenvio de acesso e suporte a múltiplos dispositivos.
- Área Premium com conteúdos exclusivos e liberações programadas.
- Perfil, segurança da conta e preferências de comunicação.
- Solicitação e acompanhamento de reembolso.

Critério de saída: o cliente encontra e acessa todas as compras sem suporte manual.

## Fase 3 — Painel Administrativo

- Visão consolidada de receita, pedidos e conversão.
- Gestão de clientes, produtos, pagamentos e reembolsos.
- Papéis administrativos com menor privilégio.
- Logs de auditoria e exportações seguras.
- Moderação de avaliações e conteúdo.
- Configuração de integrações e webhooks.

Critério de saída: toda ação sensível possui permissão, registro e possibilidade de auditoria.

## Fase 4 — Marketplace

- Catálogo público pesquisável.
- Busca, filtros, ordenação e páginas de categoria.
- Perfis de produtores e vitrines individuais.
- Avaliações verificadas vinculadas a compras.
- Recomendações e produtos relacionados.
- Regras de publicação, moderação e qualidade.

Critério de saída: o usuário descobre produtos relevantes e toda prova social é verificável.

## Fase 5 — Cupons e Promoções

- Cupons por valor ou percentual.
- Período de validade, limite total e limite por cliente.
- Restrições por produto, categoria e campanha.
- Links promocionais rastreáveis.
- Relatórios de receita incremental e abuso.

Critério de saída: descontos são validados no servidor e conciliados no pedido.

## Fase 6 — Afiliados

- Cadastro e aprovação de afiliados.
- Links e atribuição com janela configurável.
- Comissão por produto e regras de estorno.
- Painel de cliques, conversões e saldo.
- Antifraude e bloqueio de autoindicação.
- Fechamento financeiro e histórico de pagamentos.

Critério de saída: toda comissão é explicável, auditável e vinculada a uma compra confirmada.

## Fase 7 — Crescimento e escala

- Experimentação A/B server-side.
- Funil completo por canal, campanha e produto.
- Meta Conversions API e mensuração server-side com deduplicação.
- Segmentação de CRM e automações de ciclo de vida.
- Internacionalização, moedas e impostos quando necessário.
- SLOs, alertas, testes de carga e plano de resposta a incidentes.

Critério de saída: a plataforma escala campanhas com dados confiáveis, sem comprometer segurança ou experiência.

## Ordem recomendada

1. Fundação obrigatória.
2. Sistema de Produtos e Categorias.
3. Área do Cliente e Área Premium.
4. Painel Administrativo.
5. Marketplace.
6. Cupons.
7. Afiliados.
8. Crescimento e escala.
