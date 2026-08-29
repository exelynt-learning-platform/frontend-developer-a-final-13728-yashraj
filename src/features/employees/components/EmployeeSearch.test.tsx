import { fireEvent, render, screen } from "@testing-library/react";
import { EmployeeSearch } from "./EmployeeSearch";

describe("EmployeeSearch", () => {
  it("shows a warning and does not search when text is entered", () => {
    const onSearch = vi.fn();

    render(
      <EmployeeSearch
        isLoading={false}
        onSearch={onSearch}
        onClear={() => undefined}
      />,
    );

    fireEvent.change(screen.getByLabelText("Employee ID"), {
      target: { value: "Ada Lovelace" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Search" }));

    expect(
      screen.getByText("Enter a numeric employee ID, not a name or text."),
    ).toBeInTheDocument();
    expect(onSearch).not.toHaveBeenCalled();
  });

  it("searches with a numeric employee ID", () => {
    const onSearch = vi.fn();

    render(
      <EmployeeSearch
        isLoading={false}
        onSearch={onSearch}
        onClear={() => undefined}
      />,
    );

    fireEvent.change(screen.getByLabelText("Employee ID"), {
      target: { value: "00123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Search" }));

    expect(onSearch).toHaveBeenCalledWith("00123");
  });
});
