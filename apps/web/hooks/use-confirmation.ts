import { create } from "zustand";
import type { ConfirmationModalTypes } from "@/lib/types";

type ConfirmationModalState = {
  type: ConfirmationModalTypes | null;
  title: string;
  description: string;
  confirmText: string;
  open: boolean;
  onOpen: (
    type: ConfirmationModalTypes,
    title: string,
    description: string,
    confirmText: string
  ) => void;
  onClose: () => void;
  onConfirm: () => void;
  onCancel: () => void;
};

export const useConfirmationModal = create<ConfirmationModalState>((set) => ({
  type: null,
  title: "",
  description: "",
  confirmText: "",
  open: false,
  onOpen: (type, title, description, confirmText) =>
    set({ type, title, description, confirmText, open: true }),
  onClose: () => set({ type: null, open: false }),
  onConfirm: () => set({ open: false, type: null }),
  onCancel: () => set({ open: false, type: null }),
}));
