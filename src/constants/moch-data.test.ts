import { describe, it, expect } from "vitest";
import { MOCK_SUBJECTS } from "./moch-data";
import { DEPARTMENTS } from "./index";

describe("MOCK_SUBJECTS", () => {
  it("exports an array", () => {
    expect(Array.isArray(MOCK_SUBJECTS)).toBe(true);
  });

  it("contains exactly three subjects", () => {
    expect(MOCK_SUBJECTS).toHaveLength(3);
  });

  it("every subject has the required fields", () => {
    for (const subject of MOCK_SUBJECTS) {
      expect(subject).toHaveProperty("id");
      expect(subject).toHaveProperty("code");
      expect(subject).toHaveProperty("name");
      expect(subject).toHaveProperty("department");
      expect(subject).toHaveProperty("description");
      expect(subject).toHaveProperty("createdAt");
    }
  });

  it("subject ids are positive integers", () => {
    for (const subject of MOCK_SUBJECTS) {
      expect(typeof subject.id).toBe("number");
      expect(Number.isInteger(subject.id)).toBe(true);
      expect(subject.id).toBeGreaterThan(0);
    }
  });

  it("subject ids are unique", () => {
    const ids = MOCK_SUBJECTS.map((s) => s.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("subject codes are non-empty strings", () => {
    for (const subject of MOCK_SUBJECTS) {
      expect(typeof subject.code).toBe("string");
      expect(subject.code.length).toBeGreaterThan(0);
    }
  });

  it("subject codes are unique", () => {
    const codes = MOCK_SUBJECTS.map((s) => s.code);
    const uniqueCodes = new Set(codes);
    expect(uniqueCodes.size).toBe(codes.length);
  });

  it("subject names are non-empty strings", () => {
    for (const subject of MOCK_SUBJECTS) {
      expect(typeof subject.name).toBe("string");
      expect(subject.name.length).toBeGreaterThan(0);
    }
  });

  it("subject departments are from the DEPARTMENTS constant", () => {
    for (const subject of MOCK_SUBJECTS) {
      expect(DEPARTMENTS).toContain(subject.department);
    }
  });

  it("subject descriptions are non-empty strings", () => {
    for (const subject of MOCK_SUBJECTS) {
      expect(typeof subject.description).toBe("string");
      expect(subject.description.length).toBeGreaterThan(0);
    }
  });

  it("subject createdAt values are valid ISO date strings", () => {
    for (const subject of MOCK_SUBJECTS) {
      expect(typeof subject.createdAt).toBe("string");
      const parsed = new Date(subject.createdAt);
      expect(parsed.toString()).not.toBe("Invalid Date");
    }
  });

  it("contains the CS101 subject", () => {
    const cs101 = MOCK_SUBJECTS.find((s) => s.code === "CS101");
    expect(cs101).toBeDefined();
    expect(cs101?.id).toBe(1);
    expect(cs101?.department).toBe("CS");
    expect(cs101?.name).toBe("Introduction to Computer Science");
  });

  it("contains the MATH201 subject", () => {
    const math201 = MOCK_SUBJECTS.find((s) => s.code === "MATH201");
    expect(math201).toBeDefined();
    expect(math201?.id).toBe(2);
    expect(math201?.department).toBe("Math");
    expect(math201?.name).toBe("Calculus II");
  });

  it("contains the ENG102 subject", () => {
    const eng102 = MOCK_SUBJECTS.find((s) => s.code === "ENG102");
    expect(eng102).toBeDefined();
    expect(eng102?.id).toBe(3);
    expect(eng102?.department).toBe("English");
    expect(eng102?.name).toBe("Literature and Composition");
  });

  it("each department in DEPARTMENTS is represented by at least one subject", () => {
    const subjectDepartments = new Set(MOCK_SUBJECTS.map((s) => s.department));
    for (const dept of DEPARTMENTS) {
      expect(subjectDepartments).toContain(dept);
    }
  });
});