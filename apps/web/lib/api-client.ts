import axios from "axios";
import { env } from "@notpadd/env/client";
import type { APIResponse } from "./types";

export const apiClient = axios.create({
  baseURL: `${env.NEXT_PUBLIC_BACKEND_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
