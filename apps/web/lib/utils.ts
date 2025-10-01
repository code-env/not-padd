import { z } from "zod";

export const REQUIRED_STRING = z.string().min(2).trim();

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

export function formatSize(size: number): string {
  if (size < 1024) {
    return `${size} B`;
  }
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} KB`;
  }
  return `${(size / 1024 / 1024).toFixed(2)} MB`;
}
