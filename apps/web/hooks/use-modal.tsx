import { create } from "zustand";

import type { ModalTypes } from "@/lib/types";

type ModalState = {
  type: ModalTypes | null;
  isOpen: boolean;
  data: any;
  onOpen: (type: ModalTypes, data?: any) => void;
  onClose: () => void;
};

const useModal = create<ModalState>((set) => ({
  type: null,
  isOpen: false,
  data: null,
  onOpen: (type, data) => set({ type, isOpen: true, data }),
  onClose: () => set({ type: null, isOpen: false, data: null }),
}));

export default useModal;
