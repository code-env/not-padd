"use client";

import React, { createContext, useContext, type ReactNode } from "react";
import {
  useOrganization,
  useOrganizationActions,
} from "@/hooks/use-organization";
import type { Organization, Member } from "@/types";

interface OrganizationContextType {
  organizations: Organization[] | null;
  organizationsLoading: boolean;
  organizationsError: Error | null;
  refetchOrganizations: () => Promise<void>;

  activeOrganization: Organization | null;
  activeOrganizationLoading: boolean;
  activeOrganizationError: Error | null;
  setActiveOrganization: (
    organizationId: string,
    organizationSlug: string
  ) => Promise<void>;
  unsetActiveOrganization: () => Promise<void>;

  activeMember: Member | null;
  activeMemberLoading: boolean;
  activeMemberError: Error | null;
  refetchActiveMember: () => Promise<void>;

  isOwner: boolean;
  isAdmin: boolean;
  isMember: boolean;
  hasPermission: (permissions: Record<string, string[]>) => Promise<boolean>;

  createOrganization: (data: {
    name: string;
    slug: string;
    logo?: string;
    metadata?: Record<string, any>;
    keepCurrentActiveOrganization?: boolean;
  }) => Promise<any>;
  updateOrganization: (data: {
    name?: string;
    slug?: string;
    logo?: string;
    metadata?: Record<string, any>;
  }) => Promise<any>;
  deleteOrganization: (organizationId: string) => Promise<any>;
  checkSlug: (slug: string) => Promise<any>;
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
  const organizationData = useOrganization();
  const organizationActions = useOrganizationActions();

  const contextValue: OrganizationContextType = {
    ...organizationData,
    ...organizationActions,
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
  const {
    organizations,
    organizationsLoading,
    organizationsError,
    refetchOrganizations,
  } = useOrganizationContext();
  return {
    organizations,
    loading: organizationsLoading,
    error: organizationsError,
    refetch: refetchOrganizations,
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

export const useActiveMember = () => {
  const {
    activeMember,
    activeMemberLoading,
    activeMemberError,
    refetchActiveMember,
    isOwner,
    isAdmin,
    isMember,
  } = useOrganizationContext();
  return {
    activeMember,
    loading: activeMemberLoading,
    error: activeMemberError,
    refetch: refetchActiveMember,
    isOwner,
    isAdmin,
    isMember,
  };
};

export const useOrganizationPermissions = () => {
  const { hasPermission, isOwner, isAdmin, isMember } =
    useOrganizationContext();
  return { hasPermission, isOwner, isAdmin, isMember };
};

export const useOrganizationManagement = () => {
  const {
    createOrganization,
    updateOrganization,
    deleteOrganization,
    checkSlug,
  } = useOrganizationContext();
  return {
    createOrganization,
    updateOrganization,
    deleteOrganization,
    checkSlug,
  };
};
