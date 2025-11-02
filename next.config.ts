import { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // allow Supabase storage host as a remote image source
    // domains: ["qqchawvrepircjjrcmcl.supabase.co"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "qqchawvrepircjjrcmcl.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
