# Diretrizes de marca da EscalaHub

## Princípios

A EscalaHub deve comunicar clareza, autoridade e confiança sem parecer distante. A interface é escura, editorial e precisa: poucos acentos, hierarquia forte e movimento discreto. Toda decisão visual deve reduzir esforço, preservar legibilidade e tornar a próxima ação evidente.

## Paleta

Os tokens de cor vivem em `app/globals.css` e são a única fonte de verdade.

| Papel | Token | Valor base | Uso |
| --- | --- | --- | --- |
| Fundo | `--background` | `#06080d` | Canvas principal |
| Superfície | `--surface` | `#0a0e15` | Áreas secundárias |
| Superfície elevada | `--surface-elevated` | `#121925` | Controles e destaques |
| Texto principal | `--text` | `#f7f8fa` | Títulos e conteúdo prioritário |
| Texto secundário | `--text-secondary` | `#c7cbd3` | Apoio e descrições |
| Texto discreto | `--muted` | `#929aa8` | Legendas e metadados |
| Acento da marca | `--accent` | `#b8ff5c` | CTA principal e sinalização positiva |
| Azul de interação | `--blue` | `#3b82f6` | Foco, links e profundidade |
| Borda | `--border` | branco a 8,5% | Separação sutil |

O verde-lima é reservado ao CTA primário, à marca e a pequenos sinais de confiança. Não deve preencher grandes áreas. Azul e violeta criam profundidade em glows e gradientes, nunca competem com o CTA.

## Tipografia

- Corpo: Inter, com fallback sans-serif.
- Títulos: Space Grotesk, aplicada por `.display-title` e `.section-title`.
- Títulos usam tracking negativo e `text-wrap: balance` para uma composição editorial.
- Texto corrido deve usar entre 1,6 e 1,75 de entrelinha.
- Eyebrows, captions e labels são curtos, em caixa alta e com tracking amplo.
- Evitar pesos extremos em parágrafos e não usar mais de três níveis de ênfase na mesma seção.

## Espaçamento e grid

- Container padrão: até 1216 px, com 24 px de margem lateral no desktop e 14 px no mobile.
- Seções: entre 88 e 128 px de espaço vertical por meio de `.section`.
- Escala preferencial: 4, 8, 12, 16, 24, 32, 48, 64 e 96 px.
- Elementos relacionados ficam próximos; blocos conceituais recebem respiro maior.
- Não compensar desalinhamentos com margens arbitrárias. Alinhar ao container e ao grid do bloco.

## Raios, bordas e sombras

- Controle: `--radius-control` (12 px).
- Painel compacto: `--radius-panel` (18 px).
- Card: `--radius-card` (24 px).
- Destaque editorial: `--radius-feature` (32 px).
- Bordas são discretas e ganham contraste apenas em hover ou foco.
- Sombras representam elevação. Usar `--shadow-card` e `--shadow-card-hover`; evitar sombras pretas duras.

## Componentes

### Botões

Usar somente `Button` ou `buttonVariants`. As variantes oficiais são `primary`, `secondary`, `ghost`, `outline` e `destructive`; os tamanhos são `sm`, `md`, `lg` e `icon`. Todos os estados — hover, active, focus, disabled e loading — já pertencem ao componente. Botões apenas com ícone precisam de `aria-label`.

### Cards e painéis

- `.card`: superfície principal com borda, raio e sombra padronizados.
- `.interactive-card`: adiciona elevação e glow sutil a cards clicáveis.
- `.surface-panel`: agrupamentos internos e sumários.
- Cards não clicáveis não devem se mover no hover.

### Badges

Usar `Badge` com as variantes `neutral`, `success`, `info` e `warning`. Badge informa estado ou contexto; nunca deve substituir um botão.

### Campos

Usar `Input`, `Textarea` ou a classe `.input-control`. Labels permanecem visíveis, placeholders são exemplos e erros usam `aria-invalid`. Controles desabilitados precisam conservar contraste e não responder ao cursor.

### Ícones

Usar a biblioteca `react-icons/fi`. Ícones de controles seguem o tamanho do botão. Em cards, usar `.icon-tile` para manter área, peso e alinhamento consistentes. Ícones decorativos usam `aria-hidden="true"`.

### Marca

A marca oficial usa o componente `BrandLogo`, que carrega o arquivo original em `public/brand/logo.png`. O favicon oficial fica em `public/brand/favicon.png`, com derivados técnicos apenas para os tamanhos exigidos por navegadores e dispositivos. Não redesenhar, recolorir, recortar, aplicar efeitos ou alterar as proporções desses ativos.

## Imagens

- Usar `next/image`, dimensões ou `fill` com `sizes` correto e `alt` descritivo.
- Preservar a proporção original; `object-cover` só quando o corte for intencional.
- Imagens acima da dobra podem usar prioridade; as demais permanecem lazy por padrão.
- A capa principal tem proporção 2:3 e deve ser apresentada sem distorção.

## Movimento

- Duração padrão: 200 a 380 ms.
- Curva principal: `--ease-premium`.
- Hover pode elevar até 4 px; press reduz levemente a escala.
- Animações de entrada devem usar fade, slide curto ou scale discreto.
- Sempre respeitar `prefers-reduced-motion`; movimento nunca pode ser necessário para compreender a interface.

## Acessibilidade e qualidade

- Uma página deve possuir um único `h1` e manter a ordem semântica dos headings.
- Todo elemento interativo precisa de nome acessível, foco visível e área mínima de 40–44 px.
- Texto informativo não depende somente de cor.
- Contraste, navegação por teclado e leitura em 360 px devem ser verificados antes de publicar.
- Não introduzir estilos locais quando um token ou componente existente resolver o caso.
- Não manter imagens esticadas, imports sem uso, logs, TODOs, FIXMEs ou componentes órfãos.

