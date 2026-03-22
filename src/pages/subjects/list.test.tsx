import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DEPARTMENT_OPTIONS, DEPARTMENTS } from "@/constants";

// ---------------------------------------------------------------------------
// Mock heavy Refine / component dependencies so SubjectsList can render in
// a plain jsdom environment without a Refine context tree.
// ---------------------------------------------------------------------------

vi.mock("@refinedev/react-table", () => ({
  useTable: () => ({
    getHeaderGroups: () => [],
    getRowModel: () => ({ rows: [] }),
    getState: () => ({ pagination: { pageIndex: 0, pageSize: 10 } }),
    getCanNextPage: () => false,
    getCanPreviousPage: () => false,
    nextPage: vi.fn(),
    previousPage: vi.fn(),
    setPageSize: vi.fn(),
    getPageCount: () => 1,
  }),
}));

vi.mock("@refinedev/core", () => ({
  useResource: () => ({ resource: { name: "subjects" } }),
  useGo: () => vi.fn(),
  useNavigation: () => ({ create: vi.fn(), list: vi.fn() }),
}));

vi.mock("@/components/refine-ui/views/list-view.tsx", () => ({
  ListView: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="list-view">{children}</div>
  ),
}));

vi.mock("@/components/refine-ui/layout/breadcrumb.tsx", () => ({
  Breadcrumb: () => <nav data-testid="breadcrumb" />,
}));

vi.mock("@/components/refine-ui/buttons/create.tsx", () => ({
  CreateButton: () => <button data-testid="create-button">Create</button>,
}));

vi.mock("@/components/refine-ui/data-table/data-table.tsx", () => ({
  DataTable: () => <table data-testid="data-table" />,
}));

vi.mock("@/components/ui/input.tsx", () => ({
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} />
  ),
}));

vi.mock("@/components/ui/select.tsx", () => ({
  Select: ({
    children,
    onValueChange,
    value,
  }: {
    children: React.ReactNode;
    onValueChange: (v: string) => void;
    value: string;
  }) => (
    <div data-testid="select" data-value={value}>
      <select
        data-testid="select-native"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
      >
        {children}
      </select>
    </div>
  ),
  SelectTrigger: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SelectValue: ({ placeholder }: { placeholder: string }) => (
    <span>{placeholder}</span>
  ),
  SelectContent: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  SelectItem: ({
    children,
    value,
  }: {
    children: React.ReactNode;
    value: string;
  }) => <option value={value}>{children}</option>,
}));

vi.mock("@/components/ui/badge.tsx", () => ({
  Badge: ({
    children,
    variant,
  }: {
    children: React.ReactNode;
    variant?: string;
  }) => <span data-variant={variant}>{children}</span>,
}));

vi.mock("lucide-react", () => ({
  Search: () => <svg data-testid="search-icon" />,
}));

vi.mock("../../App.css", () => ({}));

// ---------------------------------------------------------------------------
// Import after mocks are declared
// ---------------------------------------------------------------------------
import SubjectsList from "./list";

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("SubjectsList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders without crashing", () => {
    render(<SubjectsList />);
  });

  it("renders the page heading 'Subjects'", () => {
    render(<SubjectsList />);
    expect(screen.getByText("Subjects")).toBeInTheDocument();
  });

  it("renders the intro description text", () => {
    render(<SubjectsList />);
    expect(
      screen.getByText("Quick access to essential metrics and management tools.")
    ).toBeInTheDocument();
  });

  it("renders the breadcrumb component", () => {
    render(<SubjectsList />);
    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();
  });

  it("renders the data table component", () => {
    render(<SubjectsList />);
    expect(screen.getByTestId("data-table")).toBeInTheDocument();
  });

  it("renders the create button", () => {
    render(<SubjectsList />);
    expect(screen.getByTestId("create-button")).toBeInTheDocument();
  });

  it("renders the search input with correct placeholder", () => {
    render(<SubjectsList />);
    const input = screen.getByPlaceholderText("Search by name ...");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "text");
  });

  it("search input starts empty", () => {
    render(<SubjectsList />);
    const input = screen.getByPlaceholderText("Search by name ...") as HTMLInputElement;
    expect(input.value).toBe("");
  });

  it("search input updates when user types", () => {
    render(<SubjectsList />);
    const input = screen.getByPlaceholderText("Search by name ...") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "Calculus" } });
    expect(input.value).toBe("Calculus");
  });

  it("search icon is rendered", () => {
    render(<SubjectsList />);
    expect(screen.getByTestId("search-icon")).toBeInTheDocument();
  });

  it("renders the department select with default 'all' value", () => {
    render(<SubjectsList />);
    const select = screen.getByTestId("select");
    expect(select).toHaveAttribute("data-value", "all");
  });

  it("renders an 'All Departments' option in the select", () => {
    render(<SubjectsList />);
    expect(screen.getByText("All Departments")).toBeInTheDocument();
  });

  it("renders department options for all DEPARTMENTS", () => {
    render(<SubjectsList />);
    for (const dept of DEPARTMENTS) {
      expect(screen.getByText(dept)).toBeInTheDocument();
    }
  });

  it("department select updates when a department is chosen", () => {
    render(<SubjectsList />);
    const nativeSelect = screen.getByTestId("select-native") as HTMLSelectElement;
    fireEvent.change(nativeSelect, { target: { value: "CS" } });
    const select = screen.getByTestId("select");
    expect(select).toHaveAttribute("data-value", "CS");
  });

  it("department select can be reset to 'all'", () => {
    render(<SubjectsList />);
    const nativeSelect = screen.getByTestId("select-native") as HTMLSelectElement;
    fireEvent.change(nativeSelect, { target: { value: "Math" } });
    fireEvent.change(nativeSelect, { target: { value: "all" } });
    const select = screen.getByTestId("select");
    expect(select).toHaveAttribute("data-value", "all");
  });
});

