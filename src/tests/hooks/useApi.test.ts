import { renderHook, waitFor, act } from "@testing-library/react";
import { useApi } from "../../hooks/useApi";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { SearchResult } from "../../types/SearchResult";
import originalGroupResultsBySport from "../../utils/groupResultsBySport";

const mockSetSearchParams = vi.fn();
let mockCurrentSearchParams = new URLSearchParams();

vi.mock("react-router", async (importOriginal) => {
  const actual = (await importOriginal()) as object;
  return {
    ...actual,
    useSearchParams: () => [mockCurrentSearchParams, mockSetSearchParams],
  };
});

vi.mock("../../utils/groupResultsBySport", () => ({
  default: vi.fn(
    (data: SearchResult[] | null): Record<string, SearchResult[]> => {
      if (!data || data.length === 0) return {};
      const grouped: Record<string, SearchResult[]> = {};
      data.forEach((item) => {
        if (!grouped[item.sport.name]) {
          grouped[item.sport.name] = [];
        }
        grouped[item.sport.name].push(item);
      });
      return grouped;
    },
  ),
}));

const groupResultsBySport = vi.mocked(originalGroupResultsBySport);

const VITE_API_URL_TEST = "https://s.livesport.services/api/v2/search";
const mockFetch = vi.fn();

const setupGlobalMocks = () => {
  vi.stubGlobal("fetch", mockFetch);
  vi.stubGlobal("importMeta", {
    env: { VITE_API_URL: VITE_API_URL_TEST },
  });
  vi.stubGlobal("navigator", { onLine: true });
};

const mockApiResponseData: SearchResult[] = [
  {
    id: "1",
    name: "Team Alpha",
    sport: { id: 1, name: "Soccer" },
    type: { id: 1, name: "Team" },
    url: "ta",
    images: [],
    defaultCountry: { id: 1, name: "A", images: [] },
    gender: { id: 1, name: "M" },
    favouriteKey: { portable: null, web: null },
    flagId: null,
    participantTypes: null,
    teams: null,
    defaultTournament: null,
    superTemplate: null,
  },
  {
    id: "2",
    name: "Player Beta",
    sport: { id: 2, name: "Basketball" },
    type: { id: 2, name: "Player" },
    url: "pb",
    images: [],
    defaultCountry: { id: 2, name: "B", images: [] },
    gender: { id: 1, name: "M" },
    favouriteKey: { portable: null, web: null },
    flagId: null,
    participantTypes: null,
    teams: null,
    defaultTournament: null,
    superTemplate: null,
  },
];

const mockExpectedGroupedData = {
  Soccer: [mockApiResponseData[0]],
  Basketball: [mockApiResponseData[1]],
};

