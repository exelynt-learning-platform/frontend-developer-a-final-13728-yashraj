import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "./App";

const mocks = vi.hoisted(() => ({
  employee: {
    id: "1",
    name: "Ada Lovelace",
    email: "ada@example.com",
    mobile: "1234567890",
    country: "India",
    state: "Delhi",
    district: "New Delhi",
  },
  employeesQuery: {
    data: [
      {
        id: "1",
        name: "Ada Lovelace",
        email: "ada@example.com",
        mobile: "1234567890",
        country: "India",
        state: "Delhi",
        district: "New Delhi",
      },
    ],
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
  },
  countriesQuery: {
    data: [{ id: "1", country: "India" }],
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
  },
  search: vi.fn(() => ({ unwrap: vi.fn().mockResolvedValue({}) })),
  create: vi.fn(() => ({ unwrap: vi.fn().mockResolvedValue({}) })),
  createState: {
    isLoading: false,
    isError: false,
    error: undefined as unknown,
  },
  update: vi.fn(() => ({ unwrap: vi.fn().mockResolvedValue({}) })),
  updateState: {
    isLoading: false,
    isError: false,
    error: undefined as unknown,
  },
  remove: vi.fn(() => ({ unwrap: vi.fn().mockResolvedValue({}) })),
  removeState: { isLoading: false },
}));

vi.mock("./features/employees/api/employeeApi", () => ({
  useGetEmployeesQuery: () => mocks.employeesQuery,
  useGetCountriesQuery: () => mocks.countriesQuery,
  useLazyGetEmployeeByIdQuery: () => [mocks.search, { isLoading: false }],
  useCreateEmployeeMutation: () => [mocks.create, mocks.createState],
  useUpdateEmployeeMutation: () => [mocks.update, mocks.updateState],
  useDeleteEmployeeMutation: () => [mocks.remove, mocks.removeState],
}));

function renderApp() {
  return render(<App />);
}

async function fillEmployeeForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("Name"), "Grace Hopper");
  await user.type(screen.getByLabelText("Email"), "grace@example.com");
  await user.type(screen.getByLabelText("Mobile"), "9876543210");
  fireEvent.mouseDown(screen.getAllByRole("combobox")[0]);
  await user.click(screen.getByRole("option", { name: "India" }));
  await user.type(screen.getByLabelText("State"), "Delhi");
  await user.type(screen.getByLabelText("District"), "New Delhi");
}

