"use client";

import React, { useCallback, useMemo, type ReactNode } from "react";
import { createContext, useContextSelector } from "use-context-selector";
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

  const setActiveOrganization = useCallback(
    async (organizationId: string, organizationSlug?: string) => {
      await authClient.organization.setActive({
        organizationId,
        organizationSlug,
      });
    },
    []
  );

  const unsetActiveOrganization = useCallback(async () => {
    await authClient.organization.setActive({
      organizationId: null,
    });
  }, []);

  const createOrganization = useCallback(
    async (data: {
      name: string;
      slug: string;
      logo?: string;
      metadata?: Record<string, any>;
      keepCurrentActiveOrganization?: boolean;
    }) => {
      return await authClient.organization.create(data);
    },
    []
  );

  const checkSlug = useCallback(async (slug: string) => {
    return await authClient.organization.checkSlug({ slug });
  }, []);

  const removeMember = useCallback(
    async (data: { memberIdOrEmail: string; organizationId?: string }) => {
      return await authClient.organization.removeMember(data);
    },
    []
  );

  const listMembers = useCallback(
    async (options?: {
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
    },
    []
  );

  // Memoize context value to prevent unnecessary re-renders
  const contextValue: OrganizationContextType = useMemo(
    () => ({
      organizations: (organizations || null) as Organization[] | null,
      organizationsLoading: isPending,
      organizationsError: error as Error | null,

      activeOrganization: (activeOrganization.data ||
        null) as Organization | null,
      activeOrganizationLoading: activeOrganization.isPending,
      activeOrganizationError: activeOrganization.error as Error | null,

      members: null,
      membersLoading: false,
      membersError: null,

      setActiveOrganization,
      unsetActiveOrganization,
      createOrganization,
      checkSlug,
      removeMember,
      listMembers,
    }),
    [
      organizations,
      isPending,
      error,
      activeOrganization.data,
      activeOrganization.isPending,
      activeOrganization.error,
      setActiveOrganization,
      unsetActiveOrganization,
      createOrganization,
      checkSlug,
      removeMember,
      listMembers,
    ]
  );

  return (
    <OrganizationContext.Provider value={contextValue}>
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganizationContext = (): OrganizationContextType => {
  const context = useContextSelector(OrganizationContext, (value) => value);
  if (context === undefined) {
    throw new Error(
      "useOrganizationContext must be used within an OrganizationProvider"
    );
  }
  return context;
};

export const useOrganizations = () => {
  const organizations = useContextSelector(
    OrganizationContext,
    (value) => value?.organizations ?? null
  );
  const organizationsLoading = useContextSelector(
    OrganizationContext,
    (value) => value?.organizationsLoading ?? false
  );
  const organizationsError = useContextSelector(
    OrganizationContext,
    (value) => value?.organizationsError ?? null
  );

  if (organizations === undefined || organizationsLoading === undefined) {
    throw new Error(
      "useOrganizations must be used within an OrganizationProvider"
    );
  }

  return {
    organizations,
    loading: organizationsLoading,
    error: organizationsError,
  };
};

export const useActiveOrganization = () => {
  const activeOrganization = useContextSelector(
    OrganizationContext,
    (value) => value?.activeOrganization ?? null
  );
  const activeOrganizationLoading = useContextSelector(
    OrganizationContext,
    (value) => value?.activeOrganizationLoading ?? false
  );
  const activeOrganizationError = useContextSelector(
    OrganizationContext,
    (value) => value?.activeOrganizationError ?? null
  );
  const setActiveOrganization = useContextSelector(
    OrganizationContext,
    (value) => value?.setActiveOrganization
  );
  const unsetActiveOrganization = useContextSelector(
    OrganizationContext,
    (value) => value?.unsetActiveOrganization
  );

  if (
    activeOrganization === undefined ||
    setActiveOrganization === undefined ||
    unsetActiveOrganization === undefined
  ) {
    throw new Error(
      "useActiveOrganization must be used within an OrganizationProvider"
    );
  }

  return {
    activeOrganization,
    loading: activeOrganizationLoading,
    error: activeOrganizationError,
    setActive: setActiveOrganization,
    unset: unsetActiveOrganization,
  };
};

export const useOrganizationMembers = () => {
  const members = useContextSelector(
    OrganizationContext,
    (value) => value?.members ?? null
  );
  const membersLoading = useContextSelector(
    OrganizationContext,
    (value) => value?.membersLoading ?? false
  );
  const membersError = useContextSelector(
    OrganizationContext,
    (value) => value?.membersError ?? null
  );
  const removeMember = useContextSelector(
    OrganizationContext,
    (value) => value?.removeMember
  );
  const listMembers = useContextSelector(
    OrganizationContext,
    (value) => value?.listMembers
  );

  if (
    members === undefined ||
    removeMember === undefined ||
    listMembers === undefined
  ) {
    throw new Error(
      "useOrganizationMembers must be used within an OrganizationProvider"
    );
  }

  return {
    members,
    loading: membersLoading,
    error: membersError,
    removeMember,
    listMembers,
  };
};

export const useOrganizationManagement = () => {
  const createOrganization = useContextSelector(
    OrganizationContext,
    (value) => value?.createOrganization
  );
  const checkSlug = useContextSelector(
    OrganizationContext,
    (value) => value?.checkSlug
  );

  if (createOrganization === undefined || checkSlug === undefined) {
    throw new Error(
      "useOrganizationManagement must be used within an OrganizationProvider"
    );
  }

  return {
    createOrganization,
    checkSlug,
  };
};
