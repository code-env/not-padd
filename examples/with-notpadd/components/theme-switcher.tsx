"use client";

import { useTheme } from "next-themes";
import { Button } from "@notpadd/ui/components/button";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      variant="outline"
    >
      Toggle Theme
    </Button>
  );
}
