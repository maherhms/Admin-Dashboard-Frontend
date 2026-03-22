import { describe, it, expect } from "vitest";
import { dataProvider } from "./data";
import { MOCK_SUBJECTS } from "@/constants/moch-data";

describe("dataProvider.getList", () => {
  it("returns all mock subjects when resource is 'subjects'", async () => {
    const result = await dataProvider.getList({ resource: "subjects" } as Parameters<typeof dataProvider.getList>[0]);
    expect(result.data).toEqual(MOCK_SUBJECTS);
  });

  it("returns the correct total count for 'subjects'", async () => {
    const result = await dataProvider.getList({ resource: "subjects" } as Parameters<typeof dataProvider.getList>[0]);
    expect(result.total).toBe(MOCK_SUBJECTS.length);
    expect(result.total).toBe(3);
  });

  it("returns an empty array for unknown resources", async () => {
    const result = await dataProvider.getList({ resource: "unknown-resource" } as Parameters<typeof dataProvider.getList>[0]);
    expect(result.data).toEqual([]);
    expect(result.total).toBe(0);
  });

  it("returns empty data for resource 'dashboard'", async () => {
    const result = await dataProvider.getList({ resource: "dashboard" } as Parameters<typeof dataProvider.getList>[0]);
    expect(result.data).toEqual([]);
    expect(result.total).toBe(0);
  });

  it("returns empty data for empty string resource", async () => {
    const result = await dataProvider.getList({ resource: "" } as Parameters<typeof dataProvider.getList>[0]);
    expect(result.data).toEqual([]);
    expect(result.total).toBe(0);
  });

  it("returned subjects data has expected shape (id, code, name, department, description, createdAt)", async () => {
    const result = await dataProvider.getList({ resource: "subjects" } as Parameters<typeof dataProvider.getList>[0]);
    for (const item of result.data) {
      expect(item).toHaveProperty("id");
      expect(item).toHaveProperty("code");
      expect(item).toHaveProperty("name");
      expect(item).toHaveProperty("department");
      expect(item).toHaveProperty("description");
      expect(item).toHaveProperty("createdAt");
    }
  });

  it("resource check is case-sensitive – 'Subjects' returns empty", async () => {
    const result = await dataProvider.getList({ resource: "Subjects" } as Parameters<typeof dataProvider.getList>[0]);
    expect(result.data).toEqual([]);
    expect(result.total).toBe(0);
  });
});

describe("dataProvider.getOne", () => {
  it("throws 'This function is not present in mock'", async () => {
    await expect(
      dataProvider.getOne({ resource: "subjects", id: 1 })
    ).rejects.toThrow("This function is not present in mock");
  });
});

describe("dataProvider.create", () => {
  it("throws 'This function is not present in mock'", async () => {
    await expect(
      dataProvider.create({ resource: "subjects", variables: {} })
    ).rejects.toThrow("This function is not present in mock");
  });
});

describe("dataProvider.update", () => {
  it("throws 'This function is not present in mock'", async () => {
    await expect(
      dataProvider.update({ resource: "subjects", id: 1, variables: {} })
    ).rejects.toThrow("This function is not present in mock");
  });
});

describe("dataProvider.deleteOne", () => {
  it("throws 'This function is not present in mock'", async () => {
    await expect(
      dataProvider.deleteOne({ resource: "subjects", id: 1 })
    ).rejects.toThrow("This function is not present in mock");
  });
});

describe("dataProvider.getApiUrl", () => {
  it("returns an empty string", () => {
    expect(dataProvider.getApiUrl()).toBe("");
  });
});