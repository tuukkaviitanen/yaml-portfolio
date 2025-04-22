import { renderToReadableStream } from "react-dom/server";
import App from "./App";
import {
  getConfiguration,
  type PopulatedConfiguration,
} from "./utils/configuration";

const PORT = Bun.env.PORT || 3000;
const CONFIG_FILE_PATH = Bun.env.CONFIG_FILE_PATH || "./portfolio.yaml";

console.info(`Listening on port ${PORT}`);

Bun.serve({
  port: PORT,
  routes: {
    "/": async () => {
      let configuration: PopulatedConfiguration;
      try {
        configuration = await getConfiguration(CONFIG_FILE_PATH);
      } catch (error) {
        return new Response("Internal Configuration Error", { status: 500 });
      }
      const stream = await renderToReadableStream(
        <App configuration={configuration} />
      );
      return new Response(stream, {
        headers: { "Content-Type": "text/html" },
      });
    },
  },
});
