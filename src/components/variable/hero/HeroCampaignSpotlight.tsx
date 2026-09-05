import { ArrowRight, HeartHandshake, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { HeroData } from "@/types/schema";

/** Campaign spotlight redesign: single background image, centered editorial content, no emergency card. */
export function HeroCampaignSpotlight({ data }: { data: HeroData }) {
  const media = data.backgroundMedia[0];

  return (
    <section className="relative isolate overflow-hidden bg-surface-dark">
      {media && (
        <>
          <img
            src={media.mediaUri}
            alt={media.caption ?? "Community members supported by our programs"}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-surface-dark/72" />
        </>
      )}

      <div className="relative mx-auto flex max-w-5xl flex-col items-center px-4 py-20 text-center sm:px-6 sm:py-24 lg:px-8">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-primary-foreground/90 backdrop-blur-sm">
          <Sparkles className="h-3.5 w-3.5" />
          Together we act
        </span>

        <h1 className="mt-6 max-w-4xl font-heading text-4xl font-extrabold leading-[1.08] tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl">
          {data.headline}
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-relaxed text-primary-foreground/80 sm:text-lg">
          {data.subHeadline}
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            to="/donate"
            className="inline-flex items-center justify-center gap-2 rounded-badge bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
          >
            {data.primaryCtaLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
          {data.secondaryCtaLabel && (
            <Link
              to="/volunteer"
              className="inline-flex items-center justify-center rounded-badge border border-white/25 bg-white/5 px-6 py-3.5 text-sm font-semibold text-primary-foreground backdrop-blur-sm transition-colors hover:border-primary/50 hover:text-brand"
            >
              {data.secondaryCtaLabel}
            </Link>
          )}
        </div>

        {data.badges && data.badges.length > 0 && (
          <div className="mt-10 grid w-full max-w-3xl gap-4 border-t border-white/15 pt-6 text-left sm:grid-cols-3">
            {data.badges.map((badge) => (
              <div key={badge.label} className="rounded-card border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="font-heading text-2xl font-extrabold text-primary-foreground">{badge.value}</p>
                <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.22em] text-primary-foreground/60">
                  {badge.label}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-primary-foreground/80">
          <span className="inline-flex items-center gap-2">
            <HeartHandshake className="h-4 w-4 text-brand" />
            Community-led care
          </span>
          <span className="inline-flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-brand" />
            Audited and transparent
          </span>
        </div>
      </div>
    </section>
  );
}
