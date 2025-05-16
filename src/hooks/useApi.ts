import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import type { Error } from "../types/Error";
import type { SearchResult } from "../types/SearchResult";

export const useApi = () => {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const sportIds = "1,2,3,4,5,6,7,8,9";
  const typeIds = searchParams.get("type-ids") ?? "1,2,3,4";
  //   const typeIds = searchParams.get("type-ids") ?? "all";

  const [results, setResults] = useState<Record<string, SearchResult[]> | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      if (!q) return;

      setIsLoading(true);
      setError(null);
      setResults(null);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}?q=${q}&lang-id=1&project-id=602&project-type-id=1&sport-ids=${sportIds}&type-ids=${typeIds}`,
      );

      if (!response.ok) {
        const data = await response.json();

        setError({
          message: "There was an error while loading the results",
          code: response.status,
          detail: data.message,
        });

        throw new Error("Network response was not ok");
      }

      const data: SearchResult[] = await response.json();

      console.log(data);

      const filteredData: Record<string, SearchResult[]> = data.reduce(
        (acc: Record<string, SearchResult[]>, item) => {
          const key = item.sport.name;

          (acc[key] = acc[key] || []).push(item);
          return acc;
        },
        {} as Record<string, SearchResult[]>,
      );

      console.log(filteredData);

      setResults(filteredData);
    } catch (error) {
      console.log(error);
      // if (error instanceof Error) {
      //   setError({ message: error.message });
      // } else {
      //   setError({ message: "An unknown error occurred" });
      // }
    } finally {
      setIsLoading(false);
    }
  }, [q, typeIds, sportIds]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { results, isLoading, error, retry: fetchData };
};
