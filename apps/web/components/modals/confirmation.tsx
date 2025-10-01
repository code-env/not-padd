"use client";

import { useConfirmationModal } from "@/hooks/use-confirmation";
import { Button } from "@notpadd/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogContentWrapper,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogMiniPadding,
  DialogTitle,
} from "@notpadd/ui/components/dialog";
import { Input } from "@notpadd/ui/components/input";
import { LoadingButton } from "@notpadd/ui/components/loading-button";
import { ArrowRight } from "lucide-react";

export const ConfirmationModal = () => {
  const {
    onClose,
    onConfirm,
    open,
    title,
    confirmText,
    canProceed,
    inputValue,
    setInputValue,
    confirmTextValue,
    isLoading,
  } = useConfirmationModal();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent showCloseButton>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogMiniPadding>
          <DialogContentWrapper>
            <DialogDescription className="text-xs">
              To confirm this action, type the following just above the input
            </DialogDescription>
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-2 text-muted-foreground">
                <ArrowRight className="size-4 " />{" "}
                <span className="text-sm select-none">{confirmTextValue}</span>
              </span>
              <Input
                placeholder="Type here to confirm..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>

            <DialogFooter>
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <LoadingButton
                onClick={onConfirm}
                disabled={!canProceed}
                loading={isLoading}
              >
                {confirmText}
              </LoadingButton>
            </DialogFooter>
          </DialogContentWrapper>
        </DialogMiniPadding>
      </DialogContent>
    </Dialog>
  );
};
