import { lazy, Suspense, useEffect, useState } from "react";
import {
  Alert,
  AppBar,
  Box,
  Button,
  Container,
  Dialog,
  Link,
  Paper,
  Snackbar,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  useCreateEmployeeMutation,
  useDeleteEmployeeMutation,
  useGetCountriesQuery,
  useGetEmployeesQuery,
  useLazyGetEmployeeByIdQuery,
  useUpdateEmployeeMutation,
} from "./features/employees/api/employeeApi";
import type { Employee } from "./features/employees/types/employee.types";
import type { EmployeeFormValues } from "./features/employees/schemas/employeeSchema";
import { EmployeeSearch } from "./features/employees/components/EmployeeSearch";
import { EmployeeSearchResult } from "./features/employees/components/EmployeeSearchResult";
import { EmployeeTable } from "./features/employees/components/EmployeeTable";
import { ErrorState, LoadingState } from "./components/common/AsyncState";
import { getApiErrorMessage, getApiErrorStatus } from "./lib/apiError";

// These interaction-only components are split out of the initial list bundle.
// Keep lazy declarations at module scope so React can cache their identity.
const EmployeeForm = lazy(() =>
  import("./features/employees/components/EmployeeForm").then((module) => ({
    default: module.EmployeeForm,
  })),
);
const DeleteEmployeeDialog = lazy(() =>
  import("./features/employees/components/DeleteEmployeeDialog").then(
    (module) => ({ default: module.DeleteEmployeeDialog }),
  ),
);

export { EmployeeTable } from "./features/employees/components/EmployeeTable";

const EMPLOYEES_PER_PAGE = 5;
type EmployeeFormState =
  | { mode: "closed" }
  | { mode: "create" }
  | { mode: "edit"; employee: Employee };

