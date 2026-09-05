import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Info, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BankCopyCard } from "@/components/reusable/BankCopyCard";
import { PhoneNumberInput } from "@/components/reusable/PhoneNumberInput";
import { initChapaCheckout, isChapaConfigured } from "@/lib/chapaHandler";
import { impactPerAmount, presetAmounts } from "@/data/donationContent";
import type { BankAccountDetails } from "@/types/schema";
import { cn } from "@/lib/utils";

interface Props {
  accounts: BankAccountDetails[];
  campaignTitle: string;
  currencySymbol: string;
}

export function MoneyDonationPanel({
  accounts,
  campaignTitle,
  currencySymbol,
}: Props) {
  const [amount, setAmount] = useState(1000);
  const [custom, setCustom] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [processing, setProcessing] = useState(false);

  const chapaReady = useMemo(() => isChapaConfigured(), []);
  const effectiveAmount = custom.trim() ? Number(custom) : amount;

  const handleChapa = async () => {
    if (!Number.isFinite(effectiveAmount) || effectiveAmount < 10) {
      toast.error(`Please enter an amount of at least 10 ${currencySymbol}.`);
      return;
    }
    setProcessing(true);
    const result = await initChapaCheckout({
      amount: effectiveAmount,
      currency: currencySymbol,
      campaignTitle,
      ...(email.trim() ? { email: email.trim() } : {}),
      ...(phone.trim() ? { phoneNumber: phone.trim() } : {}),
      ...(typeof window !== "undefined"
        ? { returnUrl: `${window.location.origin}/#donate` }
        : {}),
    });
    setProcessing(false);

    if (result.status === "initialized") {
      window.open(result.checkoutUrl, "_blank", "noopener,noreferrer");
      toast.success("Secure checkout opened in a new tab.");
      return;
    }
    toast.info(result.reason);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_1fr]">
      {/* Track 1 — direct bank transfer */}
      <div className="rounded-card border border-border bg-card p-5 shadow-glass sm:p-6">
        <h3 className="text-lg font-semibold">Direct bank transfer</h3>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Tap a card to copy the account number instantly, then complete the
          transfer from your banking or Telebirr app.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {accounts.map((account, index) => (
            <BankCopyCard key={account.id} account={account} accent={index === 0} />
          ))}
        </div>
        <div className="mt-4 flex gap-2 rounded-card border border-border bg-surface-muted p-3 text-xs text-muted-foreground">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-impact" aria-hidden />
          <p>
            Every account is held in the organization's registered legal name.
            After transferring, upload your screenshot in the{" "}
            <strong>Send transfer proof</strong> tab and we will issue an official
            acknowledgement letter.
          </p>
        </div>
      </div>

      {/* Track 2 — Chapa online checkout */}
      <div className="rounded-card border border-border bg-card p-5 shadow-glass sm:p-6">
        <h3 className="text-lg font-semibold">Pay online — card & mobile money</h3>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Powered by Chapa. Supports Telebirr, CBE Birr, Visa and Mastercard.
        </p>

        <Label className="mt-5 block text-sm font-semibold">
          Choose an amount ({currencySymbol})
        </Label>
        <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-5">
          {presetAmounts.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setAmount(value);
                setCustom("");
              }}
              className={cn(
                "rounded-md border px-2 py-2.5 text-sm font-semibold transition-colors",
                !custom && amount === value
                  ? "border-brand bg-brand text-brand-foreground"
                  : "border-border bg-background hover:border-brand/50",
              )}
            >
              {value.toLocaleString()}
            </button>
          ))}
        </div>
        {!custom && impactPerAmount[amount] ? (
          <p className="mt-2 text-xs font-medium text-impact">
            {impactPerAmount[amount]}
          </p>
        ) : null}

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="donate-custom">Custom amount</Label>
            <Input
              id="donate-custom"
              inputMode="numeric"
              value={custom}
              onChange={(e) => setCustom(e.target.value.replace(/\D/g, ""))}
              placeholder="Other amount"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="donate-email">Email for receipt</Label>
            <Input
              id="donate-email"
              type="email"
              maxLength={255}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="donate-phone">Phone number</Label>
            <PhoneNumberInput id="donate-phone" value={phone} onChange={setPhone} />
          </div>
        </div>

        <AnimatePresence initial={false}>
          {!chapaReady ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 flex gap-2 overflow-hidden rounded-card border border-urgent/40 bg-urgent/10 p-3 text-xs text-foreground"
            >
              <Info className="mt-0.5 size-4 shrink-0 text-urgent" aria-hidden />
              <p>
                Online card processing is running in <strong>test mode</strong>.
                The gateway is fully wired — it activates the moment the Chapa
                keys are added. Until then, please use a direct bank transfer.
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <Button
          size="lg"
          className="mt-4 w-full"
          onClick={handleChapa}
          disabled={processing}
        >
          {processing ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" aria-hidden /> Starting
              checkout…
            </>
          ) : (
            <>
              Give {currencySymbol}{" "}
              {Number.isFinite(effectiveAmount) ? effectiveAmount.toLocaleString() : 0}
            </>
          )}
        </Button>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Secured by Chapa · Card details never touch our servers.
        </p>
      </div>
    </div>
  );
}

export default MoneyDonationPanel;
