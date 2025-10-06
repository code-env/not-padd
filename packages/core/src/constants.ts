import path from "path";
import fs from "fs";
import { Options } from "./types";

const BACKEND_SERVER = "https://notpadd-web.vercel.app/api/v1/";

const NOTPADD_DIR = path.join(process.cwd(), ".notpadd-content");
const GENERATED_DIR = path.join(NOTPADD_DIR, "generated");
const ALL_CONTENT_FILE = path.join(GENERATED_DIR, "allContent.js");
const INDEX_FILE = path.join(NOTPADD_DIR, "index.js");
const GITIGNORE_FILE = path.join(process.cwd(), ".gitignore");

export function ensureDirectoryExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export const defaultOptions: Options = {
  configPath: "notpadd.config.ts",
};

export {
  BACKEND_SERVER,
  NOTPADD_DIR,
  GENERATED_DIR,
  ALL_CONTENT_FILE,
  INDEX_FILE,
  GITIGNORE_FILE,
};
