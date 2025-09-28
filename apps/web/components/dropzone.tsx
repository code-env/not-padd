"use client";

import type { ClipboardEvent } from "react";
import { useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
  generateClientDropzoneAccept,
  generatePermittedFileTypes,
} from "uploadthing/client";

import useUploader, { type EndPoint } from "@/hooks/use-uploader";
import { Icons } from "@notpadd/ui/components/icons";
import { cn } from "@notpadd/ui/lib/utils";
import { Loader, Upload } from "lucide-react";
import Image from "next/image";

interface DropZoneProps {
  organizationId: string;
  type: EndPoint;
}

const DropZone = ({ organizationId, type }: DropZoneProps) => {
  const { routeConfig, startUpload, isUploading, uploadProgress } =
    useUploader(type);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        startUpload([file], {
          organizationId,
          size: file.size,
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

  const onPaste = (e: ClipboardEvent) => {
    if (e.clipboardData && e.clipboardData.items) {
      const files = Array.from(e.clipboardData.items)
        .filter((item) => item.kind === "file")
        .map((item) => item.getAsFile())
        .filter((file): file is File => file !== null);
      const file = files[0];
      if (file) {
        startUpload([file], {
          organizationId,
          size: file.size,
        });
      }
    }
  };

  useEffect(() => {
    const handlePaste = (e: Event) => {
      const clipboardEvent = e as unknown as ClipboardEvent;
      onPaste(clipboardEvent);
    };

    window.addEventListener("paste", handlePaste);
    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, []);

  return (
    <div
      {...getRootProps()}
      className={cn(
        "transition-all duration-200 border-2 border-dashed border-primary/50 aspect-video rounded-lg p-4 relative overflow-hidden group",
        {
          "bg-primary/5 p-2": isDragActive,
        }
      )}
    >
      <input {...getInputProps()} />

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
