import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { EmployeeTable } from "./App";

describe("App", () => {
  it("renders employee details in the list table", () => {
    render(
      <EmployeeTable
        employees={[
          {
            id: "1",
            name: "Ada Lovelace",
            email: "ada@example.com",
            mobile: "1234567890",
            country: "India",
            state: "Delhi",
            district: "New Delhi",
          },
        ]}
        onEdit={() => undefined}
        onDelete={() => undefined}
      />,
    );

    expect(screen.getByText("Ada Lovelace")).toBeInTheDocument();
    expect(screen.getByText("ada@example.com")).toBeInTheDocument();
    expect(screen.getByText("India")).toBeInTheDocument();
  });

  it("shows five employees per page and navigates to the next page", () => {
    const employees = Array.from({ length: 6 }, (_, index) => ({
      id: String(index + 1),
      name: `Employee ${index + 1}`,
      email: `employee${index + 1}@example.com`,
      mobile: "1234567890",
      country: "India",
      state: "Delhi",
      district: "New Delhi",
    }));

    function PaginatedTable() {
      const [page, setPage] = useState(1);
      return (
        <EmployeeTable
          employees={employees}
          page={page}
          onPageChange={setPage}
          onEdit={() => undefined}
          onDelete={() => undefined}
        />
      );
    }

    render(<PaginatedTable />);

    expect(screen.getByText("Employee 1")).toBeInTheDocument();
    expect(screen.getByText("Employee 5")).toBeInTheDocument();
    expect(screen.queryByText("Employee 6")).not.toBeInTheDocument();
    expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Go to next page" }));

    expect(screen.getByText("Employee 6")).toBeInTheDocument();
    expect(screen.queryByText("Employee 1")).not.toBeInTheDocument();
    expect(screen.getByText("Page 2 of 2")).toBeInTheDocument();
  });

  it("supports changing the rows per page", () => {
    const employees = Array.from({ length: 10 }, (_, index) => ({
      id: String(index + 1),
      name: `Employee ${index + 1}`,
      email: `employee${index + 1}@example.com`,
      mobile: "1234567890",
      country: "India",
      state: "Delhi",
      district: "New Delhi",
    }));

    function PaginatedTable() {
      const [rowsPerPage, setRowsPerPage] = useState(5);
      return (
        <EmployeeTable
          employees={employees}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={setRowsPerPage}
          onEdit={() => undefined}
          onDelete={() => undefined}
        />
      );
    }

    render(<PaginatedTable />);

    fireEvent.mouseDown(
      screen.getByRole("combobox", { name: "Rows per page" }),
    );
    fireEvent.click(screen.getByRole("option", { name: "10" }));

    expect(screen.getByText("Employee 10")).toBeInTheDocument();
    expect(screen.getByText("Page 1 of 1")).toBeInTheDocument();
  });
});
