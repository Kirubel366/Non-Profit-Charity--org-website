import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Inbox, Mail, MailOpen, Phone } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { EmptyState, LoadingRows, PanelHeader, formatDateTime } from "./primitives";
import { cn } from "@/lib/utils";

export function InquiriesInbox() {
  const queryClient = useQueryClient();
  const [openId, setOpenId] = useState<string | null>(null);

  const inquiries = useQuery({
    queryKey: ["admin", "inquiries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const patch = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: { is_read?: boolean } }) => {
      const { error } = await supabase.from("contact_messages").update(values).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "inquiries"] });
      void queryClient.invalidateQueries({ queryKey: ["admin", "counts"] });
    },
    onError: (error: Error) => toast.error("Update failed", { description: error.message }),
  });

  return (
    <div className="space-y-6">
      <PanelHeader
        title="Inquiries inbox"
        description="Messages sent through the public contact form."
      />

      {inquiries.isLoading ? (
        <LoadingRows />
      ) : inquiries.data && inquiries.data.length > 0 ? (
        <ul className="space-y-3">
          {inquiries.data.map((row) => {
            const expanded = openId === row.id;
            return (
              <li
                key={row.id}
                className={cn(
                  "rounded-card border bg-card p-4",
                  row.is_read ? "border-border" : "border-brand/40 bg-brand-muted/20",
                )}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-center gap-2 font-semibold">
                      {row.full_name}
                      {!row.is_read ? (
                        <Badge className="bg-brand text-brand-foreground">Unread</Badge>
                      ) : null}
                    </p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {row.subject ?? "General message"} · {formatDateTime(row.created_at)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setOpenId(expanded ? null : row.id);
                        if (!row.is_read) patch.mutate({ id: row.id, values: { is_read: true } });
                      }}
                      aria-expanded={expanded}
                    >
                      {expanded ? "Hide" : "Read"}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        patch.mutate({ id: row.id, values: { is_read: !row.is_read } })
                      }
                    >
                      {row.is_read ? (
                        <>
                          <Mail className="mr-1.5 size-3.5" aria-hidden /> Mark unread
                        </>
                      ) : (
                        <>
                          <MailOpen className="mr-1.5 size-3.5" aria-hidden /> Mark read
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {expanded ? (
                  <div className="mt-4 space-y-4 border-t border-border pt-4">
                    <p className="whitespace-pre-line text-sm">{row.message}</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <a className="flex items-center gap-2 hover:underline" href={`mailto:${row.email}`}>
                        <Mail className="size-4 text-muted-foreground" aria-hidden /> {row.email}
                      </a>
                      {row.phone ? (
                        <a className="flex items-center gap-2 hover:underline" href={`tel:${row.phone}`}>
                          <Phone className="size-4 text-muted-foreground" aria-hidden /> {row.phone}
                        </a>
                      ) : null}
                    </div>
                    <div className="space-y-1.5">
                      {/* Admin notes column not present in this DB schema; keep inbox read/update only. */}
                    </div>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : (
        <EmptyState
          icon={<Inbox className="size-5" aria-hidden />}
          title="Inbox is empty"
          description="Messages from the website contact form will land here."
        />
      )}
    </div>
  );
}

export default InquiriesInbox;
