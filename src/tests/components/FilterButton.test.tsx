import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FilterButton from "../../components/FilterButton";
import { describe, it, expect, vi, beforeEach } from "vitest";

const mockSetSearchParams = vi.fn();
let mockCurrentSearchParams = new URLSearchParams();

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useSearchParams: () => [mockCurrentSearchParams, mockSetSearchParams],
  };
});

describe("FilterButton component", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    mockSetSearchParams.mockClear();
    mockCurrentSearchParams = new URLSearchParams();
  });

  it("renders children correctly", () => {
    const buttonText = "All";
    render(
      <FilterButton
        filterValue="all"
        onFilterChange={vi.fn()}
        activeFilter="all"
      >
        {buttonText}
      </FilterButton>,
    );
    expect(
      screen.getByRole("button", { name: buttonText }),
    ).toBeInTheDocument();
  });

  it("calls onFilterChange with filterValue when clicked", async () => {
    const filterValue = "teams";
    const mockOnFilterChange = vi.fn();
    render(
      <FilterButton
        filterValue={filterValue}
        onFilterChange={mockOnFilterChange}
        activeFilter="all"
      >
        Teams
      </FilterButton>,
    );

    await user.click(screen.getByRole("button", { name: "Teams" }));
    expect(mockOnFilterChange).toHaveBeenCalledWith(filterValue);
  });

  it("calls setSearchParams with current query and new filterValue when clicked", async () => {
    const initialQuery = "testQuery";
    mockCurrentSearchParams.set("q", initialQuery);

    const filterValue = "competitions";
    render(
      <FilterButton
        filterValue={filterValue}
        onFilterChange={vi.fn()}
        activeFilter="all"
      >
        Competitions
      </FilterButton>,
    );

    await user.click(screen.getByRole("button", { name: "Competitions" }));
    expect(mockSetSearchParams).toHaveBeenCalledWith({
      q: initialQuery,
      filter: filterValue,
    });
  });

  it("calls setSearchParams with empty query if q is not present and new filterValue", async () => {
    const filterValue = "teams";
    render(
      <FilterButton
        filterValue={filterValue}
        onFilterChange={vi.fn()}
        activeFilter="all"
      >
        Teams
      </FilterButton>,
    );

    await user.click(screen.getByRole("button", { name: "Teams" }));
    expect(mockSetSearchParams).toHaveBeenCalledWith({
      q: "",
      filter: filterValue,
    });
  });

  it("applies active styles (bg-red-700) when filterValue matches activeFilter", () => {
    render(
      <FilterButton
        filterValue="teams"
        onFilterChange={vi.fn()}
        activeFilter="teams"
      >
        Teams
      </FilterButton>,
    );
    expect(screen.getByRole("button", { name: "Teams" })).toHaveClass(
      "bg-red-700",
    );
    expect(screen.getByRole("button", { name: "Teams" })).not.toHaveClass(
      "bg-gray-700",
    );
  });

  it("applies inactive styles (bg-gray-700) when filterValue does not match activeFilter", () => {
    render(
      <FilterButton
        filterValue="teams"
        onFilterChange={vi.fn()}
        activeFilter="all"
      >
        Teams
      </FilterButton>,
    );
    expect(screen.getByRole("button", { name: "Teams" })).toHaveClass(
      "bg-gray-700",
    );
    expect(screen.getByRole("button", { name: "Teams" })).not.toHaveClass(
      "bg-red-700",
    );
  });
});
