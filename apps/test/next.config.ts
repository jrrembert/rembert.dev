import type { NextConfig } from "next";
import { TEST_APP_ASSET_PREFIX } from "../../constants";

const nextConfig: NextConfig = {
  assetPrefix: TEST_APP_ASSET_PREFIX,
};

export default nextConfig;
