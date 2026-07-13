import { Checkout } from "@/components/product/Checkout";
import { getProductFromCheckoutParam } from "@/lib/catalog";

type CheckoutPageProps = {
  searchParams: Promise<{ product?: string | string[] }>;
};

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const product = getProductFromCheckoutParam((await searchParams).product);
  return <Checkout product={product} />;
}
