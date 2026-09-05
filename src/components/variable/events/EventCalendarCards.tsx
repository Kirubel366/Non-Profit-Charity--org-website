import { motion } from "framer-motion";
import { CalendarDays, Clock, MapPin, ArrowUpRight, CheckCircle2 } from "lucide-react";
import type { EventsData } from "@/types/schema";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  data: EventsData;
}

const monthOf = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short" }).toUpperCase();
const dayOf = (iso: string) => new Date(iso).getDate().toString().padStart(2, "0");
const yearOf = (iso: string) => new Date(iso).getFullYear();

export function EventCalendarCards({ data }: Props) {


  return (
    <section id="events" className="bg-surface-muted py-20 sm:py-28">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-badge bg-brand-muted px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand">
            <CalendarDays className="size-3.5" aria-hidden />
            Upcoming
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            {data.sectionTitle}
          </h2>
          {data.sectionSubtitle ? (
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              {data.sectionSubtitle}
            </p>
          ) : null}
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.events.map((event, index) => {
            const [when, ...where] = event.timeLocation.split("·");
            return (
              <motion.article
                key={event.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: index * 0.07 }}
                className={cn(
                  "group relative flex flex-col overflow-hidden rounded-card border border-border bg-card",
                  "shadow-glass transition-all duration-300 hover:-translate-y-1 hover:shadow-elevation",
                )}
              >
                <div className="relative h-44 overflow-hidden bg-muted">
                  {event.imageUri ? (
                    <img
                      src={event.imageUri}
                      alt={event.title}
                      loading="lazy"
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-dark/60 to-transparent" />

                  <div className="absolute left-4 top-4 flex w-16 flex-col items-center overflow-hidden rounded-xl bg-card text-center shadow-elevation">
                    <span className="w-full bg-brand py-1 text-[0.65rem] font-bold tracking-widest text-brand-foreground">
                      {monthOf(event.date)}
                    </span>
                    <span className="py-1.5 text-xl font-bold leading-none">
                      {dayOf(event.date)}
                    </span>
                    <span className="pb-1.5 text-[0.6rem] text-muted-foreground">
                      {yearOf(event.date)}
                    </span>
                  </div>

                  {event.isPast ? (
                    <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-badge bg-card/90 px-2.5 py-1 text-[0.65rem] font-semibold text-muted-foreground backdrop-blur">
                      <CheckCircle2 className="size-3" aria-hidden /> Completed
                    </span>
                  ) : (
                    <span className="absolute right-4 top-4 rounded-badge bg-urgent px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-urgent-foreground">
                      Open
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-5">
                  {event.organizerTag ? (
                    <span className="text-[0.68rem] font-semibold uppercase tracking-wider text-impact">
                      {event.organizerTag}
                    </span>
                  ) : null}
                  <h3 className="mt-1.5 text-lg font-semibold leading-snug">
                    {event.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {event.description}
                  </p>

                  <dl className="mt-4 space-y-1.5 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="size-4 shrink-0 text-brand" aria-hidden />
                      <dd>{when?.trim()}</dd>
                    </div>
                    {where.length ? (
                      <div className="flex items-center gap-2">
                        <MapPin className="size-4 shrink-0 text-brand" aria-hidden />
                        <dd>{where.join("·").trim()}</dd>
                      </div>
                    ) : null}
                  </dl>

                  <div className="mt-5 pt-4 border-t border-border">
                    <Button
                      asChild={Boolean(event.rsvpHref) && !event.isPast}
                      variant={event.isPast ? "outline" : "default"}
                      className="w-full"
                      disabled={event.isPast}
                    >
                      {event.rsvpHref && !event.isPast ? (
                        <a href={event.rsvpHref}>
                          Reserve a place
                          <ArrowUpRight className="ml-1 size-4" aria-hidden />
                        </a>
                      ) : (
                        <span>{event.isPast ? "Archived milestone" : "Registration opens soon"}</span>
                      )}
                    </Button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default EventCalendarCards;
