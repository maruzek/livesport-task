import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { useSearchParams } from "react-router";
import FilterButton from "./FilterButton";
import { CircleX, Search } from "lucide-react";

const SearchBar = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") ?? "");
  const [activeFilter, setActiveFilter] = useState<string>(
    searchParams.get("filter") ?? "all",
  );
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchParams({ q: searchQuery, filter: activeFilter });
  };

  const handleClear = () => {
    setSearchQuery("");
    setActiveFilter("all");
    setSearchParams({ q: "", filter: "all" });

    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  return (
    <div>
      <form onSubmit={(e) => handleSearch(e)}>
        <div className="relative flex w-full items-center justify-center bg-gray-800 p-4 focus:ring-1 focus:ring-red-500">
          <input
            type="text"
            placeholder="Search..."
            className="w-full rounded-md rounded-tr-none rounded-br-none border border-gray-600 bg-gray-700 p-2 text-white focus:ring-1 focus:ring-red-500 focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            ref={searchInputRef}
          />
          {searchQuery && (
            <button
              type="button"
              className="absolute right-23 cursor-pointer text-gray-400 transition-colors duration-100 hover:text-white"
              onClick={handleClear}
              aria-label="Clear search"
            >
              <CircleX />
            </button>
          )}
          <button
            className="cursor-pointer rounded-md rounded-tl-none rounded-bl-none border border-red-800 bg-red-700 px-4 py-2 text-white transition-colors duration-100 hover:bg-red-800"
            aria-label="Search"
          >
            <Search />
          </button>
        </div>
      </form>
      <div className="flex w-full flex-row items-center justify-start gap-2 px-4">
        <FilterButton
          filterValue="all"
          onFilterChange={setActiveFilter}
          activeFilter={activeFilter}
        >
          All
        </FilterButton>
        <FilterButton
          filterValue="teams"
          onFilterChange={setActiveFilter}
          activeFilter={activeFilter}
        >
          Teams
        </FilterButton>
        <FilterButton
          filterValue="competitions"
          onFilterChange={setActiveFilter}
          activeFilter={activeFilter}
        >
          Competitions
        </FilterButton>
      </div>
      <hr className="my-5 text-gray-500" />
    </div>
  );
};

export default SearchBar;
