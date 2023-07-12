import { defineConfig, Options } from "tsup";

export default defineConfig((options: Options) => ({
  treeshake: false,
  splitting: false,
  entry: ["src/**/*.tsx"],
  format: ["esm"],
  dts: true,
  minify: false,
  clean: true,
  external: ["react"],
  ...options,
}));
