import { ArrowLeft, Info } from "lucide-react";
import { useLocation, useNavigate } from "react-router";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBackButtonClick = () => {
    if (location.key) {
      navigate(-1);
    } else {
      navigate("/", { replace: true });
    }
  };

  return (
    <header className="flex h-16 w-full items-center justify-between bg-gray-700 p-4">
      <div className="flex items-center gap-3">
        <button
          className="cursor-pointer transition-colors duration-100 hover:text-gray-400"
          onClick={handleBackButtonClick}
        >
          <ArrowLeft />
        </button>
        <h1>FlashResults</h1>
      </div>
      <span className="cursor-pointer transition-colors duration-100 hover:text-gray-400">
        <Info />
      </span>
    </header>
  );
};

export default Header;
