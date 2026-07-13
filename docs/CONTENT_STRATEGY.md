# Estratégia de Conteúdo da EscalaHub

## Objetivo

O conteúdo editorial deve aumentar autoridade, descoberta orgânica e confiança antes da compra. O Blog não depende de CMS: cada artigo é um arquivo TypeScript validado pelo mesmo build da aplicação.

## Estrutura

```text
content/articles/
  types.ts                         Contratos de artigo, seção e autor
  authors.ts                       Autores e responsabilidade editorial
  nome-do-artigo.ts                Conteúdo de um artigo
  index.ts                         Registro, filtros e helpers
components/content/
  ArticleCard.tsx                  Card da listagem
  ArticleHeader.tsx                Cabeçalho, breadcrumb e datas
  ArticleLayout.tsx                Corpo e composição editorial
  TableOfContents.tsx              Sumário por âncoras
  ShareButtons.tsx                 Compartilhamento sem biblioteca externa
  AuthorBox.tsx                    Responsabilidade editorial
  ReadingProgress.tsx              Progresso de leitura
app/blog/
  page.tsx                         Listagem do Blog
  [slug]/page.tsx                  Rota, metadata e schemas por artigo
```

## Como adicionar um artigo

1. Duplique um arquivo existente em `content/articles`.
2. Renomeie o arquivo e preencha um `slug` único, minúsculo e separado por hífens.
3. Revise título, description, excerpt, categoria, autor, datas e keywords.
4. Estruture o texto em seções com `id`, `title` e `paragraphs`.
5. Use `bullets` apenas quando uma lista melhorar a leitura.
6. Use `callout` para uma síntese importante, nunca para promessa exagerada.
7. Importe o artigo em `content/articles/index.ts` e adicione ao array `articles`.
8. Mantenha `status: "draft"` durante a revisão e altere para `published` quando aprovado.
9. Execute lint, TypeScript e build.

Ao publicar, o artigo entra automaticamente em `/blog`, recebe `/blog/[slug]`, metadata, JSON-LD, breadcrumb, sitemap, tempo de leitura e recursos editoriais.

## Campos e governança

- `title`: específico, útil e alinhado à intenção de busca.
- `description`: resumo factual entre aproximadamente 140 e 160 caracteres quando possível.
- `excerpt`: explica o ganho da leitura sem repetir o título.
- `publishedAt`: data da primeira publicação em `YYYY-MM-DD`.
- `updatedAt`: data da última revisão material.
- `keywords`: termos relacionados ao assunto; não usar repetição artificial.
- `featured`: reservado para conteúdo prioritário na listagem.
- `status`: `draft`, `published` ou `archived`.
- `authorId`: deve existir em `authors.ts`.

Nunca alterar `publishedAt` para simular recência. Atualize `updatedAt` somente quando houver revisão relevante do conteúdo.

## SEO por artigo

Cada artigo publicado recebe:

- title e description próprios;
- canonical absoluto via metadata base;
- Open Graph do tipo `article`;
- Twitter Card;
- datas de publicação e modificação;
- schema.org `Article`;
- schema.org `BreadcrumbList`;
- autor, publisher, tempo estimado e contagem de palavras;
- entrada no sitemap com `lastModified` real.

O H1 deve existir uma única vez. As seções usam H2 e os cards ou subdivisões futuras devem começar em H3.

## Boas práticas editoriais

1. Responder à pergunta principal nas primeiras linhas.
2. Preferir exemplos e critérios de decisão a definições genéricas.
3. Separar fatos, hipóteses e opinião editorial.
4. Evitar garantia de resultado, urgência artificial e números sem fonte.
5. Não publicar avaliações, clientes, certificações ou autoria fictícia.
6. Revisar links, datas, termos de plataformas e implicações legais.
7. Escrever primeiro para leitura mobile: parágrafos curtos e subtítulos descritivos.
8. Relacionar artigos a produtos apenas quando a conexão for útil para o leitor.
9. Atualizar ou arquivar conteúdo desatualizado.
10. Manter a linguagem compatível com a marca: clara, responsável e prática.

## Performance

O Blog é estático e não usa biblioteca de conteúdo, markdown ou CMS. Componentes de servidor formam o conteúdo principal. O progresso de leitura é um Client Component pequeno carregado por import dinâmico. Imagens futuras devem usar `next/image`, dimensões explícitas, alt descritivo e carregamento lazy quando não forem o elemento principal da primeira dobra.

## Fluxo recomendado

```text
Pauta → rascunho → revisão técnica → revisão editorial → SEO → build → publicação → monitoramento → atualização
```

Monitorar impressões, cliques orgânicos, profundidade de leitura, saída para produtos e conversões assistidas. Evitar otimizar apenas para volume de acesso: autoridade depende de utilidade e precisão.
