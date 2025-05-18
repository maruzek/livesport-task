import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ErrorPage from "../../pages/ErrorPage";

vi.mock("react-router", async (importOriginal) => {
  const actual = (await importOriginal()) as object;
  const actualDom = (await vi.importActual("react-router")) as any;
  return {
    ...actual,
    Link: actualDom.Link,
  };
});

const renderWithRouter = (
  ui: React.ReactElement,
  initialEntries = ["/error"],
) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="*" element={ui} />
      </Routes>
    </MemoryRouter>,
  );
};

describe("ErrorPage component", () => {
  beforeEach(() => {
    document.title = "";
  });

  it("sets the document title correctly", () => {
    renderWithRouter(<ErrorPage />);
    expect(document.title).toBe("404 - Not Found | FlashResults");
  });

  it('renders the main heading "404 - Not Found"', () => {
    renderWithRouter(<ErrorPage />);
    expect(
      screen.getByRole("heading", { name: /404 - Not Found/i, level: 2 }),
    ).toBeInTheDocument();
  });

  it('renders the descriptive paragraph "This page doesn\'t exist"', () => {
    renderWithRouter(<ErrorPage />);
    expect(screen.getByText("This page doesn't exist")).toBeInTheDocument();
  });

  it('renders a link to the search page ("/") with correct text', () => {
    renderWithRouter(<ErrorPage />);
    const linkElement = screen.getByRole("link", {
      name: /go back to the search/i,
    });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", "/");
  });

  it("link has correct styling classes", () => {
    renderWithRouter(<ErrorPage />);
    const linkElement = screen.getByRole("link", {
      name: /go back to the search/i,
    });
    expect(linkElement).toHaveClass(
      "rounded-md",
      "bg-red-700",
      "px-4",
      "py-2",
      "transition-colors",
      "duration-100",
      "hover:bg-red-800",
    );
  });
});
