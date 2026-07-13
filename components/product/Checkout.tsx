"use client";

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { FormEvent, useEffect, useRef, useState } from "react";
import { FiAlertCircle, FiArrowLeft, FiCheck, FiCheckCircle, FiCopy, FiCreditCard, FiDownloadCloud, FiFileText, FiLock, FiMail, FiPlus, FiRefreshCw, FiShield } from "react-icons/fi";
import { SiPix } from "react-icons/si";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ProductEventTracker } from "@/components/analytics/ProductEventTracker";
import { trackPurchase } from "@/lib/analytics";
import { formatProductPrice, getProductPath, type Product } from "@/lib/catalog";
import type { PixPaymentDetails } from "@/lib/payments/types";
import { onlyDigits } from "@/lib/payments/utils";

type PaymentMethod = "card" | "pix";
type SubmissionStatus = "pending" | "in_process" | "approved" | "rejected" | "cancelled" | "refunded" | "charged_back";

const mercadoPagoPublicKey = process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY;
const POLL_INTERVAL_MS = 4000;
const MAX_POLL_ATTEMPTS = 30;

const nextSteps = [
  { icon: FiFileText, number: "01", title: "Compra", text: "Você preenche seus dados e escolhe a forma de pagamento." },
  { icon: FiCheckCircle, number: "02", title: "Confirmação", text: "O pagamento passa pela confirmação do meio selecionado." },
  { icon: FiMail, number: "03", title: "Liberação", text: "As instruções de acesso são enviadas para o seu e-mail." },
  { icon: FiDownloadCloud, number: "04", title: "Acesso", text: "Com o acesso liberado, o material digital fica disponível para consulta." },
];

