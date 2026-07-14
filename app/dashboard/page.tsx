import { redirect } from "next/navigation";
import { requireCustomerSession } from "@/lib/account/data";

export default async function DashboardPage() {
  await requireCustomerSession();
  redirect("/account");
}
