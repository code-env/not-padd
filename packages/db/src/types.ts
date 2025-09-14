import type { InferSelectModel } from "drizzle-orm";
import schema from "./schema";

// Auth types
export type User = InferSelectModel<typeof schema.user>;
export type Session = InferSelectModel<typeof schema.session>;
export type Account = InferSelectModel<typeof schema.account>;
export type Verification = InferSelectModel<typeof schema.verification>;
export type RateLimitAttempts = InferSelectModel<typeof schema.rateLimitAttempts>;

// Organization types
export type Organization = InferSelectModel<typeof schema.organization>;
export type Member = InferSelectModel<typeof schema.member>;
export type Invitation = InferSelectModel<typeof schema.invitation>;
export type Team = InferSelectModel<typeof schema.team>;
export type TeamMember = InferSelectModel<typeof schema.teamMember>;
export type OrganizationRole = InferSelectModel<typeof schema.organizationRole>;

// NotPadd types
export type NotPaddWorkspace = InferSelectModel<typeof schema.notpaddWorkspace>;
export type NotPaddFile = InferSelectModel<typeof schema.notpaddFile>;
export type NotPaddPost = InferSelectModel<typeof schema.notpaddPost>;
export type NotPaddEvent = InferSelectModel<typeof schema.notpaddEvent>;
export type NotPaddWebhook = InferSelectModel<typeof schema.notpaddWebhook>;
