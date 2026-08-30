import { fireEvent, render, screen } from "@testing-library/react";
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
  create: vi.fn(() => ({ unwrap: vi.fn().mockResolvedValue({}) })),
  update: vi.fn(() => ({ unwrap: vi.fn().mockResolvedValue({}) })),
  remove: vi.fn(() => ({ unwrap: vi.fn().mockResolvedValue({}) })),
}));

vi.mock("./features/employees/api/employeeApi", () => ({
  useGetEmployeesQuery: () => ({
    data: [mocks.employee],
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
  }),
  useGetCountriesQuery: () => ({
    data: [{ id: "1", country: "India" }],
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
  }),
  useLazyGetEmployeeByIdQuery: () => [vi.fn(), { isLoading: false }],
  useCreateEmployeeMutation: () => [mocks.create, { isLoading: false, isError: false }],
  useUpdateEmployeeMutation: () => [mocks.update, { isLoading: false, isError: false }],
  useDeleteEmployeeMutation: () => [mocks.remove, { isLoading: false }],
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
    mocks.create.mockClear();
    mocks.update.mockClear();
    mocks.remove.mockClear();
  });

  it("submits a valid Add Employee form and shows success feedback", async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByRole("button", { name: /Add Employee/ }));
    await screen.findByRole("heading", { name: "Add Employee" });
    await fillEmployeeForm(user);
    await user.click(screen.getByRole("button", { name: "Add Employee" }));

    expect(mocks.create).toHaveBeenCalledOnce();
    expect(await screen.findByText("Employee added successfully.")).toBeInTheDocument();
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
    expect(await screen.findByText("Employee updated successfully.")).toBeInTheDocument();
  });

  it("opens delete confirmation and does not delete when cancelled", async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByRole("button", { name: "Delete Ada Lovelace" }));
    await screen.findByRole("heading", { name: "Delete Employee?" });
    expect(screen.getByRole("heading", { name: "Delete Employee?" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(mocks.remove).not.toHaveBeenCalled();
    expect(screen.queryByRole("heading", { name: "Delete Employee?" })).not.toBeInTheDocument();
  });

  it("deletes after confirmation and shows success feedback", async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByRole("button", { name: "Delete Ada Lovelace" }));
    await screen.findByRole("heading", { name: "Delete Employee?" });
    await user.click(screen.getByRole("button", { name: "Delete" }));

    expect(mocks.remove).toHaveBeenCalledWith("1");
    expect(await screen.findByText("Employee deleted successfully.")).toBeInTheDocument();
  });
});
