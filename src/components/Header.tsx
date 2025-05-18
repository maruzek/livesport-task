import { ArrowLeft, Info } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";

type HeaderProps = {
  title?: string;
};

const Header = ({ title = "FlashResults" }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBackButtonClick = () => {
    if (location.key !== "default") {
      navigate(-1);
    } else {
      if (location.pathname !== "/") {
        navigate("/", { replace: true });
      }
    }
  };

  return (
    <header className="flex h-16 w-full shrink-0 items-center justify-between bg-gray-700 p-4">
      <div className="flex items-center gap-3">
        <button
          className="cursor-pointer transition-colors duration-100 hover:text-gray-400"
          onClick={handleBackButtonClick}
          aria-label="Go back"
        >
          <ArrowLeft />
        </button>
        <h1>{title}</h1>
      </div>
      <Link
        to="/about"
        className="cursor-pointer transition-colors duration-100 hover:text-gray-400"
        aria-label="About"
      >
        <Info />
      </Link>
    </header>
  );
};

export default Header;
