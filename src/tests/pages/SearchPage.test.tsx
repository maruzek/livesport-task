import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SearchPage from "../../pages/SearchPage";
import type { SearchResult } from "../../types/SearchResult";
import type { Error as AppError } from "../../types/Error";

// Mock hooks
const mockUseApi = vi.fn();
vi.mock("../../hooks/useApi", () => ({
  useApi: () => mockUseApi(),
}));

const mockUseSearchParams = vi.fn();

vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as object),
    useSearchParams: () => mockUseSearchParams(),
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

// Mock data
const mockRetryFn = vi.fn();
const mockItem1: SearchResult = {
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
const mockItem2: SearchResult = {
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
      },
      {
        path: "2NpDbLI1-EZqRg51s.png",
        usageId: 14,
        variantTypeId: 88,
      },
    ],
  },
  images: [
    {
      path: "WfNSkAxS-OtJeQ92e.png",
      usageId: 3,
      variantTypeId: 15,
    },
  ],
  teams: [],
  defaultTournament: null,
  superTemplate: null,
};

const mockResults = {
  Soccer: [mockItem1],
  Basketball: [mockItem2],
};

const mockError: AppError = {
  code: 500,
  message: "Test Server Error",
  detail: "Something went wrong",
};

describe("SearchPage component", () => {
  let mockCurrentSearchParams: URLSearchParams;

  beforeEach(() => {
    vi.resetAllMocks();
    document.title = "";
    mockCurrentSearchParams = new URLSearchParams();
    mockUseSearchParams.mockReturnValue([mockCurrentSearchParams, vi.fn()]);
  });

  it('renders initial state with "Use the search bar" message and sets correct title', () => {
    mockUseApi.mockReturnValue({
      results: null,
      error: null,
      isLoading: false,
      retry: mockRetryFn,
    });
    renderWithRouter(<SearchPage />);

    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        "Use the search bar to find your favorite teams or players",
      ),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("search-skeleton")).not.toBeInTheDocument(); // Assuming SearchSkeleton has a data-testid
    expect(screen.queryByText(mockError.message)).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Results" }),
    ).not.toBeInTheDocument();
    expect(document.title).toBe("Search | FlashResults");
  });

  it("renders SearchSkeleton when isLoading is true and sets title based on query", () => {
    mockCurrentSearchParams.set("q", "loadingtest");
    mockUseApi.mockReturnValue({
      results: null,
      error: null,
      isLoading: true,
      retry: mockRetryFn,
    });
    renderWithRouter(<SearchPage />);

    expect(screen.getByTestId("search-skeleton")).toBeInTheDocument(); // Assuming SearchSkeleton has data-testid="search-skeleton"
    expect(
      screen.queryByText(
        "Use the search bar to find your favorite teams or players",
      ),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(mockError.message)).not.toBeInTheDocument();
    expect(document.title).toBe(
      "Search results for loadingtest | FlashResults",
    );
  });

  it("renders SearchError when an error occurs and sets title based on query", () => {
    mockCurrentSearchParams.set("q", "errortest");
    mockUseApi.mockReturnValue({
      results: null,
      error: mockError,
      isLoading: false,
      retry: mockRetryFn,
    });
    renderWithRouter(<SearchPage />);

    expect(screen.getByText(mockError.message)).toBeInTheDocument();
    expect(screen.getByText(mockError.code.toString())).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Refresh" })).toBeInTheDocument(); // From SearchError
    expect(screen.queryByTestId("search-skeleton")).not.toBeInTheDocument();
    expect(document.title).toBe("Search results for errortest | FlashResults");
  });

  it("renders results with SportGroup and SearchItem when data is available and sets title", () => {
    mockCurrentSearchParams.set("q", "querywithresults");
    mockUseApi.mockReturnValue({
      results: mockResults,
      error: null,
      isLoading: false,
      retry: mockRetryFn,
    });
    renderWithRouter(<SearchPage />);

    expect(
      screen.getByRole("heading", { name: "Results" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Soccer")).toBeInTheDocument(); // SportGroup title
    expect(screen.getByText(mockItem1.name)).toBeInTheDocument(); // SearchItem content
    expect(screen.getByText("Basketball")).toBeInTheDocument(); // SportGroup title
    expect(screen.getByText(mockItem2.name)).toBeInTheDocument(); // SearchItem content

    expect(screen.queryByTestId("search-skeleton")).not.toBeInTheDocument();
    expect(screen.queryByText(mockError.message)).not.toBeInTheDocument();
    expect(document.title).toBe(
      "Search results for querywithresults | FlashResults",
    );
  });

  it('renders "No results found" message when query is present but no results and sets title', () => {
    mockCurrentSearchParams.set("q", "noresultsquery");
    mockUseApi.mockReturnValue({
      results: {},
      error: null,
      isLoading: false,
      retry: mockRetryFn,
    });
    renderWithRouter(<SearchPage />);

    expect(screen.getByText("No results found")).toBeInTheDocument();
    expect(screen.queryByTestId("search-skeleton")).not.toBeInTheDocument();
    expect(document.title).toBe(
      "Search results for noresultsquery | FlashResults",
    );
  });

  it('renders "No results found" if results are null but query is present', () => {
    mockCurrentSearchParams.set("q", "anothernoresults");
    mockUseApi.mockReturnValue({
      results: null,
      error: null,
      isLoading: false,
      retry: mockRetryFn,
    });
    renderWithRouter(<SearchPage />);

    expect(screen.getByText("No results found")).toBeInTheDocument();
    expect(document.title).toBe(
      "Search results for anothernoresults | FlashResults",
    );
  });

  it('updates document.title to "Search | FlashResults" when query becomes empty', () => {
    mockCurrentSearchParams.set("q", ""); // Empty query
    mockUseApi.mockReturnValue({
      results: null,
      error: null,
      isLoading: false,
      retry: mockRetryFn,
    });
    renderWithRouter(<SearchPage />);
    expect(document.title).toBe("Search | FlashResults");
  });
});
