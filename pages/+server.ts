import { renderPage } from "vike/server";

export default {
  fetch: async (request: Request) => {
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
