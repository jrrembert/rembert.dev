import { describe, expect, test } from "bun:test";
import {
  getRewrittenUrl,
  unstable_getResponseFromNextConfig,
} from "next/experimental/testing/server";
import nextConfig from "./next.config";

describe("test child app routing", () => {
  for (const path of [
    "/test",
    "/test?proof=hello",
    "/test/nested",
    "/test-assets/_next/static/chunk.js",
  ]) {
    test(`proxies ${path} to the independently deployed child`, async () => {
      const response = await unstable_getResponseFromNextConfig({
        url: `https://rembert.dev${path}`,
        nextConfig,
      });

      expect(getRewrittenUrl(response)).toBe(
        `https://rembert-test.vercel.app${path}`,
      );
    });
  }

  test("supports an origin override without changing unrelated routes", async () => {
    const previousOrigin = process.env.TEST_APP_ORIGIN;
    process.env.TEST_APP_ORIGIN = "https://child-preview.vercel.app";
    try {
      const response = await unstable_getResponseFromNextConfig({
        url: "http://localhost:3000/test",
        nextConfig,
      });
      expect(getRewrittenUrl(response)).toBe("https://child-preview.vercel.app/test");

      for (const path of ["/", "/testing", "/test-assets-other"]) {
        const unrelated = await unstable_getResponseFromNextConfig({
          url: `http://localhost:3000${path}`,
          nextConfig,
        });
        expect(getRewrittenUrl(unrelated)).toBeNull();
      }
    } finally {
      if (previousOrigin === undefined) delete process.env.TEST_APP_ORIGIN;
      else process.env.TEST_APP_ORIGIN = previousOrigin;
    }
  });
});
