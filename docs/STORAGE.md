# Armazenamento privado

## Arquitetura

A EscalaHub acessa produtos digitais somente por `PrivateAssetStore`, em `lib/storage/privateAssets.ts`. Catálogo, conta, pagamentos e rotas não importam a SDK S3 nem conhecem credenciais do provider.

```text
catálogo.delivery.objectKey
        ↓
PrivateAssetStore.resolve
        ↓
autorização server-side da rota
        ↓
PrivateAssetStore.createTemporaryDownloadUrl
        ↓
Cloudflare R2 privado
```

O provider ativo é Cloudflare R2. Ele utiliza a API compatível com S3 e somente as dependências oficiais `@aws-sdk/client-s3` e `@aws-sdk/s3-request-presigner`.

## Fluxos de download

### Área do cliente

1. `/api/account/download` valida a sessão HttpOnly.
2. O servidor busca o pedido e compara o titular.
3. O pedido precisa estar `approved` e o acesso `granted`.
4. O catálogo resolve a chave privada do produto.
5. O provider executa `HeadObject`; objeto ausente retorna HTTP 404.
6. O provider assina `GetObject` por 300 segundos.
7. A rota responde com redirect temporário, `no-store` e `Referrer-Policy: no-referrer`.
8. O R2 entrega o arquivo como attachment com nome e tipo definidos no catálogo.

### Retorno da compra

`/api/delivery/download` preserva o token HMAC já existente. O token identifica pedido e produto, possui expiração, e a rota reconsulta o estado do pedido antes de emitir a URL R2. Reembolso ou disputa continuam bloqueando novos downloads.

## Respostas

- `403 Forbidden`: sessão/titular sem direito, pedido não aprovado, acesso revogado ou token inválido/expirado.
- `404 Not Found`: objeto não existe na chave configurada.
- `503 Service Unavailable`: credenciais ausentes/inválidas ou indisponibilidade do provider.

## Estrutura do bucket

```text
products/
  {slug-do-produto}/
    {arquivo-do-produto}.pdf
```

Objeto atual:

```text
products/trafego-pago-do-zero-a-escala/trafego-pago-do-zero-a-escala.pdf
```

O bucket deve permanecer privado. Não use `public/`, r2.dev ou domínio público para os produtos vendidos.

## Novo produto

1. Envie o arquivo para `products/{slug}/{arquivo}`.
2. Adicione o produto ao catálogo existente.
3. Preencha `delivery.objectKey`, `delivery.fileName` e `delivery.contentType`.
4. Execute lint, TypeScript e build.

Nenhuma variável de ambiente nova é necessária por produto.

## Troca de arquivo sem código

Envie a nova versão para a mesma chave do objeto. O R2 substitui o conteúdo e o catálogo continua válido. Mantenha o mesmo formato declarado; se nome, chave ou tipo mudarem, atualize o catálogo.

## Segurança

- URLs assinadas são bearer tokens e expiram em cinco minutos.
- A Secret Access Key existe somente no servidor.
- A URL pública opcional do bucket nunca é usada para produtos privados.
- O token R2 deve possuir apenas leitura de objetos no bucket necessário.
- Nenhuma chave assinada é armazenada no banco, catálogo, logs ou navegador.
