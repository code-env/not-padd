"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";

type Heading = {
  level: number;
  text: string;
  slug: string;
};

type TOCProps = {
  headings: Heading[];
  className?: string;
};

export function TableOfContents({ headings, className }: TOCProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-100px 0px -66%",
      }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.slug);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      headings.forEach((heading) => {
        const element = document.getElementById(heading.slug);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [headings]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav
      className={cn(
        "sticky top-20 hidden xl:block w-64 h-[calc(100vh-5rem)] overflow-y-auto pb-8",
        className
      )}
    >
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-foreground mb-4">
          On this page
        </h2>
        <ul className="space-y-1.5">
          {headings.map((heading) => {
            const isActive = activeId === heading.slug;
            return (
              <li key={heading.slug}>
                <Link
                  href={`#${heading.slug}`}
                  className={cn(
                    "block text-sm transition-colors hover:text-foreground py-1",
                    heading.level === 1 && "font-medium pl-0",
                    heading.level === 2 && "pl-4",
                    heading.level === 3 && "pl-8",
                    heading.level === 4 && "pl-12",
                    isActive
                      ? "text-foreground font-medium border-l-2 border-foreground pl-3 -ml-2"
                      : "text-muted-foreground"
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById(heading.slug);
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth", block: "start" });
                      window.history.pushState(null, "", `#${heading.slug}`);
                    }
                  }}
                >
                  {heading.text}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
