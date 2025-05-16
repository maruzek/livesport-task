import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import type { Error } from "../types/Error";
import type { SearchResult } from "../types/SearchResult";

export const useApi = () => {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const sportIds = "1,2,3,4,5,6,7,8,9";
  const filter = searchParams.get("filter") ?? "all";
  let typeIds = "1,2,3,4";

  if (filter === "all") {
    typeIds = "1,2,3,4";
  } else if (filter === "teams") {
    typeIds = "2,3,4";
  } else if (filter === "competitions") {
    typeIds = "1";
  }

  const [results, setResults] = useState<Record<string, SearchResult[]> | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      if (!q) {
        setResults(null);
        return;
      }

      setIsLoading(true);
      setError(null);
      setResults(null);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}?q=${q}&lang-id=1&project-id=602&project-type-id=1&sport-ids=${sportIds}&type-ids=${typeIds}`,
      );

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw {
          type: "http",
          status: response.status,
          message: body.message ?? response.statusText,
        };
      }

      const data: SearchResult[] = await response.json();

      const filteredData: Record<string, SearchResult[]> = data.reduce(
        (acc: Record<string, SearchResult[]>, item) => {
          const key = item.sport.name;

          (acc[key] = acc[key] || []).push(item);
          return acc;
        },
        {} as Record<string, SearchResult[]>,
      );

      setResults(filteredData);
    } catch (err: any) {
      if (!navigator.onLine || err instanceof TypeError) {
        setError({
          code: 0,
          message: "Internet connection appears to be offline.",
          detail: err.message || "Please check your network and retry.",
        });
      } else if (err.type === "http") {
        let message: string = "An error occurred.";

        switch (err.status) {
          case 400:
            message =
              "Bad request. Please check your input. An importat value is probably missing.";
            break;
          case 401:
            message = "Unauthorized. Please log in.";
            break;
          case 403:
            message = "Forbidden. You don't have permission to do that.";
            break;
          case 404:
            message = "Not found. The requested resource could not be found.";
            break;
          case 422:
            message = "Invalid values. Please check your input.";
            break;
          case 500:
            message = "Internal server error. Please try again later.";
            break;
          case 503:
            message = "Service unavailable. Please try again later.";
            break;
        }
        setError({
          code: err.status,
          message: message,
          detail: err.message,
        });
      } else {
        setError({
          code: 500,
          message: "An unexpected error occurred.",
          detail: err.message || "",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [q, typeIds, sportIds]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { results, isLoading, error, retry: fetchData };
};
