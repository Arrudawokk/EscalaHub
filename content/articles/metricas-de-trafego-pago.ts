import type { Article } from "./types";

export const metricasDeTrafegoPago = {
  slug: "metricas-de-trafego-pago",
  title: "Métricas de tráfego pago: o que analisar primeiro",
  description: "Entenda uma sequência prática para analisar CPM, CTR, CPC, conversão, CPA e ROAS sem tirar conclusões isoladas.",
  excerpt: "Métricas isoladas raramente contam a história inteira. Aprenda uma sequência de leitura para localizar gargalos antes de alterar a campanha.",
  category: "Marketing",
  authorId: "equipe-escalahub",
  publishedAt: "2026-07-12",
  updatedAt: "2026-07-12",
  keywords: ["métricas de tráfego pago", "CTR", "CPC", "CPA", "ROAS", "otimização de campanhas"],
  featured: false,
  status: "published",
  sections: [
    {
      id: "leia-como-funil",
      title: "Leia as métricas como um funil",
      paragraphs: [
        "CPM, CTR, CPC, taxa de conversão, CPA e ROAS descrevem partes diferentes do caminho entre impressão e receita. A análise fica mais útil quando segue a mesma ordem da jornada.",
        "Comece verificando se a campanha entrega, depois se chama atenção, se gera visitas qualificadas e, por fim, se a página transforma essas visitas na ação desejada.",
      ],
    },
    {
      id: "entrega-e-atencao",
      title: "Entrega e atenção: CPM e CTR",
      paragraphs: [
        "O CPM mostra o custo para alcançar mil impressões. Ele varia conforme concorrência, público, posicionamento e período, por isso deve ser comparado dentro de contextos semelhantes.",
        "O CTR ajuda a observar a relação entre impressão e clique. Um CTR baixo pode apontar desalinhamento de mensagem, criativo ou público, mas não deve ser avaliado sem considerar a qualidade dos cliques gerados.",
      ],
      callout: "Um anúncio pode ter muitos cliques e ainda assim atrair pessoas sem intenção de avançar.",
    },
    {
      id: "custo-da-visita",
      title: "Custo da visita: CPC e qualidade do tráfego",
      paragraphs: [
        "O CPC mostra quanto cada clique custou, mas um clique barato não é necessariamente eficiente. Compare o custo com o comportamento posterior: visualizações relevantes, tempo de permanência e avanço no funil.",
        "Se o anúncio gera cliques, mas a página quase não gera ações, investigue a continuidade da mensagem, o carregamento, a clareza da oferta e a experiência mobile antes de culpar apenas a segmentação.",
      ],
    },
    {
      id: "conversao-e-cpa",
      title: "Conversão e CPA: onde o negócio aparece",
      paragraphs: [
        "A taxa de conversão relaciona visitas e ações concluídas. O CPA mostra quanto foi investido, em média, para cada conversão atribuída.",
        "Avalie o CPA junto de margem, ticket e qualidade da conversão. Uma campanha só é sustentável quando o custo de aquisição cabe na economia real da oferta.",
      ],
      bullets: ["Confirme se o evento representa uma conversão real.", "Separe leads de vendas ao comparar custos.", "Considere cancelamentos e reembolsos na análise."],
    },
    {
      id: "roas-e-decisao",
      title: "ROAS e decisão de escala",
      paragraphs: [
        "O ROAS compara receita atribuída e investimento em mídia. Ele é útil, mas não substitui margem, custos operacionais e fluxo de caixa.",
        "Antes de escalar, procure consistência em uma janela adequada, volume suficiente de conversões e capacidade operacional para atender a demanda. Aumentar orçamento sobre dados frágeis amplia tanto acertos quanto erros.",
      ],
      callout: "A melhor métrica é aquela que ajuda a tomar uma decisão específica sem esconder o restante da operação.",
    },
  ],
} satisfies Article;