describe("App CRUD UI flows", () => {
  beforeEach(() => {
    mocks.employeesQuery.data = [mocks.employee];
    mocks.employeesQuery.isLoading = false;
    mocks.employeesQuery.isError = false;
    mocks.countriesQuery.data = [{ id: "1", country: "India" }];
    mocks.countriesQuery.isLoading = false;
    mocks.countriesQuery.isError = false;
    mocks.search.mockReset();
    mocks.search.mockImplementation(() => ({
      unwrap: vi.fn().mockResolvedValue(mocks.employee),
    }));
    mocks.create.mockClear();
    mocks.update.mockClear();
    mocks.remove.mockClear();
    mocks.createState.error = undefined;
    mocks.updateState.error = undefined;
    mocks.removeState.isLoading = false;
  });

  it("submits a valid Add Employee form and shows success feedback", async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByRole("button", { name: /Add Employee/ }));
    await screen.findByRole("heading", { name: "Add Employee" });
    await fillEmployeeForm(user);
    await user.click(screen.getByRole("button", { name: "Add Employee" }));

    expect(mocks.create).toHaveBeenCalledOnce();
    expect(
      await screen.findByText("Employee added successfully."),
    ).toBeInTheDocument();
  });

  it("keeps Add Employee open and shows retry feedback after a failure", async () => {
    const user = userEvent.setup();
    mocks.create
      .mockImplementationOnce(() => ({
        unwrap: vi.fn().mockRejectedValue({ status: 500 }),
      }))
      .mockImplementationOnce(() => ({
        unwrap: vi.fn().mockResolvedValue({}),
      }));
    const { rerender } = renderApp();

    await user.click(screen.getByRole("button", { name: /Add Employee/ }));
    await screen.findByRole("heading", { name: "Add Employee" });
    await fillEmployeeForm(user);
    await user.click(screen.getByRole("button", { name: "Add Employee" }));

    mocks.createState.error = { status: 500 };
    rerender(<App />);
    expect(
      screen.getByRole("heading", { name: "Add Employee" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Unable to save employee. Please check the details and try again.",
      ),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(
      await screen.findByText("Employee added successfully."),
    ).toBeInTheDocument();
  });

  it("blocks Add until Name and Email are valid and preserves other validation", async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByRole("button", { name: /Add Employee/ }));
    await screen.findByRole("heading", { name: "Add Employee" });
    const addButton = screen.getByRole("button", { name: "Add Employee" });
    expect(addButton).toBeDisabled();

    await user.type(screen.getByLabelText("Name"), "ada lovelace");
    await user.type(screen.getByLabelText("Email"), "Ada@example.com");
    expect(screen.getByText(/Each name word must start/)).toBeInTheDocument();
    expect(
      screen.getByText(/email address must be lowercase/),
    ).toBeInTheDocument();
    expect(addButton).toBeDisabled();

    await user.clear(screen.getByLabelText("Name"));
    await user.type(screen.getByLabelText("Name"), "Ada Lovelace");
    await user.clear(screen.getByLabelText("Email"));
    await user.type(screen.getByLabelText("Email"), "ada@example.com");
    expect(addButton).toBeEnabled();
    await user.click(addButton);

    expect(
      screen.getByText("Mobile must contain exactly 10 digits."),
    ).toBeInTheDocument();
    expect(screen.getByText("Country is required.")).toBeInTheDocument();
  });

  it("handles employee search success, not-found, and retryable errors", async () => {
    const user = userEvent.setup();
    renderApp();
    const searchInput = screen.getByLabelText("Employee ID");
    const searchButton = screen.getByRole("button", { name: "Search" });

    mocks.search.mockImplementationOnce(() => ({
      unwrap: vi.fn().mockResolvedValue(mocks.employee),
    }));
    await user.type(searchInput, "1");
    await user.click(searchButton);
    expect(
      await screen.findByLabelText("Search result for employee 1"),
    ).toBeInTheDocument();

    await user.clear(searchInput);
    await user.type(searchInput, "404");
    mocks.search.mockImplementationOnce(() => ({
      unwrap: vi.fn().mockRejectedValue({ status: 404 }),
    }));
    await user.click(searchButton);
    expect(await screen.findByText(/Employee not found/)).toBeInTheDocument();

    await user.clear(searchInput);
    await user.type(searchInput, "500");
    mocks.search
      .mockImplementationOnce(() => ({
        unwrap: vi.fn().mockRejectedValue({ status: 500 }),
      }))
      .mockImplementationOnce(() => ({
        unwrap: vi.fn().mockResolvedValue(mocks.employee),
      }));
    await user.click(searchButton);
    await user.click(await screen.findByRole("button", { name: "Try again" }));
    expect(
      await screen.findByLabelText("Search result for employee 1"),
    ).toBeInTheDocument();
  });

  it("shows list and country loading or error recovery states", async () => {
    const user = userEvent.setup();
    mocks.employeesQuery.isLoading = true;
    const { rerender } = renderApp();
    expect(screen.getByText("Loading employees...")).toBeInTheDocument();

    mocks.employeesQuery.isLoading = false;
    mocks.employeesQuery.isError = true;
    rerender(<App />);
    expect(screen.getByText("Unable to load employees.")).toBeInTheDocument();

    mocks.employeesQuery.isError = false;
    mocks.countriesQuery.isError = true;
    rerender(<App />);
    await user.click(screen.getByRole("button", { name: /Add Employee/ }));
    expect(
      await screen.findByText("Unable to load countries."),
    ).toBeInTheDocument();
  });

  it("shows an actionable empty employee state", async () => {
    const user = userEvent.setup();
    mocks.employeesQuery.data = [];
    renderApp();

    const emptyState = screen.getByRole("alert");
    expect(
      within(emptyState).getByText(
        "No employees found. Add your first employee.",
      ),
    ).toBeInTheDocument();

    await user.click(
      within(emptyState).getByRole("button", { name: "Add Employee" }),
    );
    expect(
      await screen.findByRole("heading", { name: "Add Employee" }),
    ).toBeInTheDocument();
  });

  it("prefills Edit Employee and submits the updated values", async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByRole("button", { name: "Edit Ada Lovelace" }));
    await screen.findByRole("heading", { name: "Edit Employee" });
    expect(screen.getByLabelText("Name")).toHaveValue("Ada Lovelace");
    expect(screen.getByLabelText("Email")).toHaveValue("ada@example.com");
    await user.clear(screen.getByLabelText("Name"));
    await user.type(screen.getByLabelText("Name"), "Grace Hopper");
    await user.click(screen.getByRole("button", { name: "Save Changes" }));

    expect(mocks.update).toHaveBeenCalledWith({
      id: "1",
      body: expect.objectContaining({ name: "Grace Hopper" }),
    });
    expect(
      await screen.findByText("Employee updated successfully."),
    ).toBeInTheDocument();
  });

  it("keeps Edit Employee open after a mutation failure", async () => {
    const user = userEvent.setup();
    mocks.update.mockImplementationOnce(() => ({
      unwrap: vi.fn().mockRejectedValue({ status: 500 }),
    }));
    const { rerender } = renderApp();

    await user.click(screen.getByRole("button", { name: "Edit Ada Lovelace" }));
    await screen.findByRole("heading", { name: "Edit Employee" });
    await user.click(screen.getByRole("button", { name: "Save Changes" }));

    mocks.updateState.error = { status: 500 };
    rerender(<App />);
    expect(
      screen.getByRole("heading", { name: "Edit Employee" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Unable to save employee. Please check the details and try again.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Employee updated successfully."),
    ).not.toBeInTheDocument();
  });

  it("opens delete confirmation and does not delete when cancelled", async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(
      screen.getByRole("button", { name: "Delete Ada Lovelace" }),
    );
    await screen.findByRole("heading", { name: "Delete Employee?" });
    expect(
      screen.getByRole("dialog", { name: "Delete Employee?" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Delete Employee?" }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(mocks.remove).not.toHaveBeenCalled();
    expect(
      screen.queryByRole("heading", { name: "Delete Employee?" }),
    ).not.toBeInTheDocument();
  });

  it("deletes after confirmation and shows success feedback", async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(
      screen.getByRole("button", { name: "Delete Ada Lovelace" }),
    );
    await screen.findByRole("heading", { name: "Delete Employee?" });
    await user.click(screen.getByRole("button", { name: "Delete" }));

    expect(mocks.remove).toHaveBeenCalledWith("1");
    expect(
      await screen.findByText("Employee deleted successfully."),
    ).toBeInTheDocument();
  });

  it("prevents duplicate delete requests while deletion is in progress", async () => {
    const user = userEvent.setup();
    let resolveDelete!: () => void;
    mocks.remove.mockImplementationOnce(() => ({
      unwrap: vi.fn(
        () =>
          new Promise<void>((resolve) => {
            resolveDelete = resolve;
          }),
      ),
    }));
    const { rerender } = renderApp();

    await user.click(
      screen.getByRole("button", { name: "Delete Ada Lovelace" }),
    );
    await screen.findByRole("heading", { name: "Delete Employee?" });
    await user.click(screen.getByRole("button", { name: "Delete" }));

    mocks.removeState.isLoading = true;
    rerender(<App />);
    const deletingButton = screen.getByRole("button", { name: "Deleting..." });
    expect(deletingButton).toBeDisabled();
    expect(mocks.remove).toHaveBeenCalledOnce();

    await act(async () => {
      resolveDelete();
    });
  });

  it("keeps delete confirmation open and retries after a delete failure", async () => {
    const user = userEvent.setup();
    mocks.remove
      .mockImplementationOnce(() => ({
        unwrap: vi.fn().mockRejectedValue({ status: 500 }),
      }))
      .mockImplementationOnce(() => ({
        unwrap: vi.fn().mockResolvedValue({}),
      }));
    renderApp();

    await user.click(
      screen.getByRole("button", { name: "Delete Ada Lovelace" }),
    );
    await screen.findByRole("heading", { name: "Delete Employee?" });
    await user.click(screen.getByRole("button", { name: "Delete" }));
    expect(
      await screen.findByText("Unable to delete employee. Please try again."),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Try again" }));

    expect(mocks.remove).toHaveBeenCalledTimes(2);
    expect(
      await screen.findByText("Employee deleted successfully."),
    ).toBeInTheDocument();
  });
});
