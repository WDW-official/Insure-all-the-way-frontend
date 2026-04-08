"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const useUpdateSearchParams = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [currentSearch, setCurrentSearch] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentSearch(window.location.search || "");
    }
  }, [pathname]);

  const getParams = () => {
    if (typeof window !== "undefined") {
      return new URLSearchParams(window.location.search || currentSearch);
    }

    return new URLSearchParams(currentSearch);
  };

  const pushParams = (params: URLSearchParams, scroll?: boolean) => {
    const nextSearch = params.toString();
    const nextUrl = nextSearch ? `${pathname}?${nextSearch}` : pathname;

    setCurrentSearch(nextSearch ? `?${nextSearch}` : "");
    router.push(nextUrl, {
      scroll: scroll || false,
    });
  };

  const updateSearchParams = (
    key: string,
    value: string | undefined,
    method: "set" | "delete" | "get",
    scroll?: boolean
  ) => {
    const params = getParams();

    if (method === "get") {
      return params.get(key);
    }

    if (method === "delete") {
      params.delete(key);
    } else if (value) {
      params.set(key, value);
    }

    pushParams(params, scroll);
  };

  const updateConcurrentSearchParams = (
    updates: { [key: string]: string | undefined },
    method: "set" | "delete" | "get",
    scroll?: boolean
  ) => {
    const params = getParams();

    if (method === "get") {
      return Object.keys(updates).reduce((acc, key) => {
        acc[key] = params.get(key);
        return acc;
      }, {} as Record<string, string | null>);
    }

    Object.entries(updates).forEach(([key, value]) => {
      if (method === "delete") {
        params.delete(key);
      } else if (value !== undefined) {
        params.set(key, value);
      }
    });

    pushParams(params, scroll);
  };

  return { updateSearchParams, updateConcurrentSearchParams };
};

export default useUpdateSearchParams;
