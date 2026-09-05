import { useQuery } from "@tanstack/react-query";
import { useVariants } from "@/context/VariantContext";
import { supabase } from "@/integrations/supabase/client";
import type { EventItem, EventsData } from "@/types/schema";
import { EventCalendarCards } from "./EventCalendarCards";
import { EventTimelineList } from "./EventTimelineList";

interface Props {
  /** Section copy (title/subtitle) — the item list itself is always live-fetched. */
  copy: Pick<EventsData, "sectionTitle" | "sectionSubtitle">;
}

function useEventsData(copy: Props["copy"]) {
  const query = useQuery({
    queryKey: ["public", "events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: true })
        .limit(50);
      if (error) throw error;
      return data;
    },
    staleTime: 60_000,
  });

  const events: EventItem[] = (query.data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    date: row.event_date,
    timeLocation: row.time_and_location,
    description: row.description,
    imageUri: row.image_url ?? undefined,
    isPast: row.is_past_milestone,
    organizerTag: row.organizer_tag ?? undefined,
    rsvpHref: row.rsvp_link ?? undefined,
  }));

  const data: EventsData = { ...copy, events };
  return { data, isLoading: query.isPending, isError: query.isError };
}

/** Variant-aware Events & News section. Both variants share the same EventsData contract. */
export function EventsSection({ copy }: Props) {
  const { variants } = useVariants();
  const { data, isLoading, isError } = useEventsData(copy);

  if (isLoading) {
    return (
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-56 animate-pulse rounded-card bg-muted" />
          ))}
        </div>
      </section>
    );
  }

  if (data.events.length === 0) {
    return (
      <section className="mx-auto w-full max-w-7xl px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{data.sectionTitle}</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          {isError
            ? "We couldn't load events right now. Please refresh the page."
            : "No events are scheduled right now — check back soon."}
        </p>
      </section>
    );
  }

  if (variants.events === "timeline-list") {
    return <EventTimelineList data={data} />;
  }
  return <EventCalendarCards data={data} />;
}

export default EventsSection;
