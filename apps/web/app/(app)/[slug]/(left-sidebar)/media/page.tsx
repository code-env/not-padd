import type { Metadata } from "next";

import { MediaSection } from "@/components/clients";

export const metadata: Metadata = {
  title: "Media",
  description: "nothing",
};

const MediaPage = () => {
  return <MediaSection />;
};

export default MediaPage;
