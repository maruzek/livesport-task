import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router";
import BottomNav from "../../components/BottomNav";
import { describe, it, expect } from "vitest";
import type { ReactElement } from "react";

const renderWithRouter = (ui: ReactElement, { route = "/" } = {}) => {
  window.history.pushState({}, "Test page", route);
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="*" element={ui} />
      </Routes>
    </MemoryRouter>,
  );
};

describe("BottomNav component", () => {
  it("renders Search and Favorites navigation links", () => {
    renderWithRouter(<BottomNav />);

    const searchLink = screen.getByRole("link", { name: /search/i });
    expect(searchLink).toBeInTheDocument();
    expect(searchLink).toHaveAttribute("href", "/");

    const favoritesLink = screen.getByRole("link", { name: /favorites/i });
    expect(favoritesLink).toBeInTheDocument();
    expect(favoritesLink).toHaveAttribute("href", "/favourites");
  });

  it('Search link contains the Search icon and text "Search"', () => {
    renderWithRouter(<BottomNav />);
    const searchLink = screen.getByRole("link", { name: /search/i });

    expect(
      screen.getByText(/search/i, { selector: "span.text-sm" }),
    ).toBeInTheDocument();

    const searchIcon = searchLink.querySelector("svg");
    expect(searchIcon).toBeInTheDocument();
  });

  it('Favorites link contains the Star icon and text "Favorites"', () => {
    renderWithRouter(<BottomNav />);
    const favoritesLink = screen.getByRole("link", { name: /favorites/i });

    expect(
      screen.getByText(/favorites/i, { selector: "span.text-sm" }),
    ).toBeInTheDocument();

    const starIcon = favoritesLink.querySelector("svg");
    expect(starIcon).toBeInTheDocument();
  });

  it("applies active class to Search link when on the root path", () => {
    renderWithRouter(<BottomNav />, { route: "/" });
    const searchLink = screen.getByRole("link", { name: /search/i });

    expect(searchLink).toHaveClass("active");
  });

  it("applies active class to Favorites link when on the /favourites path", () => {
    renderWithRouter(<BottomNav />, { route: "/favourites" });
    const favoritesLink = screen.getByRole("link", { name: /favorites/i });
    expect(favoritesLink).toHaveClass("active");
  });
});
