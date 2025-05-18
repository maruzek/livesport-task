import type { SearchResult } from "../types/SearchResult";
import placeholder from "../assets/placeholder.jpg";
import { Link } from "react-router";
import type { ReactNode } from "react";

type SearchItemProps = {
  item: SearchResult;
  rightButtonIcon?: ReactNode;
  rightButtonAction?: () => void;
};

const SearchItem = ({
  item,
  rightButtonIcon,
  rightButtonAction,
}: SearchItemProps) => {
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
    <article
      key={item.id}
      className="flex cursor-pointer flex-row items-center transition-colors duration-100 hover:bg-gray-700"
    >
      <Link
        to={`/detail`}
        state={{ item }}
        className="flex grow flex-row gap-3 px-4 py-3"
      >
        <figure
          className={`h-14 w-14 rounded-md bg-white p-1 ${item.type.name == "Player" || item.type.name == "PlayerInTeam" ? "pb-0" : ""}`}
        >
          <img
            src={img}
            alt={`Picture ${item.name}`}
            className={`h-full w-full`}
          />
        </figure>
        <div>
          <h4 className="text-md flex items-center gap-2 font-bold">
            {item.name}
            <img src={imgDefaultCountry} alt="" className="h-4 w-4" />
          </h4>
          <span className="text-sm text-gray-400">{team?.name}</span>
        </div>
      </Link>
      {rightButtonIcon && (
        <button
          onClick={() => {
            rightButtonAction?.();
          }}
          className="mx-4 my-3 ml-auto flex h-10 w-10 cursor-pointer items-center justify-center rounded-md bg-gray-700 transition-colors duration-100 hover:bg-gray-600 hover:text-white"
        >
          {rightButtonIcon}
        </button>
      )}
    </article>
  );
};

export default SearchItem;
