# Como adicionar um produto em menos de cinco minutos

## 1. Adicione as imagens

Coloque a capa e a galeria em `public/`. Use nomes únicos, sem espaços, e imagens otimizadas.

## 2. Duplique um registro

Abra `lib/catalog/products.ts`, duplique o produto existente e altere todos os campos. O `slug` deve ser único, minúsculo e separado por hífens.

Campos obrigatórios:

- identificação: `slug`, `title`, `subtitle`, `description`, `shortDescription`;
- comercial: `price`, `currency`, `checkoutUrl`, `featured`, `badge`, `status`;
- mídia: `coverImage`, `gallery`;
- organização: `category`, `author`;
- conteúdo: `benefits`, `learning`, `modules`, `audience`, `faq`, `testimonials`;
- entrega: `format`, `accessLabel`, `guaranteeDays`, `platforms`;
- descoberta: `seo.title`, `seo.description`, `seo.keywords`, imagens sociais opcionais.

Use no checkout interno:

```ts
checkoutUrl: "/checkout?product=meu-novo-produto"
```

Use `status: "draft"` enquanto prepara o conteúdo e `status: "published"` para publicar.

## 3. Escolha uma categoria

Use um dos slugs existentes:

`marketing`, `ia`, `negocios`, `produtividade`, `design` ou `automacao`.

As definições ficam em `lib/catalog/categories.ts`.

## 4. Valide

```bash
npm run lint
npm run type-check
npm run build
```

Depois do build, a rota `/products/meu-novo-produto`, a metadata, o schema, o sitemap e o checkout já estarão disponíveis automaticamente. Não é necessário criar página, componente ou regra de analytics.

## Checklist rápido

- slug único;
- preço numérico, sem `R$`;
- capa existente em `public`;
- categoria válida;
- checkout apontando para o mesmo slug;
- SEO exclusivo;
- `featured` usado apenas nos produtos prioritários;
- `published` somente quando todo o conteúdo estiver revisado.
