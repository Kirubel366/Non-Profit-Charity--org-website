import { motion } from "framer-motion";
import { CalendarClock, MapPin, ArrowRight } from "lucide-react";
import type { EventsData } from "@/types/schema";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  data: EventsData;
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export function EventTimelineList({ data }: Props) {
  const ordered = [...data.events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  return (
    <section id="events" className="bg-background py-20 sm:py-28">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-badge bg-brand-muted px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand">
            <CalendarClock className="size-3.5" aria-hidden />
            Chronology
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            {data.sectionTitle}
          </h2>
          {data.sectionSubtitle ? (
            <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">
              {data.sectionSubtitle}
            </p>
          ) : null}
        </div>

        <ol className="relative mt-14 border-l border-border pl-6 sm:pl-10">
          {ordered.map((event, index) => (
            <motion.li
              key={event.id}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              className="relative pb-10 last:pb-0"
            >
              <span
                aria-hidden
                className={cn(
                  "absolute -left-[1.9rem] top-1 flex size-4 items-center justify-center rounded-full ring-4 ring-background sm:-left-[2.9rem]",
                  event.isPast ? "bg-muted-foreground/50" : "bg-brand",
                )}
              />

              <div
                className={cn(
                  "rounded-card border border-border bg-card p-5 shadow-glass transition-shadow hover:shadow-elevation",
                  event.isPast && "bg-surface-muted",
                )}
              >
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                  <time
                    dateTime={event.date}
                    className="font-semibold uppercase tracking-wider text-brand"
                  >
                    {formatDate(event.date)}
                  </time>
                  {event.organizerTag ? (
                    <span className="rounded-badge bg-impact/10 px-2 py-0.5 font-medium text-impact">
                      {event.organizerTag}
                    </span>
                  ) : null}
                  {event.isPast ? (
                    <span className="rounded-badge bg-muted px-2 py-0.5 font-medium text-muted-foreground">
                      Milestone
                    </span>
                  ) : null}
                </div>

                <h3 className="mt-2 text-lg font-semibold leading-snug">
                  {event.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {event.description}
                </p>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="size-4 text-brand" aria-hidden />
                    {event.timeLocation}
                  </span>
                  {event.rsvpHref && !event.isPast ? (
                    <Button asChild variant="ghost" size="sm" className="text-brand">
                      <a href={event.rsvpHref}>
                        RSVP <ArrowRight className="ml-1 size-4" aria-hidden />
                      </a>
                    </Button>
                  ) : null}
                </div>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default EventTimelineList;
