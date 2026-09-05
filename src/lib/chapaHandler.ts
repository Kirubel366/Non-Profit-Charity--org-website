/**
 * Chapa gateway handler — client-side entry point of the hybrid donation engine.
 *
 * Infrastructure is fully wired: when the Chapa credentials are supplied the
 * checkout initialises through the server function (`chapa.functions.ts`).
 * Until then everything degrades gracefully into "test mode" — never throws.
 *
 * To go live, add:
 *   VITE_CHAPA_PUBLIC_KEY   (browser, publishable)   — enables the online track
 *   CHAPA_SECRET_KEY        (backend secret)          — signs the transaction
 *   CHAPA_WEBHOOK_SECRET    (backend secret)          — verifies callbacks
 */

export interface ChapaCheckoutOptions {
  amount: number;
  currency?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  campaignTitle?: string;
  /** Absolute URL Chapa returns the donor to after payment. */
  returnUrl?: string;
}

export type ChapaResult =
  | { status: "initialized"; checkoutUrl: string; txRef: string }
  | { status: "fallback"; reason: string };

export const getChapaPublicKey = (): string | undefined => {
  const key = import.meta.env["VITE_CHAPA_PUBLIC_KEY"];
  return typeof key === "string" && key.trim().length > 0 ? key : undefined;
};

export const isChapaConfigured = () => Boolean(getChapaPublicKey());

export const buildTxRef = (prefix = "l4g") =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const TEST_MODE_MESSAGE =
  "Online card processing is in test mode. Please use a direct bank transfer below — it reaches our programs immediately with zero processing fees.";

export async function initChapaCheckout(
  options: ChapaCheckoutOptions,
): Promise<ChapaResult> {
  if (!isChapaConfigured()) {
    return { status: "fallback", reason: TEST_MODE_MESSAGE };
  }

  const txRef = buildTxRef();

  try {
    const { initializeChapaPayment } = await import("./chapa.functions");
    const result = await initializeChapaPayment({
      data: {
        amount: options.amount,
        currency: options.currency ?? "ETB",
        txRef,
        ...(options.email ? { email: options.email } : {}),
        ...(options.firstName ? { firstName: options.firstName } : {}),
        ...(options.lastName ? { lastName: options.lastName } : {}),
        ...(options.phoneNumber ? { phoneNumber: options.phoneNumber } : {}),
        ...(options.campaignTitle ? { campaignTitle: options.campaignTitle } : {}),
        ...(options.returnUrl ? { returnUrl: options.returnUrl } : {}),
      },
    });

    if (result.ok) {
      return { status: "initialized", checkoutUrl: result.checkoutUrl, txRef };
    }
    return { status: "fallback", reason: result.reason };
  } catch {
    return {
      status: "fallback",
      reason: "Checkout could not start right now. Please use a direct bank transfer.",
    };
  }
}
