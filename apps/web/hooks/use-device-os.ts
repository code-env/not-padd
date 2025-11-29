import { useEffect, useState } from "react";

export function useDesktopOS() {
  const [os, setOS] = useState<"mac" | "windows" | "linux" | "unknown">(
    "unknown"
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const platform = navigator.userAgent.toLowerCase();

    if (platform.includes("mac")) {
      setOS("mac");
    } else if (platform.includes("win")) {
      setOS("windows");
    } else if (platform.includes("linux")) {
      setOS("linux");
    } else {
      setOS("unknown");
    }
  }, []);

  return os;
}
