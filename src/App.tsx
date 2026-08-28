import { useEffect, useState } from "react";
import {
  Alert,
  AppBar,
  Box,
  Button,
  Container,
  Dialog,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Pagination,
  Select,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
  Toolbar,
  Typography,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
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
import { EmployeeForm } from "./features/employees/components/EmployeeForm";
import { EmployeeSearch } from "./features/employees/components/EmployeeSearch";
import { DeleteEmployeeDialog } from "./features/employees/components/DeleteEmployeeDialog";
import { ErrorState, LoadingState } from "./components/common/AsyncState";
import type { Country } from "./features/employees/types/employee.types";

const EMPLOYEES_PER_PAGE = 5;
const NOT_AVAILABLE = "Not available";
type SortKey = "name" | "email" | "mobile" | "country";
type SortDirection = "asc" | "desc";

const formatTitleCase = (value: string) =>
  value
    .trim()
    .toLocaleLowerCase()
    .replace(/(^|[\s'-])\p{L}/gu, (character) => character.toLocaleUpperCase())
    .replace(/\s+/g, " ");

const formatNameOrCountry = (value: string) => {
  const normalizedValue = value.trim().replace(/\s+/g, " ");
  return normalizedValue && /^\p{L}[\p{L}\s'-]*$/u.test(normalizedValue)
    ? formatTitleCase(normalizedValue)
    : NOT_AVAILABLE;
};

const formatEmail = (value: string) => {
  const normalizedValue = value.trim().toLocaleLowerCase();
  return normalizedValue && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedValue)
    ? normalizedValue
    : NOT_AVAILABLE;
};

const formatMobile = (value: string) => {
  const normalizedValue = value.trim();
  return /^\d{10}$/.test(normalizedValue) ? normalizedValue : NOT_AVAILABLE;
};

const sortableColumns: Array<{ key: SortKey; label: string }> = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "mobile", label: "Mobile" },
  { key: "country", label: "Country" },
];

export function EmployeeTable({
  employees,
  countries = [],
  onEdit,
  onDelete,
  page = 1,
  onPageChange = () => undefined,
  rowsPerPage = EMPLOYEES_PER_PAGE,
  onRowsPerPageChange = () => undefined,
}: {
  employees: Employee[];
  countries?: Country[];
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
  page?: number;
  onPageChange?: (page: number) => void;
  rowsPerPage?: number;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
}) {
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const totalPages = Math.max(
    1,
    rowsPerPage === -1 ? 1 : Math.ceil(employees.length / rowsPerPage),
  );
  const currentPage = Math.min(page, totalPages);
  const sortedEmployees = sortKey
    ? [...employees].sort((firstEmployee, secondEmployee) => {
        const comparison = firstEmployee[sortKey].localeCompare(
          secondEmployee[sortKey],
          undefined,
          { numeric: sortKey === "mobile", sensitivity: "base" },
        );

        if (comparison !== 0) {
          return sortDirection === "asc" ? comparison : -comparison;
        }

        return firstEmployee.id.localeCompare(secondEmployee.id);
      })
    : employees;
  const visibleEmployees =
    rowsPerPage === -1
      ? sortedEmployees
      : sortedEmployees.slice(
          (currentPage - 1) * rowsPerPage,
          currentPage * rowsPerPage,
        );
  const firstVisibleIndex =
    rowsPerPage === -1 ? 0 : (currentPage - 1) * rowsPerPage;

  const handleSort = (nextSortKey: SortKey) => {
    setSortDirection((currentDirection) =>
      sortKey === nextSortKey && currentDirection === "asc" ? "desc" : "asc",
    );
    setSortKey(nextSortKey);
    onPageChange(1);
  };

  return (
    <Paper sx={{ overflowX: "auto" }}>
      <Table aria-label="employees" sx={{ minWidth: 680 }}>
        <TableHead>
          <TableRow>
            <TableCell>Employee Count</TableCell>
            {sortableColumns.map(({ key, label }) => (
              <TableCell
                key={key}
                sortDirection={sortKey === key ? sortDirection : false}
              >
                <TableSortLabel
                  active={sortKey === key}
                  direction={sortKey === key ? sortDirection : "asc"}
                  onClick={() => handleSort(key)}
                >
                  {label}
                </TableSortLabel>
              </TableCell>
            ))}
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {visibleEmployees.map((employee, index) => (
            <TableRow hover key={employee.id}>
              <TableCell>{firstVisibleIndex + index + 1}</TableCell>
              <TableCell>{formatNameOrCountry(employee.name)}</TableCell>
              <TableCell>{formatEmail(employee.email)}</TableCell>
              <TableCell>{formatMobile(employee.mobile)}</TableCell>
              <TableCell>
                <Stack direction="row" alignItems="center" gap={1}>
                  {countries.find(
                    (country) =>
                      country.country.trim().toLowerCase() ===
                      employee.country.trim().toLowerCase(),
                  )?.flag && (
                    <Box
                      component="img"
                      src={
                        countries.find(
                          (country) =>
                            country.country.trim().toLowerCase() ===
                            employee.country.trim().toLowerCase(),
                        )?.flag
                      }
                      alt={`${formatNameOrCountry(employee.country)} flag`}
                      loading="lazy"
                      sx={{
                        width: 32,
                        height: 22,
                        objectFit: "cover",
                        borderRadius: 0.5,
                        flexShrink: 0,
                      }}
                    />
                  )}
                  {formatNameOrCountry(employee.country)}
                </Stack>
              </TableCell>
              <TableCell>
                <Stack direction="row" gap={0.5}>
                  <Tooltip title={`Edit ${formatNameOrCountry(employee.name)}`}>
                    <IconButton
                      size="small"
                      color="primary"
                      aria-label={`Edit ${formatNameOrCountry(employee.name)}`}
                      onClick={() => onEdit(employee)}
                    >
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip
                    title={`Delete ${formatNameOrCountry(employee.name)}`}
                  >
                    <IconButton
                      size="small"
                      color="error"
                      aria-label={`Delete ${formatNameOrCountry(employee.name)}`}
                      onClick={() => onDelete(employee)}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Stack
        alignItems="center"
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        gap={1.5}
        sx={{ p: 2, borderTop: 1, borderColor: "divider" }}
      >
        <Stack direction="row" alignItems="center" gap={2}>
          <FormControl size="small" sx={{ minWidth: 130 }}>
            <InputLabel id="rows-per-page-label">Rows per page</InputLabel>
            <Select
              labelId="rows-per-page-label"
              id="rows-per-page"
              value={rowsPerPage}
              label="Rows per page"
              onChange={(event) =>
                onRowsPerPageChange(Number(event.target.value))
              }
            >
              {[5, 10, 20].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
              <MenuItem value={-1}>All</MenuItem>
            </Select>
          </FormControl>
          <Typography variant="body2" color="text.secondary">
            Page {currentPage} of {totalPages}
          </Typography>
        </Stack>
        <Pagination
          page={currentPage}
          count={totalPages}
          onChange={(_, nextPage) => onPageChange(nextPage)}
          showFirstButton={false}
          showLastButton={false}
          siblingCount={0}
          boundaryCount={1}
          size="small"
          aria-label="Employee table pagination"
        />
      </Stack>
    </Paper>
  );
}

export function App() {
  const employeesQuery = useGetEmployeesQuery();
  const countriesQuery = useGetCountriesQuery();
  const [search, searchState] = useLazyGetEmployeeByIdQuery();
  const [create, createState] = useCreateEmployeeMutation();
  const [update, updateState] = useUpdateEmployeeMutation();
  const [remove, deleteState] = useDeleteEmployeeMutation();
  const [formEmployee, setFormEmployee] = useState<Employee | null | undefined>(
    undefined,
  );
  const [deleteEmployee, setDeleteEmployee] = useState<Employee | null>(null);
  const [searchResult, setSearchResult] = useState<Employee | null>(null);
  const [searchError, setSearchError] = useState<"not-found" | "error" | null>(
    null,
  );
  const [notice, setNotice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(EMPLOYEES_PER_PAGE);
  const isFormOpen = formEmployee !== undefined;

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
    setSearchError(null);
    setSearchResult(null);
    try {
      setSearchResult(await search(id).unwrap());
    } catch (error) {
      setSearchError(
        (error as { status?: number }).status === 404 ? "not-found" : "error",
      );
    }
  };
  const handleSave = async (values: EmployeeFormValues) => {
    try {
      if (formEmployee)
        await update({ id: formEmployee.id, body: values }).unwrap();
      else await create(values).unwrap();
      setFormEmployee(undefined);
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
      await remove(deleteEmployee.id).unwrap();
      setDeleteEmployee(null);
      setNotice("Employee deleted successfully.");
    } catch {
      setNotice("Unable to delete employee. Please try again.");
    }
  };
  const formError =
    createState.isError || updateState.isError
      ? "Unable to save employee. Please check the details and try again."
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
            <Typography variant="h4" component="h2" gutterBottom>
              Employees
            </Typography>
            <Typography color="text.secondary">
              Manage your organization&apos;s employee directory.
            </Typography>
          </Box>
          <Stack direction="column" gap={2}>
            <Paper sx={{ p: { xs: 2, sm: 3 }, width: "100%" }}>
              <Stack gap={2}>
                <Typography variant="h6">Search by employee ID</Typography>
                <EmployeeSearch
                  isLoading={searchState.isLoading}
                  onSearch={handleSearch}
                  onClear={() => {
                    setSearchResult(null);
                    setSearchError(null);
                  }}
                />
                {searchState.isLoading && (
                  <LoadingState label="Searching employee..." />
                )}
                {searchResult && (
                  <Alert severity="success">
                    <strong>{searchResult.name}</strong> · {searchResult.email}{" "}
                    · {searchResult.mobile} · {searchResult.country}
                  </Alert>
                )}
                {searchError === "not-found" && (
                  <Alert severity="info">
                    Employee not found. No employee matches this ID.
                  </Alert>
                )}
                {searchError === "error" && (
                  <ErrorState message="Unable to search employee." />
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
            <Typography variant="h6">Employee list</Typography>
            <Button variant="contained" onClick={() => setFormEmployee(null)}>
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
                onEdit={setFormEmployee}
                onDelete={setDeleteEmployee}
              />
            )}
        </Stack>
      </Container>
      <Dialog
        open={isFormOpen}
        onClose={
          createState.isLoading || updateState.isLoading
            ? undefined
            : () => setFormEmployee(undefined)
        }
        fullWidth
        maxWidth="md"
      >
        <EmployeeForm
          employee={formEmployee}
          countries={countriesQuery.data ?? []}
          isSaving={createState.isLoading || updateState.isLoading}
          error={formError}
          onSubmit={handleSave}
          onCancel={() => setFormEmployee(undefined)}
        />
      </Dialog>
      <DeleteEmployeeDialog
        employee={deleteEmployee}
        isDeleting={deleteState.isLoading}
        onCancel={() => setDeleteEmployee(null)}
        onConfirm={handleDelete}
      />
      <Snackbar
        open={!!notice}
        autoHideDuration={4000}
        onClose={() => setNotice("")}
        message={notice}
      />
    </>
  );
}
