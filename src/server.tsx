import { renderToReadableStream } from "react-dom/server";
import App from "./App";
import { getConfiguration } from "./utils/configuration";
import type { PopulatedConfiguration } from "./utils/types";

const PORT = Bun.env.PORT || 3000;
const CONFIG_FILE_PATH = Bun.env.CONFIG_FILE_PATH || "./portfolio.yaml";

const isDevelopment = Bun.env.NODE_ENV === "development";

if (isDevelopment) {
  console.info("Building client bundles...");

  await Bun.build({
    entrypoints: ["./src/client.tsx"],
    outdir: "./dist",
    minify: true,
    sourcemap: "inline",
  });

  Bun.spawnSync(["bun", "run", "compile-styles"]);

  console.info("Client bundles built successfully");
}

const compressedStyles = Bun.gzipSync(
  await Bun.file("./dist/styles.css").arrayBuffer()
);
const compressedClient = Bun.gzipSync(
  await Bun.file("./dist/client.js").arrayBuffer()
);

console.info(`Listening on port ${PORT}`);

Bun.serve({
  port: PORT,
  development: isDevelopment,
  routes: {
    "/": async () => {
      let configuration: PopulatedConfiguration;
      try {
        configuration = await getConfiguration(CONFIG_FILE_PATH);
      } catch {
        return new Response("Internal Configuration Error", { status: 500 });
      }
      const stream = await renderToReadableStream(
        <App configuration={configuration} />,
        {
          bootstrapScriptContent: `window.configuration = ${JSON.stringify(
            configuration
          )}`,
          bootstrapScripts: ["/client.js"],
        }
      );
      return new Response(stream, {
        headers: { "Content-Type": "text/html" },
      });
    },
    "/styles.css": () => {
      return new Response(compressedStyles, {
        headers: { "Content-Type": "text/css", "Content-Encoding": "gzip" },
      });
    },
    "/client.js": async () => {
      return new Response(compressedClient, {
        headers: {
          "Content-Type": "application/javascript",
          "Content-Encoding": "gzip",
        },
      });
    },
  },
});
