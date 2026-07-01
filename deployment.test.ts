import { describe, expect, test } from "bun:test";
import { readFile } from "node:fs/promises";

type VercelConfig = {
  buildCommand?: string | null;
  framework?: string | null;
  installCommand?: string | null;
};

type PackageJson = {
  dependencies?: Record<string, string>;
};

describe("Vercel deployment", () => {
  test("uses the Next.js framework preset instead of a Node server entrypoint", async () => {
    const config = (await Bun.file("vercel.json").json()) as VercelConfig;

    expect(config.framework).toBe("nextjs");
    expect(config.buildCommand).toBe("bun run build");
    expect(config.installCommand).toBe("bun install");
  });

  test("wires the Next.js app into Vercel microfrontends", async () => {
    const packageJson = (await Bun.file("package.json").json()) as PackageJson;
    const nextConfig = await readFile("next.config.ts", "utf8");

    expect(packageJson.dependencies).toHaveProperty("@vercel/microfrontends");
    expect(nextConfig).toContain("@vercel/microfrontends/next/config");
    expect(nextConfig).toContain("withMicrofrontends");
  });
});
