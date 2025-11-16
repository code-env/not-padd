import { configureLogging } from "notpadd-integrations";
import { NextConfig } from "next";

type Options = {
  configPath: string;
};

const defaultOptions: Options = {
  configPath: "content-collections.ts",
};

const initializedState: Record<string, boolean> = {};

type NextConfigInput =
  | NextConfig
  | Promise<NextConfig>
  | ((
      phase: string,
      defaults: { defaultConfig: NextConfig }
    ) => NextConfig | Promise<NextConfig>);

export function createNotpaddCollection(pluginOptions: Options) {
  const [command] = process.argv.slice(2).filter((arg) => !arg.startsWith("-"));

  const isTypegen = command === "typegen";

  const isBuild = command === "build";

  const isDev =
    typeof command === "undefined" && process.env.NODE_ENV === "development";

  return async function withNotpaddCollections(
    nextConfig: NextConfigInput = {}
  ): Promise<NextConfig> {
    if (isBuild || isDev || isTypegen) {
      const shouldInitialize = !(isDev && process.ppid === 1);

      if (shouldInitialize) {
        const key = pluginOptions.configPath;
        if (!initializedState[key]) {
          initializedState[key] = true;

          const { createBuilder } = await import("notpadd-core");
          console.log("Starting content-collections", key);

          const builder = await createBuilder(key);
          configureLogging(builder);

          await builder.build();

          if (isDev) {
            console.log("start watching ...");
            await builder.watch();
          }
        }
      }
    }

    if (typeof nextConfig === "function") {
      return (async (
        phase: string,
        defaults: { defaultConfig: NextConfig }
      ): Promise<NextConfig> => {
        const resolvedConfig = await Promise.resolve(
          nextConfig(phase, defaults)
        );
        return resolvedConfig;
      }) as unknown as NextConfig;
    }

    return await Promise.resolve(nextConfig);
  };
}

export const withNotpadd = createNotpaddCollection(defaultOptions);
