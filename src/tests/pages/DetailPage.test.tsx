import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import DetailPage from "../../pages/DetailPage";
import type {
  SearchResult,
  Images,
  ParticipantType,
} from "../../types/SearchResult";
import { imageAltGenerator as mockImageAltGeneratorImport } from "../../utils/imageAltGenerator";

const mockToggleFavorite = vi.fn();
const mockIsFavorite = vi.fn();
vi.mock("../../hooks/useFavorites", () => ({
  useFavorites: () => ({
    toggleFavorite: mockToggleFavorite,
    isFavorite: mockIsFavorite,
  }),
}));

vi.mock("../../utils/imageAltGenerator", () => ({
  imageAltGenerator: vi.fn(),
}));

vi.mock("../../assets/placeholder.jpg", () => ({
  default: "mocked-placeholder.jpg",
}));

const VITE_IMG_URL_TEST = "https://www.livesport.cz/res/image/data/";
const mockLocationState = vi.fn();

vi.mock("react-router", async (importOriginal) => {
  const actual = (await importOriginal()) as object;
  return {
    ...actual,
    useLocation: () => mockLocationState(),
  };
});

const renderWithRouterAndState = (
  ui: React.ReactElement,
  itemData: SearchResult | undefined,
) => {
  mockLocationState.mockReturnValue({
    state: { item: itemData },
    pathname: "/detail",
    search: "",
    hash: "",
    key: "testkey",
  });
  return render(
    <MemoryRouter
      initialEntries={[{ pathname: "/detail", state: { item: itemData } }]}
    >
      <Routes>
        <Route path="/detail" element={ui} />
      </Routes>
    </MemoryRouter>,
  );
};

const baseMockItemFederer: SearchResult = {
  id: "GrsQDFC0",
  url: "federer-roger",
  gender: {
    id: 1,
    name: "Men",
  },
  name: "Federer Roger",
  type: {
    id: 3,
    name: "Player",
  },
  participantTypes: [
    {
      id: 2,
      name: "Player",
    },
  ],
  sport: {
    id: 2,
    name: "Tennis",
  },
  favouriteKey: {
    web: "2_GrsQDFC0",
    portable: "2_GrsQDFC0",
  },
  flagId: null,
  defaultCountry: {
    id: 182,
    name: "Switzerland",
    images: [
      {
        path: "80o9a13e-EZqRg51s.png",
        usageId: 14,
        variantTypeId: 87,
      } as Images,
      {
        path: "2NpDbLI1-EZqRg51s.png",
        usageId: 14,
        variantTypeId: 88,
      } as Images,
    ],
  },
  images: [
    {
      path: "WfNSkAxS-OtJeQ92e.png",
      usageId: 3,
      variantTypeId: 15,
    } as Images,
  ],
  teams: [],
  defaultTournament: null,
  superTemplate: null,
};

