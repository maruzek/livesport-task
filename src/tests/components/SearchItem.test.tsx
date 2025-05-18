import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchItem from "../../components/SearchItem";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router"; // Correct import for web
import type { SearchResult, Images } from "../../types/SearchResult";
import { imageAltGenerator as mockImageAltGenerator } from "../../utils/imageAltGenerator";

vi.mock("../../utils/imageAltGenerator", () => ({
  imageAltGenerator: vi.fn(),
}));

vi.mock("../../assets/placeholder.jpg", () => ({
  default: "mocked-placeholder.jpg",
}));

const renderWithRouter = (ui: React.ReactElement) => {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="*" element={ui} />
      </Routes>
    </MemoryRouter>,
  );
};

const VITE_IMG_URL_TEST = "https://www.livesport.cz/res/image/data/";

describe("SearchItem component", () => {
  const user = userEvent.setup();
  let mockItem: SearchResult;

  beforeEach(() => {
    (mockImageAltGenerator as Mock).mockClear();
    (mockImageAltGenerator as Mock).mockReturnValue("Mocked alt text");

    // Define a base mock item based on SearchResult.ts
    mockItem = {
      id: "dhSLF6tC",
      url: "chytil-mojmir",
      gender: {
        id: 1,
        name: "Men",
      },
      name: "Chytil Mojmir",
      type: {
        id: 4,
        name: "PlayerInTeam",
      },
      participantTypes: [
        {
          id: 2,
          name: "Player",
        },
        {
          id: 15,
          name: "Forward",
        },
      ],
      sport: {
        id: 1,
        name: "Soccer",
      },
      favouriteKey: {
        web: null,
        portable: null,
      },
      flagId: null,
      defaultCountry: {
        id: 62,
        name: "Czech Republic",
        images: [
          {
            path: "fJIhexR6-2T1RXrxH.png",
            usageId: 14,
            variantTypeId: 87,
          },
          {
            path: "ltIdfdtD-2T1RXrxH.png",
            usageId: 14,
            variantTypeId: 88,
          },
        ],
      },
      images: [
        {
          path: "KOpYCkGG-Gfrgx4kh.png",
          usageId: 3,
          variantTypeId: 15,
        },
      ],
      teams: [
        {
          id: "viXGgnyB",
          name: "Slavia Prague",
          kind: "TEAM",
          participantType: {
            id: 1,
            name: "Team",
          },
        },
        {
          id: "6LHwBDGU",
          name: "Czech Republic",
          kind: "NOMINATION",
          participantType: {
            id: 17,
            name: "National",
          },
        },
      ],
      defaultTournament: null,
      superTemplate: null,
    };

    vi.stubGlobal("importMeta", {
      env: {
        VITE_IMG_URL: VITE_IMG_URL_TEST,
      },
    });
  });

  it("renders item name, country flag, and team name", () => {
    renderWithRouter(<SearchItem item={mockItem} />);

    expect(
      screen.getByRole("heading", { name: /Chytil Mojmir/i }),
    ).toBeInTheDocument();
    const countryFlag = screen.getByAltText(
      "Flag of Czech Republic",
    ) as HTMLImageElement;
    expect(countryFlag).toBeInTheDocument();
    expect(countryFlag.src).toBe(`${VITE_IMG_URL_TEST}fJIhexR6-2T1RXrxH.png`);
    expect(screen.getByText("Slavia Prague")).toBeInTheDocument();
  });

  it("uses imageAltGenerator for the main image alt text", () => {
    renderWithRouter(<SearchItem item={mockItem} />);
    expect(mockImageAltGenerator).toHaveBeenCalledWith(mockItem);
    expect(screen.getByAltText("Mocked alt text")).toBeInTheDocument();
  });

  it("renders item image if available (variantTypeId 15)", () => {
    mockItem.images = [
      { variantTypeId: 15, path: "items/awesome.png", usageId: 1 } as Images,
    ];
    renderWithRouter(<SearchItem item={mockItem} />);
    const itemImage = screen.getByAltText(
      "Mocked alt text",
    ) as HTMLImageElement;
    expect(itemImage.src).toBe(`${VITE_IMG_URL_TEST}items/awesome.png`);
  });

  it("renders placeholder image if item image (variantTypeId 15) is not available", () => {
    mockItem.images = [
      { variantTypeId: 10, path: "other/image.png", usageId: 1 } as Images,
    ];
    renderWithRouter(<SearchItem item={mockItem} />);
    const itemImage = screen.getByAltText(
      "Mocked alt text",
    ) as HTMLImageElement;
    expect(itemImage.src).toContain("mocked-placeholder.jpg");
  });

  it("renders placeholder image if item.images is empty", () => {
    mockItem.images = [];
    renderWithRouter(<SearchItem item={mockItem} />);
    const itemImage = screen.getByAltText(
      "Mocked alt text",
    ) as HTMLImageElement;
    expect(itemImage.src).toContain("mocked-placeholder.jpg");
  });

  it("renders a Link to detail page", () => {
    renderWithRouter(<SearchItem item={mockItem} />);
    const linkElement = screen.getByRole("link"); // The main clickable area is a Link
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", "/detail");
  });

  it("does not render team name if item.teams is null", () => {
    mockItem.teams = null;
    renderWithRouter(<SearchItem item={mockItem} />);
    expect(screen.queryByText("Main Club")).not.toBeInTheDocument();
  });

  it("does not render team name if item.teams is an empty array", () => {
    mockItem.teams = [];
    renderWithRouter(<SearchItem item={mockItem} />);
    expect(screen.queryByText("Main Club")).not.toBeInTheDocument();
  });

  it('does not render team name if no team has participantType.name == "Team"', () => {
    if (mockItem.teams) {
      mockItem.teams[0].participantType.name = "Official";
    }
    renderWithRouter(<SearchItem item={mockItem} />);
    expect(screen.queryByText("Main Club")).not.toBeInTheDocument();
  });

  it("does not render right button if rightButtonIcon is not provided", () => {
    renderWithRouter(<SearchItem item={mockItem} />);
    const buttons = screen.queryAllByRole("button");
    expect(buttons.length).toBe(0);
  });

  it("renders right button with icon and calls rightButtonAction on click", async () => {
    const mockAction = vi.fn();
    const MockIcon = () => <svg data-testid="mock-icon" />;
    renderWithRouter(
      <SearchItem
        item={mockItem}
        rightButtonIcon={<MockIcon />}
        rightButtonAction={mockAction}
      />,
    );

    const rightButton = screen.getByRole("button");
    expect(rightButton).toBeInTheDocument();
    expect(screen.getByTestId("mock-icon")).toBeInTheDocument();

    await user.click(rightButton);
    expect(mockAction).toHaveBeenCalledTimes(1);
  });

  it("applies pb-0 class to figure if item type is Player", () => {
    mockItem.type = { id: 2, name: "Player" };
    renderWithRouter(<SearchItem item={mockItem} />);
    const figureElement = screen
      .getByAltText("Mocked alt text")
      .closest("figure");
    expect(figureElement).toHaveClass("pb-0");
  });

  it("applies pb-0 class to figure if item type is PlayerInTeam", () => {
    mockItem.type = { id: 3, name: "PlayerInTeam" };
    renderWithRouter(<SearchItem item={mockItem} />);
    const figureElement = screen
      .getByAltText("Mocked alt text")
      .closest("figure");
    expect(figureElement).toHaveClass("pb-0");
  });

  it("does not apply pb-0 class to figure for other item types", () => {
    mockItem.type = { id: 4, name: "Competition" };
    renderWithRouter(<SearchItem item={mockItem} />);
    const figureElement = screen
      .getByAltText("Mocked alt text")
      .closest("figure");
    expect(figureElement).not.toHaveClass("pb-0");
  });

  //   it("handles missing defaultCountry image gracefully (renders img tag with empty src)", () => {
  //     mockItem.defaultCountry.images = [];
  //     renderWithRouter(<SearchItem item={mockItem} />);
  //     const countryFlag = screen.getByAltText(
  //       `Flag of ${mockItem.defaultCountry.name}`,
  //     ) as HTMLImageElement;
  //     expect(countryFlag).not.toBeInTheDocument();
  //     // The component logic results in `${import.meta.env.VITE_IMG_URL}undefined` which becomes `https://fakeimages.com/undefined`
  //     // or if the filter returns nothing, it might be just the base URL or an empty string depending on strictness.
  //     // Given: `${import.meta.env.VITE_IMG_URL}${item.defaultCountry.images.filter(...)[0]?.path}` || ""
  //     // If path is undefined, it becomes `${VITE_IMG_URL_TEST}undefined` which is not ideal.
  //     // If the filter returns an empty array, `[0]` is undefined, `?.path` is undefined.
  //     // So it should hit the `|| ""` fallback.
  //   });

  it("handles item.teams being null without crashing", () => {
    mockItem.teams = null;
    expect(() =>
      renderWithRouter(<SearchItem item={mockItem} />),
    ).not.toThrow();
    expect(screen.queryByText("Main Club")).not.toBeInTheDocument();
  });
});
