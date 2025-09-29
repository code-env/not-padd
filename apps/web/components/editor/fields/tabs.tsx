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

import { Check, ChevronDown, Plus, X } from "lucide-react";
import { useState } from "react";

const TAGS = ["React", "Next.js", "Tailwind", "TypeScript", "JavaScript"];

export const TagSelector = () => {
  const [tags, setTags] = useState<string[]>(TAGS);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const selected = selectedTags;

  const handleToggleTag = (tagToToggle: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagToToggle)
        ? prev.filter((tag) => tag !== tagToToggle)
        : [...prev, tagToToggle]
    );
  };

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
                <li key={item}>
                  <Badge
                    className="font-normal bg-background"
                    variant="outline"
                  >
                    {item}
                    <button
                      className="ml-1 h-auto p-0 hover:bg-transparent"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTags(selected.filter((tag) => tag !== item));
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
              >
                <Plus className="size-4 text-muted-foreground" />
                <span className="sr-only">Add a new tag</span>
              </button>
            </div>
            {tags.length > 0 && (
              <CommandGroup>
                {tags.map((option) => (
                  <CommandItem
                    key={option}
                    onSelect={() => handleToggleTag(option)}
                    className="cursor-pointer hover:bg-sidebar!"
                  >
                    {option}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        selected.some((item) => item === option)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {tags.length > 0 && <CommandSeparator />}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
