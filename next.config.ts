import type { NextConfig } from "next";
import {
  BOARD_APP_ASSET_PREFIX,
  BOARD_APP_ORIGIN,
  TEST_APP_ASSET_PREFIX,
  TEST_APP_ORIGIN,
} from "./constants";

const nextConfig: NextConfig = {
  async rewrites() {
    const origin = process.env.TEST_APP_ORIGIN ?? TEST_APP_ORIGIN;
    const boardOrigin = process.env.BOARD_APP_ORIGIN ?? BOARD_APP_ORIGIN;
    return [
      { source: "/board", destination: `${boardOrigin}/board` },
      { source: "/board/:path+", destination: `${boardOrigin}/board/:path+` },
      {
        source: `${BOARD_APP_ASSET_PREFIX}/:path+`,
        destination: `${boardOrigin}${BOARD_APP_ASSET_PREFIX}/:path+`,
      },
      { source: "/test", destination: `${origin}/test` },
      { source: "/test/:path+", destination: `${origin}/test/:path+` },
      {
        source: `${TEST_APP_ASSET_PREFIX}/:path+`,
        destination: `${origin}${TEST_APP_ASSET_PREFIX}/:path+`,
      },
    ];
  },
};

export default nextConfig;
