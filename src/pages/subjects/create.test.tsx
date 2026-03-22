import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SubjectsCreate from "./create";

describe("SubjectsCreate", () => {
  it("renders without crashing", () => {
    render(<SubjectsCreate />);
  });

  it("displays the text 'Create'", () => {
    render(<SubjectsCreate />);
    expect(screen.getByText("Create")).toBeInTheDocument();
  });

  it("renders a div element containing the text", () => {
    const { container } = render(<SubjectsCreate />);
    const div = container.querySelector("div");
    expect(div).toBeInTheDocument();
    expect(div?.textContent).toBe("Create");
  });

  it("renders exactly one root element", () => {
    const { container } = render(<SubjectsCreate />);
    expect(container.children).toHaveLength(1);
  });
});