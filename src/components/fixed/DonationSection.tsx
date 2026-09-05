import { useEffect, useState } from "react";
import { CreditCard, HeartHandshake, PackageCheck, ReceiptText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MoneyDonationPanel } from "@/components/donation/MoneyDonationPanel";
import { MaterialDonationPanel } from "@/components/donation/MaterialDonationPanel";
import { TransferProofPanel } from "@/components/donation/TransferProofPanel";
import { useModal } from "@/context/ModalContext";
import type { BankAccountDetails } from "@/types/schema";

interface Props {
  accounts: BankAccountDetails[];
  campaignTitle: string;
  currencySymbol: string;
  targetAmount?: number;
  raisedAmount?: number;
  donorCount?: number;
}

type DonationTab = "money" | "material" | "proof";

export function DonationSection({
  accounts,
  campaignTitle,
  currencySymbol,
  targetAmount,
  raisedAmount,
  donorCount,
}: Props) {
  const { activeModal, modalPayload, closeModal } = useModal();
  const [tab, setTab] = useState<DonationTab>("money");

  // Any "Donate" CTA anywhere in the app scrolls here and can preselect a track.
  useEffect(() => {
    if (activeModal !== "donation") return;
    const requested = typeof modalPayload === "string" ? modalPayload : null;
    if (requested === "material" || requested === "proof" || requested === "money") {
      setTab(requested);
    }
    closeModal();
  }, [activeModal, modalPayload, closeModal]);

  return (
    <section
      id="donate"
      aria-labelledby="donate-heading"
      className="scroll-mt-20 bg-background py-20 sm:py-28"
    >

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-badge bg-brand-muted px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand">
            <HeartHandshake className="size-3.5" aria-hidden />
            Ways to give
          </span>
          <h2 id="donate-heading" className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Support {campaignTitle}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            Give money, donate materials, or confirm a transfer you have already
            made. Every birr and every item is logged, audited and acknowledged.
          </p>
        </div>

        <Tabs
          value={tab}
          onValueChange={(value) => setTab(value as DonationTab)}
          className="mt-10"
        >
          <TabsList
            aria-label="Choose how you would like to give"
            className="flex h-auto w-full max-w-2xl flex-col gap-1.5 rounded-card p-1.5 sm:grid sm:grid-cols-3 sm:gap-1"
          >
            <TabsTrigger
              value="money"
              className="w-full gap-2 px-3 py-2.5 text-sm sm:py-2"
            >
              <CreditCard className="size-4 shrink-0" aria-hidden /> Give money
            </TabsTrigger>
            <TabsTrigger
              value="material"
              className="w-full gap-2 px-3 py-2.5 text-sm sm:py-2"
            >
              <PackageCheck className="size-4 shrink-0" aria-hidden /> Donate materials
            </TabsTrigger>
            <TabsTrigger
              value="proof"
              className="w-full gap-2 px-3 py-2.5 text-sm sm:py-2"
            >
              <ReceiptText className="size-4 shrink-0" aria-hidden /> Send transfer proof
            </TabsTrigger>
          </TabsList>


          <TabsContent value="money" className="mt-6 focus-visible:outline-none">
            <MoneyDonationPanel
              accounts={accounts}
              campaignTitle={campaignTitle}
              currencySymbol={currencySymbol}
            />
          </TabsContent>
          <TabsContent value="material" className="mt-6 focus-visible:outline-none">
            <MaterialDonationPanel />
          </TabsContent>
          <TabsContent value="proof" className="mt-6 focus-visible:outline-none">
            <TransferProofPanel accounts={accounts} currencySymbol={currencySymbol} />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

export default DonationSection;
