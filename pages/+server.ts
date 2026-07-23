import { renderPage } from "vike/server";
import { app } from "../server/api";

export default {
  fetch: async (request: Request) => {
    const url = new URL(request.url);

    // API routes → Hono
    if (url.pathname.startsWith("/api")) {
      return app.fetch(request);
    }

    // Page routes → Vike SSR
    const pageContextInit = {
      urlOriginal: request.url,
      headersOriginal: request.headers,
    };
    const pageContext = await renderPage(pageContextInit);
    const { httpResponse } = pageContext;
    if (httpResponse) {
      const { body, statusCode, headers } = httpResponse;
      return new Response(body, {
        status: statusCode,
        headers: new Headers(headers),
      });
    }
    return new Response("Not Found", { status: 404 });
  },
};
