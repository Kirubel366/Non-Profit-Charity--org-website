import { type FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Check, Loader2, PackageCheck } from "lucide-react";
import { toast } from "sonner";
import { submitMaterialDonation } from "@/lib/public.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PhoneNumberInput, isValidPhone } from "@/components/reusable/PhoneNumberInput";
import { handoverMethods, materialCategories } from "@/data/donationContent";
import { cn } from "@/lib/utils";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function MaterialDonationPanel() {
  const [categories, setCategories] = useState<string[]>([]);
  const [details, setDetails] = useState("");
  const [quantity, setQuantity] = useState("");
  const [method, setMethod] = useState<string>("dropoff");
  const [date, setDate] = useState("");
  const [address, setAddress] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");

  const mutation = useMutation({
    mutationFn: submitMaterialDonation,
    onSuccess: () => {
      toast.success("Thank you! Our logistics desk will contact you to arrange the handover.");
      setCategories([]);
      setDetails("");
      setQuantity("");
      setDate("");
      setAddress("");
      setFullName("");
      setEmail("");
      setPhone("");
      setNote("");
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : "We couldn't record your pledge. Please try again or call our office.";
      toast.error(message);
    },
  });

  const toggleCategory = (label: string) =>
    setCategories((prev) =>
      prev.includes(label) ? prev.filter((c) => c !== label) : [...prev, label],
    );

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const name = fullName.trim();
    const mail = email.trim();

    if (name.length < 2 || name.length > 100) {
      toast.error("Please enter your full name (2–100 characters).");
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
    if (categories.length === 0) {
      toast.error("Please select at least one item category.");
      return;
    }
    if (details.trim().length < 5) {
      toast.error("Please describe the items and quantity you plan to donate.");
      return;
    }
    if (method === "pickup" && address.trim().length < 5) {
      toast.error("Please add a pickup address so our team can collect the items.");
      return;
    }

    mutation.mutate({
      data: {
        full_name: name,
        email: mail || null,
        phone: phone.trim().slice(0, 40),
        item_categories: categories,
        item_details: details.trim().slice(0, 1000),
        estimated_quantity: quantity.trim().slice(0, 120) || null,
        handover_method: method,
        preferred_date: date || null,
        address: address.trim().slice(0, 300) || null,
        note: note.trim().slice(0, 500) || null,
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-card border border-border bg-card p-5 shadow-glass sm:p-8"
    >
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-impact/10 text-impact">
          <PackageCheck className="size-5" aria-hidden />
        </span>
        <div>
          <h3 className="text-lg font-semibold">Donate materials & goods</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Food, clothing, bedding, medicine, school supplies — tell us what you
            have and we will arrange collection or drop-off.
          </p>
        </div>
      </div>

      <fieldset className="mt-6">
        <legend className="text-sm font-semibold">What will you donate? *</legend>
        <div className="mt-3 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {materialCategories.map((category) => {
            const active = categories.includes(category.label);
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => toggleCategory(category.label)}
                aria-pressed={active}
                className={cn(
                  "rounded-card border p-3 text-left transition-all",
                  active
                    ? "border-impact bg-impact/10 ring-2 ring-impact/25"
                    : "border-border bg-background hover:border-impact/40",
                )}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={cn(
                      "flex size-4 items-center justify-center rounded-[4px] border transition-colors",
                      active
                        ? "border-impact bg-impact text-impact-foreground"
                        : "border-muted-foreground/40",
                    )}
                    aria-hidden
                  >
                    {active ? <Check className="size-3" /> : null}
                  </span>
                  <span className="text-sm font-semibold">{category.label}</span>
                </span>
                <span className="mt-1 block text-xs text-muted-foreground">
                  {category.hint}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-1.5">
          <Label htmlFor="mat-details">Item details & quantity *</Label>
          <Textarea
            id="mat-details"
            rows={4}
            maxLength={1000}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="e.g. 20 winter blankets (new), 3 sacks of rice 25 kg, 12 children's jackets size 6–10"
          />
        </div>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="mat-quantity">Estimated total quantity / weight</Label>
            <Input
              id="mat-quantity"
              maxLength={120}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="e.g. 4 boxes · ~60 kg"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="mat-date">Preferred handover date</Label>
            <Input
              id="mat-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      <fieldset className="mt-6">
        <legend className="text-sm font-semibold">How will we receive it? *</legend>
        <div className="mt-3 grid gap-2.5 md:grid-cols-3">
          {handoverMethods.map((option) => {
            const active = method === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setMethod(option.id)}
                aria-pressed={active}
                className={cn(
                  "rounded-card border p-4 text-left transition-all",
                  active
                    ? "border-brand bg-brand-muted ring-2 ring-brand/25"
                    : "border-border bg-background hover:border-brand/40",
                )}
              >
                <p className="text-sm font-semibold">{option.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {option.description}
                </p>
              </button>
            );
          })}
        </div>
      </fieldset>

      {method === "pickup" ? (
        <div className="mt-4 space-y-1.5">
          <Label htmlFor="mat-address">Pickup address *</Label>
          <Input
            id="mat-address"
            maxLength={300}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Sub-city, woreda, landmark"
          />
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="mat-name">Full name *</Label>
          <Input
            id="mat-name"
            maxLength={100}
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Dawit Alemu"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="mat-phone">Phone number *</Label>
          <PhoneNumberInput id="mat-phone" value={phone} onChange={setPhone} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="mat-email">Email</Label>
          <Input
            id="mat-email"
            type="email"
            maxLength={255}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div className="mt-4 space-y-1.5">
        <Label htmlFor="mat-note">Anything else we should know?</Label>
        <Textarea
          id="mat-note"
          rows={3}
          maxLength={500}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Access notes, best time to call, condition of the items…"
        />
      </div>

      <div className="mt-6 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          Every in-kind gift is logged in our goods register and acknowledged in
          writing within 48 hours.
        </p>
        <Button type="submit" size="lg" disabled={mutation.isPending}>
          {mutation.isPending ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" aria-hidden /> Submitting…
            </>
          ) : (
            "Pledge these items"
          )}
        </Button>
      </div>
    </form>
  );
}

export default MaterialDonationPanel;
