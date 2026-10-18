import { withMicrofrontends } from "@vercel/microfrontends/next/config";
import type { NextConfig } from "next";
import { TEST_APP_ASSET_PREFIX, TEST_APP_ORIGIN } from "./constants";

const nextConfig: NextConfig = {
  async rewrites() {
    const origin = process.env.TEST_APP_ORIGIN ?? TEST_APP_ORIGIN;
    return [
      { source: "/test", destination: `${origin}/test` },
      { source: "/test/:path+", destination: `${origin}/test/:path+` },
      {
        source: `${TEST_APP_ASSET_PREFIX}/:path+`,
        destination: `${origin}${TEST_APP_ASSET_PREFIX}/:path+`,
      },
    ];
  },
};

export default withMicrofrontends(nextConfig);
