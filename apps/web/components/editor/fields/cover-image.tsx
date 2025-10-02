"use client";

import { useArticleContext, useOrganizationContext } from "@/contexts";
import useUploader from "@/hooks/use-uploader";
import { Input } from "@notpadd/ui/components/input";
import {
  Tabs,
  TabsContent,
  TabsContents,
  TabsList,
  TabsTrigger,
} from "@notpadd/ui/components/tabs";
import { Progress } from "@notpadd/ui/components/progress";
import { cn } from "@notpadd/ui/lib/utils";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import {
  generateClientDropzoneAccept,
  generatePermittedFileTypes,
} from "uploadthing/client";
import { useRouter } from "next/navigation";

export const CoverImage = () => {
  const {
    routeConfig,
    startUpload,
    isUploading,
    uploadProgress,
    url,
    imageBlurhash,
  } = useUploader("coverImageUploader");
  const router = useRouter();
  const { setArticle, articleId, article } = useArticleContext();
  const { activeOrganization } = useOrganizationContext();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const promise = startUpload([file], {
          organizationId: activeOrganization?.id as string,
          articleId: articleId as string,
        });
        toast.promise(promise, {
          loading: "Uploading image...",
          success: () => {
            if (url && article && imageBlurhash) {
              setArticle({
                ...article,
                image: url,
                imageBlurhash,
              });
            }
            return "Image uploaded successfully.";
          },
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

  return (
    <Tabs defaultValue="upload">
      <TabsList
        activeClassName="bg-muted/50"
        className="grid w-full grid-cols-2 p-0 border-b bg-transparent"
      >
        <TabsTrigger value="upload">Upload</TabsTrigger>
        <TabsTrigger value="url">Url</TabsTrigger>
      </TabsList>
      <TabsContents className=" h-full bg-muted/50 border border-dashed p-1">
        <TabsContent value="upload" className="relative">
          <div
            {...getRootProps()}
            className={cn("outline-none text-center p-4", {
              "bg-primary/5": isDragActive,
            })}
          >
            <input {...getInputProps()} disabled={isUploading} />
            <div className="flex items-center justify-center h-40 w-full">
              {isDragActive ? (
                <p>Drop the image here...</p>
              ) : (
                <p>Drag and drop an image here or click to upload</p>
              )}
            </div>
          </div>
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted p-4">
              {uploadProgress && (
                <div className="flex flex-col items-center gap-2 w-full">
                  <span>{uploadProgress}%</span>
                  <Progress value={uploadProgress} className="w-full" />
                </div>
              )}
            </div>
          )}
        </TabsContent>
        <TabsContent
          value="url"
          className="space-y-6 h-40 flex items-center justify-cente p-4"
        >
          <Input placeholder="Enter image URL" className="w-full" />
        </TabsContent>
      </TabsContents>
    </Tabs>
  );
};
