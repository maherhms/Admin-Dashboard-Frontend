import { describe, it, expect } from "vitest";
import { DEPARTMENTS, DEPARTMENT_OPTIONS } from "./index";

describe("DEPARTMENTS", () => {
  it("contains the expected departments", () => {
    expect(DEPARTMENTS).toEqual(["CS", "Math", "English"]);
  });

  it("has exactly three entries", () => {
    expect(DEPARTMENTS).toHaveLength(3);
  });

  it("contains only string values", () => {
    for (const dept of DEPARTMENTS) {
      expect(typeof dept).toBe("string");
    }
  });

  it("contains CS department", () => {
    expect(DEPARTMENTS).toContain("CS");
  });

  it("contains Math department", () => {
    expect(DEPARTMENTS).toContain("Math");
  });

  it("contains English department", () => {
    expect(DEPARTMENTS).toContain("English");
  });

  it("does not contain unexpected departments", () => {
    expect(DEPARTMENTS).not.toContain("Physics");
    expect(DEPARTMENTS).not.toContain("History");
  });
});

describe("DEPARTMENT_OPTIONS", () => {
  it("has the same length as DEPARTMENTS", () => {
    expect(DEPARTMENT_OPTIONS).toHaveLength(DEPARTMENTS.length);
  });

  it("maps each department to an option with label and value", () => {
    for (const option of DEPARTMENT_OPTIONS) {
      expect(option).toHaveProperty("label");
      expect(option).toHaveProperty("value");
    }
  });

  it("sets label equal to value for each option", () => {
    for (const option of DEPARTMENT_OPTIONS) {
      expect(option.label).toBe(option.value);
    }
  });

  it("produces options matching the DEPARTMENTS array order", () => {
    DEPARTMENTS.forEach((dept, index) => {
      expect(DEPARTMENT_OPTIONS[index].label).toBe(dept);
      expect(DEPARTMENT_OPTIONS[index].value).toBe(dept);
    });
  });

  it("contains the CS option", () => {
    expect(DEPARTMENT_OPTIONS).toContainEqual({ label: "CS", value: "CS" });
  });

  it("contains the Math option", () => {
    expect(DEPARTMENT_OPTIONS).toContainEqual({ label: "Math", value: "Math" });
  });

  it("contains the English option", () => {
    expect(DEPARTMENT_OPTIONS).toContainEqual({ label: "English", value: "English" });
  });

  it("does not include options for unlisted departments", () => {
    const values = DEPARTMENT_OPTIONS.map((o) => o.value);
    expect(values).not.toContain("Physics");
  });

  it("is a derived (non-circular) array – each entry is a plain object", () => {
    for (const option of DEPARTMENT_OPTIONS) {
      expect(Object.keys(option).sort()).toEqual(["label", "value"]);
    }
  });
});