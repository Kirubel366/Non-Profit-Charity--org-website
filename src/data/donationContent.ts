/**
 * Donation hub content — item categories, presets and handover options.
 * Kept separate from orgContent so the OCMS admin can edit it independently.
 */

export interface MaterialCategory {
  id: string;
  label: string;
  hint: string;
}

export const materialCategories: MaterialCategory[] = [
  { id: "food", label: "Food & groceries", hint: "Teff, oil, rice, pasta, sugar" },
  { id: "clothing", label: "Clothing & shoes", hint: "Clean, wearable adult or child sizes" },
  { id: "bedding", label: "Bedding & blankets", hint: "Mattresses, sheets, blankets" },
  { id: "medical", label: "Medical supplies", hint: "Unexpired medicine, hygiene kits" },
  { id: "school", label: "School materials", hint: "Exercise books, pens, uniforms" },
  { id: "furniture", label: "Furniture & appliances", hint: "Beds, chairs, kitchenware" },
  { id: "electronics", label: "Electronics & IT", hint: "Laptops, phones, printers" },
  { id: "other", label: "Something else", hint: "Tell us in the details field" },
];

export const handoverMethods = [
  {
    id: "dropoff",
    label: "I will drop it off",
    description: "Bring items to our Addis Ababa headquarters during office hours.",
  },
  {
    id: "pickup",
    label: "Please collect from me",
    description: "Our logistics team schedules a free pickup within Addis Ababa.",
  },
  {
    id: "courier",
    label: "Sending by courier",
    description: "You ship it and we confirm receipt with a signed acknowledgement.",
  },
] as const;

export const presetAmounts = [250, 500, 1000, 2500, 5000];

export const impactPerAmount: Record<number, string> = {
  250: "Feeds one child for a week",
  500: "A month of school materials",
  1000: "A warm blanket + winter kit",
  2500: "One shelter bed for a month",
  5000: "A mobile clinic outreach day",
};
