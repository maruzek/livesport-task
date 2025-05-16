import { useSearchParams } from "react-router";

type FilterButtonProps = {
  children: React.ReactNode;
  onFilterChange: (filter: string) => void;
  activeFilter?: string;
  filterValue: string;
};

const FilterButton = ({
  children,
  filterValue,
  onFilterChange,
  activeFilter,
}: FilterButtonProps) => {
  const [searhParams, setSearchParams] = useSearchParams();

  const handleFilterClick = () => {
    onFilterChange(filterValue);
    setSearchParams({
      q: searhParams.get("q") ?? "",
      filter: filterValue ?? "all",
    });
  };

  return (
    <button
      onClick={handleFilterClick}
      className={`flex cursor-pointer items-center justify-center rounded-md p-2 text-white ${filterValue == activeFilter ? "bg-red-700" : "bg-gray-700"} transition-colors duration-100 hover:bg-red-800`}
    >
      {children}
    </button>
  );
};

export default FilterButton;
