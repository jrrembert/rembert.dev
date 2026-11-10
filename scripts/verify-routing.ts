import { BOARD_APP_ASSET_PREFIX, TEST_APP_ASSET_PREFIX } from "../constants";

const [target, ...flags] = process.argv.slice(2);
if (!target) throw new Error("Usage: bun run verify:routing -- <origin> [--authenticated]");
const origin = new URL(target).origin;
const authenticated = flags.includes("--authenticated");
const headers: Record<string, string> = {};
if (authenticated) {
  const { hostname: host, protocol } = new URL(origin);
  if (protocol !== "https:") throw new Error("Authenticated checks require HTTPS");
  if (!/^rembert(?:dev)?-[a-z0-9-]+-joseph-remberts-projects\.vercel\.app$/.test(host)) {
    throw new Error("Authenticated checks are restricted to this gateway's Vercel previews");
  }
  if (!process.env.VERCEL_OIDC_TOKEN) throw new Error("Missing development OIDC identity");
  headers["x-vercel-trusted-oidc-idp-token"] = process.env.VERCEL_OIDC_TOKEN;
}

async function request(path: string, expected = 200) {
  const url = new URL(path, origin);
  if (url.origin !== origin) throw new Error("Refusing to send credentials outside the gateway origin");
  const response = await fetch(url, { headers, redirect: "manual" });
  if (response.status !== expected) throw new Error(`${path}: expected ${expected}, received ${response.status}`);
  console.log(`${response.status} ${path}`);
  return response;
}

async function pageAndAssets(path: string, prefix: string, expectedText: string) {
  const html = await (await request(path)).text();
  if (!html.includes(expectedText)) throw new Error(`${path}: expected page content missing`);
  const assets = [...new Set(
    [...html.matchAll(/(?:href|src)="([^\"]+)"/g)]
      .map((match) => match[1])
      .filter((asset) => asset.startsWith(`${prefix}/_next/`)),
  )];
  if (!assets.length) throw new Error(`${path}: expected child assets missing`);
  for (const asset of assets) await request(asset);
}

const home = await (await request("/")).text();
if (!home.includes("ryan-kicks-moose.svg")) throw new Error("Gateway homepage missing");
await pageAndAssets("/board/home", BOARD_APP_ASSET_PREFIX, "Personal Board");
await pageAndAssets("/test", TEST_APP_ASSET_PREFIX, "Hello from the test microfrontend!");
for (const path of ["/board/login", "/board/admin/login", "/board/privacy", "/board/terms", "/board/oauth-consent-logo.png"]) {
  await request(path);
}
for (const [path, login] of [
  ["/board", "/board/login"],
  ["/board/preferences", "/board/login"],
  ["/board/admin/subscribers", "/board/admin/login"],
]) {
  const response = await request(path, 307);
  const location = response.headers.get("location");
  const redirect = location ? new URL(location, origin) : null;
  if (!redirect || redirect.origin !== origin || redirect.pathname !== login) {
    throw new Error(`${path}: expected a same-origin login redirect`);
  }
}
const providers = await (await request("/board/api/auth/providers")).json();
if (!providers.google?.callbackUrl?.endsWith("/board/api/auth/callback/google")) {
  throw new Error("Google callback route changed");
}
const session = await (await request("/board/api/auth/session")).json();
if (Object.keys(session).length) throw new Error("Anonymous request unexpectedly received a session");
const csrf = await request("/board/api/auth/csrf");
if (!(await csrf.json()).csrfToken || !csrf.headers.has("set-cookie")) {
  throw new Error("CSRF token/cookie response missing");
}
for (const path of ["/admin/login", "/home", "/privacy", "/terms"]) await request(path, 404);
console.log("Routing smoke checks passed; no subscriber mutations or email requests were made.");
