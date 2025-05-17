import BasicLayout from "../layouts/BasicLayout";
import { useFavorites } from "../hooks/useFavorites";
import SearchItem from "../components/SearchItem";
import BottomNav from "../components/BottomNav";
import { Link } from "react-router";

const FavouritesPage = () => {
  const { groupedFavoritesBySport } = useFavorites();

  return (
    <BasicLayout>
      <section className="p-4">
        <h2 className="text-2xl font-bold">Your favourites</h2>
      </section>
      <section className="">
        {/* {favorites.map((item) => (
          <Link
            key={item.id}
            to={`/detail`}
            state={{ item }}
            className="block transition-colors duration-100 hover:bg-gray-700"
          >
            <SearchItem item={item} key={item.id} />
          </Link>
        ))} */}
        {groupedFavoritesBySport &&
          Object.entries(groupedFavoritesBySport).map(([sport, items]) => (
            <div key={sport} className="flex w-full flex-col">
              <span className="w-full bg-red-700 px-4 py-1 font-bold text-white">
                {sport}
              </span>
              {items.map((item) => (
                <Link
                  key={item.id}
                  to={`/detail`}
                  state={{ item }}
                  className="block transition-colors duration-100 hover:bg-gray-700"
                >
                  <SearchItem item={item} />
                </Link>
              ))}
            </div>
          ))}
      </section>
      <BottomNav />
    </BasicLayout>
  );
};

export default FavouritesPage;
