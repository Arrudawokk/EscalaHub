# Arquitetura da EscalaHub

## Visão geral

A EscalaHub usa Next.js 16 com App Router, React 19, TypeScript estrito e Tailwind CSS 4. A aplicação é organizada em três camadas principais:

1. **Domínio** — catálogo, categorias, tipos e regras de consulta em `lib/catalog`.
2. **Apresentação** — páginas do App Router e componentes em `components`.
3. **Infraestrutura** — SEO, analytics, headers, sitemap e configuração do site em `app` e `lib`.

O catálogo é a fonte única de verdade. Nenhuma página precisa conhecer slugs, preços, imagens ou conteúdo específico de um produto.

## Estrutura

```text
app/
  page.tsx                  Home e produto principal
  products/[slug]/page.tsx Página dinâmica, metadata e Product schema
  checkout/page.tsx        Resolve o produto e entrega o checkout
  dashboard/page.tsx       Interface administrativa demonstrativa
  sitemap.ts               Gera URLs para todos os produtos publicados
components/
  analytics/               Scripts e eventos por produto
  layout/                   Header e Footer
  marketing/                Seções da Home orientadas pelo catálogo
  product/                  Hero, conteúdo, preço e checkout
  ui/                       Button, Badge e Input
lib/
  catalog/
    types.ts                Contratos do domínio
    categories.ts           Taxonomia oficial
    products.ts             Dados dos produtos
    index.ts                Consultas, rotas e formatação
  analytics.ts              GA4, GTM e Meta Pixel
  storage/privateAssets.ts  Contrato privado e provider Cloudflare R2
  cn.ts                     Composição padronizada de classes
  site.ts                   Identidade e URL pública
```

## Modelo de produto

`Product` concentra slug, conteúdo comercial, preço, mídia, categoria, benefícios, módulos, FAQ, checkout, publicação e SEO. Campos adicionais de audiência, aprendizado, garantia, acesso, formato e plataformas abastecem as seções atuais sem acoplamento ao primeiro e-book.

Estados suportados:

- `draft`: não aparece em rotas públicas, Home ou sitemap.
- `published`: fica disponível publicamente.
- `archived`: é removido da navegação pública sem apagar o histórico no catálogo.

Categorias oficiais: Marketing, IA, Negócios, Produtividade, Design e Automação.

## Fluxo de dados

1. O produto é adicionado a `lib/catalog/products.ts`.
2. As consultas de `lib/catalog/index.ts` filtram apenas itens publicados.
3. A Home recebe o produto principal e a lista de destaques.
4. `generateStaticParams` cria uma página para cada slug publicado.
5. `generateMetadata` e o JSON-LD usam o SEO do próprio produto.
6. O checkout recebe `?product=slug`; `/checkout` sem parâmetro usa o primeiro destaque por compatibilidade.
7. Sitemap e eventos `ViewContent`/`InitiateCheckout` são gerados com os dados do mesmo produto.
8. Downloads usam `delivery.objectKey`; o provider valida o objeto no R2 e assina a leitura somente depois da autorização server-side.

## Páginas

- **Home**: seleciona produtos em destaque e injeta seus dados nas seções existentes.
- **Produto**: rota SSG `/products/[slug]`, com 404 para slugs ausentes ou não publicados.
- **Checkout**: rota dinâmica por query string, sem duplicar páginas para cada item.
- **Dashboard**: preservado nesta sprint; os dados ainda são demonstrativos.

## Design system

- `Button` centraliza variantes, tamanhos, estados e foco.
- `Badge` centraliza semântica de status.
- `Input` aplica o controle global de formulário.
- `cn` é a única função de composição de classes Tailwind.
- Tokens de cor, raio, sombra e estados ficam em `app/globals.css`.
- `.container-default`, `.section`, `.card`, `.glass`, `.eyebrow` e `.display-title` são os padrões estruturais existentes.

Esta sprint preservou o visual atual e removeu apenas duplicação técnica no sistema de classes.

## Escalabilidade

O catálogo local atende centenas de registros com geração estática. Quando houver edição administrativa, estoque, pedidos ou atualização sem deploy, o contrato `Product` deve ser mantido e a implementação de `lib/catalog` substituída por um repositório conectado a banco/CMS. As páginas e componentes não precisam ser reescritos.

Para catálogos muito grandes, a evolução natural é gerar os itens prioritários no build e usar renderização estática sob demanda para a cauda longa.
