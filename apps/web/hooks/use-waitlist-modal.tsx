import { create } from "zustand";

type ModalState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

const useWaitlistModal = create<ModalState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useWaitlistModal;