export function Checkout({ product }: { product: Product }) {
  const [method, setMethod] = useState<PaymentMethod>("pix");
  const [complete, setComplete] = useState(false);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [status, setStatus] = useState<SubmissionStatus>("pending");
  const [pix, setPix] = useState<PixPaymentDetails | null>(null);
  const [pixCopied, setPixCopied] = useState(false);
  const mercadoPagoRef = useRef<InstanceType<NonNullable<Window["MercadoPago"]>> | null>(null);
  const purchaseTrackedRef = useRef(false);
  const formattedPrice = formatProductPrice(product);
  const productHref = getProductPath(product);
  const trustSignals = [
    { icon: FiShield, title: "Compra protegida", text: `Garantia de ${product.guaranteeDays} dias` },
    { icon: FiLock, title: "Dados protegidos", text: "Conexão segura" },
    { icon: FiDownloadCloud, title: "Produto digital", text: "Acesso após confirmação" },
    { icon: FiMail, title: "Instruções de acesso", text: "Enviadas por e-mail" },
  ];
  const quickQuestions = [
    { question: "Quando recebo o acesso?", answer: "As instruções são enviadas para o e-mail informado após a confirmação do pagamento." },
    { question: "Como acesso o material?", answer: `Você recebe por e-mail as orientações para acessar ${product.title}.` },
    { question: "Posso acessar novamente?", answer: `Sim. O acesso ao material é ${product.accessLabel.toLowerCase()} para futuras consultas.` },
    { question: "Como funciona a garantia?", answer: `Você pode avaliar o material por ${product.guaranteeDays} dias e solicitar reembolso dentro desse prazo.` },
  ];

  useEffect(() => {
    if (!orderId || status === "approved" || status === "rejected" || status === "cancelled" || status === "refunded" || status === "charged_back") return;

    let attempts = 0;
    const interval = window.setInterval(async () => {
      attempts += 1;
      try {
        const response = await fetch(`/api/payments/status?orderId=${orderId}`);
        if (response.ok) {
          const data = (await response.json()) as { status: SubmissionStatus };
          setStatus(data.status);
        }
      } catch {
        // Falha de rede pontual: a próxima tentativa do polling cobre o caso.
      }
      if (attempts >= MAX_POLL_ATTEMPTS) window.clearInterval(interval);
    }, POLL_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, [orderId, status]);

  useEffect(() => {
    if (status === "approved" && !purchaseTrackedRef.current && orderId) {
      purchaseTrackedRef.current = true;
      trackPurchase(
        { slug: product.slug, title: product.title, price: product.price, currency: product.currency },
        { transactionId: orderId, value: product.price },
      );
    }
  }, [status, orderId, product]);

  function handleMercadoPagoLoaded() {
    if (!mercadoPagoPublicKey || !window.MercadoPago) return;
    mercadoPagoRef.current = new window.MercadoPago(mercadoPagoPublicKey, { locale: "pt-BR" });
  }

  async function copyPixCode() {
    if (!pix) return;
    await navigator.clipboard.writeText(pix.qrCode);
    setPixCopied(true);
    window.setTimeout(() => setPixCopied(false), 2500);
  }

  async function finishOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "");
    const document = String(formData.get("document") ?? "");
    const payer = { name, email, document };

    setSubmitting(true);
    try {
      let cardPayload: { token: string; paymentMethodId: string; installments: number } | undefined;

      if (method === "card") {
        if (!mercadoPagoPublicKey) throw new Error("Pagamento com cartão indisponível no momento.");
        const mp = mercadoPagoRef.current;
        if (!mp) throw new Error("Não foi possível carregar o Mercado Pago. Atualize a página e tente novamente.");

        const cardNumber = onlyDigits(String(formData.get("cardNumber") ?? ""));
        const cardholderName = String(formData.get("cardName") ?? "");
        const expiry = String(formData.get("cardExpiry") ?? "");
        const securityCode = String(formData.get("cardCvv") ?? "");
        const [expirationMonth, expirationYearShort] = expiry.split("/");

        const paymentMethods = await mp.getPaymentMethods({ bin: cardNumber.slice(0, 6) });
        const paymentMethodId = paymentMethods.results[0]?.id;
        if (!paymentMethodId) throw new Error("Não reconhecemos a bandeira do cartão informado.");

        const token = await mp.cardToken.create({
          cardNumber,
          cardholderName,
          cardExpirationMonth: expirationMonth,
          cardExpirationYear: `20${expirationYearShort}`,
          securityCode,
          identificationType: "CPF",
          identificationNumber: onlyDigits(document),
        });

        cardPayload = { token: token.id, paymentMethodId, installments: 1 };
      }

      const response = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productSlug: product.slug, method, payer, card: cardPayload }),
      });

      const data = (await response.json()) as { orderId?: string; status?: SubmissionStatus; pix?: PixPaymentDetails; error?: string };
      if (!response.ok || !data.orderId || !data.status) throw new Error(data.error || "Não foi possível concluir o pagamento.");

      setOrderId(data.orderId);
      setStatus(data.status);
      setPix(data.pix ?? null);

      if (data.status === "rejected" || data.status === "cancelled") {
        throw new Error("Pagamento não aprovado. Verifique os dados do cartão ou tente outra forma de pagamento.");
      }

      setComplete(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Não foi possível concluir o pagamento.");
    } finally {
      setSubmitting(false);
    }
  }

  if (complete) {
    const statusLabel: Record<SubmissionStatus, string> = {
      pending: method === "pix" ? "Aguardando Pix" : "Processando",
      in_process: "Processando",
      approved: "Pagamento aprovado",
      rejected: "Pagamento recusado",
      cancelled: "Pagamento cancelado",
      refunded: "Pagamento reembolsado",
      charged_back: "Pagamento contestado",
    };

    return (
      <main className="noise grid min-h-screen place-items-center bg-[#070a10] px-5 py-16">
        <div className="relative w-full max-w-xl overflow-hidden rounded-[32px] border border-white/[.1] bg-[#0d1119] p-7 text-center shadow-[0_35px_110px_rgba(0,0,0,.42)] sm:p-10 md:p-12">
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#b8ff5c]/10 blur-[90px]" />
          <span className="relative mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#b8ff5c] text-2xl text-black shadow-[0_16px_50px_rgba(184,255,92,.2)]"><FiCheck aria-hidden="true" /></span>
          <p className="eyebrow relative mt-8 justify-center">Próxima etapa</p>
          <h1 className="display-title relative mt-4 text-4xl font-semibold text-white md:text-5xl">{method === "pix" && status !== "approved" ? "Pague com Pix." : "Confira seu e-mail."}</h1>
          <p className="relative mx-auto mt-5 max-w-md leading-7 text-zinc-300">
            {method === "pix" && status !== "approved" ? (
              "Escaneie o QR Code ou copie o código abaixo no app do seu banco."
            ) : (
              <>Enviamos as instruções de confirmação da compra para <strong className="text-white">{email}</strong>.</>
            )}
          </p>

          {method === "pix" && pix && status !== "approved" ? (
            <div className="relative mt-8 flex flex-col items-center gap-4">
              <div className="rounded-2xl border border-white/[.1] bg-white p-3">
                {/* eslint-disable-next-line @next/next/no-img-element -- imagem base64 dinâmica do gateway, não passa pelo otimizador */}
                <img src={`data:image/png;base64,${pix.qrCodeBase64}`} alt="QR Code para pagamento via Pix" width={220} height={220} />
              </div>
              <Button type="button" variant="outline" size="md" onClick={copyPixCode} className="w-full">
                <FiCopy /> {pixCopied ? "Código copiado!" : "Copiar código Pix"}
              </Button>
            </div>
          ) : null}

          <div className="relative mt-8 rounded-2xl border border-white/[.08] bg-white/[.035] p-5 text-left">
            <div className="flex justify-between text-sm"><span className="text-zinc-500">Total</span><strong className="text-white">{formattedPrice}</strong></div>
            <div className="mt-3 flex justify-between text-sm"><span className="text-zinc-500">Status</span><span className="font-bold text-[#b8ff5c]">{statusLabel[status]}</span></div>
          </div>
          <p className="relative mt-5 text-xs leading-5 text-zinc-500">O acesso ao produto digital é liberado após a confirmação do pagamento.</p>
          <Button asChild size="lg" className="relative mt-8 w-full"><Link href="/">Voltar para a EscalaHub</Link></Button>
        </div>
      </main>
    );
  }

  return (
    <main data-checkout className="relative min-h-screen overflow-hidden bg-[#070a10]">
      {mercadoPagoPublicKey ? <Script src="https://sdk.mercadopago.com/js/v2" strategy="afterInteractive" onLoad={handleMercadoPagoLoaded} /> : null}
      <ProductEventTracker event="InitiateCheckout" product={{ slug: product.slug, title: product.title, price: product.price, currency: product.currency }} />
      <div className="premium-grid pointer-events-none fixed inset-0 opacity-30" />
      <div className="pointer-events-none fixed -left-52 top-20 h-[520px] w-[520px] rounded-full bg-blue-600/[.08] blur-[150px]" />
      <div className="pointer-events-none fixed -right-52 bottom-0 h-[500px] w-[500px] rounded-full bg-violet-600/[.07] blur-[150px]" />

      <header className="relative border-b border-white/[.07] bg-[#070a10]/80 backdrop-blur-2xl">
        <div className="container-default flex h-[76px] items-center justify-between">
          <Link href="/" className="group flex min-h-11 items-center gap-2.5 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-4 focus-visible:ring-offset-[#070a10] sm:gap-3" aria-label="EscalaHub — página inicial">
            <span className="grid h-9 w-9 place-items-center rounded-[11px] bg-[#b8ff5c] text-sm font-black text-black shadow-[0_0_30px_rgba(184,255,92,.16)] transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105">E</span>
            <span className="display-title text-[19px] font-bold text-white sm:text-xl">EscalaHub</span>
          </Link>
          <Badge variant="neutral" className="border-white/[.1] bg-white/[.055] py-2 text-zinc-100"><FiLock className="text-[#b8ff5c]" aria-hidden="true" /> <span className="hidden sm:inline">Ambiente seguro</span><span className="sm:hidden">Seguro</span></Badge>
        </div>
      </header>

      <div className="container-default relative pb-28 pt-8 sm:pb-32 sm:pt-10 md:pt-14 lg:pb-14">
        <Link href={productHref} className="inline-flex min-h-11 items-center gap-2 rounded-lg py-2 text-sm font-semibold text-zinc-300 outline-none transition-[color,transform] hover:-translate-x-0.5 hover:text-white focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-4 focus-visible:ring-offset-[#070a10]" aria-label={`Voltar para ${product.title}`}><FiArrowLeft /> Voltar para o produto</Link>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.08fr_.92fr] lg:items-start lg:gap-14">
          <form id="checkout-form" onSubmit={finishOrder} className="space-y-8" aria-label="Finalizar compra">
            <div>
              <p className="eyebrow">Checkout seguro</p>
              <h1 className="display-title mt-3 text-3xl font-semibold text-white sm:text-4xl">Falta pouco para acessar.</h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-400 sm:text-base">Confirme seus dados, escolha Pix ou cartão e receba as instruções após a confirmação do pagamento.</p>
            </div>

            <section aria-labelledby="checkout-dados-title">
              <div className="mb-5 flex items-center gap-3"><span className="grid h-8 w-8 place-items-center rounded-full bg-[#b8ff5c] text-sm font-black text-black">1</span><div><h2 id="checkout-dados-title" className="display-title text-2xl font-bold text-white">Seus dados</h2><p className="mt-0.5 text-xs text-zinc-500">Usaremos o e-mail para enviar as instruções de acesso.</p></div></div>
              <div className="grid gap-4 rounded-[26px] border border-white/[.085] bg-white/[.025] p-5 shadow-[inset_0_1px_rgba(255,255,255,.025),0_24px_70px_rgba(0,0,0,.12)] md:grid-cols-2 md:p-6">
                <label className="md:col-span-2"><span className="mb-2 block text-xs font-bold text-zinc-300">Nome completo</span><Input required name="name" autoComplete="name" placeholder="Como está no documento" /></label>
                <label><span className="mb-2 block text-xs font-bold text-zinc-300">E-mail</span><Input required type="email" name="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="voce@email.com" /></label>
                <label><span className="mb-2 block text-xs font-bold text-zinc-300">CPF</span><Input required name="document" inputMode="numeric" minLength={11} maxLength={14} placeholder="000.000.000-00" /></label>
              </div>
            </section>

            <section aria-labelledby="checkout-pagamento-title">
              <div className="mb-5 flex items-center gap-3"><span className="grid h-8 w-8 place-items-center rounded-full bg-[#b8ff5c] text-sm font-black text-black">2</span><div><h2 id="checkout-pagamento-title" className="display-title text-2xl font-bold text-white">Pagamento</h2><p className="mt-0.5 text-xs text-zinc-500">Escolha a opção mais conveniente para você.</p></div></div>
              <div className="grid grid-cols-2 gap-3" role="group" aria-label="Forma de pagamento">
                <Button type="button" size="lg" variant={method === "pix" ? "primary" : "outline"} onClick={() => setMethod("pix")} aria-pressed={method === "pix"} className="h-16 rounded-2xl"><SiPix /> Pix</Button>
                <Button type="button" size="lg" variant={method === "card" ? "primary" : "outline"} onClick={() => setMethod("card")} aria-pressed={method === "card"} className="h-16 rounded-2xl"><FiCreditCard /> Cartão</Button>
              </div>

              {method === "card" ? (
                <div className="mt-4 grid gap-4 rounded-[26px] border border-white/[.085] bg-white/[.025] p-5 shadow-[inset_0_1px_rgba(255,255,255,.025)] md:grid-cols-2 md:p-6">
                  <label className="md:col-span-2"><span className="mb-2 block text-xs font-bold text-zinc-300">Número do cartão</span><Input required name="cardNumber" inputMode="numeric" autoComplete="cc-number" minLength={16} maxLength={19} placeholder="0000 0000 0000 0000" /></label>
                  <label className="md:col-span-2"><span className="mb-2 block text-xs font-bold text-zinc-300">Nome no cartão</span><Input required name="cardName" autoComplete="cc-name" placeholder="NOME IMPRESSO NO CARTÃO" className="uppercase" /></label>
                  <label><span className="mb-2 block text-xs font-bold text-zinc-300">Validade</span><Input required name="cardExpiry" autoComplete="cc-exp" placeholder="MM/AA" minLength={5} maxLength={5} /></label>
                  <label><span className="mb-2 block text-xs font-bold text-zinc-300">CVV</span><Input required name="cardCvv" type="password" inputMode="numeric" autoComplete="cc-csc" minLength={3} maxLength={4} placeholder="•••" aria-label="Código de segurança do cartão" /></label>
                </div>
              ) : (
                <div className="mt-4 rounded-[26px] border border-white/[.085] bg-white/[.025] p-5 sm:p-6">
                  <div className="flex items-start gap-4"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#b8ff5c]/10 text-xl text-[#b8ff5c]"><SiPix aria-hidden="true" /></span><div><h3 className="font-bold text-white">Pagamento rápido via Pix</h3><p className="mt-2 text-sm leading-6 text-zinc-400">Ao finalizar, você receberá o código Pix. A liberação do acesso acontece após a confirmação do pagamento.</p></div></div>
                </div>
              )}
            </section>

            {errorMessage ? (
              <div role="alert" className="flex items-start gap-3 rounded-2xl border border-red-400/25 bg-red-400/10 p-4 text-sm text-red-100">
                <FiAlertCircle className="mt-0.5 shrink-0" aria-hidden="true" /> <span>{errorMessage}</span>
              </div>
            ) : null}

            <div className="rounded-[26px] border border-[#b8ff5c]/20 bg-[#b8ff5c]/[.055] p-3 shadow-[0_20px_60px_rgba(184,255,92,.06)]">
              <Button type="submit" size="lg" disabled={submitting} className="group h-16 w-full rounded-2xl px-5 text-base shadow-[0_16px_50px_rgba(134,204,54,.32)] focus-visible:ring-[#b8ff5c] sm:px-7">
                <span>{submitting ? "Processando..." : method === "pix" ? "Gerar Pix" : "Finalizar compra"}</span>
                <span className="ml-auto flex items-center gap-2 border-l border-black/15 pl-4">{formattedPrice} <FiCheckCircle className="transition-transform duration-200 group-hover:scale-110" /></span>
              </Button>
              <p className="mt-3 flex items-center justify-center gap-2 px-2 text-center text-[11px] font-medium text-zinc-400"><FiLock className="text-[#b8ff5c]" /> Seus dados são enviados em ambiente protegido.</p>
            </div>
          </form>

          <aside className="order-last lg:sticky lg:top-6 lg:h-fit" aria-label="Resumo do pedido">
            <div className="overflow-hidden rounded-[30px] border border-white/[.1] bg-[#0d1119] shadow-[0_30px_90px_rgba(0,0,0,.28)]">
              <div className="border-b border-white/[.08] bg-gradient-to-br from-blue-500/[.1] via-transparent to-violet-500/[.07] p-5 sm:p-7">
                <p className="text-[10px] font-black uppercase tracking-[.16em] text-[#b8ff5c]">Seu pedido</p>
                <div className="mt-5 flex gap-4">
                  <div className="h-32 w-[92px] shrink-0 overflow-hidden rounded-xl border border-white/[.08] bg-[#080b10] p-1.5 shadow-[0_16px_40px_rgba(0,0,0,.35)]"><Image src={product.coverImage} alt={`Capa de ${product.title}`} width={184} height={256} sizes="92px" className="h-full w-full rounded-lg object-contain" /></div>
                  <div className="min-w-0"><Badge variant="neutral" className="border-white/[.1] bg-white/[.055] text-zinc-100">Produto digital</Badge><h2 className="mt-3 font-bold leading-snug text-white">{product.title}</h2><p className="mt-2 flex items-center gap-1.5 text-xs text-zinc-400"><FiDownloadCloud className="text-[#b8ff5c]" /> Acesso após confirmação</p></div>
                </div>
              </div>

              <div className="p-5 sm:p-7">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/[.07] bg-white/[.025] p-3"><FiFileText className="text-[#b8ff5c]" /><span className="mt-2 block text-[9px] font-bold uppercase tracking-[.1em] text-zinc-500">Formato</span><strong className="mt-1 block text-xs text-white">{product.format}</strong></div>
                  <div className="rounded-2xl border border-white/[.07] bg-white/[.025] p-3"><FiDownloadCloud className="text-[#b8ff5c]" /><span className="mt-2 block text-[9px] font-bold uppercase tracking-[.1em] text-zinc-500">Acesso</span><strong className="mt-1 block text-xs text-white">{product.accessLabel}</strong></div>
                </div>
                <div className="mt-5 space-y-3 border-y border-white/[.08] py-5 text-sm"><div className="flex justify-between"><span className="text-zinc-500">Produto</span><span className="text-zinc-300">{formattedPrice}</span></div><div className="flex justify-between"><span className="text-zinc-500">Taxas</span><span className="text-zinc-300">R$ 0,00</span></div></div>
                <div className="pt-5"><span className="text-[10px] font-bold uppercase tracking-[.12em] text-zinc-500">Pagamento único</span><div className="mt-1 flex items-end justify-between"><span className="font-bold text-white">Total</span><strong className="display-title text-4xl font-black tracking-[-.045em] text-white">{formattedPrice}</strong></div></div>
              </div>
            </div>

            <div className="mt-4 rounded-[24px] border border-[#b8ff5c]/20 bg-[#b8ff5c]/[.055] p-5">
              <div className="flex items-start gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#b8ff5c]/10 text-xl text-[#b8ff5c]"><FiShield /></span><div><h3 className="font-bold text-white">Garantia de {product.guaranteeDays} dias</h3><p className="mt-1 text-xs leading-5 text-zinc-400">Você pode avaliar o material e solicitar reembolso dentro do prazo da garantia.</p></div></div>
            </div>
          </aside>
        </div>

        <section className="mt-14 border-t border-white/[.07] pt-12 sm:mt-16 sm:pt-16" aria-labelledby="checkout-confianca-title">
          <div className="text-center"><p className="eyebrow justify-center">Antes de pagar</p><h2 id="checkout-confianca-title" className="display-title mt-4 text-3xl font-semibold text-white sm:text-4xl">Tudo claro, sem surpresas.</h2></div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {trustSignals.map(({ icon: Icon, title, text }) => (
              <article key={title} className="rounded-[22px] border border-white/[.08] bg-white/[.025] p-5 shadow-[inset_0_1px_rgba(255,255,255,.025)]">
                <span className="grid h-10 w-10 place-items-center rounded-xl border border-[#b8ff5c]/10 bg-[#b8ff5c]/[.08] text-lg text-[#b8ff5c]"><Icon aria-hidden="true" /></span>
                <h3 className="mt-5 text-sm font-bold text-white">{title}</h3><p className="mt-1.5 text-xs text-zinc-500">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-[30px] border border-white/[.085] bg-[#0b0f16]/85 p-6 shadow-[0_28px_90px_rgba(0,0,0,.2)] backdrop-blur-xl sm:p-8 lg:p-10" aria-labelledby="checkout-proximos-passos-title">
          <div className="grid gap-6 lg:grid-cols-[.68fr_1.32fr] lg:items-end"><div><p className="eyebrow">Depois do pagamento</p><h2 id="checkout-proximos-passos-title" className="display-title mt-4 text-3xl font-semibold text-white sm:text-4xl">O que acontece a seguir.</h2></div><p className="max-w-xl text-sm leading-6 text-zinc-400 lg:justify-self-end">Um processo simples, do preenchimento dos dados até a liberação do produto digital.</p></div>
          <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {nextSteps.map(({ icon: Icon, number, title, text }) => (
              <li key={number} className="relative rounded-[22px] border border-white/[.075] bg-white/[.025] p-5">
                <div className="flex items-center justify-between"><Icon className="text-xl text-[#b8ff5c]" aria-hidden="true" /><span className="font-mono text-[10px] font-bold text-zinc-600">{number}</span></div>
                <h3 className="mt-5 font-bold text-white">{title}</h3><p className="mt-2 text-sm leading-6 text-zinc-500">{text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-16 grid gap-10 pb-8 lg:grid-cols-[.68fr_1.32fr] lg:gap-14" aria-labelledby="checkout-duvidas-title">
          <div><p className="eyebrow">Perguntas rápidas</p><h2 id="checkout-duvidas-title" className="display-title mt-4 text-3xl font-semibold text-white sm:text-4xl">Antes de finalizar.</h2><p className="mt-4 max-w-md text-sm leading-6 text-zinc-400">Respostas diretas para concluir sua compra com segurança.</p><div className="mt-6 flex items-center gap-2 text-xs font-semibold text-zinc-400"><FiRefreshCw className="text-[#b8ff5c]" /> Garantia de 7 dias</div></div>
          <div className="divide-y divide-white/[.08] border-y border-white/[.08]">
            {quickQuestions.map(({ question, answer }) => (
              <details key={question} className="group py-1">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 rounded-xl py-5 text-left font-bold text-white outline-none transition-colors hover:text-[#b8ff5c] focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-4 focus-visible:ring-offset-[#070a10]"><span>{question}</span><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/[.1] bg-white/[.035] text-zinc-400 transition-[transform,color] duration-300 group-open:rotate-45 group-open:text-[#b8ff5c]"><FiPlus aria-hidden="true" /></span></summary>
                <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 group-open:grid-rows-[1fr]"><div className="overflow-hidden"><p className="pb-5 pr-9 text-sm leading-6 text-zinc-400">{answer}</p></div></div>
              </details>
            ))}
          </div>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/[.1] bg-[#080b10]/92 px-4 py-3 shadow-[0_-18px_55px_rgba(0,0,0,.38)] backdrop-blur-2xl lg:hidden">
        <div className="mx-auto flex max-w-md items-center gap-3">
          <div className="shrink-0"><span className="block text-[9px] font-bold uppercase tracking-[.1em] text-zinc-500">Pagamento único</span><strong className="display-title mt-0.5 block text-xl font-black text-white">{formattedPrice}</strong></div>
          <Button type="submit" form="checkout-form" size="md" disabled={submitting} className="ml-auto h-12 min-w-44 flex-1 rounded-xl px-4 text-sm shadow-[0_12px_36px_rgba(134,204,54,.28)]" aria-label={`${method === "pix" ? "Gerar Pix" : "Finalizar compra"} por ${formattedPrice}`}>
            {submitting ? "Processando..." : method === "pix" ? "Gerar Pix" : "Finalizar compra"}
          </Button>
        </div>
      </div>
    </main>
  );
}
