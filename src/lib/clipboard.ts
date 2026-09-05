import confetti from "canvas-confetti";
import { toast } from "sonner";

/** Copies text, shows a toast and fires a light confetti burst. */
export async function copyWithCelebration(value: string, message: string) {
  try {
    await navigator.clipboard.writeText(value);
    toast.success(message);
    confetti({
      particleCount: 45,
      spread: 55,
      startVelocity: 28,
      scalar: 0.8,
      origin: { y: 0.7 },
    });
    return true;
  } catch {
    toast.error("Copy failed — please copy the number manually.");
    return false;
  }
}
