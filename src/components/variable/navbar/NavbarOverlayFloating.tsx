import { useEffect, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Heart, Menu, X } from "lucide-react";
import type { NavbarData } from "@/types/schema";
import { cn } from "@/lib/utils";

/**
 * Variant B — "Overlay Floating" (glassmorphic).
 * Detached pill that floats over the hero media, frosting on scroll.
 */
export function NavbarOverlayFloating({ data }: { data: NavbarData }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const pathname = typeof location.pathname === "string" ? location.pathname : String(location.pathname ?? "/");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActiveRoute = (href: string) => {
    const normalizedHref = String(href || "/");
    const normalizedPath = String(pathname || "/");

    return normalizedHref === "/"
      ? normalizedPath === "/"
      : normalizedPath === normalizedHref || normalizedPath.startsWith(`${normalizedHref}/`);
  };

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-6 sm:pt-5">
      <div
        className={cn(
          "pointer-events-auto mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-badge border px-4 py-2.5 backdrop-blur-xl transition-all duration-300 sm:px-5",
          scrolled
            ? "border-border/70 bg-card/80 shadow-elevation"
            : "border-border/30 bg-card/40 shadow-glass",
        )}
      >
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-badge bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
            <Heart className="h-4.5 w-4.5" />
          </span>
          <span className="font-heading text-base font-extrabold tracking-tight text-foreground">
            {data.orgName}
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex">
          {data.navigationLinks.map((link) => {
            const active = isActiveRoute(link.href);
            return (
              <Link
                key={link.href}
                to={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-badge px-3 py-1.5 text-sm font-medium transition-colors",
                  active ? "bg-primary/10 text-primary ring-1 ring-primary/15" : "text-foreground/75 hover:bg-background/60 hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/donate"
            className="hidden items-center gap-1.5 rounded-badge bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03] sm:inline-flex"
          >
            <Heart className="h-4 w-4" />
            <span>{data.donateLabel ?? "Donate"}</span>
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="inline-flex h-9 w-9 items-center justify-center rounded-badge border border-border/50 bg-background/50 text-foreground lg:hidden"
          >
            {mobileOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="pointer-events-auto mx-auto mt-2 grid max-w-6xl gap-1 rounded-card border border-border/60 bg-card/90 p-3 shadow-elevation backdrop-blur-xl lg:hidden">
          {data.navigationLinks.map((link) => {
            const active = isActiveRoute(link.href);
            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted",
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
            className="mt-1 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            <Heart className="h-4 w-4" />
            {data.donateLabel ?? "Donate Now"}
          </Link>
        </nav>
      )}
    </header>
  );
}
