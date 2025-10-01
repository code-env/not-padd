import { create } from "zustand";
import type { ConfirmationModalTypes } from "@/lib/types";

type ConfirmationModalState = {
  type: ConfirmationModalTypes | null;
  title: string;
  confirmText: string;
  confirmTextValue: string;
  open: boolean;
  canProceed: boolean;
  isLoading: boolean;
  inputValue: string;
  onOpen: (
    type: ConfirmationModalTypes,
    title: string,
    confirmText: string,
    confirmTextValue: string,
    onConfirm: () => void
  ) => void;
  onClose: () => void;
  onConfirm: () => void;
  onCancel: () => void;
  setInputValue: (value: string) => void;
};

export const useConfirmationModal = create<ConfirmationModalState>(
  (set, get) => ({
    type: null,
    title: "",
    confirmText: "",
    confirmTextValue: "",
    open: false,
    canProceed: false,
    inputValue: "",
    isLoading: false,
    onOpen: (type, title, confirmText, confirmTextValue, onConfirm) =>
      set({
        type,
        title,
        confirmText,
        confirmTextValue,
        open: true,
        canProceed: false,
        inputValue: "",
        onConfirm,
        isLoading: false,
      }),
    onClose: () =>
      set({ type: null, open: false, inputValue: "", canProceed: false }),
    onConfirm: () =>
      set({
        open: false,
        type: null,
        canProceed: true,
        inputValue: "",
        isLoading: true,
      }),
    onCancel: () =>
      set({ open: false, type: null, canProceed: false, inputValue: "" }),
    setInputValue: (value) =>
      set({
        inputValue: value,
        canProceed: value.trim() === get().confirmTextValue.trim(),
      }),
  })
);
