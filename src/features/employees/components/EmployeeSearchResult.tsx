import { Box, Chip, Divider, Paper, Stack, Typography } from "@mui/material";
import type { Employee } from "../types/employee.types";

interface EmployeeSearchResultProps {
  employee: Employee;
}

const formatWords = (value: string) =>
  value
    .trim()
    .toLocaleLowerCase()
    .replace(/(^|[\s'-])\p{L}/gu, (character) => character.toLocaleUpperCase())
    .replace(/\s+/g, " ");

const detailFields: Array<{
  key: keyof Employee;
  label: string;
  format?: (value: string) => string;
}> = [
  {
    key: "email",
    label: "Email",
    format: (value) => value.trim().toLocaleLowerCase(),
  },
  { key: "mobile", label: "Mobile" },
  { key: "country", label: "Country", format: formatWords },
  { key: "state", label: "State", format: formatWords },
  { key: "district", label: "District", format: formatWords },
];

export function EmployeeSearchResult({ employee }: EmployeeSearchResultProps) {
  return (
    <Paper
      variant="outlined"
      aria-label={`Search result for employee ${employee.id}`}
      sx={{ p: { xs: 2, sm: 2.5 }, bgcolor: "background.default" }}
    >
      <Stack gap={2}>
        <Stack
          alignItems={{ xs: "flex-start", sm: "center" }}
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          gap={1}
        >
          <Box>
            <Typography variant="overline" color="text.secondary">
              Employee details
            </Typography>
            <Typography variant="h6" component="h3">
              {formatWords(employee.name)}
            </Typography>
          </Box>
          <Chip
            label={`ID: ${employee.id}`}
            color="primary"
            variant="outlined"
          />
        </Stack>
        <Divider />
        <Box
          component="dl"
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
            gap: 2,
            m: 0,
          }}
        >
          {detailFields.map(({ key, label, format }) => (
            <Box key={key}>
              <Typography
                component="dt"
                variant="caption"
                color="text.secondary"
              >
                {label}
              </Typography>
              <Typography
                component="dd"
                variant="body1"
                sx={{ m: 0, mt: 0.25, fontWeight: 500 }}
              >
                {employee[key]
                  ? (format?.(employee[key]) ?? employee[key])
                  : "Not available"}
              </Typography>
            </Box>
          ))}
        </Box>
      </Stack>
    </Paper>
  );
}
