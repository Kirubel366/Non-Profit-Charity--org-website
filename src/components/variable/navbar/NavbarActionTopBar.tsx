import { useEffect, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Heart, HandHeart, Menu, Phone, X } from "lucide-react";
import type { NavbarData } from "@/types/schema";
import { cn } from "@/lib/utils";

/**
 * Variant A — "Action Top Bar" (Mekedonia style).
 * Utility strip with emergency contact above a solid, high-contrast nav row
 * whose primary action is an always-visible Donate button.
 */
export function NavbarActionTopBar({ data }: { data: NavbarData }) {
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
    <header className="sticky top-0 z-40 w-full">
      {/* Utility strip */}
      <div className="bg-surface-dark text-primary-foreground">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-xs sm:px-6">
          <p className="truncate opacity-80">Registered charity · 100% of donations reach the field</p>
          {data.emergencyPhone && (
            <a
              href={`tel:${data.emergencyPhone.replace(/\s/g, "")}`}
              className="flex shrink-0 items-center gap-1.5 font-medium transition-opacity hover:opacity-80"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>{data.emergencyPhone}</span>
            </a>
          )}
        </div>
      </div>

      {/* Main bar */}
      <div className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-badge bg-primary text-primary-foreground">
              <Heart className="h-5 w-5" />
            </span>
            <span className="font-heading text-lg font-extrabold tracking-tight text-foreground">
              {data.orgName}
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {data.navigationLinks.map((link) => {
              const active = isActiveRoute(link.href);
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary/10 text-primary ring-1 ring-primary/20"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/volunteer"
              className="hidden items-center gap-1.5 rounded-badge border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary sm:inline-flex"
            >
              <HandHeart className="h-4 w-4" />
              Volunteer
            </Link>
            <Link
              to="/donate"
              className="hidden items-center gap-1.5 rounded-badge bg-impact px-5 py-2 text-sm font-bold text-impact-foreground shadow-elevation transition-transform hover:scale-[1.03] sm:inline-flex"
            >
              <Heart className="h-4 w-4" />
              {data.donateLabel ?? "Donate"}
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground transition-colors hover:bg-muted lg:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile panel */}
        <div
          className={cn(
            "overflow-hidden border-t border-border bg-background transition-[max-height] duration-300 lg:hidden",
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
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "border-b border-border/60 py-3 text-sm font-medium last:border-b-0",
                    active ? "text-primary font-semibold" : "text-foreground",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              to="/donate"
              onClick={() => setMobileOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-badge bg-impact px-4 py-3 text-sm font-bold text-impact-foreground"
            >
              <Heart className="h-4 w-4" />
              {data.donateLabel ?? "Donate Now"}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
