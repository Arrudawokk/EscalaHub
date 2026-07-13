import type { Metadata } from "next";
import { LegalDocument, type LegalSection } from "@/components/legal/LegalDocument";

export const metadata: Metadata = {
  title: "LGPD e Direitos do Titular",
  description: "Canal e informações para exercer direitos relacionados a dados pessoais tratados pela EscalaHub.",
  alternates: { canonical: "/LGPD" },
  openGraph: { title: "LGPD e Direitos do Titular | EscalaHub", description: "Informações sobre proteção de dados e exercício de direitos.", url: "/LGPD", type: "website", images: ["/opengraph-image"] },
  twitter: { card: "summary_large_image", title: "LGPD e Direitos do Titular | EscalaHub", description: "Proteção de dados e exercício de direitos.", images: ["/twitter-image"] },
};

const sections: LegalSection[] = [
  { title: "Compromisso com a LGPD", paragraphs: ["A EscalaHub busca tratar dados pessoais de forma compatível com os princípios de finalidade, adequação, necessidade, transparência, segurança, prevenção e responsabilização previstos na Lei Geral de Proteção de Dados.", "A governança será aprofundada à medida que novos processos, fornecedores e integrações forem incorporados."] },
  { title: "Papel da EscalaHub", paragraphs: ["A função de controladora ou operadora depende de cada atividade. Nas interações diretas com a plataforma, a EscalaHub pode definir finalidades e meios do tratamento. Fornecedores de pagamento e outras plataformas podem atuar como controladores independentes."] },
  { title: "Bases legais", paragraphs: ["O tratamento pode se apoiar em execução de contrato, cumprimento de obrigação legal ou regulatória, legítimo interesse avaliado, exercício regular de direitos, proteção contra fraude e consentimento quando essa for a base adequada.", "A base legal deve ser analisada conforme a finalidade concreta, sem uso genérico ou automático do consentimento."] },
  { title: "Direitos do titular", paragraphs: ["O titular pode exercer os direitos previstos na LGPD, observados requisitos legais e hipóteses de retenção."], bullets: ["Confirmação da existência de tratamento e acesso.", "Correção de dados incompletos, inexatos ou desatualizados.", "Anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desconformidade.", "Portabilidade, quando regulamentada e tecnicamente aplicável.", "Informação sobre compartilhamento e consequências de negar consentimento.", "Revogação do consentimento e oposição, quando cabíveis.", "Revisão de decisões tomadas unicamente com base em tratamento automatizado, quando aplicável."] },
  { title: "Como fazer uma solicitação", paragraphs: ["Envie a solicitação pelo canal oficial, identificando o direito que deseja exercer. Para proteger o titular, a EscalaHub poderá pedir informações adicionais para confirmar identidade e legitimidade.", "A resposta observará os prazos legais e poderá explicar eventual impossibilidade total ou parcial, incluindo obrigação de retenção."] },
  { title: "Segurança e incidentes", paragraphs: ["Medidas técnicas e organizacionais devem ser proporcionais ao risco e ao estágio da operação. Em caso de incidente relevante, serão avaliadas as medidas de contenção, investigação, documentação e comunicação exigidas pela legislação."] },
  { title: "Encarregado e revisão futura", paragraphs: ["O canal de contato publicado nesta página centraliza solicitações de titulares enquanto a estrutura de encarregado e governança é formalizada. A identificação de responsável específico será adicionada quando definida e validada juridicamente."] },
];

export default function LgpdPage() {
  return <LegalDocument eyebrow="Proteção de dados" title="LGPD e Direitos do Titular" description="Informações para compreender o tratamento de dados e exercer direitos previstos na legislação brasileira." sections={sections} />;
}
