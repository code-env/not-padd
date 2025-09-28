"use client";

import type { ClipboardEvent } from "react";
import { useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
  generateClientDropzoneAccept,
  generatePermittedFileTypes,
} from "uploadthing/client";

import useUploader, { type EndPoint } from "@/hooks/use-uploader";
import { cn } from "@notpadd/ui/lib/utils";
import { Loader, Upload } from "lucide-react";
import useModal from "@/hooks/use-modal";
import { toast } from "sonner";
import { useEditor } from "novel";

interface DropZoneProps {
  organizationId: string;
  type: EndPoint;
}

const DropZone = ({ organizationId, type }: DropZoneProps) => {
  const { routeConfig, startUpload, isUploading, uploadProgress, url } =
    useUploader(type);

  const { onClose, type: modalType, isOpen } = useModal();

  const { editor } = useEditor();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const promise = startUpload([file], {
          organizationId,
          size: file.size,
        });
        toast.promise(promise, {
          loading: "Uploading image...",
          success: "Image uploaded successfully.",
          error: "Error uploading image.",
        });
      }
    },
    [startUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: generateClientDropzoneAccept(
      generatePermittedFileTypes(routeConfig).fileTypes
    ),
  });

  useEffect(() => {
    if (editor && url) {
      editor
        ?.chain()
        .focus()
        .setImage({ src: url as string })
        .createParagraphNear()
        .run();

      if (isOpen && modalType === "upload-image") {
        onClose();
      }
    }
  }, [editor, url]);

  return (
    <div
      {...getRootProps()}
      className={cn(
        "transition-all duration-200 border-2 border-dashed border-primary/50 aspect-video rounded-lg p-4 relative overflow-hidden group outline-none!",
        {
          "bg-primary/5 p-2": isDragActive,
        }
      )}
    >
      <input {...getInputProps()} className="outline-none!" />

      <div className="absolute inset-0 flex items-center justify-center flex-col gap-2">
        <div className="flex items-center justify-center size-10 bg-primary rounded-md text-primary-foreground">
          <Upload className="size-6" />
        </div>
        <span className="text-sm">
          Drag and drop to replace or copy & paste image
        </span>
      </div>

      {isUploading && (
        <div className="absolute inset-0 flex items-center justify-center z-20 aspect-video bg-background flex-col gap-2">
          <Loader className="size-14 animate-spin" />
          <span className="text-sm"> {uploadProgress} % Uploaded</span>
        </div>
      )}
    </div>
  );
};

export default DropZone;
