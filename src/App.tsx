import { BrowserRouter, Route, Routes } from "react-router";
import SearchPage from "./pages/SearchPage";
import DetailPage from "./pages/DetailPage";
import FavouritesPage from "./pages/FavouritesPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/detail" element={<DetailPage />} />
        <Route path="/favourites" element={<FavouritesPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
