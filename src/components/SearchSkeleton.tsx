const SearchSkeleton = () => {
  return (
    <div
      className="flex w-full flex-col space-y-4"
      data-testid="search-skeleton"
    >
      <div className="ml-4 h-6 w-1/4 animate-pulse rounded bg-gray-600" />
      <div className="">
        <div className="w-full bg-gray-700 px-4 py-2">
          <div className="h-5 w-1/3 animate-pulse rounded bg-gray-600 p-2" />
        </div>
        <div className="flex w-full flex-col space-y-2 px-4 pt-4">
          <div className="flex w-full animate-pulse flex-row space-x-3">
            <div className="h-12 w-12 rounded bg-gray-600" />
            <div className="flex w-3/4 flex-col gap-2">
              <div className="h-4 w-3/4 rounded bg-gray-600" />
              <div className="h-4 w-1/4 rounded bg-gray-600" />
            </div>
          </div>
          <div className="flex w-full animate-pulse flex-row space-x-3">
            <div className="h-12 w-12 rounded bg-gray-600" />
            <div className="flex w-3/4 flex-col gap-2">
              <div className="h-4 w-3/4 rounded bg-gray-600" />
              <div className="h-4 w-1/4 rounded bg-gray-600" />
            </div>
          </div>
          <div className="flex w-full animate-pulse flex-row space-x-3">
            <div className="h-12 w-12 rounded bg-gray-600" />
            <div className="flex w-3/4 flex-col gap-2">
              <div className="h-4 w-3/4 rounded bg-gray-600" />
              <div className="h-4 w-1/4 rounded bg-gray-600" />
            </div>
          </div>
        </div>
      </div>
      <div className="">
        <div className="w-full bg-gray-700 px-4 py-2">
          <div className="h-5 w-1/3 animate-pulse rounded bg-gray-600 p-2" />
        </div>
        <div className="flex w-full flex-col space-y-2 px-4 pt-4">
          <div className="flex w-full animate-pulse flex-row space-x-3">
            <div className="h-12 w-12 rounded bg-gray-600" />
            <div className="flex w-3/4 flex-col gap-2">
              <div className="h-4 w-3/4 rounded bg-gray-600" />
              <div className="h-4 w-1/4 rounded bg-gray-600" />
            </div>
          </div>
          <div className="flex w-full animate-pulse flex-row space-x-3">
            <div className="h-12 w-12 rounded bg-gray-600" />
            <div className="flex w-3/4 flex-col gap-2">
              <div className="h-4 w-3/4 rounded bg-gray-600" />
              <div className="h-4 w-1/4 rounded bg-gray-600" />
            </div>
          </div>
          <div className="flex w-full animate-pulse flex-row space-x-3">
            <div className="h-12 w-12 rounded bg-gray-600" />
            <div className="flex w-3/4 flex-col gap-2">
              <div className="h-4 w-3/4 rounded bg-gray-600" />
              <div className="h-4 w-1/4 rounded bg-gray-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchSkeleton;
