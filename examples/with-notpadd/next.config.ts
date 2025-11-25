import { withNotpadd } from "notpadd";
import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname, "../.."),
  },
};

export default withNotpadd(nextConfig);
