import { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const PHONE_PREFIX = "+251 ";

/** Digits only, ignoring the country code spacing. */
export const isValidPhone = (value: string) => {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 9 && digits.length <= 15;
};

interface Props {
  id: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
}

/**
 * Phone field that pre-fills the Ethiopian country code as real (editable)
 * text — not a placeholder — the moment the donor/volunteer starts typing.
 */
export const PhoneNumberInput = forwardRef<HTMLInputElement, Props>(
  function PhoneNumberInput({ id, value, onChange, required, className }, ref) {
    return (
      <Input
        id={id}
        ref={ref}
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        maxLength={20}
        required={required}
        value={value}
        onFocus={() => {
          if (!value) onChange(PHONE_PREFIX);
        }}
        onChange={(event) => {
          const next = event.target.value;
          // Keep the field usable: allow full editing, but never let it become
          // a bare fragment of the prefix while focused.
          onChange(next);
        }}
        onBlur={() => {
          if (value.trim() === PHONE_PREFIX.trim()) onChange("");
        }}
        placeholder="+251 911 234 567"
        className={cn("font-medium tabular-nums", className)}
      />
    );
  },
);

export default PhoneNumberInput;
