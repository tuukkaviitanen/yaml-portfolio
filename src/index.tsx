import { renderToReadableStream } from "react-dom/server";
import App from "./App";

const port = Bun.env.PORT || 3000;

Bun.serve({
  port,
  async fetch() {
    const stream = await renderToReadableStream(
      <App />,
    );
    return new Response(stream, {
      headers: { "Content-Type": "text/html" },
    });
  },
});