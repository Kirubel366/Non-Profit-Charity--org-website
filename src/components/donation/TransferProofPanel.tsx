import { useState, type ChangeEvent, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { ImageUp, Loader2, ReceiptText, X } from "lucide-react";
import { toast } from "sonner";
import { submitTransferProof } from "@/lib/public.functions";
import { uploadPrivateFile, FileUploadError } from "@/utils/fileUpload";
import { RECEIPTS_BUCKET } from "@/lib/storageBuckets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PhoneNumberInput, isValidPhone } from "@/components/reusable/PhoneNumberInput";
import type { BankAccountDetails } from "@/types/schema";
import { cn } from "@/lib/utils";
import { orgContent } from "@/data/orgContent";

interface Props {
  accounts: BankAccountDetails[];
  currencySymbol: string;
}

interface TransferFormValues {
  fullName: string;
  email: string;
  phone: string;
  amount: string;
  bank: string;
  reference: string;
  note: string;
  file: File;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_BYTES = 5 * 1024 * 1024;

export function TransferProofPanel({ accounts, currencySymbol }: Props) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [bank, setBank] = useState(accounts[0]?.bankName ?? "");
  const [reference, setReference] = useState("");
  const [note, setNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async (values: TransferFormValues) => {
      // Step 1: upload straight to storage (HEIC screenshots get converted
      // to WebP first — see uploadPrivateFile). If this fails we never touch
      // the database, so the finance team never sees a record with a dead
      // screenshot link.
      const upload = await uploadPrivateFile(values.file, RECEIPTS_BUCKET, {
        allowHeicConversion: true,
      });

      // Step 2: record the pledge, referencing the uploaded path.
      const parsedAmount = Number(values.amount.replace(/[^\d.]/g, ""));
      return submitTransferProof({
        data: {
          full_name: values.fullName,
          email: values.email || null,
          phone: values.phone,
          amount: Number.isFinite(parsedAmount) && parsedAmount > 0 ? parsedAmount : null,
          currency: currencySymbol,
          bank_name: values.bank || null,
          reference_number: values.reference || null,
          note: values.note || null,
          screenshot_path: upload.path,
        },
      });
    },
    onSuccess: () => {
      toast.success("Receipt received — your acknowledgement letter is on the way.");
      setFullName("");
      setEmail("");
      setPhone("");
      setAmount("");
      setReference("");
      setNote("");
      clearFile();
    },
    onError: (error: unknown) => {
      if (error instanceof FileUploadError) {
        toast.error(error.message);
        return;
      }
      const message =
        error instanceof Error
          ? error.message
          : `We couldn't record your receipt. Please try again or email ${orgContent.admin.financeEmail}.`;
      toast.error(message);
    },
  });

  const clearFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setFile(null);
  };

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    if (!selected) return;
    if (selected.size > MAX_BYTES) {
      toast.error("Please attach an image or PDF under 5 MB.");
      return;
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(selected);
    setPreviewUrl(
      selected.type.startsWith("image/") ? URL.createObjectURL(selected) : null,
    );
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const name = fullName.trim();
    const mail = email.trim();

    if (name.length < 2) {
      toast.error("Please enter the name used for the transfer.");
      return;
    }
    if (!isValidPhone(phone)) {
      toast.error("Please enter a valid phone number.");
      return;
    }
    if (mail && (!emailPattern.test(mail) || mail.length > 255)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!file) {
      toast.error("Please attach the screenshot or receipt of your transfer.");
      return;
    }

    mutation.mutate({
      fullName: name,
      email: mail,
      phone: phone.trim().slice(0, 40),
      amount,
      bank,
      reference: reference.trim().slice(0, 120),
      note: note.trim().slice(0, 500),
      file,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-6 rounded-card border border-border bg-card p-5 shadow-glass sm:p-8 lg:grid-cols-[1fr_1fr]"
    >
      <div>
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-muted text-brand">
            <ReceiptText className="size-5" aria-hidden />
          </span>
          <div>
            <h3 className="text-lg font-semibold">Send your transfer proof</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Already transferred to one of our accounts? Attach the screenshot so
              finance can match it and issue your official receipt.
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="proof-name">Name on transfer *</Label>
              <Input
                id="proof-name"
                maxLength={100}
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Dawit Alemu"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="proof-phone">Phone number *</Label>
              <PhoneNumberInput
                id="proof-phone"
                value={phone}
                onChange={setPhone}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="proof-email">Email</Label>
              <Input
                id="proof-email"
                type="email"
                maxLength={255}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="proof-amount">Amount ({currencySymbol})</Label>
              <Input
                id="proof-amount"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ""))}
                placeholder="1000"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="proof-bank">Bank / channel used</Label>
              <select
                id="proof-bank"
                value={bank}
                onChange={(e) => setBank(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {accounts.map((account) => (
                  <option key={account.id} value={account.bankName}>
                    {account.bankName}
                  </option>
                ))}
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="proof-ref">Transaction reference</Label>
              <Input
                id="proof-ref"
                maxLength={120}
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="FT2508XXXXXX"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="proof-note">Message (optional)</Label>
            <Textarea
              id="proof-note"
              rows={3}
              maxLength={500}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Dedicate this gift, or tell us which program it should support."
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <Label htmlFor="proof-file" className="text-sm font-semibold">
          Transfer screenshot or receipt *
        </Label>
        {file ? (
          <div className="mt-2 flex-1 overflow-hidden rounded-card border border-impact/40 bg-impact/5 p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-sm font-medium">{file.name}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Remove attachment"
                onClick={clearFile}
              >
                <X className="size-4" />
              </Button>
            </div>
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview of the attached transfer receipt"
                className="mt-3 max-h-72 w-full rounded-md object-contain"
              />
            ) : (
              <p className="mt-3 text-xs text-muted-foreground">
                Document attached — no preview available.
              </p>
            )}
          </div>
        ) : (
          <label
            htmlFor="proof-file"
            className={cn(
              "mt-2 flex min-h-[16rem] flex-1 cursor-pointer flex-col items-center justify-center gap-2 rounded-card",
              "border border-dashed border-border bg-surface-muted p-6 text-center transition-colors",
              "hover:border-brand hover:bg-brand-muted/40",
            )}
          >
            <ImageUp className="size-7 text-brand" aria-hidden />
            <span className="text-sm font-semibold">
              Click to attach your screenshot
            </span>
            <span className="text-xs text-muted-foreground">
              PNG, JPG or PDF · up to 5 MB · stored privately
            </span>
          </label>
        )}
        <input
          id="proof-file"
          type="file"
          accept="image/*,.heic,.heif,.pdf"
          className="sr-only"
          onChange={handleFile}
        />

        <Button type="submit" size="lg" className="mt-4" disabled={mutation.isPending}>
          {mutation.isPending ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" aria-hidden /> Uploading…
            </>
          ) : (
            "Submit transfer proof"
          )}
        </Button>
        <p className="mt-2 text-xs text-muted-foreground">
          Receipts are stored in private, encrypted storage and are only visible
          to the finance team.
        </p>
      </div>
    </form>
  );
}

export default TransferProofPanel;
