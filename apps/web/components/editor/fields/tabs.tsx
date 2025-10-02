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
import { cn } from "@notpadd/ui/lib/utils";

import { useOrganizationContext } from "@/contexts";
import useModal from "@/hooks/use-modal";
import { QUERY_KEYS } from "@/lib/constants";
import { TAGS_QUERIES } from "@/lib/queries";
import type { UpdateArticleSchema } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronDown, Plus, X } from "lucide-react";
import { useMemo } from "react";
import { useController, type Control } from "react-hook-form";

type TagSelectorProps = {
  control: Control<UpdateArticleSchema>;
  defaultTags?: string[];
};

export const TagSelector = ({
  control,
  defaultTags = [],
}: TagSelectorProps) => {
  const { onOpen } = useModal();
  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({
    name: "tags",
    control,
    defaultValue: defaultTags,
  });

  const { activeOrganization } = useOrganizationContext();

  const { data: tags } = useQuery({
    queryKey: [QUERY_KEYS.TAGS, activeOrganization?.id],
    queryFn: () =>
      TAGS_QUERIES.getTags(activeOrganization?.id || "", {
        page: 1,
        limit: 10,
        search: "",
      }),
    enabled: !!activeOrganization?.id,
  });

  const addTag = (tag: string) => {
    if (value?.includes(tag)) {
      return;
    }
    const newValue = [...(value || []), tag];
    onChange(newValue);
  };

  const handleRemoveTag = (tag: string) => {
    const newValue = (value || []).filter((tag: string) => tag !== tag);
    onChange(newValue);
  };

  const selected = useMemo(() => {
    if (tags && tags.data.length > 0 && value && value?.length > 0) {
      return tags.data.filter((opt) => value.includes(opt.name));
    }
    return [];
  }, [tags, value]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative h-auto min-h-9 w-full cursor-pointer rounded-md border bg-muted/50 p-2 text-sm">
          <div className="flex items-center justify-between gap-2">
            <ul className="flex flex-wrap gap-1">
              {selected.length === 0 && (
                <li className="text-muted-foreground">Select some tags</li>
              )}
              {selected.map((item) => (
                <li key={item.id}>
                  <Badge
                    className="font-normal bg-background"
                    variant="outline"
                  >
                    {item.name}
                    <button
                      className="ml-1 h-auto p-0 hover:bg-transparent"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveTag(item.name);
                      }}
                      type="button"
                      aria-label={`Remove ${item}`}
                      title={`Remove ${item}`}
                    >
                      <X className="size-2.5 p-0" />
                    </button>
                  </Badge>
                </li>
              ))}
            </ul>
            <ChevronDown className="size-4 shrink-0 opacity-50" />
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent align="start" className="min-w-[350.67px] p-0">
        <Command className="w-full">
          <CommandInput placeholder="Search tags..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <div className="flex items-center justify-between gap-1 bg-background px-2 pt-2 pb-1 font-normal text-xs">
              <span className="text-muted-foreground text-xs">Tags</span>
              <button
                className="flex items-center gap-1 p-1 hover:bg-accent"
                type="button"
                onClick={() => {
                  onOpen("create-tag");
                }}
              >
                <Plus className="size-4 text-muted-foreground" />
                <span className="sr-only">Add a new tag</span>
              </button>
            </div>
            {tags && tags.data.length > 0 && (
              <CommandGroup>
                {tags.data.map((option) => (
                  <CommandItem
                    key={option.id}
                    onSelect={() => addTag(option.name)}
                    className="cursor-pointer hover:bg-sidebar!"
                  >
                    {option.name}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        selected.some((item) => item.id === option.id)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {tags && tags.data.length > 0 && <CommandSeparator />}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
