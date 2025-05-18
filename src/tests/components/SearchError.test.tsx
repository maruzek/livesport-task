import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchError from "../../components/SearchError";
import { describe, it, expect, vi } from "vitest";
import type { Error as AppError } from "../../types/Error";

describe("SearchError component", () => {
  const user = userEvent.setup();

  const mockError: AppError = {
    code: 404,
    message: "Resource Not Found",
    detail: "The requested item could not be located on the server.",
  };
  const mockOnRetry = vi.fn();

  it("renders error code and message", () => {
    render(<SearchError error={mockError} onRetry={mockOnRetry} />);

    expect(
      screen.getByRole("heading", { name: /404/i, level: 2 }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /resource not found/i, level: 3 }),
    ).toBeInTheDocument();
  });

  it("renders Refresh button and calls onRetry when clicked", async () => {
    render(<SearchError error={mockError} onRetry={mockOnRetry} />);
    const refreshButton = screen.getByRole("button", { name: /refresh/i });

    expect(refreshButton).toBeInTheDocument();
    await user.click(refreshButton);
    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });

  it("renders Show details button initially and does not show details", () => {
    render(<SearchError error={mockError} onRetry={mockOnRetry} />);
    const showDetailsButton = screen.getByRole("button", {
      name: /show details/i,
    });

    expect(showDetailsButton).toBeInTheDocument();
    expect(
      screen.queryByText(mockError.detail as string),
    ).not.toBeInTheDocument();
  });

  it('shows error details and changes button to "Hide details" when "Show details" is clicked', async () => {
    render(<SearchError error={mockError} onRetry={mockOnRetry} />);
    const showDetailsButton = screen.getByRole("button", {
      name: /show details/i,
    });

    await user.click(showDetailsButton);

    expect(screen.getByText(mockError.detail as string)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /error details/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /hide details/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /show details/i }),
    ).not.toBeInTheDocument();
  });

  it('hides error details and changes button to "Show details" when "Hide details" is clicked', async () => {
    render(<SearchError error={mockError} onRetry={mockOnRetry} />);
    const showDetailsButton = screen.getByRole("button", {
      name: /show details/i,
    });

    await user.click(showDetailsButton);
    expect(screen.getByText(mockError.detail as string)).toBeInTheDocument();
    const hideDetailsButton = screen.getByRole("button", {
      name: /hide details/i,
    });

    await user.click(hideDetailsButton);

    expect(
      screen.queryByText(mockError.detail as string),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /error details/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /show details/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /hide details/i }),
    ).not.toBeInTheDocument();
  });
});
