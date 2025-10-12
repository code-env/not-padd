"use client";

import React, { createContext, useContext, type ReactNode } from "react";
import { authClient } from "@notpadd/auth/auth-client";
import type { Organization, Member } from "@/types";

interface OrganizationContextType {
  organizations: Organization[] | null;
  organizationsLoading: boolean;
  organizationsError: Error | null;

  activeOrganization: Organization | null;
  activeOrganizationLoading: boolean;
  activeOrganizationError: Error | null;

  members: Member[] | null;
  membersLoading: boolean;
  membersError: Error | null;

  setActiveOrganization: (
    organizationId: string,
    organizationSlug?: string
  ) => Promise<void>;
  unsetActiveOrganization: () => Promise<void>;
  createOrganization: (data: {
    name: string;
    slug: string;
    logo?: string;
    metadata?: Record<string, any>;
    keepCurrentActiveOrganization?: boolean;
  }) => Promise<any>;
  checkSlug: (slug: string) => Promise<any>;

  removeMember: (data: {
    memberIdOrEmail: string;
    organizationId?: string;
  }) => Promise<any>;
  listMembers: (options?: {
    organizationId?: string;
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortDirection?: "asc" | "desc";
    filterField?: string;
    filterOperator?: "eq" | "ne" | "gt" | "gte" | "lt" | "lte" | "contains";
    filterValue?: string;
  }) => Promise<any>;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(
  undefined
);

interface OrganizationProviderProps {
  children: ReactNode;
}

export const OrganizationProvider: React.FC<OrganizationProviderProps> = ({
  children,
}) => {
  const {
    data: organizations,
    isPending,
    error,
  } = authClient.useListOrganizations();
  const activeOrganization = authClient.useActiveOrganization();

  const setActiveOrganization = async (
    organizationId: string,
    organizationSlug?: string
  ) => {
    await authClient.organization.setActive({
      organizationId,
      organizationSlug,
    });
  };

  const unsetActiveOrganization = async () => {
    await authClient.organization.setActive({
      organizationId: null,
    });
  };

  const createOrganization = async (data: {
    name: string;
    slug: string;
    logo?: string;
    metadata?: Record<string, any>;
    keepCurrentActiveOrganization?: boolean;
  }) => {
    return await authClient.organization.create(data);
  };

  const checkSlug = async (slug: string) => {
    return await authClient.organization.checkSlug({ slug });
  };

  const removeMember = async (data: {
    memberIdOrEmail: string;
    organizationId?: string;
  }) => {
    return await authClient.organization.removeMember(data);
  };

  const listMembers = async (options?: {
    organizationId?: string;
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortDirection?: "asc" | "desc";
    filterField?: string;
    filterOperator?: "eq" | "ne" | "gt" | "gte" | "lt" | "lte" | "contains";
    filterValue?: string;
  }) => {
    return await authClient.organization.listMembers({
      query: {
        ...options,
      },
    });
  };

  const contextValue: OrganizationContextType = {
    organizations,
    organizationsLoading: isPending,
    organizationsError: error,

    activeOrganization: activeOrganization.data,
    activeOrganizationLoading: activeOrganization.isPending,
    activeOrganizationError: activeOrganization.error,

    members: null,
    membersLoading: false,
    membersError: null,

    setActiveOrganization,
    unsetActiveOrganization,
    createOrganization,
    checkSlug,
    removeMember,
    listMembers,
  };

  return (
    <OrganizationContext.Provider value={contextValue}>
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganizationContext = (): OrganizationContextType => {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error(
      "useOrganizationContext must be used within an OrganizationProvider"
    );
  }
  return context;
};

export const useOrganizations = () => {
  const { organizations, organizationsLoading, organizationsError } =
    useOrganizationContext();
  return {
    organizations,
    loading: organizationsLoading,
    error: organizationsError,
  };
};

export const useActiveOrganization = () => {
  const {
    activeOrganization,
    activeOrganizationLoading,
    activeOrganizationError,
    setActiveOrganization,
    unsetActiveOrganization,
  } = useOrganizationContext();
  return {
    activeOrganization,
    loading: activeOrganizationLoading,
    error: activeOrganizationError,
    setActive: setActiveOrganization,
    unset: unsetActiveOrganization,
  };
};

export const useOrganizationMembers = () => {
  const { members, membersLoading, membersError, removeMember, listMembers } =
    useOrganizationContext();
  return {
    members,
    loading: membersLoading,
    error: membersError,
    removeMember,
    listMembers,
  };
};

export const useOrganizationManagement = () => {
  const { createOrganization, checkSlug } = useOrganizationContext();
  return {
    createOrganization,
    checkSlug,
  };
};
