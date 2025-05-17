import BasicLayout from "../layouts/BasicLayout";
import { useFavorites } from "../hooks/useFavorites";
import SearchItem from "../components/SearchItem";
import BottomNav from "../components/BottomNav";
import SportGroup from "../components/SportGroup";
import { Star } from "lucide-react";

const FavouritesPage = () => {
  const { groupedFavoritesBySport, toggleFavorite } = useFavorites();

  return (
    <BasicLayout>
      <section className="p-4">
        <h2 className="text-2xl font-bold">Your favourites</h2>
      </section>
      <section className="">
        {groupedFavoritesBySport &&
          Object.entries(groupedFavoritesBySport).map(([sport, items]) => (
            <SportGroup key={sport} sport={sport}>
              {items.map((item) => (
                <SearchItem
                  item={item}
                  rightButtonIcon={<Star fill="#fff" strokeWidth={1} />}
                  rightButtonAction={() => toggleFavorite(item)}
                  key={item.id}
                />
              ))}
            </SportGroup>
          ))}
      </section>
      <BottomNav />
    </BasicLayout>
  );
};

export default FavouritesPage;
