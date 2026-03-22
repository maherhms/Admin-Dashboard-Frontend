import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Dashboard from "./dashboard";

describe("Dashboard", () => {
  it("renders without crashing", () => {
    render(<Dashboard />);
  });

  it("displays the text 'Dashboard'", () => {
    render(<Dashboard />);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("renders a div element containing the text", () => {
    const { container } = render(<Dashboard />);
    const div = container.querySelector("div");
    expect(div).toBeInTheDocument();
    expect(div?.textContent).toBe("Dashboard");
  });

  it("renders exactly one root element", () => {
    const { container } = render(<Dashboard />);
    expect(container.children).toHaveLength(1);
  });
});