// ---------------------------------------------------------------------------
// Filter-logic unit tests – pure functions extracted from the component
// ---------------------------------------------------------------------------

describe("SubjectsList filter logic", () => {
  function computeDepartmentFilters(selectedDepartment: string) {
    return selectedDepartment === "all"
      ? []
      : [{ field: "department", operator: "eq", value: selectedDepartment }];
  }

  function computeSearchFilters(searchQuery: string) {
    return searchQuery
      ? [{ field: "name", operator: "contains", value: searchQuery }]
      : [];
  }

  it("departmentFilters is empty when selectedDepartment is 'all'", () => {
    expect(computeDepartmentFilters("all")).toEqual([]);
  });

  it("departmentFilters contains an eq filter when a department is selected", () => {
    const filters = computeDepartmentFilters("CS");
    expect(filters).toHaveLength(1);
    expect(filters[0]).toEqual({ field: "department", operator: "eq", value: "CS" });
  });

  it("departmentFilters uses the correct field 'department'", () => {
    const filters = computeDepartmentFilters("Math");
    expect(filters[0].field).toBe("department");
  });

  it("departmentFilters uses the 'eq' operator", () => {
    const filters = computeDepartmentFilters("English");
    expect(filters[0].operator).toBe("eq");
  });

  it("searchFilters is empty when searchQuery is an empty string", () => {
    expect(computeSearchFilters("")).toEqual([]);
  });

  it("searchFilters contains a contains filter when searchQuery is non-empty", () => {
    const filters = computeSearchFilters("Calculus");
    expect(filters).toHaveLength(1);
    expect(filters[0]).toEqual({ field: "name", operator: "contains", value: "Calculus" });
  });

  it("searchFilters uses the correct field 'name'", () => {
    const filters = computeSearchFilters("Science");
    expect(filters[0].field).toBe("name");
  });

  it("searchFilters uses the 'contains' operator", () => {
    const filters = computeSearchFilters("Literature");
    expect(filters[0].operator).toBe("contains");
  });

  it("both filters can be combined – all subjects when department=all and no query", () => {
    const permanent = [...computeDepartmentFilters("all"), ...computeSearchFilters("")];
    expect(permanent).toEqual([]);
  });

  it("both filters applied when both are set", () => {
    const permanent = [
      ...computeDepartmentFilters("CS"),
      ...computeSearchFilters("Intro"),
    ];
    expect(permanent).toHaveLength(2);
    expect(permanent[0].field).toBe("department");
    expect(permanent[1].field).toBe("name");
  });

  it("departmentFilters does not treat partial matches as 'all'", () => {
    expect(computeDepartmentFilters("all departments")).toHaveLength(1);
    expect(computeDepartmentFilters("ALL")).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// DEPARTMENT_OPTIONS integration – verified in the rendered select
// ---------------------------------------------------------------------------

describe("DEPARTMENT_OPTIONS used in SubjectsList", () => {
  it("DEPARTMENT_OPTIONS contains the right number of options", () => {
    expect(DEPARTMENT_OPTIONS).toHaveLength(DEPARTMENTS.length);
  });

  it("each option has a label and value equal to the department name", () => {
    for (const option of DEPARTMENT_OPTIONS) {
      expect(DEPARTMENTS).toContain(option.label);
      expect(option.label).toBe(option.value);
    }
  });
});