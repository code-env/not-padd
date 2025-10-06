import { NextConfig } from "next";
import fs from "fs";
import path from "path";
import { defaultOptions, Options } from "@notpadd/core";

export { createNotpaddConfig } from "@notpadd/core";

const initaliazedState: Record<string, boolean> = {};

export function createNotpaddCollection(pluginOption: Options) {
  return async (
    nextConfig: Partial<NextConfig> | Promise<Partial<NextConfig>> = {}
  ): Promise<NextConfig> => {
    const resolvedConfig = (await Promise.resolve(nextConfig)) as NextConfig;
    const [command] = process.argv
      .slice(2)
      .filter((arg) => !arg.startsWith("-"));

    const configFilePath = path.resolve(process.cwd(), pluginOption.configPath);
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
      notpaddConfig = (await import(configFilePath)).notpadd;
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
      if (initaliazedState[pluginOption.configPath]) {
        return resolvedConfig;
      }
    }

    initaliazedState[pluginOption.configPath] = true;
    console.log("Notpadd config initialized");

    return resolvedConfig;
  };
}

export const withNotpadd = createNotpaddCollection(defaultOptions);
