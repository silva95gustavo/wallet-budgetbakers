import { build } from "esbuild";
import { execSync } from "child_process";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { dependencies, peerDependencies } = require("./package.json");

build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  minify: true,
  external: Object.keys(dependencies ?? {}).concat(
    Object.keys(peerDependencies ?? {})
  ),
  platform: "node",
  outfile: "dist/index.js",
  format: "cjs",
  plugins: [
    {
      name: "TypeScriptDeclarationsPlugin",
      setup(build) {
        build.onEnd((result) => {
          if (result.errors.length > 0) return;
          execSync("tsc", ["--emitDeclarationOnly"]);
        });
      },
    },
  ],
});
