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
import { DownloadIcon } from "lucide-react";
import Image from "next/image";

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
    return <MediaLoadingUI count={10} />;
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
  return (
    <div className="flex flex-col border">
      <div className="p-1">
        <div className="h-72 w-full relative">
          <Image
            src={media.url}
            alt={media.name}
            fill
            className="object-cover"
          />
        </div>
      </div>
      <div className="bg-sidebar p-2 flex items-center justify-between gap-2">
        <div className="flex flex-col gap-2 flex-1">
          <p className="text-sm font-medium truncate max-w-[250px]">
            {media.name}
          </p>
          <div className="flex items-center gap-2 ">
            <p className="text-sm">{format(media.createdAt, "MMM d, yyyy")}</p>
            <div className="h-4 w-px bg-border" />
            <p className="text-sm">{formatSize(media.size)}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <DownloadIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
};
