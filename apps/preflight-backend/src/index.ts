/**
 * index — listen on env.PORT.
 * Why: backend dev entry for turbo dev.
 */
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config({
  path: path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../../../.env",
  ),
});

const { env } = await import("./config/env.js");
const { createApp } = await import("./app.js");

const app = createApp();

app.listen(env.PORT, () => {
  console.log(`preflight-backend listening on ${env.PORT}`);
});
