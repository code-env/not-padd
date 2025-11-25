"use client";

import { useOrganizationContext } from "@/contexts";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/constants";
import { ORGANIZATION_QUERIES } from "@/lib/queries";
import {
  Dialog,
  DialogContent,
  DialogContentWrapper,
  DialogHeader,
  DialogMiniPadding,
  DialogTitle,
} from "@notpadd/ui/components/dialog";
import useModal from "@/hooks/use-modal";
import DropZone from "../dropzone";
import { Button } from "@notpadd/ui/components/button";
import { PlusIcon } from "lucide-react";

export const UploadMedia = () => {
  const { onOpen } = useModal();
  return (
    <Button
      size="icon"
      title="Upload Media"
      onClick={() => onOpen("upload-media")}
      className="fixed right-10 bottom-10"
    >
      <PlusIcon className="size-4" />
    </Button>
  );
};

export const UploadMediaModal = () => {
  const { type, onClose } = useModal();
  const { activeOrganization } = useOrganizationContext();
  const isModalOpen = type === "upload-media";
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Media</DialogTitle>
        </DialogHeader>
        <DialogMiniPadding>
          <DialogContentWrapper className="p-0 border-0">
            <DropZone
              type="mediaUploader"
              organizationId={activeOrganization?.id as string}
            />
          </DialogContentWrapper>
        </DialogMiniPadding>
      </DialogContent>
    </Dialog>
  );
};
