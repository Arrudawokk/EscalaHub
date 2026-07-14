"use server";

import { redirect } from "next/navigation";
import { getOrderStore } from "@/lib/payments/orderStore";
import { isValidEmail } from "@/lib/payments/utils";
import { issueCustomerSession, revokeCustomerSession } from "@/lib/account/session";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function accessAccount(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const orderId = String(formData.get("orderId") ?? "").trim();
  let error: string | null = null;

  if (!isValidEmail(email) || email.length > 254 || !UUID_PATTERN.test(orderId)) {
    error = "Confira o e-mail e o código do pedido.";
  } else {
    const order = await getOrderStore().getByExternalReference(orderId);
    if (!order || order.payerEmail.trim().toLowerCase() !== email || order.status !== "approved" || order.accessStatus !== "granted") {
      error = "Não encontramos uma compra aprovada com esses dados.";
    } else {
      await issueCustomerSession(order);
    }
  }

  if (error) redirect(`/account/entrar?error=${encodeURIComponent(error)}`);
  redirect("/account");
}

export async function logoutAccount() {
  await revokeCustomerSession();
  redirect("/account/entrar");
}
