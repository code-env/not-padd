/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "wqjxt2y032.ufs.sh",
        protocol: "https",
        pathname: "/f/*",
      },
    ],
  },
};

// export default withNotpadd(nextConfig);
export default nextConfig;
