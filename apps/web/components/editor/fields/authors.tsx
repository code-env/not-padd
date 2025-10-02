"use client";

import { Badge } from "@notpadd/ui/components/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@notpadd/ui/components/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@notpadd/ui/components/popover";
import { UserProfile } from "@notpadd/ui/components/user-profile";
import { cn } from "@notpadd/ui/lib/utils";

import { useOrganizationContext } from "@/contexts";
import { QUERY_KEYS } from "@/lib/constants";
import { AUTHORS_QUERIES } from "@/lib/queries";
import type { AuthorsListItem, UpdateArticleSchema } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronDown, ChevronsUpDown, Plus, X } from "lucide-react";
import { useState } from "react";
import { useController, type Control } from "react-hook-form";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@notpadd/ui/components/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@notpadd/ui/components/tooltip";

type Author = {
  userId: string;
  name: string;
  email: string;
  image: string;
};

type AuthorSelectorProps = {
  control: Control<UpdateArticleSchema>;
  defaultAuthors?: string[];
};

export const AuthorSelector = ({
  control,
  defaultAuthors = [],
}: AuthorSelectorProps) => {
  const { activeOrganization } = useOrganizationContext();
  const [selectedAuthors, setSelectedAuthors] = useState<Author[]>([]);

  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({
    name: "authors",
    control,
    defaultValue: defaultAuthors,
  });

  const { data: authors } = useQuery({
    queryKey: [QUERY_KEYS.AUTHORS],
    queryFn: () =>
      AUTHORS_QUERIES.getAuthors(activeOrganization?.id ?? "", {
        page: 1,
        limit: 100,
      }),
  });

  const addAuthor = (author: AuthorsListItem) => {
    if (value?.includes(author.name ?? "")) {
      return;
    }
    const newValue = [...(value || []), author.name];
    onChange(newValue);
  };

  const selected = selectedAuthors;

  return (
    <Popover>
      <PopoverTrigger className="w-full">
        <div className="relative flex h-auto min-h-9 w-full cursor-pointer items-center justify-between gap-2 rounded-md border bg-muted/50 px-3 py-1.5 text-sm">
          <ul className="-space-x-2 flex flex-wrap">
            {selected.length === 0 && (
              <li className="text-muted-foreground">Select authors</li>
            )}
            {selected.length === 1 && (
              <li className="flex items-center gap-2">
                <UserProfile
                  name={selected[0]?.name as string}
                  url={selected[0]?.image as string}
                />
                <p className="max-w-64 text-sm">{selected[0]?.name}</p>
              </li>
            )}
            {selected.length > 1 &&
              selected.map((author) => (
                <li className="flex items-center" key={author.userId}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Avatar className="size-6">
                        <AvatarImage src={author.image || undefined} />
                        <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-64 text-xs">{author.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </li>
              ))}
          </ul>
          <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
        </div>
      </PopoverTrigger>
      <PopoverContent align="center" className="min-w-[350.67px] p-0">
        <Command className="w-full">
          <CommandInput placeholder="Search authors..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>

            {authors?.data && authors?.data.length > 0 && (
              <CommandGroup>
                {authors?.data.map((option) => (
                  <CommandItem
                    key={option.userId}
                    onSelect={() => addAuthor(option)}
                    className="cursor-pointer hover:bg-sidebar!"
                  >
                    <UserProfile
                      name={option.name}
                      url={option.image}
                      size="xs"
                      fallbackClassName="text-xs"
                    />
                    {option.name}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        selected.some((item) => item.userId === option.userId)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {authors?.data && authors?.data.length > 0 && <CommandSeparator />}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
