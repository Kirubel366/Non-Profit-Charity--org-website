import { Facebook, Instagram, Linkedin, Youtube, Send as Telegram, ShieldCheck, FileCheck2, Scale, Heart } from "lucide-react";
import { Link } from "@tanstack/react-router";
import useSiteProfile from "@/hooks/useSiteProfile";
import { useVariants } from "@/context/VariantContext";
import type { FooterData } from "@/types/schema";
import { Button } from "@/components/ui/button";

interface Props {
  data: FooterData;
}

export function CompactFooter({ data }: Props) {
  const year = new Date().getFullYear();
  const socials = [
    { key: "facebook", href: data.socialLinks.facebook, Icon: Facebook, label: "Facebook" },
    { key: "instagram", href: data.socialLinks.instagram, Icon: Instagram, label: "Instagram" },
    { key: "telegram", href: data.socialLinks.telegram, Icon: Telegram, label: "Telegram" },
    { key: "linkedin", href: data.socialLinks.linkedin, Icon: Linkedin, label: "LinkedIn" },
    { key: "youtube", href: data.socialLinks.youtube, Icon: Youtube, label: "YouTube" },
  ].filter((s) => Boolean(s.href));
  const legalLinks = ("legalLinks" in data ? (data as typeof data & { legalLinks?: Array<{ label: string; href: string }> }).legalLinks : []) ?? [];

  return (
    <footer className="border-t border-border bg-surface-dark text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 border-b border-primary-foreground/10 pb-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md space-y-3">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-badge bg-primary text-primary-foreground">
                <Heart className="h-4 w-4" aria-hidden />
              </span>
              <p className="text-base font-bold tracking-tight text-primary-foreground">{data.orgName}</p>
            </div>
            <p className="text-sm leading-relaxed text-primary-foreground/70">{data.missionStatement}</p>
          </div>

          <nav aria-label="Footer navigation" className="min-w-0 md:max-w-xs">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-foreground/50">
              Explore
            </p>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-primary-foreground/75">
              {data.quickLinks.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="transition-colors hover:text-brand">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-3 md:items-end">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-foreground/50">
              Take action
            </p>
            <div className="flex flex-col gap-2 sm:flex-row md:flex-col">
              <Button asChild className="bg-urgent text-urgent-foreground hover:bg-urgent/90">
                <Link to="/donate">Donate now</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-primary-foreground/25 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <Link to="/volunteer">Volunteer</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-0 py-4 text-xs text-primary-foreground/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {data.orgName}. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-3 sm:justify-end">
            {legalLinks.length > 0 &&
              legalLinks.map((link) => (
                <Link key={link.href} to={link.href} className="transition-colors hover:text-brand">
                  {link.label}
                </Link>
              ))}
            {(!legalLinks.length || legalLinks.length < 2) &&
              data.quickLinks.slice(0, Math.max(0, 2 - legalLinks.length)).map((link) => (
                <Link key={link.href} to={link.href} className="transition-colors hover:text-brand">
                  {link.label}
                </Link>
              ))}
            {socials.length > 0 && (
              <div className="flex items-center gap-2 pl-1">
                {socials.map(({ key, href, Icon, label }) => (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={label}
                    className="flex size-8 items-center justify-center rounded-full border border-primary-foreground/15 text-primary-foreground/70 transition-colors hover:border-brand hover:text-brand"
                  >
                    <Icon className="size-3.5" aria-hidden />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}

export function FooterRenderer({ data }: Props) {
  const { variants } = useVariants();
  const { phones: dbPhones, email: dbEmail } = useSiteProfile();
  const mergedPhones = dbPhones.length > 0 ? dbPhones : [data.phone].filter(Boolean);

  const mergedData: FooterData = {
    ...data,
    phone: mergedPhones[0] ?? "",
    phones: mergedPhones,
    email: dbEmail ?? data.email,
  };

  switch (variants.footer) {
    case "compact-single-row":
      return <CompactFooter data={mergedData} />;
    case "multi-column-detailed":
    default:
      return <DetailedFooter data={mergedData} />;
  }
}

export function LegalFooter({ data }: Props) {
  return <FooterRenderer data={data} />;
}

export function DetailedFooter({ data }: Props) {
  const year = new Date().getFullYear();
  const displayPhones = Array.from(
    new Set([...(data.phones ?? [data.phone]).filter((value): value is string => Boolean(value && value.trim().length > 0))]),
  );

  const socials = [
    { key: "facebook", href: data.socialLinks.facebook, Icon: Facebook, label: "Facebook" },
    { key: "instagram", href: data.socialLinks.instagram, Icon: Instagram, label: "Instagram" },
    { key: "telegram", href: data.socialLinks.telegram, Icon: Telegram, label: "Telegram" },
    { key: "linkedin", href: data.socialLinks.linkedin, Icon: Linkedin, label: "LinkedIn" },
    { key: "youtube", href: data.socialLinks.youtube, Icon: Youtube, label: "YouTube" },
  ].filter((s) => Boolean(s.href));

  return (
    <footer className="bg-surface-dark text-primary-foreground">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-4">
          <div className="lg:col-span-2 max-w-md">
            <p className="text-lg font-bold tracking-tight">{data.orgName}</p>
            <p className="mt-3 text-sm leading-relaxed text-primary-foreground/70">
              {data.missionStatement}
            </p>
            <address className="mt-5 space-y-1 text-sm not-italic text-primary-foreground/70">
              <p>{data.address}</p>
              {displayPhones.map((phone) => (
                <p key={phone}>
                  <a className="transition-colors hover:text-brand" href={`tel:${phone.replace(/\s/g, "")}`}>
                    {phone}
                  </a>
                </p>
              ))}
              <p>
                <a className="transition-colors hover:text-brand" href={`mailto:${data.email}`}>
                  {data.email}
                </a>
              </p>
            </address>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild className="bg-urgent text-urgent-foreground hover:bg-urgent/90">
                <Link to="/donate">Donate now</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-primary-foreground/25 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <Link to="/volunteer">Volunteer</Link>
              </Button>
            </div>
          </div>

          <nav aria-label="Quick links">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/50">
              Explore
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {data.quickLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-primary-foreground/75 transition-colors hover:text-brand">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/50">
              Governance
            </p>
            <ul className="mt-4 space-y-3 text-sm text-primary-foreground/75">
              <li className="flex gap-2">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-impact" aria-hidden />
                <span>Registration certificate {data.registrationNumber}</span>
              </li>
              <li className="flex gap-2">
                <FileCheck2 className="mt-0.5 size-4 shrink-0 text-impact" aria-hidden />
                <span>Externally audited every fiscal year; reports published publicly.</span>
              </li>
              <li className="flex gap-2">
                <Scale className="mt-0.5 size-4 shrink-0 text-impact" aria-hidden />
                <span>Tax-exempt under Ethiopian charity law. Receipts issued on request.</span>
              </li>
            </ul>
            <ul className="mt-5 space-y-2 text-sm">
              {(data.legalLinks ?? []).map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-primary-foreground/60 underline-offset-4 transition-colors hover:text-brand hover:underline">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 rounded-card border border-primary-foreground/10 bg-primary-foreground/5 p-5 text-xs leading-relaxed text-primary-foreground/60">
          <p className="font-semibold uppercase tracking-widest text-primary-foreground/70">
            Legal disclaimer
          </p>
          <p className="mt-2">
            {data.orgName} is a non-profit organization registered with the Ethiopian
            Authority for Civil Society Organizations under {data.registrationNumber}.
            Donations are used exclusively for charitable programs and administrative
            costs disclosed in the annual audited financial statements. Tax deductibility
            depends on the donor's jurisdiction; {data.orgName} makes no representation of
            deductibility outside Ethiopia. No donation is solicited where such solicitation
            would be unlawful.
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-primary-foreground/10 pt-6 sm:flex-row">
          <p className="text-xs text-primary-foreground/55">
            © {year} {data.orgName}. All rights reserved.
          </p>
          <ul className="flex items-center gap-2">
            {socials.map(({ key, href, Icon, label }) => (
              <li key={key}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={label}
                  className="flex size-9 items-center justify-center rounded-full border border-primary-foreground/15 text-primary-foreground/70 transition-colors hover:border-brand hover:text-brand"
                >
                  <Icon className="size-4" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default FooterRenderer;
