import { useMemo } from "react";
import type { SearchResult } from "../types/SearchResult";
import useLocalStorage from "./useLocalStorage";

export const useFavorites = () => {
  const [favorites, setFavorites] = useLocalStorage<SearchResult[]>(
    "favorites",
    [],
  );

  const isFavorite = (item: SearchResult) => {
    return favorites.some((saved) => saved.id === item.id);
  };

  const toggleFavorite = (item: SearchResult) => {
    if (isFavorite(item)) {
      setFavorites((prev) =>
        prev.filter((favorite) => favorite.id !== item.id),
      );
    } else {
      setFavorites((prev) => [...prev, item]);
    }
  };

  const groupedFavoritesBySport = useMemo(() => {
    if (!favorites || favorites.length === 0) {
      return null; // Or an empty object {} if you prefer
    }
    return favorites.reduce(
      (acc: Record<string, SearchResult[]>, item) => {
        const key = item.sport.name;
        (acc[key] = acc[key] || []).push(item);
        return acc;
      },
      {} as Record<string, SearchResult[]>,
    );
  }, [favorites]);

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    groupedFavoritesBySport,
  } as const;
};
