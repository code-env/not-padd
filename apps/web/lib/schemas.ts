import { z } from "zod";
import { REQUIRED_STRING } from "./utils";

// Treat empty strings as undefined for optional string fields
const OPTIONAL_STRING = z.preprocess(
  (val) => (typeof val === "string" && val.trim() === "" ? undefined : val),
  REQUIRED_STRING.optional()
);

export const createArticleSchema = z.object({
  title: REQUIRED_STRING,
  description: REQUIRED_STRING,
  slug: REQUIRED_STRING,
});

export const updateArticleSchema = z.object({
  title: OPTIONAL_STRING,
  description: OPTIONAL_STRING,
  slug: OPTIONAL_STRING,
  tags: z.array(REQUIRED_STRING).optional(),
  authors: z.array(REQUIRED_STRING).optional(),
  content: OPTIONAL_STRING,
  markdown: OPTIONAL_STRING,
  json: OPTIONAL_STRING,
});

export const createTagSchema = z.object({
  name: REQUIRED_STRING,
});
