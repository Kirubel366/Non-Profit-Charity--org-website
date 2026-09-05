import { useEffect, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Heart, Mail, Menu, Phone, X } from "lucide-react";
import type { NavbarData } from "@/types/schema";
import { cn } from "@/lib/utils";

/**
 * Variant C — "Centered Classic" (institutional).
 * Stacked, symmetrical masthead: contact rail, centered wordmark, then a
 * centered navigation row. Reads as formal and trustworthy.
 */
export function NavbarCenteredClassic({ data }: { data: NavbarData }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const pathname = typeof location.pathname === "string" ? location.pathname : String(location.pathname ?? "/");

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActiveRoute = (href: string) => {
    const normalizedHref = String(href || "/");
    const normalizedPath = String(pathname || "/");

    return normalizedHref === "/"
      ? normalizedPath === "/"
      : normalizedPath === normalizedHref || normalizedPath.startsWith(`${normalizedHref}/`);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background">
      <div className="hidden border-b border-border/70 bg-surface-muted lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-5">
            {data.emergencyPhone && (
              <span className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" /> {data.emergencyPhone}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" /> {data.email ?? "hello@yourorganization.org"}
            </span>
          </div>
          <Link to="/volunteer" className="font-semibold text-primary transition-opacity hover:opacity-80">
            Become a volunteer
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between gap-6 py-4">
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary text-primary">
              <Heart className="h-5 w-5" />
            </span>
            <span className="font-heading text-xl font-extrabold uppercase tracking-[0.18em] text-foreground">
              {data.orgName || "Organization"}
            </span>
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-7 lg:flex">
            {data.navigationLinks.map((link) => {
              const active = isActiveRoute(link.href);
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative py-1 text-sm font-semibold uppercase tracking-wide transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-center after:scale-x-0 after:bg-primary after:transition-transform hover:text-foreground hover:after:scale-x-100",
                    active ? "text-primary after:scale-x-100" : "text-muted-foreground",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <Link
            to="/donate"
            className="hidden rounded-badge bg-primary px-5 py-2 text-sm font-bold uppercase tracking-wide text-primary-foreground transition-transform hover:scale-[1.03] lg:inline-flex"
          >
            {data.donateLabel ?? "Donate"}
          </Link>

          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground transition-colors hover:bg-muted"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-border transition-[max-height] duration-300 lg:hidden",
          mobileOpen ? "max-h-96" : "max-h-0 border-t-0",
        )}
      >
        <nav className="flex flex-col px-4 py-2 sm:px-6">
          {data.navigationLinks.map((link) => {
            const active = isActiveRoute(link.href);
            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "border-b border-border/60 py-3 text-sm font-semibold uppercase tracking-wide last:border-b-0",
                  active ? "text-primary" : "text-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            to="/donate"
            onClick={() => setMobileOpen(false)}
            className="mt-2 rounded-badge bg-primary px-4 py-3 text-center text-sm font-bold text-primary-foreground"
          >
            {data.donateLabel ?? "Donate Now"}
          </Link>
        </nav>
      </div>
    </header>
  );
}
