"use client";

import type { MembersResponse } from "@/lib/types";
import { Badge } from "@notpadd/ui/components/badge";
import { UserProfile } from "@notpadd/ui/components/user-profile";
import { cn } from "@notpadd/ui/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";
import MemberAction from "./member-action";

export const memberColumns: ColumnDef<MembersResponse>[] = [
  {
    accessorKey: "user",
    header: "User",
    cell: ({ row }) => {
      const user = row.original.user;
      return (
        <div className="max-w-md min-w-[250px] flex items-center gap-2 overflow-x-auto">
          <UserProfile name={user.name} url={user.image} size="sm" />
          <div>
            <p className="truncate text-sm first-letter:capitalize">
              {user.name}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.role;
      return (
        <Badge
          className={cn(
            status === "owner"
              ? "bg-green-500/10 border border-green-500/20 text-green-800"
              : "bg-yellow-500/10 border border-yellow-500/20 text-yellow-500"
          )}
        >
          {status === "owner" ? "Owner" : "Member"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="flex justify-end pr-10">Actions</div>,
    cell: ({ row }) => {
      const member = row.original;

      return (
        <div className="flex justify-end pr-10">
          <MemberAction member={member} />
        </div>
      );
    },
  },
];
