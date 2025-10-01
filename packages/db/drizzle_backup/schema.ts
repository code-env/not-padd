import { pgTable, unique, text, boolean, timestamp, foreignKey, bigint, jsonb, integer } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const user = pgTable("user", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	emailVerified: boolean("email_verified").notNull(),
	image: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
}, (table) => [
	unique("user_email_unique").on(table.email),
]);

export const account = pgTable("account", {
	id: text().primaryKey().notNull(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id").notNull(),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at", { mode: 'string' }),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { mode: 'string' }),
	scope: text(),
	password: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "account_user_id_user_id_fk"
		}).onDelete("cascade"),
]);

export const file = pgTable("file", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	url: text().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	size: bigint({ mode: "number" }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	organizationId: text("organization_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organization.id],
			name: "file_organization_id_organization_id_fk"
		}).onDelete("cascade"),
]);

export const session = pgTable("session", {
	id: text().primaryKey().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	token: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id").notNull(),
	activeOrganizationId: text("active_organization_id"),
	activeTeamId: text("active_team_id"),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "session_user_id_user_id_fk"
		}).onDelete("cascade"),
	unique("session_token_unique").on(table.token),
]);

export const verification = pgTable("verification", {
	id: text().primaryKey().notNull(),
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
});

export const articles = pgTable("articles", {
	id: text().primaryKey().notNull(),
	slug: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
	title: text().notNull(),
	content: text().default(').notNull(),
	excerpt: text(),
	published: boolean().default(false).notNull(),
	publishedAt: timestamp("published_at", { mode: 'string' }),
	organizationId: text("organization_id").notNull(),
	description: text().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organization.id],
			name: "articles_organization_id_organization_id_fk"
		}).onDelete("cascade"),
	unique("articles_slug_unique").on(table.slug),
	unique("articles_organization_id_slug_unique").on(table.slug, table.organizationId),
]);

export const event = pgTable("event", {
	id: text().primaryKey().notNull(),
	type: text().notNull(),
	payload: jsonb().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	organizationId: text("organization_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organization.id],
			name: "event_organization_id_organization_id_fk"
		}).onDelete("cascade"),
]);

export const webhook = pgTable("webhook", {
	id: text().primaryKey().notNull(),
	url: text().notNull(),
	secret: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
	organizationId: text("organization_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organization.id],
			name: "webhook_organization_id_organization_id_fk"
		}).onDelete("cascade"),
]);

export const member = pgTable("member", {
	id: text().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	organizationId: text("organization_id").notNull(),
	role: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "member_user_id_user_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organization.id],
			name: "member_organization_id_organization_id_fk"
		}).onDelete("cascade"),
]);

export const invitation = pgTable("invitation", {
	id: text().primaryKey().notNull(),
	email: text().notNull(),
	inviterId: text("inviter_id").notNull(),
	organizationId: text("organization_id").notNull(),
	role: text().notNull(),
	status: text().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	teamId: text("team_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.inviterId],
			foreignColumns: [member.id],
			name: "invitation_inviter_id_member_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organization.id],
			name: "invitation_organization_id_organization_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.teamId],
			foreignColumns: [team.id],
			name: "invitation_team_id_team_id_fk"
		}).onDelete("cascade"),
]);

export const team = pgTable("team", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	organizationId: text("organization_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organization.id],
			name: "team_organization_id_organization_id_fk"
		}).onDelete("cascade"),
]);

export const organizationRole = pgTable("organization_role", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	organizationId: text("organization_id").notNull(),
	permissions: jsonb().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organization.id],
			name: "organization_role_organization_id_organization_id_fk"
		}).onDelete("cascade"),
]);

export const teamMember = pgTable("team_member", {
	id: text().primaryKey().notNull(),
	teamId: text("team_id").notNull(),
	userId: text("user_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.teamId],
			foreignColumns: [team.id],
			name: "team_member_team_id_team_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "team_member_user_id_user_id_fk"
		}).onDelete("cascade"),
]);

export const organization = pgTable("organization", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	slug: text().notNull(),
	logo: text(),
	metadata: jsonb(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	lastUsed: boolean("last_used").default(false),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	storageLimit: bigint("storage_limit", { mode: "number" }).default(104857600).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	storageUsed: bigint("storage_used", { mode: "number" }).default(0).notNull(),
}, (table) => [
	unique("organization_slug_unique").on(table.slug),
]);

export const rateLimitAttempts = pgTable("rate_limit_attempts", {
	identifier: text().primaryKey().notNull(),
	count: integer().default(1).notNull(),
	expiresAt: timestamp("expires_at", { withTimezone: true, mode: 'string' }).notNull(),
});
