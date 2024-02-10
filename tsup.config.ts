import { defineConfig } from "tsup";

export default defineConfig((options) => {
  return {
    entry: ["./src/**/solution.ts"],
    splitting: false,
    publicDir: "data",
    format: ["esm"],
    treeshake: true,
    outDir: "./dist",
    shims: true,
    clean: true,
    dts: false,
    bundle: true,
    loader: {
      ".txt": "text",
    },
    minify: !options.watch,
    platform: "node",
  };
});
