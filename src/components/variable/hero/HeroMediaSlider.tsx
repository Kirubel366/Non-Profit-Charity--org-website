import { useCallback, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { HeroData } from "@/types/schema";
import { cn } from "@/lib/utils";

/** Variant B — Media Carousel: full-bleed rotating imagery with overlaid copy. */
export function HeroMediaSlider({ data }: { data: HeroData }) {
  const slides = data.backgroundMedia.length > 0 ? data.backgroundMedia : [];
  const [index, setIndex] = useState(0);

  const go = useCallback(
    (delta: number) => {
      setIndex((prev) => (prev + delta + slides.length) % Math.max(slides.length, 1));
    },
    [slides.length],
  );

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = window.setInterval(() => go(1), 6000);
    return () => window.clearInterval(timer);
  }, [go, slides.length]);

  const active = slides[index];

  return (
    <section className="relative isolate min-h-[34rem] overflow-hidden bg-surface-dark">
      {slides.map((slide, i) => (
        <img
          key={slide.id}
          src={slide.mediaUri}
          alt={slide.caption ?? "Program imagery"}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-1000",
            i === index ? "opacity-100" : "opacity-0",
          )}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-surface-dark/90 via-surface-dark/70 to-surface-dark/20" />

      <div className="relative mx-auto flex min-h-[34rem] max-w-7xl flex-col justify-center px-4 py-24 sm:px-6">
        <div className="max-w-2xl">
          <h1 className="font-heading text-4xl font-extrabold leading-[1.1] tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl">
            {data.headline}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-primary-foreground/80">
            {data.subHeadline}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
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
                className="inline-flex items-center gap-2 rounded-badge border border-primary-foreground/30 px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
              >
                {data.secondaryCtaLabel}
              </Link>
            )}
          </div>

          {active?.caption && (
            <p className="mt-8 text-sm text-primary-foreground/70">{active.caption}</p>
          )}
        </div>

        {slides.length > 1 && (
          <div className="mt-10 flex items-center gap-3">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous slide"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-primary-foreground/30 text-primary-foreground transition-colors hover:bg-primary-foreground/10"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next slide"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-primary-foreground/30 text-primary-foreground transition-colors hover:bg-primary-foreground/10"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <div className="ml-2 flex gap-2">
              {slides.map((slide, i) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={i === index}
                  className={cn(
                    "h-1.5 rounded-badge transition-all",
                    i === index
                      ? "w-8 bg-primary-foreground"
                      : "w-4 bg-primary-foreground/40 hover:bg-primary-foreground/70",
                  )}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
