# EscalaHub 1.0.0 — Release Notes

**Data:** 14/07/2026

**Branch:** `main`

**Deploy operacional:** https://teste-site-qnxk.vercel.app

## Visão geral

A versão 1.0.0 consolida a EscalaHub como uma plataforma de catálogo, venda, confirmação e entrega protegida de produtos digitais. O código foi auditado para estabilidade, segurança, performance, conversão, SEO e escalabilidade, sem introduzir funcionalidades experimentais.

## Entregas da versão

- Landing Page, página de produto e checkout responsivos e orientados à clareza da oferta.
- Catálogo tipado e reutilizável para múltiplos produtos.
- Pré-checkout próprio e pagamento hospedado pela Stripe com cartão e Pix.
- Validação server-side do catálogo e do valor, idempotência e reconciliação autoritativa.
- Webhook assinado, janela antirreplay, deduplicação persistente e transições protegidas.
- PostgreSQL para pedidos, acessos, contas e sessões.
- Entrega automática para pedido aprovado e download por rota protegida.
- Área autenticada com biblioteca, pedidos e perfil preparado.
- Analytics centralizado para GA4, GTM e Meta Pixel, com UTMs e deduplicação de `Purchase`.
- SEO completo com metadata, canonical, Open Graph, Twitter Cards, JSON-LD, robots, sitemap, favicon e manifest.
- Blog por arquivos, páginas institucionais, políticas, loading, estados vazios, erros e 404.
- Headers de segurança, cache privado para áreas sensíveis e separação entre variáveis públicas e segredos.

## Ajustes finais da 1.0.0

- Versão do pacote atualizada de `0.1.0` para `1.0.0`.
- Remoção do template raiz vazio, eliminando remontagens sem benefício entre navegações.
- Sitemap corrigido para não declarar páginas estáticas como modificadas a cada novo build.
- Datas reais dos artigos continuam publicadas no sitemap.

## Validação

- `npm install`: aprovado; 367 pacotes auditados, 0 vulnerabilidades reportadas.
- `npm run lint`: aprovado.
- `npm run type-check`: aprovado.
- `npm run build`: aprovado com 33 rotas.
- Rotas principais do deploy: HTTP 200.
- Rota inexistente: HTTP 404.
- APIs rejeitam origem, payload, assinatura e links inválidos com os códigos esperados.
- Deploy V1 concluído com sucesso no projeto Vercel operacional `teste-site-qnxk`.

## Decisão de lançamento

O código V1 está aprovado. Vendas reais e campanhas continuam bloqueadas até a configuração e homologação das credenciais, banco, arquivo privado, analytics e domínio definitivo descritas em [docs/V1_RELEASE.md](docs/V1_RELEASE.md) e [docs/KNOWN_LIMITATIONS.md](docs/KNOWN_LIMITATIONS.md).
