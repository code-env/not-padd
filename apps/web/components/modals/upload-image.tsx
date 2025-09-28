import { useOrganizationContext } from "@/contexts";
import useModal from "@/hooks/use-modal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
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
        <DropZone
          type="mediaUploader"
          organizationId={activeOrganization?.id as string}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UploadImage;
