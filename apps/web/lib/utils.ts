import { z } from "zod";

export const REQUIRED_STRING = z.string().min(2);

export function replaceOrganizationWithWorkspace(input: string): string {
  return input.replace(/organization/gi, (match) => {
    return match
      .split("")
      .map((char, i) => {
        const replacementChar = "workspace"[i];
        return char === char.toUpperCase()
          ? replacementChar?.toUpperCase()
          : replacementChar?.toLowerCase();
      })
      .join("");
  });
}
