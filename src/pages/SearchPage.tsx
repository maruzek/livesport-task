import Header from "../components/Header";
import SearchBar from "../components/SearchBar";

import { useApi } from "../hooks/useApi";
import SearchItem from "../components/SearchItem";
import SearchSkeleton from "../components/SearchSkeleton";
import SearchError from "../components/SearchError";
import { Link } from "react-router";

const SearchPage = () => {
  const { results, error, isLoading, retry } = useApi();
  const totalCount = results
    ? Object.values(results).reduce((sum, arr) => sum + arr.length, 0)
    : 0;

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <div className="flex h-screen w-full flex-col bg-gray-800 shadow-2xl shadow-zinc-900 sm:w-3/5 md:w-3/5 lg:w-2/5 xl:w-1/4">
        <Header />
        <main className="flex w-full flex-col overflow-y-scroll pb-5">
          <SearchBar />

          <div>
            {error && <SearchError error={error} onRetry={retry} />}
            {isLoading && <SearchSkeleton />}
            {!results && !isLoading && !error && (
              <div className="flex w-full flex-col items-center justify-center p-4">
                <h2 className="text-center text-lg font-bold text-white">
                  Use the search bar to find your favorite teams or players
                </h2>
              </div>
            )}
            {results && totalCount === 0 && (
              <div className="flex w-full flex-col items-center justify-center p-4">
                <h2 className="text-lg font-bold text-white">
                  No results found
                </h2>
              </div>
            )}
            {results &&
              Object.entries(results).map(([sport, items]) => (
                <div key={sport} className="flex w-full flex-col">
                  <span className="mt-3 w-full bg-red-700 px-4 py-1 font-bold text-white">
                    {sport}
                  </span>
                  {items.map((item) => (
                    <Link
                      key={item.id}
                      to={`/detail`}
                      state={{ item }}
                      className="block hover:bg-gray-700"
                    >
                      <SearchItem item={item} />
                    </Link>
                  ))}
                </div>
              ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SearchPage;
