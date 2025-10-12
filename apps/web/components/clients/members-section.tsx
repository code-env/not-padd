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
  getFilteredRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import type { MembersResponse } from "@/lib/types";
import useModal from "@/hooks/use-modal";
import { Input } from "@notpadd/ui/components/input";
import { Button } from "@notpadd/ui/components/button";
import { Search } from "lucide-react";

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
    getFilteredRowModel: getFilteredRowModel(),
  });

  if (error) {
    return <div>error: {error.message}</div>;
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-10">
        <MembersHeader disabled={true} onSearch={() => {}} />
        <MembersLoading columns={10} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <MembersHeader
        disabled={data?.members.length === 0 || isLoading}
        onSearch={(search) =>
          table.setColumnFilters([{ id: "user", value: search }])
        }
      />
      <MemberTable table={table} columns={memberColumns} />
    </div>
  );
};

interface MembersHeaderProps {
  disabled: boolean;
  onSearch: (search: string) => void;
}

const MembersHeader = ({ disabled, onSearch }: MembersHeaderProps) => {
  const { onOpen } = useModal();
  return (
    <div className="flex items-center justify-between">
      <div className="relative w-full max-w-sm">
        <Search className="size-4 absolute top-0 bottom-0 my-auto left-4 text-muted-foreground" />
        <Input
          placeholder="Search team member..."
          className="w-full bg-sidebar pl-10 text-muted-foreground"
          disabled={disabled}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <Button disabled={disabled} onClick={() => onOpen("invite-member")}>
        Invite Member
      </Button>
    </div>
  );
};
