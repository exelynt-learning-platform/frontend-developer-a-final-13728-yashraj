import { EmployeesPage } from "./features/employees/pages/EmployeesPage";

// Preserve the existing public import used by table tests and consumers.
export { EmployeeTable } from "./features/employees/components/EmployeeTable";

export function App() {
  return <EmployeesPage />;
}
