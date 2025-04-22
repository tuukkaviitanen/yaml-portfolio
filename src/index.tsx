import { renderToReadableStream } from "react-dom/server";
import App from "./App";
import { getConfiguration, type Configuration } from "./utils/configuration";

const PORT = Bun.env.PORT || 3000;
const CONFIG_FILE_PATH = Bun.env.CONFIG_FILE_PATH || "./portfolio.yaml";

Bun.serve({
  port: PORT,
  routes: {
    "/": async () => {
      let configuration: Configuration
      try{
        configuration = await getConfiguration(CONFIG_FILE_PATH);
      } catch (error) {
        return new Response("Internal Configuration Error", { status: 500 });
      }
      const stream = await renderToReadableStream(
        <App configuration={configuration} />,
      );
      return new Response(stream, {
        headers: { "Content-Type": "text/html" },
      });
    },
  },
});