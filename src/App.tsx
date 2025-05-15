import { BrowserRouter, Route, Routes } from "react-router";
import SearchPage from "./pages/SearchPage";
import DetailPage from "./pages/DetailPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/detail/:entityId" element={<DetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
