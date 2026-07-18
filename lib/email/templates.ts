import type { EmailMessage, TransactionalEmailData, TransactionalEmailTemplate } from "./types";
import { SITE_URL } from "@/lib/site";

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ?? character);
}

export function renderTransactionalEmail(template: TransactionalEmailTemplate, data: TransactionalEmailData): EmailMessage {
  const name = data.recipientName?.trim() || "cliente";
  const messages: Record<TransactionalEmailTemplate, { subject: string; heading: string; body: string }> = {
    purchase_approved: { subject: `Pagamento aprovado — ${data.productTitle}`, heading: "Pagamento aprovado", body: `Seu pagamento de ${data.formattedAmount} foi confirmado.` },
    payment_pending: { subject: `Pagamento pendente — ${data.productTitle}`, heading: "Pagamento pendente", body: "Seu pedido foi criado e aguarda a confirmação do pagamento." },
    refund_processed: { subject: `Reembolso processado — ${data.productTitle}`, heading: "Reembolso processado", body: "O reembolso foi registrado e o acesso ao produto foi encerrado." },
    product_delivery: { subject: `Seu acesso a ${data.productTitle}`, heading: "Produto liberado", body: "O produto já está disponível em sua biblioteca protegida." },
  };
  const message = messages[template];
  const text = `Olá, ${name}.\n\n${message.body}\n\nPedido: ${data.orderId}\nAcesse: ${data.accountUrl}`;
  const logoUrl = `${SITE_URL}/brand/logo.png`;
  const html = `<div style="background:#071008;padding:32px"><div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#f7f8fa"><img src="${escapeHtml(logoUrl)}" alt="EscalaHub" width="108" height="72" style="display:block;width:108px;height:72px;object-fit:contain;margin:0 0 24px"><p>Olá, ${escapeHtml(name)}.</p><h1>${escapeHtml(message.heading)}</h1><p>${escapeHtml(message.body)}</p><p><strong>Pedido:</strong> ${escapeHtml(data.orderId)}</p><p><a href="${escapeHtml(data.accountUrl)}" style="display:inline-block;border-radius:12px;background:#B8FF5C;padding:14px 20px;color:#071008;font-weight:700;text-decoration:none">Acessar minha conta</a></p><p style="color:#929aa8">EscalaHub</p></div></div>`;
  return { to: data.recipientEmail, subject: message.subject, html, text };
}
