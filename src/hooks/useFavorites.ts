import { useMemo } from "react";
import type { SearchResult } from "../types/SearchResult";
import useLocalStorage from "./useLocalStorage";
import groupResultsBySport from "../utils/groupResultsBySport";

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
    return groupResultsBySport(favorites);
  }, [favorites]);

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    groupedFavoritesBySport,
  } as const;
};
