import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ModalType } from "@/types/schema";

export interface ModalContextType {
  activeModal: ModalType;
  modalPayload: unknown;
  openModal: (type: ModalType, payload?: unknown) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [modalPayload, setModalPayload] = useState<unknown>(null);

  const openModal = useCallback((type: ModalType, payload: unknown = null) => {
    setActiveModal(type);
    setModalPayload(payload);
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
    setModalPayload(null);
  }, []);

  const value = useMemo(
    () => ({ activeModal, modalPayload, openModal, closeModal }),
    [activeModal, modalPayload, openModal, closeModal],
  );

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
}

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used within a ModalProvider");
  return context;
};
