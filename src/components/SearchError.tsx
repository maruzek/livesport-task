import { useState } from "react";
import type { Error } from "../types/Error";

type SearchErrorProps = {
  error: Error;
  onRetry: () => void;
};

const SearchError = ({ error, onRetry }: SearchErrorProps) => {
  const [isDetailOpened, setIsDetailOpened] = useState<boolean>(false);

  return (
    <div className="my-4 flex w-full flex-col items-center justify-center gap-2 p-4">
      <h2 className="font-bold">{error.message}</h2>
      <div>
        <button
          onClick={() => onRetry()}
          className="cursor-pointer rounded-md border border-red-800 bg-red-700 px-4 py-2 text-white transition-colors duration-100 hover:bg-red-800"
        >
          Refresh
        </button>
        <button
          className="ml-4 cursor-pointer rounded-md border-2 border-red-800 px-4 py-2 text-white transition-colors duration-100 hover:bg-red-800"
          onClick={() => setIsDetailOpened(!isDetailOpened)}
        >
          {isDetailOpened ? "Hide details" : "Show details"}
        </button>
      </div>
      {isDetailOpened && (
        <div className="mt-4 w-full rounded-md border border-gray-500 p-4 text-white">
          <h3 className="font-bold">Error details</h3>
          <p>{error.detail}</p>
        </div>
      )}
    </div>
  );
};

export default SearchError;
