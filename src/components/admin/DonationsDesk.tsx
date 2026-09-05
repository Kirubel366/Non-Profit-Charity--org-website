import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalLink, PackageCheck, ReceiptText } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { MATERIAL_STATUSES, RECEIPT_STATUSES } from "@/lib/adminConstants";
import { RECEIPTS_BUCKET } from "@/lib/storageBuckets";
import {
  EmptyState,
  LoadingRows,
  PanelHeader,
  StatusPill,
  formatDate,
  formatDateTime,
} from "./primitives";

export function DonationsDesk() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState("materials");

  const materials = useQuery({
    queryKey: ["admin", "materials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("material_donations")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const receipts = useQuery({
    queryKey: ["admin", "receipts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transfer_proofs")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const setStatus = useMutation({
    mutationFn: async ({ table, id, status }: { table: "material_donations" | "transfer_proofs"; id: string; status: string; }) => {
      const { error } = await supabase.from(table).update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Status updated");
      void queryClient.invalidateQueries({ queryKey: ["admin", "materials"] });
      void queryClient.invalidateQueries({ queryKey: ["admin", "receipts"] });
      void queryClient.invalidateQueries({ queryKey: ["admin", "counts"] });
    },
    onError: (error: Error) => toast.error("Update failed", { description: error.message }),
  });

  const openReceipt = async (path: string | null) => {
    if (!path) return;
    const { data, error } = await supabase.storage
      .from(RECEIPTS_BUCKET)
      .createSignedUrl(path, 600);
    if (error || !data?.signedUrl) {
      toast.error("Could not open the screenshot", { description: error?.message });
      return;
    }
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-6">
      <PanelHeader
        title="Donations desk"
        description="Material pledges and bank transfer proofs submitted by supporters."
      />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList
          aria-label="Donation record type"
          className="flex h-auto w-full max-w-md flex-col gap-1.5 p-1.5 sm:grid sm:grid-cols-2 sm:gap-1"
        >
          <TabsTrigger value="materials" className="w-full gap-2 py-2.5 sm:py-2">
            <PackageCheck className="size-4" aria-hidden /> Material pledges
          </TabsTrigger>
          <TabsTrigger value="receipts" className="w-full gap-2 py-2.5 sm:py-2">
            <ReceiptText className="size-4" aria-hidden /> Transfer proofs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="materials" className="mt-6">
          {materials.isLoading ? (
            <LoadingRows />
          ) : materials.data && materials.data.length > 0 ? (
            <ul className="space-y-3">
              {materials.data.map((row) => (
                <li key={row.id} className="rounded-card border border-border bg-card p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                        <p className="font-semibold">{row.full_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {row.phone_number}
                          {row.email ? ` · ${row.email}` : ""} · {formatDateTime(row.created_at)}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusPill status={row.status} />
                      <Select
                        value={row.status}
                        onValueChange={(status) =>
                          setStatus.mutate({ table: "material_donations", id: row.id, status })
                        }
                      >
                        <SelectTrigger
                          className="h-8 w-36 text-xs"
                          aria-label={`Update status for ${row.full_name}`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {MATERIAL_STATUSES.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(row.selected_categories ?? []).map((cat) => (
                      <Badge key={cat} variant="secondary">
                        {cat}
                      </Badge>
                    ))}
                  </div>
                  <p className="mt-3 text-sm">{row.item_details}</p>
                  <dl className="mt-3 grid gap-x-6 gap-y-1 text-xs text-muted-foreground sm:grid-cols-2">
                    <div className="flex gap-2">
                      <dt className="font-medium">Quantity:</dt>
                      <dd>{row.estimated_weight_qty ?? "—"}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="font-medium">Delivery:</dt>
                      <dd>
                        {row.delivery_method}
                        {row.preferred_handover_date ? ` · ${formatDate(row.preferred_handover_date)}` : ""}
                      </dd>
                    </div>
                    {row.pickup_address ? (
                      <div className="flex gap-2 sm:col-span-2">
                        <dt className="font-medium">Address:</dt>
                        <dd>{row.pickup_address}</dd>
                      </div>
                    ) : null}
                    {row.additional_notes ? (
                      <div className="flex gap-2 sm:col-span-2">
                        <dt className="font-medium">Note:</dt>
                        <dd>{row.additional_notes}</dd>
                      </div>
                    ) : null}
                  </dl>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={<PackageCheck className="size-5" aria-hidden />}
              title="No material pledges yet"
              description="In-kind donation pledges from the donation section will appear here."
            />
          )}
        </TabsContent>

        <TabsContent value="receipts" className="mt-6">
  {receipts.isLoading ? (
    <LoadingRows />
  ) : receipts.data && receipts.data.length > 0 ? (
    <ul className="space-y-3">
      {receipts.data.map((row) => (
        <li
          key={row.id}
          className="rounded-card border border-border bg-card p-4"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-semibold">
                {row.name_on_transfer}
                {row.amount
                  ? ` · ${row.amount}`
                  : ""}
              </p>

              <p className="text-sm text-muted-foreground">
                {row.bank_channel ?? "Bank/channel not stated"} ·{" "}
                {row.transaction_reference ?? "No reference"} ·{" "}
                {formatDateTime(row.created_at)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <StatusPill status={row.status} />

              <Select
                value={row.status}
                onValueChange={(status) =>
                  setStatus.mutate({
                    table: "transfer_proofs",
                    id: row.id,
                    status,
                  })
                }
              >
                <SelectTrigger
                  className="h-8 w-36 text-xs"
                  aria-label={`Update status for ${row.name_on_transfer}`}
                >
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {RECEIPT_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            {row.phone_number}
            {row.email ? ` · ${row.email}` : ""}
          </p>

          {row.message ? (
            <p className="mt-2 text-sm">{row.message}</p>
          ) : null}

          {row.screenshot_url ? (
            <Button
              size="sm"
              variant="outline"
              className="mt-3"
              onClick={() => void openReceipt(row.screenshot_url)}
            >
              <ExternalLink className="mr-1.5 size-3.5" aria-hidden />
              View screenshot
            </Button>
          ) : (
            <p className="mt-3 text-xs text-muted-foreground">
              No screenshot attached.
            </p>
          )}
        </li>
      ))}
    </ul>
  ) : (
    <EmptyState
      icon={<ReceiptText className="size-5" aria-hidden />}
      title="No transfer proofs yet"
      description="Screenshots uploaded by donors will be listed here for verification."
    />
  )}
</TabsContent>
      </Tabs>
    </div>
  );
}

export default DonationsDesk;
