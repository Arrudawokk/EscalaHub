# Relatório de CRO — Jornada de compra

## Escopo auditado

Jornada completa em desktop e mobile: Home → produto → checkout → confirmação. A validação foi feita no build de produção, incluindo navegação, hierarquia visual, CTAs, formulário, responsividade e estado final do pedido.

## Principais problemas encontrados

### Home

- A headline era ampla e não dizia imediatamente que o produto ensina tráfego pago.
- O CTA principal usava uma chamada genérica e escondia o preço até a seção seguinte.
- Dashboard e newsletter criavam saídas do funil para visitantes vindos de anúncios.
- A seção de destaque explicava a plataforma, mas não atacava diretamente a dor de investir sem um processo claro.
- Havia animações contínuas sem contribuição direta para a decisão de compra.

### Produto

- No celular, a capa ocupava a primeira tela inteira; a headline começava perto de 806 px e o primeiro CTA aparecia perto de 1.442 px.
- O Header repetia “Ver produto” dentro da própria página e oferecia navegação para áreas sem relação com a compra.
- A página longa tinha intervalos grandes entre CTAs no mobile.
- A seção vazia de avaliações chamava atenção para a ausência de prova social.
- A imagem era priorizada mesmo quando ficava abaixo da primeira dobra mobile.

### Checkout e confirmação

- No celular, o resumo ocupava a primeira tela e o formulário começava perto de 875 px.
- Cartão era a opção inicial, exibindo quatro campos adicionais antes do CTA.
- A mensagem inicial descrevia o processo, mas não reforçava quão perto o usuário estava do acesso.
- Alguns sinais de confiança repetiam conceitos sem esclarecer acesso, garantia e entrega.

## Melhorias realizadas

### Clareza e copy

- A Home agora abre com “Tráfego Pago. do Zero à Escala.” e identifica o guia no eyebrow.
- O CTA principal informa o preço: “Conhecer o método por R$ 47,00”.
- A seção de destaque agora confronta a dor “investir no escuro” e explica planejamento, métricas e otimização.
- FAQ passou a esclarecer preço único, ausência de mensalidade, acesso e garantia sem alegações não verificáveis.
- CTAs intermediários foram reescritos para indicar destino e intenção.

### Redução de distrações

- Dashboard foi removido do Header e do Footer da jornada comercial.
- Newsletter deixou de aparecer na Home para não desviar o usuário antes da compra.
- O Header da página de produto foi reduzido a marca e “Comprar agora”.
- A seção de avaliações vazia não é renderizada; depoimentos continuam preparados e só aparecem quando existirem relatos reais.

### Produto mobile-first

- Headline, proposta, detalhes, preço e CTA passaram a aparecer antes da capa no celular.
- O H1 saiu de aproximadamente 806 px para 157 px.
- O primeiro CTA saiu de aproximadamente 1.442 px para 793 px.
- Uma barra mobile fixa mantém preço e “Quero acesso agora” visíveis durante a página longa.
- A composição desktop original foi preservada.

### Checkout

- O formulário passou a vir antes do resumo no celular: de aproximadamente 875 px para 185 px.
- Pix agora é a opção inicial e aparece primeiro, reduzindo campos visíveis sem remover cartão.
- O resumo permanece ao lado do formulário no desktop.
- A copy inicial reforça proximidade do acesso e explica o fluxo em uma frase.
- Sinais de confiança foram concentrados em garantia, proteção dos dados, produto digital e instruções por e-mail.
- O fluxo Pix foi concluído até a tela de confirmação durante a auditoria.

### Performance

- Removidas animações infinitas do Hero que não apoiavam a conversão.
- Imagens que ficam abaixo da dobra mobile deixaram de ser forçadas como preload/eager.
- Newsletter e seção vazia de prova social deixaram de compor o HTML da Home/produto.
- Não foi encontrado overflow horizontal em 390 px nem em 1440 px.

## Hipóteses de aumento de conversão

1. **Especificidade na primeira dobra:** visitantes de Meta Ads reconhecem imediatamente o assunto e permanecem mais tempo na Home.
2. **Preço antes do clique:** reduz cliques sem intenção e aumenta a qualidade de quem chega à página do produto.
3. **CTA persistente no produto:** reduz a dependência de o usuário encontrar manualmente um dos CTAs em uma página longa.
4. **Conteúdo antes da capa no mobile:** entrega proposta, preço e ação antes de exigir rolagem.
5. **Formulário antes do resumo:** reduz a sensação de distância até o pagamento.
6. **Pix inicial:** reduz carga cognitiva e quantidade de campos para a opção de menor fricção.
7. **Sem prova social vazia:** evita transformar a ausência de avaliações em uma objeção explícita.
8. **Menos saídas do funil:** reduz navegação para Dashboard e newsletter durante a decisão de compra.

## Próximos testes A/B recomendados

Os testes abaixo devem ser executados um por vez, com evento de exposição, `ViewContent`, `InitiateCheckout` e compra confirmada:

1. CTA da Home com preço versus “Ver o guia completo”.
2. Headline orientada ao produto versus headline orientada à dor “Pare de investir no escuro”.
3. Barra fixa do produto sempre visível versus exibida após a primeira dobra.
4. Pix selecionado por padrão versus nenhuma forma pré-selecionada.
5. CTA “Quero acesso agora” versus “Começar com o guia”.
6. Garantia próxima ao preço versus dentro do botão/área de CTA.
7. Resumo completo abaixo do formulário versus resumo compacto antes dos campos no mobile.
8. Página completa versus versão com módulos recolhidos em accordion no mobile.

Não testar depoimentos, números, escassez ou certificações até existirem evidências reais e autorização de uso.

## Métricas recomendadas

- Home → produto.
- Produto → checkout.
- Início do preenchimento → envio do checkout.
- Abandono por método de pagamento.
- Conversão confirmada por origem/campanha e por dispositivo.
- Tempo até o primeiro CTA e profundidade de rolagem.

O evento `Purchase` só deve ser usado após confirmação real e idempotente do provedor de pagamento.
