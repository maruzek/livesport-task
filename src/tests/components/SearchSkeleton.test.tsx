import { render } from "@testing-library/react";
import SearchSkeleton from "../../components/SearchSkeleton";
import { describe, it, expect } from "vitest";

describe("SearchSkeleton component", () => {
  it("renders the main skeleton container", () => {
    const { container } = render(<SearchSkeleton />);
    const mainContainer = container.firstChild;
    expect(mainContainer).toBeInTheDocument();
    expect(mainContainer).toHaveClass(
      "flex",
      "w-full",
      "flex-col",
      "space-y-4",
    );
  });

  it("renders the top header placeholder", () => {
    const { container } = render(<SearchSkeleton />);
    const headerPlaceholder = container.querySelector(
      ".ml-4.h-6.w-1\\/4.animate-pulse.rounded.bg-gray-600",
    );
    expect(headerPlaceholder).toBeInTheDocument();
  });

  it("renders two section title placeholders", () => {
    const { container } = render(<SearchSkeleton />);
    const sectionTitlePlaceholders = container.querySelectorAll(
      ".h-5.w-1\\/3.animate-pulse.rounded.bg-gray-600.p-2",
    );
    expect(sectionTitlePlaceholders.length).toBe(2);
  });

  it("renders a total of 6 skeleton item rows (3 per section)", () => {
    const { container } = render(<SearchSkeleton />);
    const skeletonItemRows = container.querySelectorAll(
      ".flex.w-full.animate-pulse.flex-row.space-x-3",
    );
    expect(skeletonItemRows.length).toBe(6);
  });

  it("each skeleton item row contains an image placeholder and two text line placeholders", () => {
    const { container } = render(<SearchSkeleton />);
    const skeletonItemRows = container.querySelectorAll(
      ".flex.w-full.animate-pulse.flex-row.space-x-3",
    );

    expect(skeletonItemRows.length).toBeGreaterThan(0);

    skeletonItemRows.forEach((itemRow) => {
      const imagePlaceholder = itemRow.querySelector(
        ".h-12.w-12.rounded.bg-gray-600",
      );
      expect(imagePlaceholder).toBeInTheDocument();

      const textLinePlaceholders = itemRow.querySelectorAll(
        ".h-4.rounded.bg-gray-600",
      );
      expect(textLinePlaceholders.length).toBe(2);

      const firstTextLine = itemRow.querySelector(
        ".h-4.w-3\\/4.rounded.bg-gray-600",
      );
      const secondTextLine = itemRow.querySelector(
        ".h-4.w-1\\/4.rounded.bg-gray-600",
      );
      expect(firstTextLine).toBeInTheDocument();
      expect(secondTextLine).toBeInTheDocument();
    });
  });

  it("applies animate-pulse class to 9 key structural elements", () => {
    const { container } = render(<SearchSkeleton />);
    const animatedElements = container.querySelectorAll(".animate-pulse");
    expect(animatedElements.length).toBe(9);
  });
});
