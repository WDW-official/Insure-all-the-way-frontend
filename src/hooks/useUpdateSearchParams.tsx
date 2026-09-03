"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const SEARCH_PARAMS_CHANGE_EVENT = "iatw-search-params-change";

const useUpdateSearchParams = () => {
  const pathname = usePathname();
  const [currentSearch, setCurrentSearch] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const syncSearchParams = (event?: Event) => {
      const nextSearch =
        event instanceof CustomEvent && typeof event.detail === "string"
          ? event.detail
          : window.location.search || "";

      setCurrentSearch(nextSearch);
    };

    syncSearchParams();

    window.addEventListener("popstate", syncSearchParams);
    window.addEventListener(SEARCH_PARAMS_CHANGE_EVENT, syncSearchParams);

    return () => {
      window.removeEventListener("popstate", syncSearchParams);
      window.removeEventListener(SEARCH_PARAMS_CHANGE_EVENT, syncSearchParams);
    };
  }, [pathname]);

  const getParams = () => {
    if (typeof window !== "undefined") {
      return new URLSearchParams(currentSearch || window.location.search);
    }

    return new URLSearchParams(currentSearch);
  };

  const pushParams = (params: URLSearchParams, scroll?: boolean) => {
    const nextSearch = params.toString();
    const nextUrl = nextSearch ? `${pathname}?${nextSearch}` : pathname;
    const formattedSearch = nextSearch ? `?${nextSearch}` : "";

    setCurrentSearch(formattedSearch);

    if (typeof window !== "undefined") {
      window.history.pushState(null, "", nextUrl);
      window.dispatchEvent(
        new CustomEvent(SEARCH_PARAMS_CHANGE_EVENT, {
          detail: formattedSearch,
        })
      );
    }

    if (scroll) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
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
