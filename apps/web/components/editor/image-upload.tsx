"use client";

import useUploader from "@/hooks/use-uploader";
import { createImageUpload } from "novel/plugins";
import { toast } from "sonner";
import { useOrganizationContext } from "@/contexts";

export const useUploadFn = () => {
  const { activeOrganization } = useOrganizationContext();
  const { startUpload } = useUploader("mediaUploader");

  const onUpload = (file: File) => {
    const promise = startUpload([file], {
      organizationId: activeOrganization?.id as string,
      size: file.size,
    });

    return new Promise((resolve, reject) => {
      toast.promise(
        promise.then(async (data) => {
          if (data && data.length > 0) {
            const res = data[0]?.serverData;
            const image = new Image();
            image.src = res?.url as string;
            image.onload = () => {
              resolve(res);
            };
          }
        }),
        {
          loading: "Uploading image...",
          success: "Image uploaded successfully.",
          error: (e) => {
            reject(e);
            return e.message;
          },
        }
      );
    });
  };

  return createImageUpload({
    onUpload,
    validateFn: (file) => {
      if (!file.type.includes("image/")) {
        toast.error("File type not supported.");
        return false;
      }
      if (file.size / 1024 / 1024 > 20) {
        toast.error("File size too big (max 20MB).");
        return false;
      }
      return true;
    },
  });
};
