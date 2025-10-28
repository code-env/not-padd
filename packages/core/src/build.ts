import { createCacheManager } from "./cache";
import { createCollector } from "./collector";
import { InternalConfiguration } from "./configurationReader";
import { Emitter } from "./events";
import { processNotpaddData } from "./notpadd";
import { createSynchronizer } from "./synchronizer";
import { createTransformer } from "./transformer";
import { isDefined } from "./utils";
import { createWriter } from "./writer";

type Dependencies = {
  emitter: Emitter;
  outputDirectory: string;
  baseDirectory: string;
  configuration: InternalConfiguration;
};

export type BuildEvents = {
  "builder:start": {
    startedAt: number;
  };
  "builder:end": {
    startedAt: number;
    endedAt: number;
    stats: {
      collections: number;
      documents: number;
    };
  };
};

export async function createBuildContext({
  emitter,
  outputDirectory,
  baseDirectory,
  configuration,
}: Dependencies) {
  if (!configuration.notpadd) {
    console.warn(
      "Notpadd configuration is not provided, skipping Notpadd data processing"
    );
    throw new Error("Notpadd configuration is required");
  }

  try {
    await processNotpaddData(configuration.notpadd, baseDirectory);
  } catch (error) {
    console.error("Failed to process Notpadd data:", error);
  }

  const collector = createCollector(emitter, baseDirectory);

  const [writer, resolved, cacheManager] = await Promise.all([
    createWriter(outputDirectory),
    collector.collect(configuration.collections),
    createCacheManager(baseDirectory, configuration.checksum),
  ]);

  const synchronizer = createSynchronizer(
    collector.collectFile,
    resolved,
    baseDirectory
  );

  const transform = createTransformer(emitter, cacheManager);
  return {
    resolved,
    writer,
    synchronizer,
    transform,
    emitter,
    cacheManager,
    configuration,
    baseDirectory,
  };
}

export type BuildContext = Awaited<ReturnType<typeof createBuildContext>>;

export async function build({
  emitter,
  transform,
  resolved,
  writer,
  configuration,
}: BuildContext) {
  const startedAt = Date.now();
  emitter.emit("builder:start", {
    startedAt,
  });

  const collections = await transform(resolved);
  await Promise.all([
    writer.createDataFiles(collections),
    writer.createTypeDefinitionFile(configuration),
    writer.createJavaScriptFile(configuration),
  ]);

  const pendingOnSuccess = collections
    .filter((collection) => Boolean(collection.onSuccess))
    .map((collection) =>
      collection.onSuccess?.(collection.documents.map((doc) => doc.document))
    );

  await Promise.all(pendingOnSuccess.filter(isDefined));

  const stats = collections.reduce(
    (acc, collection) => {
      acc.collections++;
      acc.documents += collection.documents.length;
      return acc;
    },
    {
      collections: 0,
      documents: 0,
    }
  );

  emitter.emit("builder:end", {
    startedAt,
    endedAt: Date.now(),
    stats,
  });
}
