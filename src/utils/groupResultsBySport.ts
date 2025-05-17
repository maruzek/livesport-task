import type { SearchResult } from "../types/SearchResult";

const groupResultsBySport = (results: SearchResult[]) => {
  if (!results || results.length === 0) {
    return null; // Or an empty object {} if you prefer
  }

  const filteredData: Record<string, SearchResult[]> = results.reduce(
    (acc: Record<string, SearchResult[]>, item) => {
      const key = item.sport.name;

      (acc[key] = acc[key] || []).push(item);
      return acc;
    },
    {} as Record<string, SearchResult[]>,
  );

  return filteredData;
};

export default groupResultsBySport;
