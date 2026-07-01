import { describe, expect, test } from "bun:test";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { HOME_IMAGE_ALT, HOME_IMAGE_PATH } from "./constants";

describe("home page", () => {
  test("renders the moose-kick image from the Next.js app page", async () => {
    const page = await readFile("app/page.tsx", "utf8");
    const styles = await readFile("app/page.module.css", "utf8");

    expect(page).toContain("next/image");
    expect(page).toContain("src={HOME_IMAGE_PATH}");
    expect(page).toContain("alt={HOME_IMAGE_ALT}");
    expect(page).toContain("width={99}");
    expect(page).toContain("height={97}");
    expect(styles).toContain("display: flex");
    expect(styles).toContain("align-items: center");
    expect(styles).toContain("justify-content: center");
    expect(styles).toContain("min-height: 100vh");
  });

  test("serves the home image from Next.js public assets", () => {
    expect(HOME_IMAGE_PATH).toBe("/ryan-kicks-moose.svg");
    expect(HOME_IMAGE_ALT).toBe("Ryan kicks moose");
    expect(existsSync(`public${HOME_IMAGE_PATH}`)).toBe(true);
  });
});
