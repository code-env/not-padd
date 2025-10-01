"use client";

import { useCallback } from "react";
import { toast } from "sonner";

const toastConfirmIds = new Map<string, boolean>();

export function useToast() {
  const showToast = useCallback(
    (message: string, params?: { key?: string; duration?: number }) => {
      const toastKey = `toast-${btoa(`${params?.key ?? ""}-${message}`).slice(
        0,
        16
      )}`;

      if (toastConfirmIds.has(toastKey)) {
        document
          .querySelector(`.${toastKey}`)
          ?.animate(
            [
              { transform: "scale(1)" },
              { transform: "scale(0.95)" },
              { transform: "scale(1.02)" },
              { transform: "scale(1)" },
            ],
            { duration: 1000, easing: "ease-in-out" }
          );
        return;
      }

      toastConfirmIds.set(toastKey, true);
      toast(message, {
        className: toastKey,
        duration: params?.duration,
        onDismiss: () => {
          toastConfirmIds.delete(toastKey);
        },
      });
    },
    []
  );

  return { toast: showToast };
}