describe("DetailPage component", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.resetAllMocks();
    document.title = "";
    (mockImageAltGeneratorImport as Mock).mockReturnValue("Mocked alt text");
    mockIsFavorite.mockReturnValue(false);

    vi.stubGlobal("importMeta", {
      env: {
        VITE_IMG_URL: VITE_IMG_URL_TEST,
      },
    });
  });

  it('renders "No data available" and sets title when item is not in location state', () => {
    renderWithRouterAndState(<DetailPage />, undefined);
    expect(screen.getByText("No data available.")).toBeInTheDocument();
    expect(document.title).toBe("Not found | FlashResults");
  });

  it("renders item details correctly when item (Federer) is provided", () => {
    renderWithRouterAndState(<DetailPage />, baseMockItemFederer);

    expect(
      screen.getByRole("heading", { name: /Tennis - Men/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Federer Roger" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Switzerland")).toBeInTheDocument();

    const itemImage = screen.getByAltText(
      "Mocked alt text",
    ) as HTMLImageElement;
    expect(itemImage.src).toBe(
      `${VITE_IMG_URL_TEST}${baseMockItemFederer.images![0].path}`,
    );

    const flagImage = screen.getByAltText(
      "Flag of Switzerland",
    ) as HTMLImageElement;
    expect(flagImage.src).toBe(
      `${VITE_IMG_URL_TEST}${baseMockItemFederer.defaultCountry.images.filter((img) => img.variantTypeId === 87)[0]?.path}`,
    );
    expect(mockImageAltGeneratorImport).toHaveBeenCalledWith(
      baseMockItemFederer,
    );
  });

  it("uses placeholder image when item image (variantTypeId 15) is not available", () => {
    const itemWithoutMainImage: SearchResult = {
      ...baseMockItemFederer,
      images: [],
    };
    renderWithRouterAndState(<DetailPage />, itemWithoutMainImage);
    const itemImage = screen.getByAltText(
      "Mocked alt text",
    ) as HTMLImageElement;
    expect(itemImage.src).toContain("mocked-placeholder.jpg");
  });

  it("sets document title correctly with team name if available", () => {
    const itemWithTeam: SearchResult = {
      ...baseMockItemFederer,
      teams: [
        {
          id: "team1",
          name: "Swiss Basel Club",
          kind: "Club",
          participantType: { id: 1, name: "Team" } as ParticipantType,
        },
      ],
    };
    renderWithRouterAndState(<DetailPage />, itemWithTeam);
    expect(document.title).toBe(
      "Federer Roger (Swiss Basel Club) stats | FlashResults",
    );
  });

  it("sets document title correctly without team name if no qualifying team (using Federer base)", () => {
    renderWithRouterAndState(<DetailPage />, baseMockItemFederer);
    expect(document.title).toBe("Federer Roger stats | FlashResults");
  });

  it("calls toggleFavorite when favorite button is clicked", async () => {
    renderWithRouterAndState(<DetailPage />, baseMockItemFederer);
    const favButton = screen.getByRole("button", { name: /Toggle favorites/i });
    await user.click(favButton);
    expect(mockToggleFavorite).toHaveBeenCalledWith(baseMockItemFederer);
  });

  it("favorite button shows correct state (filled star) and aria-label when isFavorite is true", () => {
    mockIsFavorite.mockReturnValue(true);
    renderWithRouterAndState(<DetailPage />, baseMockItemFederer);
    const favButton = screen.getByRole("button", {
      name: /Toggle favorites/i,
    });
    const starIcon = favButton.querySelector("svg");
    expect(starIcon).toHaveAttribute("fill", "#fff");
    expect(starIcon).toHaveAttribute("stroke-width", "1");
  });

  it("favorite button shows correct state (outline star) and aria-label when isFavorite is false", () => {
    mockIsFavorite.mockReturnValue(false);
    renderWithRouterAndState(<DetailPage />, baseMockItemFederer);
    const favButton = screen.getByRole("button", { name: /Toggle favorites/i });
    const starIcon = favButton.querySelector("svg");
    expect(starIcon).toHaveAttribute("fill", "transparent");
    expect(starIcon).toHaveAttribute("stroke-width", "2");
  });

  it('renders Teams section for "PlayerInTeam" type', () => {
    const playerInTeamItem: SearchResult = {
      ...baseMockItemFederer,
      type: { id: 4, name: "PlayerInTeam" },
      teams: [
        {
          id: "team1",
          name: "Geneva Servette",
          kind: "Club",
          participantType: { id: 1, name: "Team" } as ParticipantType,
        },
        {
          id: "team2",
          name: "Switzerland Davis Cup",
          kind: "National",
          participantType: { id: 17, name: "National" } as ParticipantType,
        },
      ],
    };
    renderWithRouterAndState(<DetailPage />, playerInTeamItem);
    expect(screen.getByRole("heading", { name: "Teams" })).toBeInTheDocument();
    expect(screen.getByText("Geneva Servette")).toBeInTheDocument();
    expect(screen.getByText("Switzerland Davis Cup")).toBeInTheDocument();
  });

  it('does not render Teams section for "Player" type (using Federer base)', () => {
    renderWithRouterAndState(<DetailPage />, baseMockItemFederer);
    expect(
      screen.queryByRole("heading", { name: "Teams" }),
    ).not.toBeInTheDocument();
  });

  it("handles item.teams being null or empty in Teams section gracefully for PlayerInTeam", () => {
    const playerInTeamNoTeams: SearchResult = {
      ...baseMockItemFederer,
      type: { id: 4, name: "PlayerInTeam" },
      teams: null,
    };
    const { rerender } = renderWithRouterAndState(
      <DetailPage />,
      playerInTeamNoTeams,
    );
    expect(screen.getByRole("heading", { name: "Teams" })).toBeInTheDocument();
    expect(screen.queryByText("Geneva Servette")).not.toBeInTheDocument();

    const playerInTeamEmptyTeams: SearchResult = {
      ...baseMockItemFederer,
      type: { id: 4, name: "PlayerInTeam" },
      teams: [],
    };
    mockLocationState.mockReturnValue({
      state: { item: playerInTeamEmptyTeams },
      pathname: "/detail",
      search: "",
      hash: "",
      key: "testkey2",
    });
    rerender(
      <MemoryRouter
        initialEntries={[
          { pathname: "/detail", state: { item: playerInTeamEmptyTeams } },
        ]}
        initialIndex={0}
      >
        <Routes>
          <Route path="/detail" element={<DetailPage />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByRole("heading", { name: "Teams" })).toBeInTheDocument();
    expect(screen.queryByText("Geneva Servette")).not.toBeInTheDocument();
  });
});
