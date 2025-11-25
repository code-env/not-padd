"use client";

import { MediaLoadingUI } from "@/components/loading-uis";
import { useOrganizationContext } from "@/contexts";
import { QUERY_KEYS } from "@/lib/constants";
import { MEDIA_QUERIES } from "@/lib/queries";
import { formatSize } from "@/lib/utils";
import type { File as Media } from "@notpadd/db/types";
import { Button } from "@notpadd/ui/components/button";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { DownloadIcon, Loader } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export const MediaSection = () => {
  const { activeOrganization } = useOrganizationContext();
  const queries = {
    page: 1,
    limit: 10,
    search: "",
  };

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: [QUERY_KEYS.MEDIA, activeOrganization?.id],
    queryFn: () =>
      MEDIA_QUERIES.getMedia(activeOrganization?.id as string, { ...queries }),
  });

  if (isLoading) {
    return <MediaLoadingUI count={12} />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {response?.data.map((media) => (
        <MediaItem key={media.id} media={media} />
      ))}
    </div>
  );
};

const MediaItem = ({ media }: { media: Media }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const downloadMedia = async () => {
    try {
      setIsDownloading(true);
      const response = await fetch(media.url, { mode: "cors" });
      if (!response.ok) throw new Error("Network response was not ok");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = media.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to download file.");
    } finally {
      setIsDownloading(false);
    }
  };
  return (
    <div className="flex flex-col border">
      <div className="p-1">
        <div className="h-44 w-full relative">
          <Image
            src={media.url}
            alt={media.name}
            fill
            className="object-cover"
          />
        </div>
      </div>
      <div className="bg-sidebar p-2 flex items-center justify-between gap-2">
        <div className="flex flex-col gap-2 flex-1 max-w-[80%]">
          <p className="text-sm font-medium truncate">{media.name}</p>
          <div className="flex items-center gap-2 ">
            <p className="text-sm">{format(media.createdAt, "MMM d, yyyy")}</p>
            <div className="h-4 w-px bg-border" />
            <p className="text-sm">{formatSize(media.size)}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={downloadMedia}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <Loader className="size-4 animate-spin" />
          ) : (
            <DownloadIcon className="size-4" />
          )}
        </Button>
      </div>
    </div>
  );
};
