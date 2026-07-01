import { describe, expect, test } from "bun:test";
import { HOME_IMAGE_ALT, HOME_IMAGE_PATH } from "./constants";

describe("home page", () => {
  test("renders the moose-kick image centered on the page", async () => {
    const html = await Bun.file("index.html").text();

    expect(html).toContain(`src="${HOME_IMAGE_PATH}"`);
    expect(html).toContain(`alt="${HOME_IMAGE_ALT}"`);
    expect(html).toContain("display: flex");
    expect(html).toContain("align-items: center");
    expect(html).toContain("justify-content: center");
    expect(html).toContain("min-height: 100vh");
  });
});
