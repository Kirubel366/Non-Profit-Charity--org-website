import { useState } from "react";
import { Check, Copy, Landmark } from "lucide-react";
import type { BankAccountDetails } from "@/types/schema";
import { copyWithCelebration } from "@/lib/clipboard";
import { cn } from "@/lib/utils";

interface Props {
  account: BankAccountDetails;
  accent?: boolean;
}

/** High-contrast bank card with single-click account copy + confetti celebration. */
export function BankCopyCard({ account, accent = false }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const ok = await copyWithCelebration(
      account.accountNumber.replace(/\s/g, ""),
      `${account.bankName} account copied!`,
    );
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`Copy ${account.bankName} account number`}
      className={cn(
        "group relative w-full overflow-hidden rounded-card border p-4 text-left transition-all",
        "hover:-translate-y-0.5 hover:shadow-elevation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        accent
          ? "border-brand/40 bg-brand-muted"
          : "border-border bg-card",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-surface-dark text-primary-foreground">
              <Landmark className="size-4" aria-hidden />
            </span>
            <p className="truncate text-sm font-semibold">{account.bankName}</p>
          </div>
          <p className="mt-3 font-mono text-lg font-bold tracking-wider tabular-nums">
            {account.accountNumber}
          </p>
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {account.accountName}
            {account.swiftCode ? ` · SWIFT ${account.swiftCode}` : ""}
          </p>
        </div>

        <span
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-full transition-colors",
            copied
              ? "bg-impact text-impact-foreground"
              : "bg-muted text-muted-foreground group-hover:bg-brand group-hover:text-brand-foreground",
          )}
          aria-hidden
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        </span>
      </div>
      <span className="sr-only" role="status">
        {copied ? "Account number copied" : ""}
      </span>
    </button>
  );
}

export default BankCopyCard;
