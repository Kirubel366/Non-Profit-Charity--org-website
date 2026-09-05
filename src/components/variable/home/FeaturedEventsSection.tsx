import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { orgContent } from "@/data/orgContent";

interface FeaturedEventRow {
  id: string;
  title: string;
  event_date: string;
  time_and_location: string;
  description: string;
  image_url?: string | null;
  organizer_tag?: string | null;
}

export function FeaturedEventsSection() {
  const { data: events = [], isLoading } = useQuery({
    queryKey: ["public", "featured-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("id, title, event_date, time_and_location, description, image_url, organizer_tag")
        .eq("is_featured_homepage", true)
        .order("event_date", { ascending: true })
        .limit(3);

      if (error) throw error;
      return (data ?? []) as FeaturedEventRow[];
    },
    staleTime: 60_000,
  });

  if (isLoading) {
    return (
      <section className="bg-secondary/20 py-16 sm:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-72 animate-pulse rounded-card bg-muted" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!events.length) return null;

  return (
    <section className="bg-secondary/20 py-16 sm:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-badge bg-trust-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-trust-600">
              {orgContent.events.homepageBadge}
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {orgContent.events.homepageSectionTitle}
            </h2>
          </div>

          <Button asChild variant="outline" className="w-fit">
            <Link to="/events">
              View all events
              <ArrowRight className="ml-2 size-4" aria-hidden />
            </Link>
          </Button>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {events.map((event) => (
            <article key={event.id} className="overflow-hidden rounded-card border border-border bg-card shadow-card">
              {event.image_url && (
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="h-52 w-full object-cover"
                  loading="lazy"
                />
              )}

              <div className="p-5">
                {event.organizer_tag && (
                  <span className="inline-flex rounded-badge bg-primary/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                    {event.organizer_tag}
                  </span>
                )}

                <h3 className="mt-4 text-xl font-bold text-foreground">{event.title}</h3>

                <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="size-4 text-brand" aria-hidden />
                    <span>{new Date(event.event_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4 text-brand" aria-hidden />
                    <span>{event.time_and_location}</span>
                  </div>
                </div>

                <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  {event.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedEventsSection;
