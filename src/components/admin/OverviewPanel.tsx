import { useQuery } from "@tanstack/react-query";
import {
  CalendarDays,
  HeartHandshake,
  Images,
  Inbox,
  PackageCheck,
  ReceiptText,
  Users,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getDonationNotificationCount } from "./donationCounts";
import { PanelHeader, LoadingRows, formatDateTime, StatusPill } from "./primitives";
import type { AdminTab } from "./AdminShell";

interface RecentRow {
  id: string;
  kind: string;
  who: string;
  detail: string;
  status?: string;
  created_at: string;
}

export function useAdminCounts() {
  return useQuery({
    queryKey: ["admin", "counts"],
    queryFn: async (): Promise<Partial<Record<AdminTab, number>>> => {
      const head = { count: "exact" as const, head: true };
      const [volunteers, inquiries, materials, transferProofs, events, gallery] = await Promise.all([
        supabase.from("volunteer_applications").select("id", head).eq("status", "New"),
        supabase.from("contact_messages").select("id", head).eq("is_read", false),
        supabase.from("material_donations").select("id", head).eq("status", "Pending"),
        supabase.from("transfer_proofs").select("id", head).eq("status", "Pending"),
        supabase.from("events").select("id", head),
        supabase.from("gallery_items").select("id", head),
      ]);
      return {
        volunteers: volunteers.count ?? 0,
        inquiries: inquiries.count ?? 0,
        donations: getDonationNotificationCount(materials.count ?? 0, transferProofs.count ?? 0),
        events: events.count ?? 0,
        gallery: gallery.count ?? 0,
      };
    },
  });
}

const tiles = [
  { key: "events", label: "Published events", icon: CalendarDays },
  { key: "gallery", label: "Gallery items", icon: Images },
  { key: "volunteers", label: "New applicants", icon: Users },
  { key: "inquiries", label: "Unread messages", icon: Inbox },
  { key: "donations", label: "Pending donations", icon: HeartHandshake },
] as const;

export function OverviewPanel({
  counts,
  onNavigate,
}: {
  counts: Partial<Record<AdminTab, number>>;
  onNavigate: (tab: AdminTab) => void;
}) {
  const recent = useQuery({
    queryKey: ["admin", "recent"],
    queryFn: async (): Promise<RecentRow[]> => {
      const [volunteers, inquiries, materials, receipts] = await Promise.all([
          supabase
            .from("volunteer_applications")
            .select("id, full_name, service_pillar, status, created_at")
            .order("created_at", { ascending: false })
            .limit(5),
        supabase
          .from("contact_messages")
          .select("id, full_name, subject, is_read, created_at")
          .order("created_at", { ascending: false })
          .limit(5),
        supabase
          .from("material_donations")
          .select("id, full_name, item_details, status, created_at")
          .order("created_at", { ascending: false })
          .limit(5),
        supabase
          .from("transfer_proofs")
          .select("id, name_on_transfer, amount, status, created_at")
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

      const rows: RecentRow[] = [
        ...(volunteers.data ?? []).map((row) => ({
          id: `v-${row.id}`,
          kind: "Volunteer",
          who: row.full_name,
          detail: row.service_pillar,
          status: row.status,
          created_at: row.created_at,
        })),
        ...(inquiries.data ?? []).map((row) => ({
          id: `i-${row.id}`,
          kind: "Inquiry",
          who: row.full_name,
          detail: row.subject ?? "General message",
          status: row.is_read ? "Archived" : "New",
          created_at: row.created_at,
        })),
        ...(materials.data ?? []).map((row) => ({
          id: `m-${row.id}`,
          kind: "Material gift",
          who: row.full_name,
          detail: row.item_details.slice(0, 60),
          status: row.status,
          created_at: row.created_at,
        })),
        ...(receipts.data ?? []).map((row) => ({
          id: `r-${row.id}`,
          kind: "Transfer proof",
          who: row.name_on_transfer ?? "",
          detail: row.amount ? `${row.amount}` : "Amount not stated",
          status: row.status,
          created_at: row.created_at,
        })),
      ];

      return rows
        .sort((a, b) => b.created_at.localeCompare(a.created_at))
        .slice(0, 12);
    },
  });

  return (
    <div className="space-y-6">
      <PanelHeader
        title="Overview"
        description="Everything that arrived from the public website, in one place."
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
        {tiles.map((tile) => (
          <button
            key={tile.key}
            type="button"
            onClick={() => onNavigate(tile.key as AdminTab)}
            className="rounded-card border border-border bg-card p-4 text-left transition-colors hover:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <tile.icon className="size-4 text-brand" aria-hidden />
            <p className="mt-3 text-2xl font-bold tabular-nums">
              {counts[tile.key as AdminTab] ?? 0}
            </p>
            <p className="text-xs text-muted-foreground">{tile.label}</p>
          </button>
        ))}
      </div>

      <section aria-labelledby="recent-heading" className="space-y-3">
        <h3 id="recent-heading" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Latest activity
        </h3>
        {recent.isLoading ? (
          <LoadingRows rows={3} />
        ) : recent.data && recent.data.length > 0 ? (
          <ul className="divide-y divide-border overflow-hidden rounded-card border border-border bg-card">
            {recent.data.map((row) => (
              <li key={row.id} className="flex flex-wrap items-center gap-3 p-4">
                <span className="flex size-9 items-center justify-center rounded-card bg-muted text-muted-foreground">
                  {row.kind === "Volunteer" ? (
                    <Users className="size-4" aria-hidden />
                  ) : row.kind === "Inquiry" ? (
                    <Inbox className="size-4" aria-hidden />
                  ) : row.kind === "Material gift" ? (
                    <PackageCheck className="size-4" aria-hidden />
                  ) : (
                    <ReceiptText className="size-4" aria-hidden />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{row.who}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {row.kind} · {row.detail}
                  </p>
                </div>
                {row.status ? <StatusPill status={row.status} /> : null}
                <span className="w-full text-xs text-muted-foreground sm:w-auto">
                  {formatDateTime(row.created_at)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-card border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No submissions yet. Activity from the website will appear here.
          </p>
        )}
      </section>
    </div>
  );
}

export default OverviewPanel;
