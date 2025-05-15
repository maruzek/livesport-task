const SearchBar = () => {
  return (
    <div>
      <form className="">
        <div className="flex w-full items-center justify-center bg-gray-800 p-4 focus:ring-1 focus:ring-red-500">
          <input
            type="text"
            placeholder="Search..."
            className="w-full rounded-md rounded-tr-none rounded-br-none border border-gray-600 bg-gray-700 p-2 text-white focus:ring-1 focus:ring-red-500 focus:outline-none"
          />
          <button className="cursor-pointer rounded-md rounded-tl-none rounded-bl-none border border-red-800 bg-red-700 px-4 py-2 text-white transition-colors duration-100 hover:bg-red-800">
            Search
          </button>
        </div>
      </form>
      <div className="flex w-full flex-row items-center justify-start gap-2 px-4">
        <div className="flex items-center justify-center rounded-md bg-red-700 p-2 text-white">
          <span>Vše</span>
        </div>
        <div className="flex items-center justify-center rounded-md bg-red-700 p-2 text-white">
          <span>Soutěže</span>
        </div>
        <div className="flex items-center justify-center rounded-md bg-red-700 p-2 text-white">
          <span>Týmy</span>
        </div>
      </div>
      <hr className="my-3 text-gray-500" />
    </div>
  );
};

export default SearchBar;
