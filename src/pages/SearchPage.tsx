import SearchBar from "../components/SearchBar";

import { useApi } from "../hooks/useApi";
import SearchItem from "../components/SearchItem";
import SearchSkeleton from "../components/SearchSkeleton";
import SearchError from "../components/SearchError";
import SportGroup from "../components/SportGroup";
import BasicLayout from "../layouts/BasicLayout";
import { useSearchParams } from "react-router";
import { useEffect } from "react";

const SearchPage = () => {
  const { results, error, isLoading, retry } = useApi();
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const totalCount = results
    ? Object.values(results).reduce((sum, arr) => sum + arr.length, 0)
    : 0;

  useEffect(() => {
    if (q !== "") {
      document.title = `Search results for ${q} | FlashResults`;
    } else {
      document.title = "Search | FlashResults";
    }
  }, [q]);

  return (
    <BasicLayout displayBottomNav>
      <SearchBar />

      {error && <SearchError error={error} onRetry={retry} />}
      {isLoading && <SearchSkeleton />}
      {!results && !isLoading && !error && totalCount === 0 && q === "" && (
        <h2 className="mt-4 text-center text-lg font-bold text-white">
          Use the search bar to find your favorite teams or players
        </h2>
      )}
      {totalCount === 0 && q !== "" && !isLoading && !error && (
        <h2 className="mt-4 text-center text-lg font-bold text-white">
          No results found
        </h2>
      )}
      {results &&
        Object.entries(results).map(([sport, items]) => (
          <SportGroup key={sport} sport={sport}>
            {items.map((item) => (
              <SearchItem item={item} key={item.id} />
            ))}
          </SportGroup>
        ))}
    </BasicLayout>
  );
};

export default SearchPage;
