import { Search, Star } from "lucide-react";
import { NavLink } from "react-router";

const BottomNav = () => {
  return (
    <nav className="z-10 flex w-full shrink-0 items-center justify-center bg-gray-800">
      <ul className="flex h-full w-full items-center justify-between">
        <li className="nav-li w-1/2 text-center">
          <NavLink
            to="/"
            className="flex w-full flex-col items-center px-4 py-2 text-white transition-colors duration-100 hover:bg-gray-700"
          >
            <Search />
            <span className="text-sm">Search</span>
          </NavLink>
        </li>
        <li className="nav-li w-1/2 text-center">
          <NavLink
            to="/favourites"
            className="flex flex-col items-center px-4 py-2 text-white transition-colors duration-100 hover:bg-gray-700"
          >
            <Star />
            <span className="text-sm">Favorites</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default BottomNav;
