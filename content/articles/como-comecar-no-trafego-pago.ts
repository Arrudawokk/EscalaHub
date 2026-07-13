import type { Article } from "./types";

export const comoComecarNoTrafegoPago = {
  slug: "como-comecar-no-trafego-pago",
  title: "Como começar no tráfego pago sem investir no escuro",
  description: "Um roteiro prático para organizar objetivo, oferta, mensuração e orçamento antes de publicar a primeira campanha de tráfego pago.",
  excerpt: "Antes do primeiro anúncio, organize objetivo, oferta, mensuração e limite de investimento. Esta sequência reduz improviso e melhora a qualidade das decisões.",
  category: "Marketing",
  authorId: "equipe-escalahub",
  publishedAt: "2026-07-12",
  updatedAt: "2026-07-12",
  keywords: ["tráfego pago para iniciantes", "como anunciar", "planejamento de campanha", "Meta Ads", "Google Ads"],
  featured: true,
  status: "published",
  sections: [
    {
      id: "comece-pelo-objetivo",
      title: "Comece pelo objetivo, não pela plataforma",
      paragraphs: [
        "A primeira decisão não é escolher entre Meta Ads, Google Ads ou outra plataforma. É definir o resultado que a campanha precisa produzir e como esse resultado será observado.",
        "Uma campanha de reconhecimento, uma campanha para captar contatos e uma campanha para vender exigem mensagens, páginas e métricas diferentes. Sem essa definição, qualquer número pode parecer bom ou ruim fora de contexto.",
      ],
      bullets: ["Defina uma ação principal esperada.", "Escolha uma métrica ligada a essa ação.", "Estabeleça um período mínimo para análise."],
    },
    {
      id: "revise-oferta",
      title: "Revise a oferta antes de comprar atenção",
      paragraphs: [
        "Tráfego pago amplia a distribuição de uma mensagem; ele não corrige sozinho uma proposta pouco clara. Antes de investir, verifique se o visitante entende o que está sendo oferecido, para quem é e qual é o próximo passo.",
        "A página de destino deve continuar a conversa iniciada no anúncio. Quando anúncio e página prometem coisas diferentes, a campanha perde eficiência mesmo que gere cliques.",
      ],
      callout: "Antes de aumentar o orçamento, reduza a distância entre a promessa do anúncio e a experiência da página.",
    },
    {
      id: "prepare-mensuracao",
      title: "Prepare a mensuração antes de publicar",
      paragraphs: [
        "Defina quais eventos representam progresso: visualização do produto, início do checkout e compra confirmada são exemplos de etapas distintas. Cada evento responde a uma pergunta diferente sobre o funil.",
        "Valide links, parâmetros de campanha e eventos antes de investir. Dados incompletos tornam a otimização mais lenta e podem levar a decisões baseadas em impressões isoladas.",
      ],
      bullets: ["Use parâmetros UTM consistentes.", "Teste os eventos em ambiente de validação.", "Registre a origem da campanha até a conversão."],
    },
    {
      id: "defina-orcamento",
      title: "Defina orçamento e limite de aprendizado",
      paragraphs: [
        "O orçamento inicial deve permitir observar comportamento sem comprometer a operação. Não existe um valor universal: ticket, margem, taxa de conversão e custo do mercado alteram a conta.",
        "Estabeleça antecipadamente quanto pode ser investido, quando revisar e quais sinais justificam manter, ajustar ou interromper uma campanha. Isso reduz decisões impulsivas durante oscilações normais.",
      ],
    },
    {
      id: "publique-com-hipotese",
      title: "Publique com uma hipótese clara",
      paragraphs: [
        "Uma campanha inicial deve responder a uma pergunta específica. Testar muitas variáveis ao mesmo tempo dificulta identificar o que produziu a mudança.",
        "Registre público, mensagem, criativo, oferta e resultado esperado. Ao final do período de análise, compare o observado com a hipótese e escolha o próximo ajuste com base nessa diferença.",
      ],
      callout: "Começar pequeno não significa começar sem método. Significa limitar risco enquanto a campanha produz informação útil.",
    },
  ],
} satisfies Article;
