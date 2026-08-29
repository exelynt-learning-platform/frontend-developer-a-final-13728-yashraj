import { fireEvent, render, screen, within } from "@testing-library/react";
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
    expect(
      screen.getByRole("button", { name: "Edit Ada Lovelace" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Delete Ada Lovelace" }),
    ).toBeInTheDocument();
  });

  it("shows five employees per page and navigates to the next page", () => {
    const employees = Array.from({ length: 6 }, (_, index) => ({
      id: String(index + 1),
      name: `Employee ${String.fromCharCode(65 + index)}`,
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

    expect(screen.getByText("Employee A")).toBeInTheDocument();
    expect(screen.getByText("Employee E")).toBeInTheDocument();
    expect(screen.queryByText("Employee F")).not.toBeInTheDocument();
    expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Go to next page" }));

    expect(screen.getByText("Employee F")).toBeInTheDocument();
    expect(screen.queryByText("Employee A")).not.toBeInTheDocument();
    expect(
      within(screen.getAllByRole("row")[1]).getByText("6"),
    ).toBeInTheDocument();
    expect(screen.getByText("Page 2 of 2")).toBeInTheDocument();
  });

  it("formats table values and shows not available for invalid data", () => {
    render(
      <EmployeeTable
        employees={[
          {
            id: "1",
            name: "jOhN   doE",
            email: " JOHN@EXAMPLE.COM ",
            mobile: "1234567890",
            country: "tUrKmEnIsTaN",
            state: "Ahal",
            district: "Ashgabat",
          },
          {
            id: "2",
            name: "12345",
            email: "invalid-email",
            mobile: "1234",
            country: "",
            state: "",
            district: "",
          },
        ]}
        onEdit={() => undefined}
        onDelete={() => undefined}
      />,
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("Turkmenistan")).toBeInTheDocument();
    expect(screen.getByText("1234567890")).toBeInTheDocument();
    expect(screen.getAllByText("Not available")).toHaveLength(4);
  });

  it("supports changing the rows per page", () => {
    const employees = Array.from({ length: 10 }, (_, index) => ({
      id: String(index + 1),
      name: `Employee ${String.fromCharCode(65 + index)}`,
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

    expect(screen.getByText("Employee J")).toBeInTheDocument();
    expect(screen.getByText("Page 1 of 1")).toBeInTheDocument();
  });

  it("keeps all employees visible when switching to All more than once", () => {
    const employees = Array.from({ length: 6 }, (_, index) => ({
      id: String(index + 1),
      name: `Employee ${String.fromCharCode(65 + index)}`,
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

    const selectRowsPerPage = (option: string) => {
      fireEvent.mouseDown(
        screen.getByRole("combobox", { name: "Rows per page" }),
      );
      fireEvent.click(screen.getByRole("option", { name: option }));
    };

    selectRowsPerPage("All");
    expect(screen.getByText("Employee F")).toBeInTheDocument();
    expect(screen.getByText("Page 1 of 1")).toBeInTheDocument();

    selectRowsPerPage("5");
    expect(screen.queryByText("Employee F")).not.toBeInTheDocument();
    expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();

    selectRowsPerPage("All");
    expect(screen.getByText("Employee F")).toBeInTheDocument();
    expect(screen.getByText("Page 1 of 1")).toBeInTheDocument();
  });

  it("sorts applicable columns and leaves actions unsortable", () => {
    const employees = [
      {
        id: "1",
        name: "Zoe Employee",
        email: "zoe@example.com",
        mobile: "9999999999",
        country: "United Kingdom",
        state: "England",
        district: "London",
      },
      {
        id: "2",
        name: "Ada Employee",
        email: "ada@example.com",
        mobile: "1111111111",
        country: "India",
        state: "Delhi",
        district: "New Delhi",
      },
    ];

    render(
      <EmployeeTable
        employees={employees}
        onEdit={() => undefined}
        onDelete={() => undefined}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Name" }));

    const rows = screen.getAllByRole("row");
    expect(rows[1]).toHaveTextContent("Ada Employee");
    expect(screen.getByText("Actions")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Actions" }),
    ).not.toBeInTheDocument();
  });

  it("sorts only the employees in the selected page", () => {
    const employees = [
      "Zoe Employee",
      "Ada Employee",
      "Mia Employee",
      "Liam Employee",
      "Noah Employee",
      "Aaron Employee",
    ].map((name, index) => ({
      id: String(index + 1),
      name,
      email: `employee${index + 1}@example.com`,
      mobile: "1234567890",
      country: "India",
      state: "Delhi",
      district: "New Delhi",
    }));

    render(
      <EmployeeTable
        employees={employees}
        onEdit={() => undefined}
        onDelete={() => undefined}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Name" }));

    const rows = screen.getAllByRole("row");
    expect(rows[1]).toHaveTextContent("Ada Employee");
    expect(screen.queryByText("Aaron Employee")).not.toBeInTheDocument();
  });
});
