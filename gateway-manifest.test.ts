import { expect, test } from "bun:test";

test("the cutover manifest sends every child path through the gateway", async () => {
  const config = await Bun.file("microfrontends.json").json();
  expect(Object.keys(config.applications)).toEqual(["rembert.dev"]);
  expect(config.applications["rembert.dev"].routing).toBeUndefined();
});
