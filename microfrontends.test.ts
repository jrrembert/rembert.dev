import { describe, expect, test } from "bun:test";
import { validateRouting } from "@vercel/microfrontends/next/testing";

type MicrofrontendsConfig = {
  applications: Record<
    string,
    {
      routing?: Array<{ paths: string[] }>;
      development?: {
        fallback?: string;
        local?: number | string;
        task?: string;
      };
    }
  >;
};

describe("microfrontends routing", () => {
  test("uses rembert.dev as the default app and routes board paths to personal-board", async () => {
    const config = (await Bun.file(
      "microfrontends.json",
    ).json()) as MicrofrontendsConfig;

    expect(Object.keys(config.applications)).toEqual([
      "rembert.dev",
      "personal-board",
    ]);

    expect(config.applications["rembert.dev"].routing).toBeUndefined();
    expect(config.applications["rembert.dev"].development).toMatchObject({
      fallback: "rembert.dev",
      local: 3000,
      task: "dev",
    });

    expect(config.applications["personal-board"].routing).toEqual([
      {
        paths: ["/board/:path*"],
      },
    ]);
    expect(config.applications["personal-board"].development).toMatchObject({
      fallback: "personal-board.vercel.app",
    });

    expect(() =>
      validateRouting("microfrontends.json", {
        "rembert.dev": ["/"],
        "personal-board": ["/board", "/board/settings"],
      }),
    ).not.toThrow();
  });
});
