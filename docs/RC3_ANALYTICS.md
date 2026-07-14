# RC3 Analytics

## Objetivo

A RC3 estabelece uma única camada de mensuração para a jornada Home → Produto → Checkout → Compra confirmada. Componentes não conversam diretamente com SDKs de terceiros: todos os eventos passam por `lib/analytics.ts`.

As integrações permanecem opcionais e são ativadas somente por variáveis de ambiente reais. A ausência ou falha de qualquer tag não interrompe navegação, checkout, pagamento ou entrega.

## Configuração

Variáveis públicas disponíveis:

```env
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=
NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID=
NEXT_PUBLIC_META_PIXEL_ID=
```

Valores vazios desativam a integração correspondente. IDs fora do formato esperado são ignorados.

### Regra de roteamento para GA4 e GTM

Use apenas uma rota de envio para a mesma propriedade GA4:

1. GA4 direto: configure `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` e não crie no GTM tags que reenviem os mesmos eventos para essa propriedade.
2. GA4 gerenciado pelo GTM: configure o container no GTM, deixe `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` vazio e faça o container consumir os eventos padronizados do Data Layer.

O Meta Pixel pode permanecer ativo nos dois cenários. Essa separação evita duplicação causada por configuração externa do container.

## Arquitetura

- `components/analytics/Analytics.tsx`: carrega scripts opcionais e registra navegações.
- `components/analytics/ProductEventTracker.tsx`: conecta páginas de produto e checkout à camada central.
- `lib/analytics.ts`: valida configuração, captura atribuição, monta payloads, envia eventos e executa deduplicação.
- `components/product/Checkout.tsx`: solicita `Purchase` somente depois que a API confirma `approved` e entrega um `purchaseEventId` estável.

Os scripts usam `afterInteractive`. Eventos disparados antes de o Meta Pixel estar pronto entram em fila e são enviados após a inicialização. O Data Layer é criado antes do carregamento do GTM, permitindo que o container processe eventos já registrados.

## Matriz de eventos

| Jornada | GA4 | Meta Pixel | Data Layer | Momento |
| --- | --- | --- | --- | --- |
| Página aberta ou rota alterada | `page_view` | `PageView` | `page_view` | Uma vez por pathname |
| Produto visualizado | `view_item` | `ViewContent` | `view_item` | Montagem da página publicada do produto |
| Checkout iniciado | `begin_checkout` | `InitiateCheckout` | `begin_checkout` | Montagem do checkout do produto |
| Pagamento confirmado | `purchase` | `Purchase` | `purchase` | Somente após status `approved` |
| Busca confirmada | `search` | `Search` | `search` | Estrutura pronta, ainda sem origem de produto |
| Lead confirmado | `generate_lead` | `Lead` | `generate_lead` | Estrutura pronta, ainda sem origem confirmada |

`Search` não é disparado porque a aplicação ainda não possui busca. `Lead` não é disparado pelo formulário `mailto:`, pois abrir o cliente de e-mail não confirma o recebimento de um lead. Isso evita métricas artificiais.

## Parâmetros de produto

Eventos comerciais incluem:

- `currency`
- `value`
- `content_ids`
- `content_name`
- `content_category`
- `content_type: product`
- `items[]` com `item_id`, `item_name`, `item_category`, `price` e `quantity`

O Data Layer segue o formato de e-commerce com o objeto `ecommerce`. O `Purchase` também inclui `transaction_id` e `event_id`.

## Atribuição

A primeira entrada captura e normaliza:

- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`
- `gclid`
- `fbclid`

Os valores são limitados a 256 caracteres, armazenados em `sessionStorage` e preservados durante navegações internas até o checkout e o evento de compra. A estrutura mantém primeiro e último toque; os eventos utilizam o último toque válido da sessão.

Nenhum nome, e-mail, CPF, dado de cartão ou outro dado pessoal é armazenado na atribuição ou enviado como parâmetro de analytics.

## Deduplicação

### PageView

O carregamento automático de PageView do GA4 e do Meta Pixel foi desativado. A camada central envia o evento inicial e as mudanças de rota uma única vez por pathname.

### Produto e checkout

`ProductEventTracker` possui proteção de montagem para impedir repetição causada por re-renderização ou pelo Strict Mode.

### Purchase

- só executa com `status === approved`;
- exige `purchaseEventId` fornecido pela API após confirmação do pedido;
- utiliza esse identificador como `transaction_id` do GA4 e `eventID` do Meta Pixel;
- mantém proteção em memória e em `localStorage` por transação;
- não marca a transação como enviada antes de registrar o evento no Data Layer.

O identificador estável deixa a compra preparada para futura deduplicação com Meta Conversions API e Google Enhanced Conversions.

## Falhas e diagnóstico

Chamadas de terceiros são isoladas por tratamento de erro. Falhas de script ou despacho geram um item `analytics_error` no Data Layer com apenas:

- `analytics_integration`
- `analytics_event`

Nenhuma exceção de analytics é propagada para a aplicação. No ambiente definitivo, validar:

1. Meta Events Manager → Test Events.
2. GA4 → DebugView e Realtime.
3. GTM → Preview/Tag Assistant.
4. Uma compra aprovada e uma pendente para confirmar que apenas a aprovada registra `purchase`.
5. Uma segunda abertura da confirmação para confirmar ausência de novo `Purchase` no mesmo navegador.

## Consentimento

A estrutura técnica está pronta, mas a ativação das tags deve respeitar a política de cookies, a LGPD e a decisão jurídica sobre consentimento. IDs reais só devem ser liberados em produção depois dessa validação.
