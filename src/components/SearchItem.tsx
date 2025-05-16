import type { SearchResult } from "../types/SearchResult";
import placeholder from "../assets/placeholder.jpg";

type SearchItemProps = {
  item: SearchResult;
};

const SearchItem = ({ item }: SearchItemProps) => {
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
    <article key={item.id} className="flex flex-row px-4 pt-4">
      <figure className="mr-3 w-1/8 rounded-md bg-white">
        <img
          src={img}
          alt={`Picture ${item.name}`}
          className={`p-1 ${item.type.name == "Player" || (item.type.name == "PlayerInTeam" && "pb-0")}`}
        />
      </figure>
      <div>
        <h4 className="text-md flex items-center gap-2 font-bold">
          {item.name}
          <img src={imgDefaultCountry} alt="" className="h-4 w-4" />
        </h4>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>{team?.name}</span>
        </div>
      </div>
    </article>
  );
};

export default SearchItem;
