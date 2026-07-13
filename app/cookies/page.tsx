import type { Metadata } from "next";
import { LegalDocument, type LegalSection } from "@/components/legal/LegalDocument";

export const metadata: Metadata = {
  title: "Política de Cookies",
  description: "Saiba como cookies e tecnologias semelhantes podem ser utilizados na EscalaHub.",
  alternates: { canonical: "/cookies" },
  openGraph: { title: "Política de Cookies | EscalaHub", description: "Uso de cookies e tecnologias semelhantes na plataforma.", url: "/cookies", type: "website", images: ["/opengraph-image"] },
  twitter: { card: "summary_large_image", title: "Política de Cookies | EscalaHub", description: "Uso de cookies e tecnologias semelhantes.", images: ["/twitter-image"] },
};

const sections: LegalSection[] = [
  { title: "O que são cookies", paragraphs: ["Cookies são pequenos arquivos ou identificadores armazenados no dispositivo para permitir funções, lembrar preferências, medir uso e apoiar segurança. Tecnologias semelhantes podem cumprir funções equivalentes."] },
  { title: "Categorias previstas", paragraphs: ["A EscalaHub organiza o uso de cookies conforme finalidade e necessidade."], bullets: ["Essenciais: necessários para funcionamento, segurança e entrega da página.", "Preferências: lembram escolhas realizadas pelo usuário.", "Analytics: ajudam a entender navegação e desempenho de conteúdo.", "Marketing: apoiam mensuração de campanhas e públicos quando integrações reais estão configuradas."] },
  { title: "Ferramentas opcionais", paragraphs: ["Google Analytics, Google Tag Manager e Meta Pixel só são carregados quando IDs reais são configurados no ambiente da aplicação. Cada fornecedor pode tratar dados conforme seus próprios termos e políticas.", "A estrutura técnica da EscalaHub não utiliza IDs fictícios para simular rastreamento."] },
  { title: "Como gerenciar", paragraphs: ["O usuário pode excluir ou bloquear cookies nas configurações do navegador. A restrição de cookies essenciais pode afetar o funcionamento de partes da plataforma.", "Quando um mecanismo de consentimento granular for necessário à operação, ele deverá permitir aceitar, recusar ou revisar categorias não essenciais."] },
  { title: "Prazo e terceiros", paragraphs: ["A duração varia conforme a finalidade e a configuração do fornecedor. Cookies de sessão expiram ao encerrar a navegação; cookies persistentes permanecem pelo período definido ou até serem removidos.", "Links para sites externos podem levar a ambientes com políticas próprias, pelas quais a EscalaHub não é responsável."] },
  { title: "Atualizações", paragraphs: ["Esta Política será atualizada quando novas tecnologias, fornecedores ou escolhas de consentimento forem incorporados à plataforma."] },
];

export default function CookiesPage() {
  return <LegalDocument eyebrow="Transparência digital" title="Política de Cookies" description="Como cookies e tecnologias semelhantes apoiam funcionamento, segurança e mensuração da plataforma." sections={sections} />;
}
