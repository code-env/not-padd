import fs from "fs";
import path from "path";
import jiti from "jiti";
import { defaultOptions, Options } from "@notpadd/core";

export { createNotpaddConfig } from "@notpadd/core";

const initaliazedState: Record<string, boolean> = {};

function createNotpaddCollection(pluginOptions: Options) {
  return async <
    TConfig extends Record<string, unknown> = Record<string, unknown>,
  >(
    nextConfig: TConfig | Promise<TConfig> = {} as TConfig
  ): Promise<TConfig> => {
    const resolvedConfig = await Promise.resolve(nextConfig);
    const [command] = process.argv
      .slice(2)
      .filter((arg) => !arg.startsWith("-"));

    const configFilePath = path.resolve(
      process.cwd(),
      pluginOptions.configPath
    );
    const configExist = fs.existsSync(configFilePath);

    if (!configExist) {
      if (command === "dev") {
        console.warn(`${configFilePath} does not exist. Please create it.`);
      } else if (command === "build") {
        console.warn(`${configFilePath} does not exist. Please create it.`);
        process.exit(1);
      }
    }

    let notpaddConfig: any;
    try {
      const load = jiti(process.cwd(), { cache: false });
      const mod = load(configFilePath);
      notpaddConfig = mod?.notpadd;
      if (typeof notpaddConfig !== "function") {
        throw new Error(
          "The exported value from notpadd.config.ts must be a function named 'notpadd'."
        );
      }
    } catch (error: any) {
      console.error("Failed to load notpadd.config.ts:", error.message);
      process.exit(1);
      return resolvedConfig;
    }
    await notpaddConfig();

    if (command === "dev" || command === "build") {
      if (initaliazedState[pluginOptions.configPath]) {
        return resolvedConfig;
      }
    }

    initaliazedState[pluginOptions.configPath] = true;
    console.log("Notpadd config initialized");

    return resolvedConfig;
  };
}

export const withNotpadd = createNotpaddCollection(defaultOptions);
