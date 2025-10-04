import { useOrganizationContext } from "@/contexts";
import useModal from "@/hooks/use-modal";
import {
  Dialog,
  DialogContent,
  DialogContentWrapper,
  DialogHeader,
  DialogMiniPadding,
  DialogTitle,
} from "@notpadd/ui/components/dialog";
import DropZone from "../dropzone";

const UploadImage = () => {
  const { type, onClose } = useModal();
  const { activeOrganization } = useOrganizationContext();

  const isModalOpen = type === "upload-image";

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader className="hidden">
          <DialogTitle>Upload Image</DialogTitle>
        </DialogHeader>
        <DialogMiniPadding>
          <DialogContentWrapper className="p-0">
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

export default UploadImage;
