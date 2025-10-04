"use client";

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

import { useArticleContext, useOrganizationContext } from "@/contexts";
import { QUERY_KEYS } from "@/lib/constants";
import { AUTHORS_QUERIES } from "@/lib/queries";
import type { AuthorsListItem, UpdateArticleSchema } from "@/lib/types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@notpadd/ui/components/tooltip";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useController, useFormContext, type Control } from "react-hook-form";

type AuthorSelectorProps = {
  control: Control<UpdateArticleSchema>;
  defaultAuthors?: string[];
};

export const AuthorSelector = ({
  control,
  defaultAuthors = [],
}: AuthorSelectorProps) => {
  const { activeOrganization } = useOrganizationContext();
  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({
    name: "authors",
    control,
    defaultValue: defaultAuthors,
  });

  const { article } = useArticleContext();
  const { setValue } = useFormContext<UpdateArticleSchema>();

  const { data: authors } = useQuery({
    queryKey: [QUERY_KEYS.AUTHORS],
    queryFn: () =>
      AUTHORS_QUERIES.getAuthors(
        activeOrganization?.id ?? "",
        article?.id ?? "",
        {
          page: 1,
          limit: 100,
        }
      ),
  });

  useEffect(() => {
    if (!authors?.data) return;
    if (!Array.isArray(value) || value.length === 0) return;

    const mapped = value.map((v: string) => {
      const byMemberId = authors.data.find((a) => a.memberId === v);
      if (byMemberId) return v;
      const byUserId = authors.data.find((a) => a.userId === v);
      if (byUserId) return byUserId.memberId;
      const byName = authors.data.find((a) => a.name === v);
      if (byName) return byName.memberId;
      return v;
    });

    const cleaned = mapped.filter(
      (m): m is string => typeof m === "string" && m.trim() !== ""
    );

    const changed =
      cleaned.length !== value.length || cleaned.some((m, i) => m !== value[i]);
    if (!changed) return;

    setValue("authors", cleaned, {
      shouldDirty: false,
      shouldTouch: false,
      shouldValidate: false,
    });
  }, [authors?.data, value, setValue]);

  const selectedAuthors = useMemo(() => {
    if (!authors?.data || !Array.isArray(value) || value.length === 0) {
      return [] as AuthorsListItem[];
    }
    return authors.data.filter((a) => value.includes(a.memberId));
  }, [authors, value]);

  const addAuthor = (author: AuthorsListItem) => {
    const memberId = author.memberId;
    if (!memberId) return;
    if (value?.includes(memberId)) {
      return;
    }
    const newValue = [...(value || []), memberId];
    onChange(newValue);
  };

  return (
    <Popover>
      <PopoverTrigger className="w-full">
        <div className="relative flex h-auto min-h-9 w-full cursor-pointer items-center justify-between gap-2 rounded-md border bg-muted/50 px-3 py-1.5 text-sm">
          <ul className="-space-x-2 flex flex-wrap">
            {selectedAuthors.length === 0 && (
              <li className="text-muted-foreground">Select authors</li>
            )}
            {selectedAuthors.length === 1 && (
              <li className="flex items-center gap-2">
                <UserProfile
                  name={selectedAuthors[0]?.name ?? ""}
                  size="sm"
                  url={selectedAuthors[0]?.image ?? ""}
                />
                <p className="max-w-64 text-sm">
                  {selectedAuthors.map((author) => author.name).join(", ")}
                </p>
              </li>
            )}
            {selectedAuthors.length > 1 &&
              selectedAuthors.map((author) => (
                <li className="flex items-center" key={author.memberId}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <UserProfile
                        name={author.name}
                        url={author.image}
                        size="sm"
                        fallbackClassName="text-xs"
                      />
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
                        value?.includes(option.memberId as string)
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
