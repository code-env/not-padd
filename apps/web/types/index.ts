import type {
  Member as DbMember,
  Organization as DbOrganization,
  Team,
  User,
} from "@notpadd/db/types";

export interface Organization
  extends Omit<DbOrganization, "logo" | "metadata"> {
  logo?: string | null | undefined;
  metadata?: any;
}

export type Member = DbMember;

export interface OrganizationWithMembers extends Organization {
  members?: Member[];
}

export interface UserWithOrganizations extends User {
  organizations?: Organization[];
}

export interface MemberWithUser extends Member {
  user?: User;
}

export interface OrganizationWithMembersAndTeams extends Organization {
  members?: MemberWithUser[];
  teams?: Team[];
}
