import { relations } from "drizzle-orm/relations";
import { user, account, organization, file, session, articles, event, webhook, member, invitation, team, organizationRole, teamMember } from "./schema";

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	accounts: many(account),
	sessions: many(session),
	members: many(member),
	teamMembers: many(teamMember),
}));

export const fileRelations = relations(file, ({one}) => ({
	organization: one(organization, {
		fields: [file.organizationId],
		references: [organization.id]
	}),
}));

export const organizationRelations = relations(organization, ({many}) => ({
	files: many(file),
	articles: many(articles),
	events: many(event),
	webhooks: many(webhook),
	members: many(member),
	invitations: many(invitation),
	teams: many(team),
	organizationRoles: many(organizationRole),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const articlesRelations = relations(articles, ({one}) => ({
	organization: one(organization, {
		fields: [articles.organizationId],
		references: [organization.id]
	}),
}));

export const eventRelations = relations(event, ({one}) => ({
	organization: one(organization, {
		fields: [event.organizationId],
		references: [organization.id]
	}),
}));

export const webhookRelations = relations(webhook, ({one}) => ({
	organization: one(organization, {
		fields: [webhook.organizationId],
		references: [organization.id]
	}),
}));

export const memberRelations = relations(member, ({one, many}) => ({
	user: one(user, {
		fields: [member.userId],
		references: [user.id]
	}),
	organization: one(organization, {
		fields: [member.organizationId],
		references: [organization.id]
	}),
	invitations: many(invitation),
}));

export const invitationRelations = relations(invitation, ({one}) => ({
	member: one(member, {
		fields: [invitation.inviterId],
		references: [member.id]
	}),
	organization: one(organization, {
		fields: [invitation.organizationId],
		references: [organization.id]
	}),
	team: one(team, {
		fields: [invitation.teamId],
		references: [team.id]
	}),
}));

export const teamRelations = relations(team, ({one, many}) => ({
	invitations: many(invitation),
	organization: one(organization, {
		fields: [team.organizationId],
		references: [organization.id]
	}),
	teamMembers: many(teamMember),
}));

export const organizationRoleRelations = relations(organizationRole, ({one}) => ({
	organization: one(organization, {
		fields: [organizationRole.organizationId],
		references: [organization.id]
	}),
}));

export const teamMemberRelations = relations(teamMember, ({one}) => ({
	team: one(team, {
		fields: [teamMember.teamId],
		references: [team.id]
	}),
	user: one(user, {
		fields: [teamMember.userId],
		references: [user.id]
	}),
}));