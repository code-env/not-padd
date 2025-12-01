import { AnyCollection, AnyConfiguration, Collection, Meta } from "./config";

export type Modification = "create" | "update" | "delete";

export type Document = {
  _meta: Meta;
};

export type CollectionFile = {
  data: {
    content?: string;
    [key: string]: unknown;
  };
  path: string;
};

export type FileCollection = Pick<
  AnyCollection,
  "directory" | "include" | "exclude" | "parser"
>;

export type ResolvedCollection<T extends FileCollection> = T & {
  files: Array<CollectionFile>;
};

export type GetCollectionNames<TConfiguration extends AnyConfiguration> =
  keyof CollectionByName<TConfiguration>;

export type CollectionByName<TConfiguration extends AnyConfiguration> = {
  [TCollection in TConfiguration["collections"][number] as TCollection["name"]]: TCollection;
};

/**
 * Utility type to force TypeScript to evaluate and simplify complex types.
 * This makes hover information show the resolved type instead of the raw type expressions.
 */
type Prettify<T> = T extends (...args: infer Args) => infer Return
  ? (...args: Args) => Return
  : T extends Array<infer U>
    ? Array<Prettify<U>>
    : T extends object
      ? { [K in keyof T]: Prettify<T[K]> }
      : T;

type GetDocument<TCollection extends AnyCollection> =
  TCollection extends Collection<any, any, any, any, any, infer TDocument>
    ? TDocument
    : never;

export type GetTr<TCollection extends AnyCollection> =
  TCollection extends Collection<any, any, any, any, infer TDocument, any>
    ? TDocument
    : never;

export type GetTypeByName<
  TConfiguration extends AnyConfiguration,
  TName extends keyof CollectionByName<TConfiguration>,
  TCollection = CollectionByName<TConfiguration>[TName],
> = TCollection extends AnyCollection
  ? Prettify<GetDocument<TCollection>>
  : never;
