import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/** Consistent panel header used by every OCMS tab. */
export function PanelHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-xl font-bold tracking-tight sm:text-2xl">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {action ? <div className="flex flex-wrap gap-2">{action}</div> : null}
    </div>
  );
}

export function LoadingRows({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading records</span>
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton key={index} className="h-20 w-full rounded-card" />
      ))}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-border bg-muted/30 px-6 py-14 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-background text-muted-foreground shadow-sm">
        {icon}
      </div>
      <h3 className="mt-4 text-base font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

const statusTones: Record<string, string> = {
  New: "bg-brand-muted text-brand border-transparent",
  Contacted: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-transparent",
  Scheduled: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-transparent",
  Approved: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-transparent",
  Verified: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-transparent",
  Received: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-transparent",
  Rejected: "bg-destructive/15 text-destructive border-transparent",
  Archived: "bg-muted text-muted-foreground border-transparent",
};

export function StatusPill({ status }: { status: string }) {
  return (
    <Badge
      variant="outline"
      className={cn("font-semibold", statusTones[status] ?? "")}
    >
      {status}
    </Badge>
  );
}

export function InlineSpinner({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
      <Loader2 className="size-4 animate-spin" aria-hidden />
      {label}
    </span>
  );
}

export const formatDate = (value?: string | null) =>
  value
    ? new Date(value).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

export const formatDateTime = (value?: string | null) =>
  value
    ? new Date(value).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";
