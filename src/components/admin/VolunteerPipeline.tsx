import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Mail, Phone, Search, Users } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";
// Local volunteer row shape matching the live DB (avoid generated types mismatch)
type VolunteerRow = {
  id: string;
  full_name: string;
  email: string;
  phone_number?: string | null;
  service_pillar?: string | null;
  availability: string[];
  skills: string[];
  motivation?: string | null;
  cv_url?: string | null;
  status?: string;
  created_at: string;
};
import { RESUMES_BUCKET } from "@/lib/storageBuckets";
import { VOLUNTEER_STATUSES } from "@/lib/adminConstants";
import {
  EmptyState,
  LoadingRows,
  PanelHeader,
  StatusPill,
  formatDateTime,
} from "./primitives";

type Row = VolunteerRow;

async function downloadCv(path: string) {
  const { data, error } = await supabase.storage
    .from(RESUMES_BUCKET)
    .createSignedUrl(path, 60);
  if (error || !data?.signedUrl) {
    toast.error("Couldn't generate a download link for this CV.");
    return;
  }
  window.open(data.signedUrl, "_blank", "noopener,noreferrer");
}

export function VolunteerPipeline() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [pillarFilter, setPillarFilter] = useState("All");

  const applications = useQuery({
    queryKey: ["admin", "volunteers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("volunteer_applications")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const patch = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: Partial<VolunteerRow> }) => {
      const { error } = await supabase
        .from("volunteer_applications")
        .update(values)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Applicant updated");
      void queryClient.invalidateQueries({ queryKey: ["admin", "volunteers"] });
      void queryClient.invalidateQueries({ queryKey: ["admin", "counts"] });
    },
    onError: (error: Error) => toast.error("Update failed", { description: error.message }),
  });

  const pillars = Array.from(new Set((applications.data ?? []).map((row) => row.service_pillar)));

  const rows = (applications.data ?? []).filter((row) => {
    const term = search.trim().toLowerCase();
    const matchesTerm =
      !term ||
      row.full_name.toLowerCase().includes(term) ||
      row.email.toLowerCase().includes(term) ||
      row.skills.some((skill) => skill.toLowerCase().includes(term));
    const matchesStatus = statusFilter === "All" || row.status === statusFilter;
    const matchesPillar = pillarFilter === "All" || row.service_pillar === pillarFilter;
    return matchesTerm && matchesStatus && matchesPillar;
  });

  return (
    <div className="space-y-6">
      <PanelHeader
        title="Volunteer pipeline"
        description="Review applicants, track outreach and move candidates through recruitment."
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="vol-search">Search</Label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              id="vol-search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Name, email or skill"
              className="pl-9"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="vol-status">Status</Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger id="vol-status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All statuses</SelectItem>
              {VOLUNTEER_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="vol-pillar">Service pillar</Label>
          <Select value={pillarFilter} onValueChange={setPillarFilter}>
            <SelectTrigger id="vol-pillar">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All pillars</SelectItem>
              {pillars.map((pillar) => (
                <SelectItem key={pillar} value={pillar}>
                  {pillar}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {applications.isLoading ? (
        <LoadingRows />
      ) : rows.length > 0 ? (
        <Accordion type="single" collapsible className="space-y-3">
          {rows.map((row) => (
            <AccordionItem
              key={row.id}
              value={row.id}
              className="overflow-hidden rounded-card border border-border bg-card px-4"
            >
              <AccordionTrigger className="gap-3 py-4 hover:no-underline">
                <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1 text-left">
                  <span className="truncate font-semibold">{row.full_name}</span>
                  <Badge variant="outline">{row.service_pillar}</Badge>
                  <StatusPill status={row.status} />
                  <span className="text-xs text-muted-foreground">
                    {formatDateTime(row.created_at)}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pb-5">
                <div className="grid gap-3 sm:grid-cols-2">
                  <p className="flex items-center gap-2 text-sm">
                    <Mail className="size-4 text-muted-foreground" aria-hidden />
                    <a className="underline-offset-2 hover:underline" href={`mailto:${row.email}`}>
                      {row.email}
                    </a>
                  </p>
                  <p className="flex items-center gap-2 text-sm">
                    <Phone className="size-4 text-muted-foreground" aria-hidden />
                    <a className="underline-offset-2 hover:underline" href={`tel:${row.phone_number ?? ""}`}>
                      {row.phone_number ?? "Not provided"}
                    </a>
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {row.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                  {row.availability.map((slot) => (
                    <Badge key={slot} variant="outline">
                      {slot}
                    </Badge>
                  ))}
                </div>

                {row.motivation ? (
                  <p className="rounded-card bg-muted/50 p-3 text-sm text-muted-foreground">
                    {row.motivation}
                  </p>
                ) : null}

                <p className="text-xs text-muted-foreground">
                  {row.cv_url ? (
                    <button
                      type="button"
                      className="font-medium text-brand underline-offset-2 hover:underline"
                      onClick={() => downloadCv(row.cv_url!)}
                    >
                      Download CV
                    </button>
                  ) : (
                    "No CV attached"
                  )}
                </p>

                <div className="grid gap-3 sm:grid-cols-[12rem_minmax(0,1fr)]">
                  <div className="space-y-1.5">
                    <Label htmlFor={`status-${row.id}`}>Recruitment status</Label>
                    <Select
                      value={row.status}
                      onValueChange={(status) =>
                        patch.mutate({ id: row.id, values: { status } })
                      }
                    >
                      <SelectTrigger id={`status-${row.id}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {VOLUNTEER_STATUSES.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Admin notes column not present in this DB schema; hidden. */}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <EmptyState
          icon={<Users className="size-5" aria-hidden />}
          title="No applications match"
          description="Adjust the filters, or wait for new volunteers to apply from the website."
        />
      )}
    </div>
  );
}

export default VolunteerPipeline;
