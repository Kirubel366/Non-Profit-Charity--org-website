import { ArrowRight, HeartHandshake, Play } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useModal } from "@/context/ModalContext";
import type { HeroData } from "@/types/schema";

/** Variant A — High Impact Split: copy + CTAs left, media collage right. */
export function HeroSplitAction({ data }: { data: HeroData }) {
  const { openModal } = useModal();
  const [primaryMedia, ...restMedia] = data.backgroundMedia;

  return (
    <section className="relative overflow-hidden bg-surface-muted">
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-brand-soft blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-hope-soft blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-2 lg:gap-16">
        <div>
          <span className="inline-flex items-center gap-2 rounded-badge border border-border bg-card px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-brand">
            <HeartHandshake className="h-3.5 w-3.5" />
            Registered charity
          </span>

          <h1 className="mt-5 font-heading text-4xl font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {data.headline}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
            {data.subHeadline}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/donate"
              className="inline-flex items-center gap-2 rounded-badge bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-elevation transition-transform hover:scale-[1.03]"
            >
              {data.primaryCtaLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
            {data.secondaryCtaLabel && (
              <Link
                to="/volunteer"
                className="inline-flex items-center gap-2 rounded-badge border border-border bg-card px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                {data.secondaryCtaLabel}
              </Link>
            )}
          </div>

          {data.badges && data.badges.length > 0 && (
            <dl className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3">
              {data.badges.map((badge) => (
                <div key={badge.label}>
                  <dt className="sr-only">{badge.label}</dt>
                  <dd className="font-heading text-2xl font-extrabold text-foreground">
                    {badge.value}
                  </dd>
                  <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {badge.label}
                  </p>
                </div>
              ))}
            </dl>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {primaryMedia && (
            <div className="relative col-span-2 overflow-hidden rounded-card shadow-elevation">
              <img
                src={primaryMedia.mediaUri}
                alt={primaryMedia.caption ?? "Community members supported by our programs"}
                className="aspect-[16/10] w-full object-cover"
              />
              {primaryMedia.isVideo && (
                <button
                  type="button"
                  onClick={() => openModal("video", primaryMedia)}
                  aria-label="Play story video"
                  className="absolute inset-0 flex items-center justify-center bg-surface-dark/25 transition-colors hover:bg-surface-dark/40"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-card shadow-elevation">
                    <Play className="h-5 w-5 text-primary" />
                  </span>
                </button>
              )}
            </div>
          )}
          {restMedia.slice(0, 2).map((media) => (
            <div key={media.id} className="overflow-hidden rounded-card shadow-glass">
              <img
                src={media.mediaUri}
                alt={media.caption ?? "Program activity"}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
