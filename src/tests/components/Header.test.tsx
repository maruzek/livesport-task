import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header from "../../components/Header";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router";

const mockNavigate = vi.fn();
let mockLocation = {
  key: "default",
  pathname: "/",
  search: "",
  hash: "",
  state: null,
};

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
  };
});

const renderWithRouter = (ui: React.ReactElement, initialRoute = "/") => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="*" element={ui} />
      </Routes>
    </MemoryRouter>,
  );
};

describe("Header component", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    mockNavigate.mockClear();
    mockLocation = {
      key: "default",
      pathname: "/",
      search: "",
      hash: "",
      state: null,
    };
  });

  it('renders with default title "FlashResults" if no title prop is provided', () => {
    renderWithRouter(<Header />);
    expect(
      screen.getByRole("heading", { name: "FlashResults" }),
    ).toBeInTheDocument();
  });

  it("renders with the provided title prop", () => {
    const customTitle = "Search";
    renderWithRouter(<Header title={customTitle} />);
    expect(
      screen.getByRole("heading", { name: customTitle }),
    ).toBeInTheDocument();
  });

  it("renders the back button with ArrowLeft icon", () => {
    renderWithRouter(<Header />);

    const backButton = screen.getByRole("button", { name: /go back/i });

    expect(backButton).toBeInTheDocument();
    expect(backButton.querySelector("svg")).toBeInTheDocument();
  });

  it("renders the info link with Info icon pointing to /about", () => {
    renderWithRouter(<Header />);

    const infoLink = screen.getByRole("link", { name: /about/i });

    expect(infoLink).toBeInTheDocument();
    expect(infoLink).toHaveAttribute("href", "/about");
    expect(infoLink.querySelector("svg")).toBeInTheDocument();
  });

  it('calls navigate(-1) when back button is clicked and location.key is not "default"', async () => {
    mockLocation.key = "someOtherKey";

    renderWithRouter(<Header />);

    const backButton = screen.getByRole("button", { name: /go back/i });
    await user.click(backButton);
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('calls navigate("/", { replace: true }) when back button is clicked, location.key is "default", and pathname is not "/"', async () => {
    mockLocation.key = "default";
    mockLocation.pathname = "/somepage";
    renderWithRouter(<Header />, "/somepage");
    const backButton = screen.getAllByRole("button")[0];
    await user.click(backButton);
    expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
  });

  it('does not call navigate when back button is clicked, location.key is "default", and pathname is "/"', async () => {
    mockLocation.key = "default";
    mockLocation.pathname = "/";
    renderWithRouter(<Header />, "/");
    const backButton = screen.getAllByRole("button")[0];
    await user.click(backButton);
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
