/**
 * Demo credentials used to bootstrap a first OCMS administrator and to power
 * the one-click "demo login" button on the admin screen.
 *
 * IMPORTANT: this button and the value shown next to it (see AdminLogin.tsx)
 * are only ever as private as this constant is — anyone who can load the
 * /admin page can read this password directly off the page. That was already
 * true when this was a fixed string in source; making it configurable here
 * doesn't fix that, it just stops it being a fixed, guessable, permanently
 * public string. The demo login is OFF by default (empty values below); set
 * VITE_DEMO_ADMIN_EMAIL / VITE_DEMO_ADMIN_PASSWORD only in a pre-launch demo
 * environment, never in production. Once real admin accounts exist, unset
 * these and change the account's real Supabase Auth password.
 */
export const DEMO_ADMIN_EMAIL = import.meta.env["VITE_DEMO_ADMIN_EMAIL"] ?? "";
export const DEMO_ADMIN_PASSWORD = import.meta.env["VITE_DEMO_ADMIN_PASSWORD"] ?? "";
export const DEMO_ADMIN_ENABLED = Boolean(DEMO_ADMIN_EMAIL && DEMO_ADMIN_PASSWORD);

export const VOLUNTEER_STATUSES = [
  "New",
  "Contacted",
  "Approved",
  "Archived",
] as const;
export type VolunteerStatus = (typeof VOLUNTEER_STATUSES)[number];

export const MATERIAL_STATUSES = [
  "Pending",
  "Verified",
  "Rejected",
  "Acknowledged",
] as const;
export type MaterialStatus = (typeof MATERIAL_STATUSES)[number];

export const RECEIPT_STATUSES = [
  "Pending",
  "Verified",
  "Rejected",
  "Acknowledged",
] as const;
export type ReceiptStatus = (typeof RECEIPT_STATUSES)[number];

export const GALLERY_CATEGORIES = [
  "Education",
  "Shelter",
  "Healthcare",
  "Events",
  "General",
] as const;
