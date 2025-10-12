"use client";

import { MembersLoading } from "@/components/loading-uis";
import { useOrganizationContext } from "@/contexts";
import { QUERY_KEYS } from "@/lib/constants";
import { ORGANIZATION_QUERIES } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";
import { MemberTable } from "./tables/member-table";
import { memberColumns } from "./tables/member-column";
import {
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import type { MembersResponse } from "@/lib/types";

export const MembersSection = () => {
  const queries = {
    limit: 10,
    offset: 0,
    sortBy: "createdAt",
    sortDirection: "desc",
  } as const;

  const { activeOrganization } = useOrganizationContext();
  const { data, isLoading, error } = useQuery({
    queryKey: [QUERY_KEYS.MEMBERS, activeOrganization?.id],
    queryFn: () =>
      ORGANIZATION_QUERIES.getMembers(
        activeOrganization?.id as string,
        queries
      ),
  });

  const table = useReactTable({
    data: (data?.members || []) as MembersResponse[],
    columns: memberColumns as ColumnDef<MembersResponse>[],
    getCoreRowModel: getCoreRowModel(),
  });

  if (error) {
    return <div>error: {error.message}</div>;
  }

  if (isLoading) {
    return <MembersLoading columns={10} />;
  }

  console.log(data);

  return <MemberTable table={table} columns={memberColumns} />;
};
