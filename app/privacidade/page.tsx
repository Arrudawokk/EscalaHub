import type { Metadata } from "next";
import { LegalDocument, type LegalSection } from "@/components/legal/LegalDocument";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: "Entenda quais dados a EscalaHub pode tratar, para quais finalidades e quais são os seus direitos.",
  alternates: { canonical: "/privacidade" },
  openGraph: { title: "Política de Privacidade | EscalaHub", description: "Práticas de privacidade e proteção de dados da EscalaHub.", url: "/privacidade", type: "website", images: ["/brand/logo.png"] },
  twitter: { card: "summary_large_image", title: "Política de Privacidade | EscalaHub", description: "Práticas de privacidade e proteção de dados.", images: ["/brand/logo.png"] },
};

const sections: LegalSection[] = [
  { title: "Escopo e responsabilidade", paragraphs: ["Esta Política descreve como a EscalaHub trata dados pessoais relacionados à navegação, contato, compra e acesso aos produtos digitais.", "Quando o pagamento ou outro serviço for realizado por um fornecedor externo, esse fornecedor também poderá atuar como controlador independente conforme a própria política de privacidade."] },
  { title: "Dados que podem ser tratados", paragraphs: ["Os dados variam conforme a interação realizada. A EscalaHub procura limitar a coleta ao necessário para cada finalidade."], bullets: ["Dados de contato, como nome e e-mail, quando enviados voluntariamente.", "Dados necessários à compra e entrega, conforme o fluxo de pagamento utilizado.", "Dados técnicos, como endereço IP, dispositivo, navegador, páginas acessadas e origem da visita.", "Mensagens e informações fornecidas em solicitações de suporte ou exercício de direitos."] },
  { title: "Finalidades do tratamento", paragraphs: ["Os dados podem ser usados para entregar produtos, responder solicitações, manter a segurança, cumprir obrigações legais, medir desempenho da plataforma e melhorar conteúdo e experiência.", "Dados de analytics e publicidade só são coletados quando as integrações correspondentes estão configuradas e devem respeitar as escolhas e configurações aplicáveis."] },
  { title: "Compartilhamento", paragraphs: ["Dados podem ser compartilhados com fornecedores estritamente necessários à hospedagem, pagamento, comunicação, analytics, segurança e suporte. A EscalaHub não comercializa listas de dados pessoais.", "Também poderá haver compartilhamento para cumprir ordem legal, regulatória ou proteger direitos e segurança da plataforma e de seus usuários."] },
  { title: "Retenção e segurança", paragraphs: ["Os dados são mantidos pelo período necessário às finalidades informadas, ao cumprimento de obrigações ou ao exercício regular de direitos.", "São adotadas medidas técnicas e organizacionais compatíveis com o estágio da operação. Nenhum ambiente digital, contudo, pode prometer risco zero."] },
  { title: "Seus direitos", paragraphs: ["Nos termos da legislação aplicável, você pode solicitar confirmação de tratamento, acesso, correção, anonimização, bloqueio, eliminação, portabilidade quando aplicável, informação sobre compartilhamento e revisão de decisões automatizadas."], bullets: ["A solicitação pode exigir validação de identidade.", "Alguns dados podem ser preservados quando houver obrigação legal ou base legítima para retenção.", "Pedidos devem ser enviados pelos canais oficiais da EscalaHub."] },
  { title: "Atualizações desta Política", paragraphs: ["Esta Política pode ser atualizada para refletir mudanças operacionais, legais ou tecnológicas. A data de revisão será sempre indicada no início do documento."] },
];

export default function PrivacyPage() {
  return <LegalDocument eyebrow="Privacidade" title="Política de Privacidade" description="Transparência sobre coleta, uso, compartilhamento e proteção de dados pessoais na EscalaHub." sections={sections} />;
}
