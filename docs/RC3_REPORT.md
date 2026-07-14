# RC3 Report — Analytics e mensuração

## Resumo

A RC3 revisou a mensuração completa sem alterar Design System, regras de negócio, integração de pagamento ou arquitetura do projeto. A aplicação ficou preparada para acompanhar campanhas reais por Meta Pixel, GA4 e GTM, mantendo o `Purchase` condicionado à confirmação server-side já implementada na RC2.

## Arquivos modificados

- `.env.example`
- `PROJECT_STATUS.md`
- `lib/analytics.ts`
- `components/analytics/Analytics.tsx`
- `components/product/Checkout.tsx`
- `app/products/[slug]/page.tsx`
- `docs/RC3_ANALYTICS.md`
- `docs/RC3_REPORT.md`

## Problemas encontrados

1. UTMs, `gclid` e `fbclid` não eram preservados após a primeira navegação.
2. O Data Layer utilizava nomes diferentes dos eventos recomendados do GA4.
3. O PageView inicial dependia dos snippets automáticos, enquanto mudanças de rota usavam outra origem.
4. Eventos do Meta Pixel podiam ser perdidos quando disparados antes da criação de `window.fbq`.
5. `ViewContent` e `InitiateCheckout` não tinham `eventID` para futura deduplicação server-side.
6. Os itens de e-commerce não carregavam categoria do produto.
7. O Data Layer só existia quando havia ID de GTM, dificultando homologação e evolução da configuração.
8. Não havia estrutura tipada para `Search` e `Lead`.
9. Falhas de carregamento das tags não geravam sinal de diagnóstico padronizado.
10. Configurar simultaneamente GA4 direto e tags GA4 no GTM poderia duplicar eventos por configuração externa.

## Problemas corrigidos

- Padronização de `page_view`, `view_item`, `begin_checkout`, `purchase`, `search` e `generate_lead`.
- Persistência de primeiro e último toque de campanha em `sessionStorage`.
- Inclusão da atribuição em eventos de página, produto, checkout e compra.
- PageView centralizado, sem disparos automáticos paralelos do GA4 e Meta Pixel.
- Fila de eventos do Meta Pixel durante carregamento assíncrono.
- `eventID` em todos os eventos Meta preparados para deduplicação futura.
- Payload completo com moeda, valor, IDs, tipo, categoria e item de produto.
- Data Layer inicializado independentemente da presença do GTM.
- Proteção de `Purchase` preservada e fortalecida: status aprovado, ID estável, memória e armazenamento local.
- Erros isolados e registrados como `analytics_error` sem impacto no fluxo principal.
- Regra operacional documentada para evitar duplicidade entre GA4 direto e GA4 via GTM.

## Eventos revisados

- `PageView`: ativo e único por pathname.
- `ViewContent`: ativo em produto publicado.
- `InitiateCheckout`: ativo na entrada do checkout.
- `Purchase`: ativo apenas após confirmação `approved`.
- `Search`: preparado, não disparado sem busca real.
- `Lead`: preparado, não disparado pelo `mailto:` sem confirmação de recebimento.

## SEO revisado

- metadata base e metadata dinâmica;
- canonical;
- Open Graph e Twitter Cards;
- JSON-LD de Organization, WebSite, Product, Article e Breadcrumb;
- `robots.ts`;
- `sitemap.ts`;
- favicon, Apple icon e manifest.

Nenhuma correção estrutural foi necessária nesta RC. Checkout, dashboard e APIs continuam fora de indexação.

## Performance revisada

- scripts de terceiros permanecem em `afterInteractive`;
- ausência de IDs elimina o carregamento de scripts externos;
- imagens continuam em `next/image`, com preload somente para imagens LCP;
- fonte permanece local ao sistema, sem requisição bloqueante externa;
- páginas permanecem Server Components, com ilhas Client apenas onde há interação;
- Reading Progress continua carregado dinamicamente;
- analytics não bloqueia renderização nem propaga falhas.

## Pendências operacionais

1. Inserir somente IDs reais no ambiente definitivo.
2. Definir consentimento de cookies antes de ativar tags de marketing.
3. Escolher GA4 direto ou GA4 via GTM para cada propriedade.
4. Homologar eventos no domínio final com Meta Test Events, GA4 DebugView e GTM Preview.
5. Executar compra sandbox aprovada e pendente com credenciais reais de teste.

## Melhorias futuras

- Meta Conversions API server-side usando o mesmo `eventID`.
- Google Enhanced Conversions após revisão jurídica e de consentimento.
- Persistência server-side da atribuição no pedido quando houver estratégia de dados definida.
- Testes E2E automatizados para a sequência de eventos no sandbox.
- Observabilidade externa para `analytics_error` sem coletar dados pessoais.

Esses itens não foram implementados porque dependem de configuração externa, consentimento, credenciais ou ampliação de escopo.
