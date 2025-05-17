import BasicLayout from "../layouts/BasicLayout";
import { useFavorites } from "../hooks/useFavorites";
import SearchItem from "../components/SearchItem";
import BottomNav from "../components/BottomNav";
import { Link } from "react-router";

const FavouritesPage = () => {
  const { favorites } = useFavorites();

  return (
    <BasicLayout>
      <section className="p-4">
        <h2 className="text-2xl font-bold">Your favourites</h2>
      </section>
      <section className="">
        {favorites.map((item) => (
          <Link
            key={item.id}
            to={`/detail`}
            state={{ item }}
            className="block transition-colors duration-100 hover:bg-gray-700"
          >
            <SearchItem item={item} key={item.id} />
          </Link>
        ))}
      </section>
      <BottomNav />
    </BasicLayout>
  );
};

export default FavouritesPage;
