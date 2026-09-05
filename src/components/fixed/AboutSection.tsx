import { BadgeCheck, FileText, Landmark, ShieldCheck } from "lucide-react";
import type { AboutData } from "@/types/schema";

/**
 * Fixed (non-variable) About section: founding narrative, legal trust badges
 * and a milestone timeline.
 */
export function AboutSection({ data }: { data: AboutData }) {
  const paragraphs = data.foundingNarrative.split("\n\n").filter(Boolean);

  return (
    <section id="about" className="bg-surface-muted py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="inline-flex items-center rounded-badge bg-brand-soft px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand">
              Who we are
            </span>
            <h2 className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              {data.sectionTitle}
            </h2>

            <div className="mt-5 space-y-4">
              {paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 24)} className="text-base leading-relaxed text-muted-foreground">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Legal / trust badges */}
            <div className="mt-8 flex flex-wrap gap-3">
              {data.charterVerified && (
                <span className="inline-flex items-center gap-2 rounded-badge border border-hope/30 bg-hope-soft px-3.5 py-2 text-sm font-semibold text-accent-foreground">
                  <BadgeCheck className="h-4 w-4" />
                  Charter Verified
                </span>
              )}
              {data.registrationNumber && (
                <span className="inline-flex items-center gap-2 rounded-badge border border-border bg-card px-3.5 py-2 text-sm font-medium text-foreground">
                  <Landmark className="h-4 w-4 text-primary" />
                  Reg. No. {data.registrationNumber}
                </span>
              )}
              <span className="inline-flex items-center gap-2 rounded-badge border border-border bg-card px-3.5 py-2 text-sm font-medium text-foreground">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Independently Audited
              </span>
              <span className="inline-flex items-center gap-2 rounded-badge border border-border bg-card px-3.5 py-2 text-sm font-medium text-foreground">
                <FileText className="h-4 w-4 text-primary" />
                Public Impact Reports
              </span>
            </div>
          </div>

          <div className="space-y-8">
            {data.imageUri && (
              <div className="overflow-hidden rounded-card shadow-elevation">
                <img
                  src={data.imageUri}
                  alt={`${data.sectionTitle} — community members supported by the organisation`}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
            )}

            <ol className="relative border-l border-border pl-6">
              {data.timeline.map((entry) => (
                <li key={entry.year} className="relative pb-7 last:pb-0">
                  <span className="absolute -left-[1.9rem] mt-1 flex h-3 w-3 items-center justify-center rounded-full border-2 border-primary bg-background" />
                  <p className="font-heading text-sm font-bold text-primary">{entry.year}</p>
                  <h3 className="mt-0.5 font-heading text-base font-semibold text-foreground">
                    {entry.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {entry.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
