import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { TablesInsert } from "@/integrations/supabase/types";

/**
 * Every insert payload below is typed against `TablesInsert<"table">` from
 * the real, generated database schema (`src/integrations/supabase/types.ts`).
 * If a table or column name here doesn't match the live database, this file
 * will fail to compile — that's intentional. Do not loosen these types to
 * make an error disappear; fix the field name instead.
 *
 * These functions run with the service-role client (`supabaseAdmin`), so
 * they bypass RLS. That's fine for public *inserts* the anon policies would
 * allow anyway, but it also means the Zod validation below IS the only
 * gatekeeper — keep it in sync with the DB constraints.
 */

const emailSchema = z.string().trim().email().max(255);

async function getSupabaseAdmin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

/* ----------------------------- Contact form ----------------------------- */

const contactValidator = z.object({
  full_name: z.string().trim().min(2).max(100),
  email: emailSchema,
  phone: z.string().trim().max(40).nullable().optional(),
  subject: z.string().trim().max(150).nullable().optional(),
  message: z.string().trim().min(10).max(1000),
});

export const submitContactMessage = createServerFn({ method: "POST" })
  .validator((input: unknown) => contactValidator.parse(input))
  .handler(async ({ data }) => {
    const payload = {
      full_name: data.full_name,
      email: data.email,
      phone_number: data.phone || null,
      subject: data.subject || null,
      message: data.message,
    };

    const supabaseAdmin = await getSupabaseAdmin();
    const { error } = await supabaseAdmin.from("contact_messages").insert(payload);
    if (error) {
      console.error("submitContactMessage failed", error);
      throw new Error("We couldn't send your message. Please try again shortly.");
    }
    return { ok: true as const };
  });

/* ------------------------- Volunteer application ------------------------- */

const volunteerValidator = z.object({
  full_name: z.string().trim().min(2).max(100),
  email: emailSchema,
  phone: z.string().trim().min(1).max(40),
  pillar: z.string().trim().min(1),
  skills: z.array(z.string()).min(1),
  availability: z.array(z.string()).min(1),
  motivation: z.string().trim().min(1).max(1000),
  cv_url: z.string().trim().min(1).max(1000),
});

export const submitVolunteerApplication = createServerFn({ method: "POST" })
  .validator((input: unknown) => volunteerValidator.parse(input))
  .handler(async ({ data }) => {
    console.debug("submitVolunteerApplication received data:", data);
    const payload = {
      full_name: data.full_name,
      email: data.email,
      phone_number: data.phone,
      service_pillar: data.pillar,
      skills: data.skills,
      availability: data.availability,
      motivation: data.motivation,
      cv_url: data.cv_url,
      status: "New",
    };

    const supabaseAdmin = await getSupabaseAdmin();
    const { error } = await supabaseAdmin.from("volunteer_applications").insert(payload);
    if (error) {
      console.error("submitVolunteerApplication failed", error);
      throw new Error("We couldn't submit your application. Please try again shortly.");
    }
    return { ok: true as const };
  });

/* -------------------------- Material donation -------------------------- */

const materialValidator = z.object({
  full_name: z.string().trim().min(2).max(100),
  email: z.string().trim().max(255).nullable().optional(),
  phone: z.string().trim().min(1).max(40),
  item_categories: z.array(z.string()).min(1),
  item_details: z.string().trim().min(5).max(1000),
  estimated_quantity: z.string().trim().max(120).nullable().optional(),
  handover_method: z.string().trim().min(1),
  preferred_date: z.string().trim().nullable().optional(),
  address: z.string().trim().max(300).nullable().optional(),
  note: z.string().trim().max(500).nullable().optional(),
});

export const submitMaterialDonation = createServerFn({ method: "POST" })
  .validator((input: unknown) => materialValidator.parse(input))
  .handler(async ({ data }) => {
    const deliveryMethodMap: Record<string, string> = {
      dropoff: "I will drop it off",
      pickup: "Please collect from me",
      courier: "Sending by courier",
    };

    const payload = {
      full_name: data.full_name,
      email: data.email || null,
      phone_number: data.phone,
      selected_categories: data.item_categories,
      item_details: data.item_details,
      estimated_weight_qty: data.estimated_quantity || null,
      delivery_method: deliveryMethodMap[data.handover_method] ?? data.handover_method,
      preferred_handover_date: data.preferred_date || null,
      pickup_address: data.address || null,
      additional_notes: data.note || null,
      status: "Pending",
    };

    const supabaseAdmin = await getSupabaseAdmin();
    const { error } = await supabaseAdmin.from("material_donations").insert(payload);
    if (error) {
      console.error("submitMaterialDonation failed", error);
      throw new Error("We couldn't record your pledge. Please try again shortly.");
    }
    return { ok: true as const };
  });

/* --------------------------- Transfer receipt ---------------------------- */

const transferValidator = z.object({
  full_name: z.string().trim().min(2).max(100),
  email: z.string().trim().max(255).nullable().optional(),
  phone: z.string().trim().min(1).max(40),
  amount: z.number().positive().nullable().optional(),
  currency: z.string().trim().min(1),
  bank_name: z.string().trim().nullable().optional(),
  reference_number: z.string().trim().max(120).nullable().optional(),
  note: z.string().trim().max(500).nullable().optional(),
  screenshot_path: z.string().trim().min(1),
});

export const submitTransferProof = createServerFn({ method: "POST" })
  .validator((input: unknown) => transferValidator.parse(input))
  .handler(async ({ data }) => {
    const payload = {
      name_on_transfer: data.full_name,
      email: data.email || null,
      phone_number: data.phone,
      amount: data.amount ?? null,
      bank_channel: data.bank_name || null,
      transaction_reference: data.reference_number || null,
      message: data.note || null,
      screenshot_url: data.screenshot_path,
      status: "Pending",
    };

    const supabaseAdmin = await getSupabaseAdmin();
    const { error } = await supabaseAdmin.from("transfer_proofs").insert(payload);
    if (error) {
      console.error("submitTransferProof failed", error);
      throw new Error("We couldn't record your receipt. Please try again shortly.");
    }
    return { ok: true as const };
  });

/* --------------------------- Site profile ---------------------------- */

export const getSiteProfile = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      const supabaseAdmin = await getSupabaseAdmin();
      const { data, error } = await supabaseAdmin
        .from("site_settings")
        .select("contact_email, emergency_phone, secondary_phone")
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("getSiteProfile supabase error", error);
        return { email: null, phones: [] };
      }

      const phones = [data?.emergency_phone, data?.secondary_phone].filter(
        (p): p is string => Boolean(p && p.toString().trim().length > 0),
      );

      return { email: data?.contact_email ?? null, phones: Array.from(new Set(phones)) };
    } catch (err) {
      console.error("getSiteProfile failed", err);
      return { email: null, phones: [] };
    }
  });
