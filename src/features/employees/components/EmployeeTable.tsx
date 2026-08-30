import { useState } from "react";
import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Pagination,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { EMPLOYEES_PER_PAGE } from "../constants";
import type { Employee, Country } from "../types/employee.types";
import {
  formatEmail,
  formatMobile,
  formatNameOrCountry,
} from "../utils/formatEmployeeValue";

type SortKey = "name" | "email" | "mobile" | "country";
type SortDirection = "asc" | "desc";

const sortableColumns: Array<{ key: SortKey; label: string }> = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "mobile", label: "Mobile" },
  { key: "country", label: "Country" },
];

interface EmployeeTableProps {
  employees: Employee[];
  countries?: Country[];
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
  page?: number;
  onPageChange?: (page: number) => void;
  rowsPerPage?: number;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
}

export function EmployeeTable({
  employees,
  countries = [],
  onEdit,
  onDelete,
  page = 1,
  onPageChange = () => undefined,
  rowsPerPage = EMPLOYEES_PER_PAGE,
  onRowsPerPageChange = () => undefined,
}: EmployeeTableProps) {
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const totalPages = Math.max(
    1,
    rowsPerPage === -1 ? 1 : Math.ceil(employees.length / rowsPerPage),
  );
  const currentPage = Math.min(page, totalPages);
  const paginatedEmployees =
    rowsPerPage === -1
      ? employees
      : employees.slice(
          (currentPage - 1) * rowsPerPage,
          currentPage * rowsPerPage,
        );
  const visibleEmployees = sortKey
    ? [...paginatedEmployees].sort((firstEmployee, secondEmployee) => {
        const comparison = (firstEmployee[sortKey] ?? "").localeCompare(
          secondEmployee[sortKey] ?? "",
          undefined,
          { numeric: sortKey === "mobile", sensitivity: "base" },
        );

        if (comparison !== 0) {
          return sortDirection === "asc" ? comparison : -comparison;
        }

        return (firstEmployee.id ?? "").localeCompare(secondEmployee.id ?? "");
      })
    : paginatedEmployees;
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
    <Paper variant="outlined" sx={{ overflowX: "auto", mb: { xs: 8, sm: 0 } }}>
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
          {visibleEmployees.map((employee, index) => {
            const country = countries.find(
              (item) =>
                (item.country ?? "").trim().toLowerCase() ===
                (employee.country ?? "").trim().toLowerCase(),
            );
            const displayName = formatNameOrCountry(employee.name);
            const displayCountry = formatNameOrCountry(employee.country);

            return (
              <TableRow hover key={employee.id}>
                <TableCell>{firstVisibleIndex + index + 1}</TableCell>
                <TableCell>{displayName}</TableCell>
                <TableCell>{formatEmail(employee.email)}</TableCell>
                <TableCell>{formatMobile(employee.mobile)}</TableCell>
                <TableCell>
                  <Stack direction="row" alignItems="center" gap={1}>
                    {country?.flag && (
                      <Box
                        component="img"
                        src={country.flag}
                        alt={`${displayCountry} flag`}
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
                    {displayCountry}
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack direction="row" gap={0.5}>
                    <Tooltip title={`Edit ${displayName}`}>
                      <IconButton
                        size="small"
                        color="primary"
                        aria-label={`Edit ${displayName}`}
                        onClick={() => onEdit(employee)}
                      >
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={`Delete ${displayName}`}>
                      <IconButton
                        size="small"
                        color="error"
                        aria-label={`Delete ${displayName}`}
                        onClick={() => onDelete(employee)}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            );
          })}
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
