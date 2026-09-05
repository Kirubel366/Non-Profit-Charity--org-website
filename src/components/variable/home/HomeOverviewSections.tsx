import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  ChevronRight,
  Heart,
  MapPin,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVariants } from "@/context/VariantContext";
import { usePublicGalleryItems } from "@/hooks/usePublicGalleryItems";
import { orgContent } from "@/data/orgContent";
import { FeaturedEventsSection } from "@/components/variable/home/FeaturedEventsSection";
import type { GalleryItem } from "@/types/schema";
import { cn } from "@/lib/utils";

const sectionShell =
  "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8";

function getImpactStatTitle(metricLabel?: string) {
  const label = String(metricLabel ?? "");

  if (label.toLowerCase().includes("children")) return "Children supported";
  if (label.toLowerCase().includes("meals")) return "Meals served";
  if (label.toLowerCase().includes("scholarships")) return "Active scholarships";
  return "Program efficiency";
}

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header className="mx-auto max-w-2xl text-center">
      <span className="inline-flex rounded-badge bg-trust-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-trust-600">
        {eyebrow}
      </span>
      <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      <p className="mt-3 text-base leading-relaxed text-muted-foreground">{description}</p>
    </header>
  );
}

function AboutOverviewVariantOne() {
  const aboutData = orgContent.about;
  const highlights = [
    "Community-based care and long-term family support",
    "Education, shelter and health services under one roof",
  ];

  return (
    <div className="mt-12 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
      <div className="overflow-hidden rounded-card border border-border bg-card shadow-elevation">
        <img
          src={aboutData.imageUri}
          alt={`${orgContent.navbar.orgName} community support`}
          className="h-72 w-full object-cover md:h-80"
        />
      </div>

      <div className="rounded-card border border-border bg-secondary/30 p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Who we are
        </p>
        <p className="mt-4 text-lg leading-relaxed text-foreground">
          {aboutData.foundingNarrative.slice(0, 230)}...
        </p>

        <ul className="mt-6 space-y-3">
          {highlights.map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm text-foreground/80">
              <span className="mt-0.5 flex size-5 items-center justify-center rounded-full bg-primary/10 text-primary">
                <BadgeCheck className="size-3.5" aria-hidden />
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className="mt-8">
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link to="/about">
              Learn more about us
              <ArrowRight className="ml-2 size-4" aria-hidden />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function AboutOverviewVariantTwo() {
  const pillars = [
    { label: "Shelter", value: "24/7" },
    { label: "Education", value: "2,310" },
    { label: "Healthcare", value: "48k+" },
  ];

  return (
    <div className="mt-12 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="rounded-card border border-border bg-card p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Our purpose
        </p>
        <h3 className="mt-3 text-2xl font-bold text-foreground">
          A practical, local response to urgent need and long-term dignity.
        </h3>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          We help children, elders and families move from crisis to stability through shelter,
          education, nutrition and healthcare delivered with measured accountability.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {pillars.map((pillar) => (
            <div key={pillar.label} className="rounded-badge border border-border bg-secondary/40 p-4 text-center">
              <div className="text-xl font-bold text-foreground">{pillar.value}</div>
              <div className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
                {pillar.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-card border border-border bg-gradient-to-br from-primary/10 via-secondary/20 to-background p-6 sm:p-8">
        <div className="flex items-center gap-3 text-primary">
          <ShieldCheck className="size-5" aria-hidden />
          <span className="text-xs font-semibold uppercase tracking-[0.18em]">Community trust</span>
        </div>

        <blockquote className="mt-5 border-l-2 border-primary pl-4 text-lg leading-relaxed text-foreground">
          “We exist to make sure no child sleeps on the street and no elder is left without care.”
        </blockquote>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link to="/about">
              About {orgContent.navbar.orgName}
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/contact">Contact us</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function AboutOverviewVariantThree() {
  const aboutData = orgContent.about;

  return (
    <div className="mt-12 grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
      <div className="overflow-hidden rounded-card border border-border bg-card shadow-elevation">
        <img
          src={aboutData.imageUri}
          alt={`Community members supported by ${orgContent.navbar.orgName}`}
          className="h-full min-h-[280px] w-full object-cover"
        />
      </div>

      <div className="rounded-card border border-border bg-secondary/30 p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Our approach</p>
        <h3 className="mt-3 text-2xl font-bold text-foreground">Practical care, trusted relationships, lasting change.</h3>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          {aboutData.foundingNarrative.slice(0, 260)}...
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {[
            { title: "Direct service", detail: "Shelter, food, education and household support delivered locally." },
            { title: "Community trust", detail: "On-the-ground programs shaped by families, elders and local leaders." },
            { title: "Clear accountability", detail: "Verified outcomes and transparent reporting at every stage." },
            { title: "Long-term dignity", detail: "Care plans that help families move toward stability and resilience." },
          ].map((item) => (
            <div key={item.title} className="rounded-card border border-border bg-card p-4">
              <p className="text-sm font-semibold text-foreground">{item.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AboutOverviewVariantFour() {
  const aboutData = orgContent.about;

  return (
    <div className="mt-12 grid gap-6 lg:grid-cols-3">
      <div className="rounded-card border border-border bg-card p-6 sm:p-7 lg:col-span-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Who we serve</p>
        <h3 className="mt-3 text-3xl font-bold text-foreground">A steady response for children, families and elders.</h3>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          {aboutData.foundingNarrative.slice(0, 300)}...
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link to="/about">Learn more</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/contact">Contact us</Link>
          </Button>
        </div>
      </div>

      <div className="h-auto rounded-card border border-border bg-gradient-to-br from-primary/10 via-secondary/15 to-background p-6 sm:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Why trust us</p>
        <div className="mt-5 space-y-4">
          {[
            { label: "Registered and reviewed", value: "Charter verified" },
            { label: "Field reporting", value: "Monthly updates" },
            { label: "Local partnerships", value: "Community-led" },
          ].map((item) => (
            <div key={item.label} className="rounded-badge border border-border bg-card/80 p-3">
              <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{item.label}</div>
              <div className="mt-1 text-lg font-bold text-foreground">{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AboutOverviewSection() {
  const { variants } = useVariants();

  const variantMap = {
    "story-panel": <AboutOverviewVariantOne />,
    "spotlight-grid": <AboutOverviewVariantTwo />,
    "community-portrait": <AboutOverviewVariantThree />,
    "trust-matrix": <AboutOverviewVariantFour />,
  } as const;

  return (
    <section id="about-overview" className="bg-background py-16 sm:py-24">
      <div className={sectionShell}>
        <SectionHeader
          eyebrow="About"
          title="A local organization rooted in dignity and care"
          description="We meet immediate needs while building stable futures for children, families and elders across Ethiopia."
        />
        {variantMap[variants.aboutOverview] ?? <AboutOverviewVariantOne />}
      </div>
    </section>
  );
}

function ProgramsOverviewVariantOne() {
  const previews = orgContent.programs.programs.slice(0, 4);

  return (
    <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {previews.map((program) => (
        <article key={program.id} className="overflow-hidden rounded-card border border-border bg-card shadow-card transition-transform hover:-translate-y-1">
          <img src={program.imageUri} alt={program.title} className="h-48 w-full object-cover" />
          <div className="p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex rounded-badge bg-trust-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-trust-600">
                {program.categoryTag}
              </span>
              <MapPin className="size-4 text-muted-foreground" aria-hidden />
            </div>
            <h3 className="mt-4 text-xl font-bold text-foreground">{program.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{program.shortDescription}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

function ProgramsOverviewVariantTwo() {
  const previews = orgContent.programs.programs.slice(0, 4);

  return (
    <div className="mt-12 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="overflow-hidden rounded-card border border-border bg-card shadow-elevation">
        <img
          src={previews[0].imageUri}
          alt={previews[0].title}
          className="h-72 w-full object-cover sm:h-80"
        />
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <Sparkles className="size-4" aria-hidden />
            Featured pillar
          </div>
          <h3 className="mt-3 text-2xl font-bold text-foreground">{previews[0].title}</h3>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">{previews[0].shortDescription}</p>
          <div className="mt-6">
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link to="/programs">
                Explore our programs
                <ChevronRight className="ml-2 size-4" aria-hidden />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {previews.slice(1).map((program) => (
          <div key={program.id} className="rounded-card border border-border bg-secondary/30 p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {program.categoryTag}
              </span>
              <Heart className="size-4 text-primary" aria-hidden />
            </div>
            <h3 className="mt-3 text-lg font-bold text-foreground">{program.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{program.shortDescription}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProgramsOverviewSection() {
  const { variants } = useVariants();

  return (
    <section id="programs-overview" className="bg-secondary/30 py-16 sm:py-24">
      <div className={sectionShell}>
        <SectionHeader
          eyebrow="Programs"
          title="Four pillars, one promise"
          description="Our work is designed to address urgent needs while creating steadier futures for children, elders and families."
        />
        {variants.programsOverview === "pillar-cards" ? <ProgramsOverviewVariantOne /> : <ProgramsOverviewVariantTwo />}
      </div>
    </section>
  );
}

function ImpactOverviewVariantOne() {
  const stats = orgContent.impact.stats.slice(0, 4);

  return (
    <div className="mt-12">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const safeValue = Number(stat?.metricValue ?? 0);

          return (
            <div key={stat.id} className="rounded-card border border-border bg-card p-5 shadow-card">
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {getImpactStatTitle(stat?.label)}
              </div>
              <div className="mt-3 text-3xl font-black tracking-tight text-foreground">{stat.metricNumber}</div>
              <div className="mt-2 text-sm font-medium text-muted-foreground">{stat.description}</div>
              <div className="mt-4 h-2.5 rounded-full bg-secondary">
                <div
                  className="h-2.5 rounded-full bg-primary"
                  style={{ width: `${Math.min(100, 65 + safeValue / 200)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-card border border-border bg-gradient-to-r from-primary/10 via-secondary/40 to-background p-6 sm:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Why it matters
            </p>
            <p className="mt-2 max-w-xl text-base leading-relaxed text-foreground">
              Every program is designed around measurable outcomes, transparent reporting and long-term community resilience.
            </p>
          </div>
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link to="/impact">
              See our impact
              <ArrowRight className="ml-2 size-4" aria-hidden />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function ImpactOverviewVariantTwo() {
  const stats = orgContent.impact.stats.slice(0, 3);
  const leading = orgContent.impact.stats[3];

  return (
    <div className="mt-12 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
      <div className="rounded-card border border-border bg-primary/5 p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Measured outcomes</p>
        <div className="mt-4 text-5xl font-black tracking-tight text-foreground">{leading?.metricNumber ?? "—"}</div>
        <div className="mt-2 text-sm font-medium uppercase tracking-wide text-muted-foreground">
          {leading?.label ?? "Impact"}
        </div>
        <p className="mt-5 text-base leading-relaxed text-muted-foreground">
          {leading?.description ?? "Verified outcomes across our programs."}
        </p>
        <div className="mt-7">
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link to="/impact">
              More results
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.id} className="rounded-card border border-border bg-card p-5 shadow-card">
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {getImpactStatTitle(stat?.label)}
            </div>
            <div className="mt-3 text-2xl font-black text-foreground">{stat.metricNumber}</div>
            <div className="mt-2 text-sm text-muted-foreground">{stat.description}</div>
            <div className="mt-4 rounded-badge bg-secondary px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {stat.label ?? "Impact"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ImpactOverviewSection() {
  const { variants } = useVariants();

  return (
    <section id="impact-overview" className="bg-background py-16 sm:py-24">
      <div className={sectionShell}>
        <SectionHeader
          eyebrow="Impact"
          title="Visible change, measured with care"
          description="The numbers behind our work reflect the real-world support our teams and community partners provide every month."
        />
        {variants.impactOverview === "metric-band" ? <ImpactOverviewVariantOne /> : <ImpactOverviewVariantTwo />}
      </div>
    </section>
  );
}

function GalleryOverviewVariantOne({ items }: { items: GalleryItem[] }) {
  const feature = items[0];
  const small = items.slice(1, 4);
  if (!feature) return null;

  return (
    <div className="mt-12 grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
      <div className="overflow-hidden rounded-card border border-border bg-card shadow-elevation">
        <img src={feature.mediaUri} alt={feature.title} className="h-full min-h-[300px] w-full object-cover" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
        {small.map((item) => (
          <div key={item.id} className="overflow-hidden rounded-card border border-border bg-card">
            <img src={item.mediaUri} alt={item.title} className="h-32 w-full object-cover" />
            <div className="p-3">
              <p className="text-sm font-semibold text-foreground">{item.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GalleryOverviewVariantTwo({ items }: { items: GalleryItem[] }) {
  const photos = items.slice(0, 4);

  return (
    <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {photos.map((item, index) => (
        <div
          key={item.id}
          className={cn(
            "overflow-hidden rounded-card border border-border bg-card shadow-card",
            index === 0 && "sm:col-span-2 lg:col-span-2",
          )}
        >
          <img
            src={item.mediaUri}
            alt={item.title}
            className={cn("w-full object-cover", index === 0 ? "h-72" : "h-52")}
          />
          <div className="p-4">
            <p className="text-sm font-semibold text-foreground">{item.title}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">{item.categoryTag}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function GalleryOverviewSection() {
  const { variants } = useVariants();
  const { items, isLoading } = usePublicGalleryItems(4);

  return (
    <section id="gallery-overview" className="bg-secondary/30 py-16 sm:py-24">
      <div className={sectionShell}>
        <SectionHeader
          eyebrow="Gallery"
          title="Moments from the field"
          description="A quick glimpse into the people, places and projects that shape our work every day."
        />
        {isLoading ? (
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-52 animate-pulse rounded-card bg-muted" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="mt-12 text-center text-sm text-muted-foreground">
            No photos have been published yet — check back soon.
          </p>
        ) : variants.galleryOverview === "feature-collage" ? (
          <GalleryOverviewVariantOne items={items} />
        ) : (
          <GalleryOverviewVariantTwo items={items} />
        )}
        <div className="mt-8 flex justify-center">
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link to="/gallery">
              View gallery
              <ArrowRight className="ml-2 size-4" aria-hidden />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function DonationOverviewVariantOne() {
  return (
    <div className="mt-12 rounded-card border border-primary/20 bg-gradient-to-r from-primary/15 via-brand/10 to-background p-6 sm:p-8 lg:p-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Support this work</p>
          <h3 className="mt-3 text-3xl font-bold tracking-tight text-foreground">
            A single contribution can fund a safe night, a meal, a scholarship or a clinic visit.
          </h3>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Your support helps us protect children, feed families and keep essential care services active in the communities that need them most.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link to="/donate">
              Donate now
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/volunteer">Become a volunteer</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function DonationOverviewVariantTwo() {
  const stats = [
    { label: "Meals served", value: "1.2M" },
    { label: "Children supported", value: "18,420" },
    { label: "Volunteer network", value: "500+" },
  ];

  return (
    <div className="mt-12 grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
      <div className="rounded-card border border-border bg-card p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Why give
        </p>
        <h3 className="mt-3 text-3xl font-bold text-foreground">Make the next care cycle possible.</h3>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          The work is always immediate: a safe bed, a daily meal, a classroom, or a healthcare visit. Consistent support keeps these services running.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {stats.map((item) => (
            <div key={item.label} className="rounded-badge border border-border bg-secondary/40 p-4 text-center">
              <div className="text-xl font-black text-foreground">{item.value}</div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-card border border-border bg-secondary/30 p-6 sm:p-8">
        <div className="flex items-center gap-2 text-primary">
          <Users className="size-5" aria-hidden />
          <span className="text-xs font-semibold uppercase tracking-[0.18em]">Community impact</span>
        </div>
        <div className="mt-4 text-4xl font-black tracking-tight text-foreground">94%</div>
        <p className="mt-2 text-sm uppercase tracking-[0.18em] text-muted-foreground">of every birr reaches the field</p>

        <div className="mt-6 flex flex-col gap-3">
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link to="/donate">Donate now</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/contact">Ask about giving options</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function DonationOverviewSection() {
  const { variants } = useVariants();

  return (
    <section id="donation-overview" className="bg-background py-16 sm:py-24">
      <div className={sectionShell}>
        <SectionHeader
          eyebrow="Get involved"
          title="Support the next round of care"
          description="Your involvement helps us sustain shelter, food, education and healthcare services in the communities we serve."
        />
        {variants.donationOverview === "support-banner" ? <DonationOverviewVariantOne /> : <DonationOverviewVariantTwo />}
      </div>
    </section>
  );
}

export function HomeOverviewSections() {
  return (
    <>
      <AboutOverviewSection />
      <ProgramsOverviewSection />
      <ImpactOverviewSection />
      <GalleryOverviewSection />
      <FeaturedEventsSection />
      <DonationOverviewSection />
    </>
  );
}

export default HomeOverviewSections;
