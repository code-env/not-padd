import {
  boolean,
  jsonb,
  pgTable,
  text,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";
import {
  account,
  rateLimitAttempts,
  session,
  user,
  verification,
} from "./auth-schema";

export const notpaddWorkspace = pgTable("notpadd_workspace", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  ownerId: text("owner_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  storageLimit: integer("storage_limit").notNull().default(100),
  storageUsed: integer("storage_used").notNull().default(0),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
  lastUsed: boolean("last_used").default(false).notNull(),
});

export const notpaddFile = pgTable("notpadd_file", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => notpaddWorkspace.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  url: text("url").notNull(),
  size: integer("size").notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const notpaddPost = pgTable("notpadd_post", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => notpaddWorkspace.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  published: boolean("published").default(false).notNull(),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const notpaddEvent = pgTable("notpadd_event", {
  id: text("id").primaryKey(),
  type: text("type").notNull(),
  payload: jsonb("payload").notNull(),
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => notpaddWorkspace.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const notpaddWebhook = pgTable("notpadd_webhook", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => notpaddWorkspace.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  secret: text("secret"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

const schema = {
  user,
  account,
  session,
  verification,
  rateLimitAttempts,
  notpaddEvent,
  notpaddFile,
  notpaddPost,
  notpaddWebhook,
  notpaddWorkspace,
};

export default schema;
