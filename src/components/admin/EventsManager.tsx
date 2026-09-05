import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarDays, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { EVENTS_BUCKET } from "@/lib/storageBuckets";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";
import { EmptyState, LoadingRows, PanelHeader, formatDate } from "./primitives";

type EventRow = Tables<"events">;

const emptyDraft = (): TablesInsert<"events"> => ({
  title: "",
  event_date: new Date().toISOString().slice(0, 10),
  time_and_location: "",
  description: "",
  organizer_tag: "",
  image_url: "",
  rsvp_link: "",
  is_past_milestone: false,
  is_featured_homepage: false,
});

export function EventsManager() {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState<TablesInsert<"events"> | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<EventRow | null>(null);

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["admin", "events"] });
    void queryClient.invalidateQueries({ queryKey: ["admin", "counts"] });
    void queryClient.invalidateQueries({ queryKey: ["public", "events"] });
  };

  const events = useQuery({
    queryKey: ["admin", "events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const save = useMutation({
    mutationFn: async (payload: TablesInsert<"events">) => {
      const clean = {
        ...payload,
        organizer_tag: payload.organizer_tag || null,
        image_url: payload.image_url || null,
        rsvp_link: payload.rsvp_link || null,
      };
      if (editingId) {
        const { error } = await supabase.from("events").update(clean).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("events").insert(clean);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editingId ? "Event updated" : "Event published");
      setDraft(null);
      setEditingId(null);
      invalidate();
    },
    onError: (error: Error) => toast.error("Could not save event", { description: error.message }),
  });

  const toggleFeature = useMutation({
    mutationFn: async (row: EventRow) => {
      const { error } = await supabase
        .from("events")
        .update({ is_featured_homepage: !row.is_featured_homepage })
        .eq("id", row.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Featured status updated");
      invalidate();
    },
    onError: (error: Error) => toast.error("Update failed", { description: error.message }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      // Try to fetch the row to know the image path so we can remove the file
      const { data: rows } = await supabase.from("events").select("image_url").eq("id", id).limit(1);
      const imageUrl = rows?.[0]?.image_url ?? null;
      const extractStoragePath = (imageUrl: string | null | undefined): string | null => {
        if (!imageUrl) return null;
        if (!/^https?:\/\//i.test(imageUrl)) return imageUrl;
        const marker = '/object/public/';
        const i = imageUrl.indexOf(marker);
        if (i === -1) return null;
        const tail = imageUrl.substring(i + marker.length);
        const parts = tail.split('/');
        if (parts.length < 2) return null;
        const bucket = parts.shift();
        const path = parts.join('/');
        return bucket === EVENTS_BUCKET ? path : null;
      };

      const storagePath = extractStoragePath(imageUrl);
      if (storagePath) {
        const { error: removeError } = await supabase.storage.from(EVENTS_BUCKET).remove([storagePath]);
        if (removeError) throw removeError;
      }

      const { error } = await supabase.from("events").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Event deleted");
      setPendingDelete(null);
      invalidate();
    },
    onError: (error: Error) => toast.error("Delete failed", { description: error.message }),
  });

  const openCreate = () => {
    setEditingId(null);
    setDraft(emptyDraft());
  };

  const openEdit = (row: EventRow) => {
    setEditingId(row.id);
    setDraft({
      title: row.title,
      event_date: row.event_date,
      time_and_location: row.time_and_location,
      description: row.description,
      organizer_tag: row.organizer_tag ?? "",
      image_url: row.image_url ?? "",
      rsvp_link: row.rsvp_link ?? "",
      is_past_milestone: row.is_past_milestone,
      is_featured_homepage: row.is_featured_homepage,
    });
  };

  const update = (patch: Partial<TablesInsert<"events">>) =>
    setDraft((current) => (current ? { ...current, ...patch } : current));

  return (
    <div className="space-y-6">
      <PanelHeader
        title="Events manager"
        description="Create, feature and retire upcoming drives, fundraisers and milestones."
        action={
          <Button onClick={openCreate}>
            <Plus className="mr-2 size-4" aria-hidden /> New event
          </Button>
        }
      />

      {events.isLoading ? (
        <LoadingRows />
      ) : events.data && events.data.length > 0 ? (
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {events.data.map((row) => (
            <li
              key={row.id}
              className="flex flex-col overflow-hidden rounded-card border border-border bg-card"
            >
              {row.image_url ? (
                <img
                  src={row.image_url}
                  alt=""
                  loading="lazy"
                  className="h-32 w-full object-cover"
                />
              ) : null}
              <div className="flex flex-1 flex-col p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">{formatDate(row.event_date)}</Badge>
                  {row.is_featured_homepage ? (
                    <Badge className="bg-impact text-impact-foreground">Featured</Badge>
                  ) : null}
                  {row.is_past_milestone ? <Badge variant="secondary">Past</Badge> : null}
                </div>
                <h3 className="mt-2 text-base font-semibold leading-tight">{row.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{row.time_and_location}</p>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {row.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-3">
                  <Button size="sm" variant="outline" onClick={() => openEdit(row)}>
                    <Pencil className="mr-1.5 size-3.5" aria-hidden /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleFeature.mutate(row)}
                    aria-pressed={row.is_featured}
                  >
                    <Star className="mr-1.5 size-3.5" aria-hidden />
                    {row.is_featured ? "Unfeature" : "Feature"}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setPendingDelete(row)}
                  >
                    <Trash2 className="mr-1.5 size-3.5" aria-hidden /> Delete
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          icon={<CalendarDays className="size-5" aria-hidden />}
          title="No events yet"
          description="Publish your first outreach drive so it appears on the public events section."
          action={
            <Button onClick={openCreate}>
              <Plus className="mr-2 size-4" aria-hidden /> New event
            </Button>
          }
        />
      )}

      <Dialog open={draft !== null} onOpenChange={(open) => !open && setDraft(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit event" : "New event"}</DialogTitle>
            <DialogDescription>
              These details render directly in both public event layouts.
            </DialogDescription>
          </DialogHeader>

          {draft ? (
            <form
              id="event-form"
              className="space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                save.mutate(draft);
              }}
            >
              <div className="space-y-1.5">
                <Label htmlFor="ev-title">Title</Label>
                <Input
                  id="ev-title"
                  required
                  value={draft.title}
                  onChange={(e) => update({ title: e.target.value })}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="ev-date">Date</Label>
                  <Input
                    id="ev-date"
                    type="date"
                    required
                    value={draft.event_date}
                    onChange={(e) => update({ event_date: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ev-org">Organizer tag</Label>
                  <Input
                    id="ev-org"
                    value={draft.organizer_tag ?? ""}
                    onChange={(e) => update({ organizer_tag: e.target.value })}
                    placeholder="Community Team"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ev-loc">Time & location</Label>
                <Input
                  id="ev-loc"
                  required
                  value={draft.time_and_location ?? ""}
                  onChange={(e) => update({ time_and_location: e.target.value })}
                  placeholder="9:00 AM · Meskel Square, Addis Ababa"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ev-desc">Description</Label>
                <Textarea
                  id="ev-desc"
                  rows={3}
                  required
                  value={draft.description ?? ""}
                  onChange={(e) => update({ description: e.target.value })}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="ev-img">Upload image</Label>
                  <input
                    id="ev-img"
                    type="file"
                    accept="image/*"
                    className="mt-2"
                    onChange={async (e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      const path = `events/${crypto.randomUUID()}-${f.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
                      const { error: uploadError } = await supabase.storage.from(EVENTS_BUCKET).upload(path, f, { cacheControl: "3600", upsert: false });
                      if (uploadError) {
                        toast.error("Image upload failed", { description: uploadError.message });
                        return;
                      }
                      // Store a public URL in the `image_url` column
                      const publicUrl = supabase.storage.from(EVENTS_BUCKET).getPublicUrl(path).data.publicUrl;
                      update({ image_url: publicUrl });
                    }}
                  />
                  {draft.image_url ? (
                    <img src={draft.image_url} alt="Event" className="mt-2 max-h-40 w-full object-cover" />
                  ) : null}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ev-rsvp">RSVP link</Label>
                  <Input
                    id="ev-rsvp"
                    value={draft.rsvp_link ?? ""}
                    onChange={(e) => update({ rsvp_link: e.target.value })}
                    placeholder="#rsvp"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-3 rounded-card border border-border p-3 sm:flex-row sm:gap-6">
                <div className="flex items-center gap-3">
                  <Switch
                    id="ev-featured"
                    checked={Boolean(draft.is_featured_homepage)}
                    onCheckedChange={(checked) => update({ is_featured_homepage: checked })}
                  />
                  <Label htmlFor="ev-featured">Feature on homepage</Label>
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    id="ev-past"
                    checked={Boolean(draft.is_past_milestone)}
                    onCheckedChange={(checked) => update({ is_past_milestone: checked })}
                  />
                  <Label htmlFor="ev-past">Mark as past milestone</Label>
                </div>
              </div>
            </form>
          ) : null}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDraft(null)}>
              Cancel
            </Button>
            <Button type="submit" form="event-form" disabled={save.isPending}>
              {save.isPending ? "Saving…" : editingId ? "Save changes" : "Publish event"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this event?</AlertDialogTitle>
            <AlertDialogDescription>
              “{pendingDelete?.title}” will be removed from the public website
              immediately. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => pendingDelete && remove.mutate(pendingDelete.id)}
            >
              Delete event
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default EventsManager;
