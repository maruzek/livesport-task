import { useLocation } from "react-router";
import type { SearchResult } from "../types/SearchResult";
import BasicLayout from "../layouts/BasicLayout";
import { useEffect } from "react";
import placeholder from "../assets/placeholder.jpg";
import { Star } from "lucide-react";
import { useFavorites } from "../hooks/useFavorites";

const DetailPage = () => {
  // puvodni varianta pouzivala useParams, ale to nedavalo smysl a bylo to neprehledne
  // const { entityId: id } = useParams();
  const { state } = useLocation();
  const { toggleFavorite, isFavorite } = useFavorites();

  const item = (state as { item?: SearchResult })?.item;

  useEffect(() => {
    if (!item) {
      document.title = "Not found";
    }

    if (item) {
      const defaultTeam = item.teams?.filter(
        (team) => team.participantType.name == "Team",
      )[0]?.name;
      document.title = `${item.name} (${defaultTeam}) stats | FlashVýsledky`;
    }
  }, [item]);

  if (!item) {
    return (
      <div className="p-4 text-white">
        <p>No data available.</p>
      </div>
    );
  }

  const img = item.images.filter((img) => img.variantTypeId == 15)[0]?.path
    ? `${import.meta.env.VITE_IMG_URL}${item.images.filter((img) => img.variantTypeId == 15)[0]?.path}`
    : placeholder;

  const imgDefaultCountry =
    `${import.meta.env.VITE_IMG_URL}${item.defaultCountry.images.filter((img) => img.variantTypeId == 87)[0]?.path}` ||
    "";

  const handleAddToFav = () => {
    toggleFavorite(item);
  };

  return (
    <BasicLayout>
      <section className="flex w-full flex-col bg-gray-800">
        <h3 className="px-4 pt-3 text-lg font-bold">
          {item.sport.name} - {item.gender.name}
        </h3>
        <hr className="mt-2 mb-2 text-gray-500" />
        <div className="flex flex-row items-center justify-between p-4">
          <div className="flex flex-row gap-4">
            <div className="h-25 w-25 rounded-md bg-white p-1">
              <img src={img} alt="" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{item.name}</h2>
              <p className="mt-1 flex items-center gap-1 text-sm text-gray-400">
                <img
                  src={imgDefaultCountry}
                  alt={`Flag of ${item.defaultCountry.name}`}
                  className="h-4 w-4"
                />
                {item.defaultCountry.name}
              </p>
            </div>
          </div>
          <button
            onClick={handleAddToFav}
            className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-md bg-gray-700 transition-colors duration-100 hover:bg-gray-600 hover:text-white ${isFavorite(item) ? "text-white" : "text-gray-400"}`}
          >
            <Star
              fill={isFavorite(item) ? "#fff" : "transparent"}
              strokeWidth={isFavorite(item) ? 1 : 2}
            />
          </button>
        </div>
      </section>
      <section>
        {item.type.name === "PlayerInTeam" && (
          <>
            <div className="w-full bg-gray-700 p-4">
              <h4 className="mb-3 text-xl font-bold">Teams</h4>
              <ul className="grid grid-cols-1 gap-2">
                {item.teams?.map((team) => (
                  <li
                    key={team.id}
                    className="flex items-center justify-between rounded-md bg-gray-800 p-3 transition-colors hover:bg-gray-600"
                  >
                    <span>{team.name}</span>
                    <span className="text-sm text-gray-400">
                      {team.participantType.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </section>
    </BasicLayout>
  );
};

export default DetailPage;
