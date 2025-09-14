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

// Organization table
export const organization = pgTable("organization", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  logo: text("logo"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

// Member table
export const member = pgTable("member", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  role: text("role").notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

// Invitation table
export const invitation = pgTable("invitation", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  inviterId: text("inviter_id")
    .notNull()
    .references(() => member.id, { onDelete: "cascade" }),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  role: text("role").notNull(),
  status: text("status").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  teamId: text("team_id")
    .references(() => team.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

// Team table
export const team = pgTable("team", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

// Team Member table
export const teamMember = pgTable("team_member", {
  id: text("id").primaryKey(),
  teamId: text("team_id")
    .notNull()
    .references(() => team.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

// Organization Role table (for dynamic access control)
export const organizationRole = pgTable("organization_role", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  permissions: jsonb("permissions").notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

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
  organization,
  member,
  invitation,
  team,
  teamMember,
  organizationRole,
  notpaddEvent,
  notpaddFile,
  notpaddPost,
  notpaddWebhook,
  notpaddWorkspace,
};

export default schema;
