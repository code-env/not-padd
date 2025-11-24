/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "wqjxt2y032.ufs.sh",
        protocol: "https",
        pathname: "/f/*",
      },
      {
        hostname: "avatars.githubusercontent.com",
        protocol: "https",
        pathname: "/*",
      },
      {
        hostname: "api.dicebear.com",
        protocol: "https",
        pathname: "/*",
      },
    ],
  },
};

// export default withNotpadd(nextConfig);
export default nextConfig;
