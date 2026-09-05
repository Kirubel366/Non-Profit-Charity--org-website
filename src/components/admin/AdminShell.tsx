import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  CalendarDays,
  Gauge,
  HeartHandshake,
  Images,
  Inbox,
  LogOut,
  Menu,
  Settings2,
  ShieldCheck,
  Users,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { enabledModules } from "@/config/moduleFlags";
import { cn } from "@/lib/utils";
import { orgContent } from "@/data/orgContent";

export type AdminTab =
  | "overview"
  | "events"
  | "gallery"
  | "volunteers"
  | "donations"
  | "inquiries"
  | "settings";

interface NavItem {
  id: AdminTab;
  label: string;
  hint: string;
  icon: typeof Gauge;
  /** Tab is hidden when its module flag is off. */
  enabled: boolean;
}

export const adminNavItems: NavItem[] = [
  { id: "overview", label: "Overview", hint: "Live activity", icon: Gauge, enabled: true },
  { id: "events", label: "Events", hint: "Drives & news", icon: CalendarDays, enabled: enabledModules.events },
  { id: "gallery", label: "Gallery", hint: "Media library", icon: Images, enabled: enabledModules.gallery },
  { id: "volunteers", label: "Volunteers", hint: "Applicant pipeline", icon: Users, enabled: enabledModules.volunteers },
  { id: "donations", label: "Donations", hint: "Materials & proofs", icon: HeartHandshake, enabled: enabledModules.donate },
  { id: "inquiries", label: "Inbox", hint: "Contact messages", icon: Inbox, enabled: enabledModules.inquiries },
  { id: "settings", label: "Profile and Account", hint: "Site details and credentials", icon: Settings2, enabled: enabledModules.settings },
];

export const visibleAdminTabs = adminNavItems.filter((item) => item.enabled);

function NavList({
  active,
  onSelect,
  counts,
}: {
  active: AdminTab;
  onSelect: (tab: AdminTab) => void;
  counts: Partial<Record<AdminTab, number>>;
}) {
  return (
    <nav aria-label="Admin sections" className="space-y-1">
      {visibleAdminTabs.map((item) => {
        const isActive = item.id === active;
        const count = counts[item.id];
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex w-full items-center gap-3 rounded-card px-3 py-2.5 text-left text-sm font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              isActive
                ? "bg-brand text-brand-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <item.icon className="size-4 shrink-0" aria-hidden />
            <span className="flex-1 leading-tight">
              {item.label}
              <span
                className={cn(
                  "block text-xs font-normal",
                  isActive ? "text-brand-foreground/80" : "text-muted-foreground/80",
                )}
              >
                {item.hint}
              </span>
            </span>
            {count ? (
              <span
                className={cn(
                  "rounded-badge px-2 py-0.5 text-xs font-semibold tabular-nums",
                  isActive ? "bg-brand-foreground/20" : "bg-muted text-foreground",
                )}
              >
                {count}
              </span>
            ) : null}
          </button>
        );
      })}
    </nav>
  );
}

export function AdminShell({
  active,
  onSelect,
  counts,
  email,
  onSignOut,
  children,
}: {
  active: AdminTab;
  onSelect: (tab: AdminTab) => void;
  counts: Partial<Record<AdminTab, number>>;
  email: string;
  onSignOut: () => void;
  children: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const brand = (
    <div className="flex items-center gap-3">
      <span className="flex size-10 items-center justify-center rounded-card bg-brand-muted text-brand">
        <ShieldCheck className="size-5" aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-bold tracking-tight">{orgContent.admin.productName}</p>
        <p className="truncate text-xs text-muted-foreground">{email}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/40">
      <a
        href="#admin-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:shadow"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open admin menu">
                <Menu className="size-4" aria-hidden />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[19rem] p-0">
              <SheetTitle className="sr-only">Admin navigation</SheetTitle>
              <div className="border-b border-border p-4">{brand}</div>
              <div className="p-3">
                <NavList
                  active={active}
                  counts={counts}
                  onSelect={(tab) => {
                    onSelect(tab);
                    setMobileOpen(false);
                  }}
                />
              </div>
            </SheetContent>
          </Sheet>
          <p className="truncate text-sm font-semibold">{orgContent.admin.productName}</p>
          <Button variant="ghost" size="icon" aria-label="Sign out" onClick={onSignOut}>
            <LogOut className="size-4" aria-hidden />
          </Button>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[110rem] gap-0 lg:gap-6 lg:px-6 lg:py-6">
        <aside className="sticky top-6 hidden h-[calc(100vh-3rem)] w-72 shrink-0 flex-col rounded-card border border-border bg-card p-4 shadow-sm lg:flex">
          {brand}
          <div className="mt-6 flex-1 overflow-y-auto">
            <NavList active={active} counts={counts} onSelect={onSelect} />
          </div>
          <div className="mt-4 space-y-2 border-t border-border pt-4">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/">
                <ExternalLink className="mr-2 size-4" aria-hidden /> View public site
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={onSignOut}>
              <LogOut className="mr-2 size-4" aria-hidden /> Sign out
            </Button>
          </div>
        </aside>

        <main
          id="admin-main"
          className="min-w-0 flex-1 rounded-none border-border bg-background p-4 sm:p-6 lg:rounded-card lg:border lg:shadow-sm"
        >
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminShell;
