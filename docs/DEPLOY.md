# Deploy da EscalaHub

## GitHub

O repositório oficial é `Arrudawokk/teste-site-`. O fluxo recomendado é trabalhar em branch, executar as validações e integrar na `main` somente com build aprovado.

```bash
git checkout -b nome-da-alteracao
npm install
npm run lint
npm run type-check
npm run build
git push -u origin nome-da-alteracao
```

Nunca versionar `.env.local`, tokens, chaves ou credenciais.

## Vercel

O projeto operacional validado é `teste-site-qnxk`, publicado em `https://teste-site-qnxk.vercel.app`.

1. Conecte apenas o repositório `Arrudawokk/teste-site-`.
2. Use a branch `main` como Production Branch.
3. Mantenha Root Directory na raiz (`.`).
4. Selecione o preset Next.js.
5. Use `npm install` como Install Command ou mantenha a detecção automática.
6. Use `npm run build` como Build Command ou mantenha a detecção automática.
7. Não configure Output Directory; o adaptador Next.js gerencia `.next` automaticamente.
8. Cadastre as variáveis no ambiente correto.
9. Publique primeiro em Preview e valide Home, produto, checkout, sitemap e robots.
10. Promova para Production e configure o domínio canônico.

Não conecte o mesmo repositório a projetos Vercel duplicados. Em 14/07/2026 foram encontrados `teste-site` e `teste-site-qnxk`; o segundo é o projeto operacional. Antes de remover o duplicado, compare domínios e variáveis no painel para evitar perda de configuração.

## Variáveis de ambiente

Obrigatórias em produção:

- `NEXT_PUBLIC_SITE_URL`: URL canônica, com HTTPS e sem barra final. Se estiver vazia na Vercel, `VERCEL_PROJECT_PRODUCTION_URL` é utilizada automaticamente; configure explicitamente ao conectar o domínio definitivo.
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: chave pública da Stripe, no mesmo modo da chave secreta.
- `STRIPE_SECRET_KEY`: chave privada da Stripe, usada somente no servidor.
- `STRIPE_WEBHOOK_SECRET`: segredo de assinatura do endpoint de webhook.
- `PRICE_ID`: identificador do preço único em BRL configurado para o produto.
- `DATABASE_URL`: conexão PostgreSQL com pooler para persistência transacional.
- `DELIVERY_TOKEN_SECRET`: segredo aleatório com pelo menos 32 caracteres.
- `R2_ACCOUNT_ID`: identificador da conta Cloudflare.
- `R2_ACCESS_KEY_ID`: identificador da credencial S3 com leitura no bucket.
- `R2_SECRET_ACCESS_KEY`: segredo privado da credencial S3.
- `R2_BUCKET`: nome do bucket privado de produtos.

Opcional:

- `R2_PUBLIC_URL`: URL de ativos públicos; nunca é usada na entrega de produtos privados.

Opcionais, apenas com IDs reais:

- `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID`: Measurement ID do GA4.
- `NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID`: Container ID do GTM.
- `NEXT_PUBLIC_META_PIXEL_ID`: Pixel ID da Meta.

Use `.env.example` como referência. A ausência de um ID mantém a integração correspondente desativada.

As credenciais e o Price da Stripe devem pertencer ao mesmo modo. O checkout recusa criar sessões sem URL pública HTTPS ou configuração completa e consistente.

## Banco e entrega

Antes do primeiro deploy que aceite pagamentos, execute as migrações em ordem no banco do mesmo ambiente:

```bash
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f db/migrations/001_payment_orders.sql
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f db/migrations/002_customer_accounts.sql
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f db/migrations/003_stripe_gateway.sql
```

Nunca coloque o produto digital em `public/`. Envie-o ao R2 privado usando a estrutura descrita em `docs/STORAGE.md`; a aplicação só emite uma URL de cinco minutos após validar pedido, aprovação e acesso.

## Analytics e Pixel

- `PageView` é enviado globalmente.
- `ViewContent` recebe slug, título, preço e moeda do produto visitado.
- `InitiateCheckout` recebe os dados do produto selecionado no checkout.
- `Purchase` está preparado em `lib/analytics.ts`, mas só deve ser chamado após confirmação real e idempotente do pagamento no servidor.

Não dispare `Purchase` por clique, envio de formulário ou página de agradecimento sem validação do provedor.

## Checklist após deploy

- confirmar que `NEXT_PUBLIC_SITE_URL` corresponde ao domínio final;
- abrir `/robots.txt`, `/sitemap.xml` e um produto publicado;
- validar canonical, Open Graph, Twitter Card e JSON-LD;
- validar checkout com e sem `?product=slug`;
- conferir eventos nas ferramentas de depuração do GA4, GTM e Meta;
- confirmar que tags não essenciais só serão ativadas depois da implementação do consentimento aplicável;
- confirmar headers de segurança e HTTPS;
- homologar assinatura, reenvio e reconciliação do webhook em Preview;
- confirmar que reembolso e chargeback revogam o download;
- confirmar que o link expirado é recusado e que um novo link é emitido pela consulta do pedido;
- executar uma compra real somente depois da integração de pagamento homologada.
