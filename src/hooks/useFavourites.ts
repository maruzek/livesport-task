import type { SearchResult } from "../types/SearchResult";
import useLocalStorage from "./useLocalStorage";

const useFavorites = () => {
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

  return {
    favorites,
    isFavorite,
    toggleFavorite,
  } as const;
};

export default useFavorites;
