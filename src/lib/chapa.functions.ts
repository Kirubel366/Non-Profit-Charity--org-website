import { createServerFn } from "@tanstack/react-start";

/**
 * Chapa server infrastructure.
 *
 * The transaction is signed server-side with CHAPA_SECRET_KEY so the secret
 * never reaches the browser. Until the secret is configured every call returns
 * a graceful `ok: false` result — no throw, no console exception.
 */

export interface ChapaInitInput {
  amount: number;
  currency: string;
  txRef: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  campaignTitle?: string;
  returnUrl?: string;
}

export type ChapaInitResult =
  | { ok: true; checkoutUrl: string; txRef: string }
  | { ok: false; reason: string };

const CHAPA_API = "https://api.chapa.co/v1";

const validateInit = (input: ChapaInitInput): ChapaInitInput => {
  if (!Number.isFinite(input.amount) || input.amount < 10) {
    throw new Error("Amount must be at least 10.");
  }
  if (!input.txRef || input.txRef.length > 80) {
    throw new Error("Invalid transaction reference.");
  }
  return input;
};

export const initializeChapaPayment = createServerFn({ method: "POST" })
  .validator(validateInit)
  .handler(async ({ data }): Promise<ChapaInitResult> => {
    const secret = process.env["CHAPA_SECRET_KEY"];
    if (!secret) {
      return {
        ok: false,
        reason:
          "Online card processing is in test mode. Please use a direct bank transfer below.",
      };
    }

    try {
      const response = await fetch(`${CHAPA_API}/transaction/initialize`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secret}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: String(data.amount),
          currency: data.currency,
          tx_ref: data.txRef,
          ...(data.email ? { email: data.email } : {}),
          ...(data.firstName ? { first_name: data.firstName } : {}),
          ...(data.lastName ? { last_name: data.lastName } : {}),
          ...(data.phoneNumber ? { phone_number: data.phoneNumber } : {}),
          ...(data.returnUrl ? { return_url: data.returnUrl } : {}),
          ...(process.env["CHAPA_CALLBACK_URL"]
            ? { callback_url: process.env["CHAPA_CALLBACK_URL"] }
            : {}),
          customization: {
            title: (data.campaignTitle ?? "Donation").slice(0, 16),
            description: "Thank you for supporting our programs.",
          },
        }),
      });

      const payload = (await response.json()) as {
        status?: string;
        message?: string;
        data?: { checkout_url?: string };
      };

      const checkoutUrl = payload.data?.checkout_url;
      if (!response.ok || !checkoutUrl) {
        return {
          ok: false,
          reason: payload.message ?? "Chapa could not start this checkout.",
        };
      }

      return { ok: true, checkoutUrl, txRef: data.txRef };
    } catch {
      return { ok: false, reason: "Chapa is unreachable right now." };
    }
  });

export const verifyChapaPayment = createServerFn({ method: "POST" })
  .validator((input: { txRef: string }) => {
    if (!input?.txRef) throw new Error("Missing transaction reference.");
    return input;
  })
  .handler(async ({ data }) => {
    const secret = process.env["CHAPA_SECRET_KEY"];
    if (!secret) return { ok: false as const, reason: "Chapa is not configured." };

    try {
      const response = await fetch(
        `${CHAPA_API}/transaction/verify/${encodeURIComponent(data.txRef)}`,
        { headers: { Authorization: `Bearer ${secret}` } },
      );
      const payload = (await response.json()) as {
        status?: string;
        data?: { status?: string; amount?: string; currency?: string };
      };
      return {
        ok: response.ok && payload.data?.status === "success",
        status: payload.data?.status ?? "unknown",
        amount: payload.data?.amount ?? null,
        currency: payload.data?.currency ?? null,
      };
    } catch {
      return { ok: false as const, reason: "Verification failed." };
    }
  });
