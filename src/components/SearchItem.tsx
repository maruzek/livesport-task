import type { SearchResult } from "../types/SearchResult";
import placeholder from "../assets/placeholder.jpg";

type SearchItemProps = {
  item: SearchResult;
};

const SearchItem = ({ item }: SearchItemProps) => {
  // Nezobrazuje loga lig, protože je to jiný typ
  const img = item.images.filter((img) => img.variantTypeId == 15)[0]?.path
    ? `${import.meta.env.VITE_IMG_URL}${item.images.filter((img) => img.variantTypeId == 15)[0]?.path}`
    : placeholder;

  const imgDefaultCountry =
    `${import.meta.env.VITE_IMG_URL}${item.defaultCountry.images.filter((img) => img.variantTypeId == 87)[0]?.path}` ||
    "";

  const team = item.teams?.filter(
    (team) => team.participantType.name == "Team",
  )[0];

  return (
    <article key={item.id} className="flex flex-row px-4 py-3">
      <figure
        className={`mr-3 h-14 w-14 rounded-md bg-white p-1 ${(item.type.name == "Player" || item.type.name == "PlayerInTeam") && "pb-0"}`}
      >
        <img
          src={img}
          alt={`Picture ${item.name}`}
          className={`block h-full w-full object-contain`}
        />
      </figure>
      <div>
        <h4 className="text-md flex items-center gap-2 font-bold">
          {item.name}
          <img src={imgDefaultCountry} alt="" className="h-4 w-4" />
        </h4>
        <span className="text-sm text-gray-400">{team?.name}</span>
      </div>
    </article>
  );
};

export default SearchItem;
