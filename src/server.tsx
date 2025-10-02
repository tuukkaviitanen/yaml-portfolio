import { renderToReadableStream } from "react-dom/server";
import App from "./App";
import cache from "./utils/cache";
import { getConfiguration } from "./utils/configuration";
import { CONFIG_FILE_PATH, NODE_ENV, PORT, VERSION } from "./utils/env";
import type { PopulatedConfiguration } from "./utils/types";

const isDevelopment = NODE_ENV === "development";

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
  await Bun.file("./dist/styles.css").arrayBuffer(),
);
const compressedClient = Bun.gzipSync(
  await Bun.file("./dist/client.js").arrayBuffer(),
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
            configuration,
          )}`,
          bootstrapScripts: ["/client.js"],
        },
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
    "/health": async () => {
      return new Response(
        JSON.stringify({
          version: VERSION,
          redis_connection: (await cache.checkConnection())
            ? "HEALTHY"
            : "UNHEALTHY",
        }),
        { status: 200 },
      );
    },
  },
});
