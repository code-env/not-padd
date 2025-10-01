"use client";

import { useConfirmationModal } from "@/hooks/use-confirmation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@notpadd/ui/components/dialog";
import { Button } from "@notpadd/ui/components/button";

export const ConfirmationModal = () => {
  const { onClose, type, open, title, description, confirmText } =
    useConfirmationModal();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogDescription>{description}</DialogDescription>
        <DialogFooter>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={onClose}>{confirmText}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
