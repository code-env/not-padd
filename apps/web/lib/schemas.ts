import { z } from "zod";
import { REQUIRED_STRING } from "./utils";

export const createArticleSchema = z.object({
  title: REQUIRED_STRING,
  description: REQUIRED_STRING,
  slug: REQUIRED_STRING,
});

export const updateArticleSchema = z.object({
  title: REQUIRED_STRING.optional(),
  description: REQUIRED_STRING.optional(),
  slug: REQUIRED_STRING.optional(),
  tags: z.array(REQUIRED_STRING).optional(),
  authors: z.array(REQUIRED_STRING).optional(),
});

export const createTagSchema = z.object({
  name: REQUIRED_STRING,
});
