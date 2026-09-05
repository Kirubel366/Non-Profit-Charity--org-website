import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useModal } from "@/context/ModalContext";

/**
 * Global intent host — mounted once at the app root.
 *
 * Redirect modal-based calls to their dedicated public pages instead of
 * relying on in-page scroll jumps.
 */
export function ModalHost() {
  const navigate = useNavigate();
  const { activeModal, closeModal } = useModal();

  useEffect(() => {
    if (!activeModal) return;

    if (activeModal === "donation") {
      void navigate({ to: "/donate" });
    }

    if (activeModal === "volunteer") {
      void navigate({ to: "/volunteer" });
    }

    closeModal();
  }, [activeModal, closeModal, navigate]);

  return null;
}

export default ModalHost;
