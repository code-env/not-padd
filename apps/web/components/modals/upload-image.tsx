import useModal from "@/hooks/use-modal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@notpadd/ui/components/dialog";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  TabsContents,
} from "@notpadd/ui/components/tabs";

const UploadImage = () => {
  const { type, onClose } = useModal();

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
        <Tabs defaultValue="account">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContents className="mx-1 mb-1 -mt-2 rounded-sm h-full bg-background">
            <TabsContent value="account" className="space-y-6 p-6">
              <p className="text-sm text-muted-foreground">
                Make changes to your account here. Click save when you&apos;re
                done.
              </p>
            </TabsContent>
            <TabsContent value="password" className="space-y-6 p-6">
              <p className="text-sm text-muted-foreground">
                Change your password here. After saving, you&apos;ll be logged
                out.
              </p>
            </TabsContent>
          </TabsContents>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default UploadImage;