describe("useApi hook", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockCurrentSearchParams = new URLSearchParams();
    setupGlobalMocks();
    groupResultsBySport.mockClear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should return initial state when no query (q) is present", () => {
    const { result } = renderHook(() => useApi());
    expect(result.current.results).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("should fetch data and set loading state when query (q) is present", async () => {
    mockCurrentSearchParams.set("q", "test");
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponseData,
    });
    groupResultsBySport.mockReturnValueOnce(mockExpectedGroupedData);

    const { result } = renderHook(() => useApi());
    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(mockFetch).toHaveBeenCalledTimes(1);
    const expectedUrl = `${VITE_API_URL_TEST}?q=test&lang-id=1&project-id=602&project-type-id=1&sport-ids=1,2,3,4,5,6,7,8,9&type-ids=1,2,3,4`;
    expect(mockFetch).toHaveBeenCalledWith(expectedUrl);
    expect(result.current.results).toEqual(mockExpectedGroupedData);
    expect(groupResultsBySport).toHaveBeenCalledWith(mockApiResponseData);
  });

  it('should correctly adjust API URL based on the "filter" search parameter', async () => {
    mockCurrentSearchParams.set("q", "test");
    const { rerender } = renderHook(() => useApi());

    mockCurrentSearchParams.set("filter", "teams");
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => [] });
    groupResultsBySport.mockReturnValueOnce({});
    act(() => rerender());
    await waitFor(() =>
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("&type-ids=2,3,4"),
      ),
    );
    mockFetch.mockClear();

    mockCurrentSearchParams.set("filter", "competitions");
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => [] });
    groupResultsBySport.mockReturnValueOnce({});
    act(() => rerender());
    await waitFor(() =>
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("&type-ids=1"),
      ),
    );
    mockFetch.mockClear();

    mockCurrentSearchParams.set("filter", "all");
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => [] });
    groupResultsBySport.mockReturnValueOnce({});
    act(() => rerender());
    await waitFor(() =>
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("&type-ids=1,2,3,4"),
      ),
    );
  });

  it("should handle network offline error", async () => {
    mockCurrentSearchParams.set("q", "test");
    vi.stubGlobal("navigator", { onLine: false });
    mockFetch.mockRejectedValueOnce(new TypeError("Failed to fetch"));

    const { result } = renderHook(() => useApi());
    await waitFor(() => expect(result.current.error).not.toBeNull());
    expect(result.current.error?.code).toBe(0);
    expect(result.current.error?.message).toBe(
      "Internet connection appears to be offline.",
    );
    expect(result.current.isLoading).toBe(false);
  });

  it("should handle HTTP 404 (Not Found) error", async () => {
    mockCurrentSearchParams.set("q", "test");
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: "Not Found",
      json: async () => ({ message: "API Resource Not Found Detail" }),
    });

    const { result } = renderHook(() => useApi());
    await waitFor(() => expect(result.current.error).not.toBeNull());
    expect(result.current.error?.code).toBe(404);
    expect(result.current.error?.message).toBe(
      "Not found. The requested resource could not be found.",
    );
    expect(result.current.error?.detail).toBe("API Resource Not Found Detail");
    expect(result.current.isLoading).toBe(false);
  });

  it("should handle HTTP 500 (Server Error) error", async () => {
    mockCurrentSearchParams.set("q", "test");
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      json: async () => ({ message: "Server exploded" }),
    });

    const { result } = renderHook(() => useApi());
    await waitFor(() => expect(result.current.error).not.toBeNull());
    expect(result.current.error?.code).toBe(500);
    expect(result.current.error?.message).toBe(
      "Internal server error. Please try again later.",
    );
    expect(result.current.error?.detail).toBe("Server exploded");
    expect(result.current.isLoading).toBe(false);
  });

  it("should handle unexpected errors during fetch", async () => {
    mockCurrentSearchParams.set("q", "test");
    const error = new Error("Unexpected JS error");
    mockFetch.mockRejectedValueOnce(error);

    const { result } = renderHook(() => useApi());
    await waitFor(() => expect(result.current.error).not.toBeNull());
    expect(result.current.error?.code).toBe(500);
    expect(result.current.error?.message).toBe("An unexpected error occurred.");
    expect(result.current.error?.detail).toBe(error.message);
    expect(result.current.isLoading).toBe(false);
  });

  it("should allow retrying a failed fetch", async () => {
    mockCurrentSearchParams.set("q", "test");
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 503,
      statusText: "Service Unavailable",
      json: async () => ({}),
    });

    const { result } = renderHook(() => useApi());
    await waitFor(() => expect(result.current.error).not.toBeNull());
    expect(mockFetch).toHaveBeenCalledTimes(1);

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponseData,
    });
    groupResultsBySport.mockReturnValueOnce(mockExpectedGroupedData);

    act(() => {
      result.current.retry();
    });

    expect(result.current.isLoading).toBe(true);
    await waitFor(() =>
      expect(result.current.results).toEqual(mockExpectedGroupedData),
    );
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it("should not fetch and should reset results if query (q) becomes empty", async () => {
    mockCurrentSearchParams.set("q", "initialQuery");
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponseData,
    });
    groupResultsBySport.mockReturnValueOnce(mockExpectedGroupedData);

    const { result, rerender } = renderHook(() => useApi());
    await waitFor(() =>
      expect(result.current.results).toEqual(mockExpectedGroupedData),
    );
    expect(mockFetch).toHaveBeenCalledTimes(1);

    mockFetch.mockClear();
    groupResultsBySport.mockClear();
    mockCurrentSearchParams.set("q", "");

    act(() => rerender());

    expect(mockFetch).not.toHaveBeenCalled();
    expect(result.current.results).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });
});
