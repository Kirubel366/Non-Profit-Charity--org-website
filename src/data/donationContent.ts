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
  { id: "clothing", label: "Clothing & shoes", hint: "Clean, wearable clothes and shoes in adult and child sizes" },
  { id: "food", label: "Food & groceries", hint: "For our holiday celebrations and weekend lunches for children" },
  { id: "school", label: "School materials", hint: "Exercise books, pens, school bags" },
  { id: "books", label: "Books", hint: "Books for our Adis Gojo book rental at the Youth Center" },
  { id: "hygiene", label: "Hygiene & personal care", hint: "Soap, toothpaste, towels for the children we support" },
  { id: "other", label: "Something else", hint: "Tell us in the details field" },
];

export const handoverMethods = [
  {
    id: "dropoff",
    label: "I will drop it off",
    description: "Bring items to our office at Tewodros Campus, University of Gondar. Contact us first to arrange a time.",
  },
  {
    id: "pickup",
    label: "Please collect from me",
    description: "Contact us and we will try to arrange a pickup in Gondar.",
  },
  {
    id: "courier",
    label: "Sending by courier",
    description: "You ship it to us and we will confirm once it arrives.",
  },
] as const;

export const presetAmounts = [250, 500, 1000, 2500, 5000];

export const impactPerAmount: Record<number, string> = {
  250: "Contributes to weekend lunches for children",
  500: "Contributes to school materials for children",
  1000: "Helps provide clothing and shoes for neighbors in need",
  2500: "Helps us host families at our holiday celebrations",
  5000: "Contributes to a patient's treatment fund",
};
