import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchBar from "../../components/SearchBar";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router";

const mockSetSearchParams = vi.fn();
let mockCurrentSearchParams = new URLSearchParams();

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useSearchParams: () => [mockCurrentSearchParams, mockSetSearchParams],
  };
});

const renderWithRouter = (ui: React.ReactElement, initialEntries = ["/"]) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="*" element={ui} />
      </Routes>
    </MemoryRouter>,
  );
};

describe("SearchBar component", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    mockSetSearchParams.mockClear();
    mockCurrentSearchParams = new URLSearchParams();
  });

  it("renders initial state correctly", () => {
    renderWithRouter(<SearchBar />);

    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "All" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Teams" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Competitions" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /clear/i }),
    ).not.toBeInTheDocument();
  });

  it("initializes searchQuery and activeFilter from URL parameters", () => {
    mockCurrentSearchParams.set("q", "testquery");
    mockCurrentSearchParams.set("filter", "teams");
    renderWithRouter(<SearchBar />);

    expect(screen.getByPlaceholderText("Search...")).toHaveValue("testquery");
    expect(screen.getByRole("button", { name: "Teams" })).toHaveClass(
      "bg-red-700",
    );
    expect(screen.getByRole("button", { name: "All" })).not.toHaveClass(
      "bg-red-700",
    );
    expect(
      screen.getByRole("button", { name: "Competitions" }),
    ).not.toHaveClass("bg-red-700");
    expect(
      screen.queryByRole("button", { name: /clear/i }),
    ).toBeInTheDocument();
  });

  it("updates searchQuery state and input value on typing", async () => {
    renderWithRouter(<SearchBar />);
    const searchInput = screen.getByPlaceholderText("Search...");
    await user.type(searchInput, "Slavia");
    expect(searchInput).toHaveValue("Slavia");
  });

  it("shows clear button when searchQuery is not empty and hides it when empty", async () => {
    renderWithRouter(<SearchBar />);
    const searchInput = screen.getByPlaceholderText("Search...");

    expect(
      screen.queryByRole("button", { name: /clear/i }),
    ).not.toBeInTheDocument();

    await user.type(searchInput, "Liverpool");

    const clearButton = screen.getByRole("button", { name: /clear/i });
    expect(clearButton).toBeInTheDocument();
    await user.click(clearButton);
    expect(
      screen.queryByLabelText("Clear search query"),
    ).not.toBeInTheDocument();
  });

  it("handleClear resets searchQuery, activeFilter, calls setSearchParams, and focuses input", async () => {
    mockCurrentSearchParams.set("q", "initial");
    mockCurrentSearchParams.set("filter", "teams");

    renderWithRouter(<SearchBar />);

    const searchInput = screen.getByPlaceholderText(
      "Search...",
    ) as HTMLInputElement;
    const focusSpy = vi.spyOn(searchInput, "focus");
    await user.type(searchInput, "cleartest");

    const clearButton = screen.getByRole("button", { name: /clear/i });

    await user.click(clearButton);

    expect(searchInput).toHaveValue("");
    expect(mockSetSearchParams).toHaveBeenCalledWith({ q: "", filter: "all" });
    expect(searchInput.focus).toHaveBeenCalled();
    expect(focusSpy).toHaveBeenCalled();
    expect(clearButton).not.toBeInTheDocument();
  });

  it("handleSearch calls setSearchParams with current searchQuery and activeFilter", async () => {
    renderWithRouter(<SearchBar />);
    const searchInput = screen.getByPlaceholderText("Search...");
    const searchSubmitButton = screen.getByRole("button", { name: /search/i });

    await user.type(searchInput, "Champions League");
    const teamsFilterButton = screen.getByRole("button", { name: "Teams" });
    await user.click(teamsFilterButton);

    expect(mockSetSearchParams).toHaveBeenCalledWith({
      q: "",
      filter: "teams",
    });

    await user.click(searchSubmitButton);

    expect(mockSetSearchParams).toHaveBeenCalledWith({
      q: "Champions League",
      filter: "teams",
    });
  });
});
