import { describe, expect, test } from "bun:test";
import {
  getRewrittenUrl,
  unstable_getResponseFromNextConfig,
} from "next/experimental/testing/server";
import nextConfig from "./next.config";

describe("board zone routing", () => {
  for (const path of [
    "/board",
    "/board/home",
    "/board/login?sent=1",
    "/board/preferences",
    "/board/api/auth/callback/google?code=fixture&state=fixture",
    "/board/unsubscribe/fixture/one-click",
    "/board/oauth-consent-logo.png",
    "/vc-ap-e198da/_next/static/chunks/board.js",
  ]) {
    test(`forwards ${path} to personal-board`, async () => {
      const response = await unstable_getResponseFromNextConfig({
        url: `https://www.rembert.dev${path}`,
        nextConfig,
      });
      expect(getRewrittenUrl(response)).toBe(
        `https://personal-board-eight.vercel.app${path}`,
      );
    });
  }

  test("supports a separate board origin without intercepting other apps", async () => {
    const previous = process.env.BOARD_APP_ORIGIN;
    process.env.BOARD_APP_ORIGIN = "https://board-preview.example.com";
    try {
      const response = await unstable_getResponseFromNextConfig({
        url: "https://www.rembert.dev/board/login",
        nextConfig,
      });
      expect(getRewrittenUrl(response)).toBe("https://board-preview.example.com/board/login");
      for (const path of ["/", "/boardroom", "/vc-ap-e198da-other"]) {
        const unrelated = await unstable_getResponseFromNextConfig({
          url: `https://www.rembert.dev${path}`,
          nextConfig,
        });
        expect(getRewrittenUrl(unrelated)).toBeNull();
      }
    } finally {
      if (previous === undefined) delete process.env.BOARD_APP_ORIGIN;
      else process.env.BOARD_APP_ORIGIN = previous;
    }
  });
});
