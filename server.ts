import { DEFAULT_PORT, HOME_IMAGE_PATH } from "./constants";

const port = Number(process.env.PORT ?? DEFAULT_PORT);

const server = Bun.serve({
  port,
  fetch(request) {
    const { pathname } = new URL(request.url);

    if (pathname === "/" || pathname === "/index.html") {
      return new Response(Bun.file("index.html"), {
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }

    if (pathname === HOME_IMAGE_PATH) {
      return new Response(Bun.file("ryan-kicks-moose.svg"), {
        headers: { "content-type": "image/svg+xml" },
      });
    }

    return new Response("Not found", { status: 404 });
  },
});

console.log(`rembert.dev listening on http://localhost:${server.port}`);
