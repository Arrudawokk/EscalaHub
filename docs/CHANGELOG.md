# Changelog

Todas as alterações relevantes da EscalaHub são registradas neste arquivo.

## [1.0.0] — 14/07/2026

### Adicionado

- Catálogo tipado de produtos e rotas dinâmicas de produto.
- Checkout Mercado Pago com Pix e cartão, idempotência e tratamento completo de estados.
- Persistência PostgreSQL de pedidos, eventos de webhook, contas e sessões.
- Webhook assinado, antirreplay, deduplicado e reconciliado com a API do gateway.
- Entrega protegida, biblioteca, histórico de pedidos e área do cliente.
- Analytics centralizado para GA4, GTM e Meta Pixel, incluindo UTMs e eventos de comércio.
- Blog por arquivos, páginas institucionais, políticas e documentação operacional.
- Metadata, canonical, Open Graph, Twitter Cards, JSON-LD, robots, sitemap e manifest.
- Estados de loading, erro, 404 e vazios.

### Alterado

- Landing Page, produto e checkout refinados para conversão, acessibilidade e mobile.
- Design System padronizado para botões, badges, inputs, cards e estados interativos.
- Fronteiras entre Server e Client Components reduzidas nas áreas globais.
- URL pública e callback de webhook compatíveis com o domínio de produção da Vercel.
- Pacote marcado como versão `1.0.0`.

### Corrigido

- Fluxos duplicados de analytics e deduplicação de `Purchase`.
- Segurança do webhook, idempotência, validação de origem e respostas sem cache.
- Tratamento de indisponibilidade do SDK de cartão e recuperação de pedido.
- Contraste, foco, responsividade, navegação e links quebrados.
- Sitemap com datas artificiais de alteração em todo deploy.
- Remontagem global causada por template raiz sem comportamento.

### Segurança

- CSP, HSTS, política de permissões, proteção contra framing e MIME sniffing.
- Cookies de sessão HttpOnly, Secure em produção e SameSite Lax.
- Downloads autorizados no servidor e arquivo mantido fora de `public/`.
- Segredos restritos ao servidor e ambiente de produção sem fallback de persistência em memória.
