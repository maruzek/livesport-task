import { render, screen } from "@testing-library/react";
import SportGroup from "../../components/SportGroup";
import { describe, it, expect } from "vitest";

describe("SportGroup component", () => {
  it("renders the sport name and children correctly", () => {
    const sportName = "Soccer";
    const childText = "Child Item";

    render(
      <SportGroup sport={sportName}>
        <div>{childText}</div>
      </SportGroup>,
    );

    expect(screen.getByText(sportName)).toBeInTheDocument();
    expect(screen.getByText(childText)).toBeInTheDocument();
  });
});