export function App() {
  const employeesQuery = useGetEmployeesQuery();
  const countriesQuery = useGetCountriesQuery();
  const [searchEmployee, searchState] = useLazyGetEmployeeByIdQuery();
  const [createEmployee, createState] = useCreateEmployeeMutation();
  const [updateEmployee, updateState] = useUpdateEmployeeMutation();
  const [deleteEmployeeRequest, deleteState] = useDeleteEmployeeMutation();
  const [formState, setFormState] = useState<EmployeeFormState>({
    mode: "closed",
  });
  const [deleteEmployee, setDeleteEmployee] = useState<Employee | null>(null);
  const [searchResult, setSearchResult] = useState<Employee | null>(null);
  const [searchedId, setSearchedId] = useState("");
  const [searchError, setSearchError] = useState<"not-found" | "error" | null>(
    null,
  );
  const [notice, setNotice] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(EMPLOYEES_PER_PAGE);
  const isFormOpen = formState.mode !== "closed";
  const formEmployee = formState.mode === "edit" ? formState.employee : null;

  useEffect(() => {
    const totalPages = Math.max(
      1,
      rowsPerPage === -1
        ? 1
        : Math.ceil((employeesQuery.data?.length ?? 0) / rowsPerPage),
    );
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [employeesQuery.data?.length, rowsPerPage]);

  const handleRowsPerPageChange = (nextRowsPerPage: number) => {
    setRowsPerPage(nextRowsPerPage);
    setCurrentPage(1);
  };
  const handleSearch = async (id: string) => {
    setSearchedId(id);
    setSearchError(null);
    setSearchResult(null);
    try {
      setSearchResult(await searchEmployee(id).unwrap());
    } catch (error) {
      setSearchError(getApiErrorStatus(error) === 404 ? "not-found" : "error");
    }
  };
  const handleSave = async (values: EmployeeFormValues) => {
    try {
      if (formEmployee) {
        await updateEmployee({ id: formEmployee.id, body: values }).unwrap();
      } else {
        await createEmployee(values).unwrap();
      }
      setFormState({ mode: "closed" });
      setNotice(
        formEmployee
          ? "Employee updated successfully."
          : "Employee added successfully.",
      );
    } catch {
      /* form values remain available for retry */
    }
  };
  const handleDelete = async () => {
    if (!deleteEmployee) return;
    try {
      await deleteEmployeeRequest(deleteEmployee.id).unwrap();
      setDeleteEmployee(null);
      setNotice("Employee deleted successfully.");
    } catch (error) {
      setDeleteError(
        getApiErrorMessage(
          error,
          "Unable to delete employee. Please try again.",
        ),
      );
    }
  };
  const formError =
    createState.error || updateState.error
      ? getApiErrorMessage(
          createState.error ?? updateState.error,
          "Unable to save employee. Please check the details and try again.",
        )
      : undefined;
  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <Typography variant="h6" component="h1">
            Employee Management System
          </Typography>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 5 } }}>
        <Stack gap={3}>
          <Box>
            <Typography variant="overline" color="primary.main">
              Directory
            </Typography>
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              sx={{ mt: 0.5 }}
            >
              Employees
            </Typography>
            <Typography color="text.secondary">
              Manage your organization&apos;s employee directory.
            </Typography>
          </Box>
          <Stack direction="column" gap={2}>
            <Paper
              variant="outlined"
              sx={{ p: { xs: 2, sm: 3 }, width: "100%" }}
            >
              <Stack gap={2}>
                <Box>
                  <Typography variant="overline" color="primary.main">
                    Quick lookup
                  </Typography>
                  <Typography variant="h6" component="h3" sx={{ mt: 0.25 }}>
                    Search by employee ID
                  </Typography>
                </Box>
                <EmployeeSearch
                  isLoading={searchState.isLoading}
                  onSearch={handleSearch}
                  onClear={() => {
                    setSearchResult(null);
                    setSearchError(null);
                    setSearchedId("");
                  }}
                />
                {searchState.isLoading && (
                  <LoadingState label="Searching employee..." />
                )}
                {searchResult && (
                  <EmployeeSearchResult employee={searchResult} />
                )}
                {searchError === "not-found" && (
                  <Alert severity="info">
                    Employee not found. No employee matches this ID.
                  </Alert>
                )}
                {searchError === "error" && (
                  <ErrorState
                    message="Unable to search employee."
                    onRetry={() => handleSearch(searchedId)}
                  />
                )}
              </Stack>
            </Paper>
          </Stack>
          <Stack
            alignItems={{ xs: "stretch", sm: "center" }}
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            gap={2}
          >
            <Box>
              <Typography variant="overline" color="primary.main">
                Directory records
              </Typography>
              <Typography variant="h6" component="h3" sx={{ mt: 0.25 }}>
                Employee list
              </Typography>
            </Box>
            <Button
              variant="contained"
              onClick={() => setFormState({ mode: "create" })}
            >
              ＋ Add Employee
            </Button>
          </Stack>
          {employeesQuery.isLoading && (
            <LoadingState label="Loading employees..." />
          )}
          {employeesQuery.isError && (
            <ErrorState
              message="Unable to load employees."
              onRetry={employeesQuery.refetch}
            />
          )}
          {!employeesQuery.isLoading &&
            !employeesQuery.isError &&
            employeesQuery.data?.length === 0 && (
              <Alert severity="info">No employees found.</Alert>
            )}
          {!employeesQuery.isLoading &&
            !employeesQuery.isError &&
            employeesQuery.data &&
            employeesQuery.data.length > 0 && (
              <EmployeeTable
                employees={employeesQuery.data}
                page={currentPage}
                onPageChange={setCurrentPage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleRowsPerPageChange}
                onEdit={(employee) => setFormState({ mode: "edit", employee })}
                onDelete={(employee) => {
                  setDeleteError("");
                  setDeleteEmployee(employee);
                }}
              />
            )}
        </Stack>
      </Container>
      <Dialog
        open={isFormOpen}
        onClose={
          createState.isLoading || updateState.isLoading
            ? undefined
            : () => setFormState({ mode: "closed" })
        }
        fullWidth
        maxWidth="md"
      >
        {isFormOpen && (
          <Suspense
            fallback={<LoadingState label="Loading employee form..." />}
          >
            <EmployeeForm
              employee={formEmployee}
              countries={countriesQuery.data ?? []}
              countriesLoading={countriesQuery.isLoading}
              countriesError={countriesQuery.isError}
              onRetryCountries={countriesQuery.refetch}
              isSaving={createState.isLoading || updateState.isLoading}
              error={formError}
              onSubmit={handleSave}
              onCancel={() => setFormState({ mode: "closed" })}
            />
          </Suspense>
        )}
      </Dialog>
      {deleteEmployee && (
        <Suspense fallback={null}>
          <DeleteEmployeeDialog
            employee={deleteEmployee}
            isDeleting={deleteState.isLoading}
            error={deleteError}
            onCancel={() => setDeleteEmployee(null)}
            onConfirm={handleDelete}
          />
        </Suspense>
      )}
      <Snackbar
        open={!!notice}
        autoHideDuration={4000}
        onClose={() => setNotice("")}
        message={notice}
      />
      <Paper
        elevation={3}
        sx={{
          position: "fixed",
          right: { xs: 12, sm: 20 },
          bottom: { xs: 12, sm: 20 },
          zIndex: (theme) => theme.zIndex.appBar,
          px: 1.5,
          py: 0.75,
          border: 1,
          borderColor: "divider",
        }}
      >
        <Link
          href="https://github.com/YashrajKamble"
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
          color="text.secondary"
          aria-label="Made by Yashraj Kamble, open GitHub profile"
          sx={{ fontSize: { xs: "0.75rem", sm: "0.8125rem" }, fontWeight: 600 }}
        >
          Made by Yashraj Kamble
        </Link>
      </Paper>
    </>
  );
}
