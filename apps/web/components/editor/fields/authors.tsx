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

import { Check, ChevronDown, Plus, X } from "lucide-react";
import { useState } from "react";
import type { Control } from "react-hook-form";
import type { UpdateArticleSchema } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/constants";
import { AUTHORS_QUERIES } from "@/lib/queries";

type Author = {
  id: string;
  name: string;
  email: string;
  image: string;
};

const AUTHORS: Author[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    image: "https://github.com/shadcn.png",
  },
  {
    id: "2",
    name: "Jane Doe",
    email: "jane.doe@example.com",
    image: "https://github.com/shadcn.png",
  },
  {
    id: "3",
    name: "John Smith",
    email: "john.smith@example.com",
    image: "https://github.com/shadcn.png",
  },
  {
    id: "4",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    image: "https://github.com/shadcn.png",
  },
];

type AuthorSelectorProps = {
  control: Control<UpdateArticleSchema>;
  defaultAuthors?: string[];
};

export const AuthorSelector = ({
  control,
  defaultAuthors = [],
}: AuthorSelectorProps) => {
  const [authors, setAuthors] = useState<Author[]>(AUTHORS);
  const [selectedAuthors, setSelectedAuthors] = useState<Author[]>([]);

  const { data: authors } = useQuery({
    queryKey: [QUERY_KEYS.AUTHORS],
    queryFn: () => AUTHORS_QUERIES.getAuthors(),
  });

  const selected = selectedAuthors;

  const handleToggleAuthor = (authorToToggle: Author) => {
    setSelectedAuthors((prev) =>
      prev.includes(authorToToggle)
        ? prev.filter((author) => author !== authorToToggle)
        : [...prev, authorToToggle]
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
                        setSelectedAuthors(
                          selected.filter((author) => author !== item)
                        );
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
              <span className="text-muted-foreground text-xs">Authors</span>
              <button
                className="flex items-center gap-1 p-1 hover:bg-accent"
                type="button"
              >
                <Plus className="size-4 text-muted-foreground" />
                <span className="sr-only">Add a new author</span>
              </button>
            </div>
            {authors.length > 0 && (
              <CommandGroup>
                {authors.map((option) => (
                  <CommandItem
                    key={option.id}
                    onSelect={() => handleToggleAuthor(option)}
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
                        selected.some((item) => item.id === option.id)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {authors.length > 0 && <CommandSeparator />}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
