import type { Metadata } from "next";
import { LegalDocument, type LegalSection } from "@/components/legal/LegalDocument";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description: "Condições para utilizar a plataforma, adquirir produtos digitais e acessar conteúdos da EscalaHub.",
  alternates: { canonical: "/termos" },
  openGraph: { title: "Termos de Uso | EscalaHub", description: "Condições de uso da plataforma e dos produtos digitais.", url: "/termos", type: "website", images: ["/opengraph-image"] },
  twitter: { card: "summary_large_image", title: "Termos de Uso | EscalaHub", description: "Condições de uso da plataforma e dos produtos digitais.", images: ["/twitter-image"] },
};

const sections: LegalSection[] = [
  { title: "Aceitação e escopo", paragraphs: ["Estes Termos regulam o acesso à EscalaHub, aos conteúdos gratuitos e aos produtos digitais oferecidos na plataforma. Ao utilizar o site ou concluir uma compra, você declara ter lido e aceitado as condições aplicáveis.", "Condições específicas exibidas na página de um produto integram estes Termos para aquela aquisição."] },
  { title: "Informações e elegibilidade", paragraphs: ["O usuário deve fornecer informações corretas e atualizadas quando necessárias para compra, entrega ou suporte. O uso por menores deve observar a legislação e a participação do responsável legal quando exigida."] },
  { title: "Produtos, preços e acesso", paragraphs: ["Preço, formato, prazo de acesso e garantia são informados antes da compra. A confirmação e a liberação dependem da validação do meio de pagamento utilizado.", "O acesso é pessoal e não pode ser revendido, compartilhado publicamente ou usado para distribuir cópias não autorizadas."] },
  { title: "Propriedade intelectual", paragraphs: ["Textos, identidade visual, materiais, métodos, arquivos e demais conteúdos são protegidos pela legislação aplicável. A compra concede uma licença pessoal de uso, não transfere direitos de propriedade intelectual."], bullets: ["É permitido estudar e aplicar o conteúdo para fins próprios.", "Não é permitido copiar, revender, publicar ou disponibilizar o material integral ou parcialmente sem autorização.", "Citações breves devem indicar a fonte e respeitar os limites legais."] },
  { title: "Uso responsável", paragraphs: ["Não é permitido tentar comprometer a segurança, automatizar acessos abusivos, fraudar pagamentos, violar direitos de terceiros ou utilizar a plataforma para atividade ilegal.", "A EscalaHub pode restringir acesso em caso de fraude, abuso ou violação material destes Termos, respeitados os direitos aplicáveis."] },
  { title: "Conteúdo educacional e resultados", paragraphs: ["Os materiais possuem finalidade educacional e não constituem promessa de resultado financeiro, profissional ou comercial. Resultados dependem de contexto, execução, mercado e decisões do próprio usuário.", "A EscalaHub procura manter conteúdo claro e atualizado, mas informações podem precisar de revisão diante de mudanças de plataformas, legislação ou mercado."] },
  { title: "Garantia, suporte e alterações", paragraphs: ["Solicitações de garantia seguem o prazo e as condições apresentadas na oferta e a legislação aplicável. O suporte utiliza os canais oficiais publicados no site.", "Estes Termos podem ser atualizados. Mudanças relevantes serão refletidas pela nova data de revisão e aplicadas conforme permitido pela legislação."] },
];

export default function TermsPage() {
  return <LegalDocument eyebrow="Condições de uso" title="Termos de Uso" description="Regras claras para navegar, comprar, acessar e utilizar os produtos digitais da EscalaHub." sections={sections} />;
}
