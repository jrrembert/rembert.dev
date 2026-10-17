import { expect, test } from "bun:test";

test("Dependabot's npm metadata matches the packages installed by Bun", async () => {
  const bunLock = Bun.JSONC.parse(await Bun.file("bun.lock").text()) as {
    packages: Record<string, [string, ...unknown[]]>;
  };
  const npmLock = (await Bun.file("package-lock.json").json()) as {
    packages: Record<string, { version?: string }>;
  };

  const bunPackages = new Set(
    Object.values(bunLock.packages).map(([nameAndVersion]) => nameAndVersion),
  );
  const npmPackages = new Set(
    Object.entries(npmLock.packages)
      .filter(([path]) => path.includes("node_modules/"))
      .map(([path, { version }]) => {
        const name = path.split("node_modules/").at(-1);
        return `${name}@${version}`;
      }),
  );

  expect([...npmPackages].sort()).toEqual([...bunPackages].sort());
});
