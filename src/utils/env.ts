export const PORT = Number(Bun.env.PORT) || 3000;
export const GITHUB_TOKEN = Bun.env.GITHUB_TOKEN;
export const REDIS_URL = Bun.env.REDIS_URL;
export const NODE_ENV = Bun.env.NODE_ENV;
export const CONFIG_FILE_PATH = Bun.env.CONFIG_FILE_PATH || "./portfolio.yaml";
export const VERSION = Bun.env.VERSION ?? "DEVELOPMENT";
