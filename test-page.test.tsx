import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

test("the test microfrontend renders a hello message", async () => {
  const { default: TestPage } = await import("./apps/test/app/test/page");

  expect(renderToStaticMarkup(<TestPage />)).toContain(
    "<h1>Hello from the test microfrontend!</h1>",
  );
});
