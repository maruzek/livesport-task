import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import type { Error } from "../types/Error";
import type { SearchResult } from "../types/SearchResult";

export const useApi = () => {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const sportIds = "1,2,3,4,5,6,7,8,9";
  const typeIds = searchParams.get("type-ids") ?? "1,2,3,4";

  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    console.log("test");
    const fetchData = async () => {
      if (!q) return;

      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}?q=${q}&lang-id=1&project-id=602&project-type-id=1&sport-ids=${sportIds}&type-ids=${typeIds}`,
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data: SearchResult[] = await response.json();

      console.log(data);
      setResults(data);
    };

    fetchData();
  }, [q, sportIds, typeIds]);

  return { results, isLoading, error };
};
