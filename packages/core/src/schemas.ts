import { z } from "zod";
import type { NotpaddData } from "./notpadd";

export const blurDataUrlSchema = z.string().optional().nullable();

export const notpaddAuthorSchema = z.object({
  name: z.string(),
  email: z.string(),
  image: z.string().nullable(),
});

export const notpaddSchema = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  published: z.boolean().nullable(),
  markdown: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  image: z.string().nullable(),
  imageBlurhash: blurDataUrlSchema,
  authors: z.array(notpaddAuthorSchema),
  tags: z.array(z.string()).nullable(),
});

export const notpaddSchemaOptional = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string().optional(),
  published: z.boolean().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  image: z.string().optional().nullable(),
  authors: z.array(notpaddAuthorSchema).optional(),
  imageBlurhash: blurDataUrlSchema.optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
});

export const notpaddSchemaMinimal = z.object({
  slug: z.string(),
  title: z.string(),
});

export const notpaddSchemaExtended = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  published: z.boolean().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  image: z.string().nullable(),
  tags: z.array(z.string()).optional(),
  category: z.string().optional(),
  authors: z.array(notpaddAuthorSchema).optional(),
});

export const notpaddSchemaPublished = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  published: z.literal(true),
  createdAt: z.string(),
  updatedAt: z.string(),
  image: z.string().nullable(),
});

export type NotpaddSchema = z.infer<typeof notpaddSchema>;
export type NotpaddSchemaOptional = z.infer<typeof notpaddSchemaOptional>;
export type NotpaddSchemaMinimal = z.infer<typeof notpaddSchemaMinimal>;
export type NotpaddSchemaExtended = z.infer<typeof notpaddSchemaExtended>;
export type NotpaddSchemaPublished = z.infer<typeof notpaddSchemaPublished>;
export type NotpaddAuthorSchema = z.infer<typeof notpaddAuthorSchema>;

export const createNotpaddSchema = <T extends z.ZodRawShape>(
  additionalFields: T
) => {
  return notpaddSchema.extend(additionalFields);
};

export const createNotpaddSchemaPick = <
  T extends keyof NotpaddData,
  TFields extends T[],
>(
  fields: TFields
) => {
  const baseSchema = notpaddSchema;
  const pickedFields = fields.reduce(
    (acc, field) => {
      acc[field] = baseSchema.shape[field as keyof typeof baseSchema.shape];
      return acc;
    },
    {} as Record<T, z.ZodTypeAny>
  );
  return z.object(pickedFields);
};

export const createNotpaddSchemaOmit = <
  T extends keyof NotpaddData,
  TFields extends T[],
>(
  fields: TFields
) => {
  const baseSchema = notpaddSchema;
  const omittedFields = Object.keys(baseSchema.shape).filter(
    (key) => !fields.includes(key as T)
  ) as Array<keyof typeof baseSchema.shape>;
  const pickedFields = omittedFields.reduce(
    (acc, field) => {
      acc[field] = baseSchema.shape[field];
      return acc;
    },
    {} as Record<keyof typeof baseSchema.shape, z.ZodTypeAny>
  );
  return z.object(pickedFields);
};
