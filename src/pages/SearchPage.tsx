import Header from "../components/Header";
import SearchBar from "../components/SearchBar";

import placeholder from "../assets/placeholder.jpg";

const SearchPage = () => {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <div className="flex h-screen w-full flex-col bg-gray-800 shadow-2xl shadow-zinc-900 sm:w-3/5 md:w-3/5 lg:w-2/5 xl:w-1/4">
        <Header />
        <main>
          <SearchBar />

          <section className="flex w-full flex-col">
            <span className="w-full bg-red-800 px-4 py-1 font-bold text-white">
              Fotbal
            </span>
            <article className="flex flex-row px-4 pt-4">
              <figure className="mr-3 w-1/8">
                <img src={placeholder} alt="" />
              </figure>
              <div>
                <h4 className="text-md font-bold">SK Slavia Praha</h4>
              </div>
            </article>
            <article className="flex flex-row px-4 pt-4">
              <figure className="mr-3 w-1/8">
                <img src={placeholder} alt="" />
              </figure>
              <div>
                <h4 className="text-md font-bold">FC Slavia Karlovy Vary</h4>
              </div>
            </article>
          </section>
          <section className="mt-4 flex w-full flex-col">
            <span className="w-full bg-red-800 px-4 py-1 font-bold text-white">
              Hokej
            </span>
            <article className="flex flex-row px-4 pt-4">
              <figure className="mr-3 w-1/8">
                <img src={placeholder} alt="" />
              </figure>
              <div>
                <h4 className="text-md font-bold">HC Slavia Praha</h4>
              </div>
            </article>
          </section>
        </main>
      </div>
    </div>
  );
};

export default SearchPage;
