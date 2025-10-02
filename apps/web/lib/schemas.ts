import { z } from "zod";
import { REQUIRED_STRING } from "./utils";

export const createArticleSchema = z.object({
  title: REQUIRED_STRING,
  description: REQUIRED_STRING,
  slug: REQUIRED_STRING,
});

export const updateArticleSchema = z.object({
  title: REQUIRED_STRING,
  description: REQUIRED_STRING,
  slug: REQUIRED_STRING,
  tags: z.array(REQUIRED_STRING),
  authors: z.array(REQUIRED_STRING),
});
