import path from "node:path";
import { fileURLToPath } from "node:url";

const configDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(configDir, "../..");

const nextConfig = {
  outputFileTracingRoot: projectRoot,
  typedRoutes: true
};

export default nextConfig;
