import { BrowserRouter, Route, Routes } from "react-router";
import SearchPage from "./pages/SearchPage";
import DetailPage from "./pages/DetailPage";
import FavouritesPage from "./pages/FavouritesPage";
import ErrorPage from "./pages/ErrorPage";
import AboutPage from "./pages/AboutPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/detail" element={<DetailPage />} />
        <Route path="/favourites" element={<FavouritesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
