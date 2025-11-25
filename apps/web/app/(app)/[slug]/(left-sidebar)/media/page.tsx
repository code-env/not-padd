import type { Metadata } from "next";

import { MediaSection } from "@/components/clients";
import { UploadMedia } from "@/components/modals/upload-media";

export const metadata: Metadata = {
  title: "Media",
  description: "nothing",
};

const MediaPage = () => {
  return (
    <div className="flex flex-col gap-10">
      <MediaSection />
      <UploadMedia />
    </div>
  );
};

export default MediaPage;
