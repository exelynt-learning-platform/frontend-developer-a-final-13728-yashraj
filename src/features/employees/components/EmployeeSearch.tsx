import {
  InputAdornment,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

interface EmployeeSearchProps {
  isLoading: boolean;
  onSearch: (id: string) => void;
  onClear: () => void;
}

export function EmployeeSearch({
  isLoading,
  onSearch,
  onClear,
}: EmployeeSearchProps) {
  const [id, setId] = useState("");
  const [validationError, setValidationError] = useState("");
  const isNumericId = /^\d+$/.test(id.trim());

  return (
    <Stack
      component="form"
      direction={{ xs: "column", sm: "row" }}
      gap={1.5}
      onSubmit={(event) => {
        event.preventDefault();
        const trimmedId = id.trim();
        if (!trimmedId) return;
        if (!isNumericId) {
          setValidationError(
            "Enter a numeric employee ID, not a name or text.",
          );
          return;
        }
        setValidationError("");
        onSearch(trimmedId);
      }}
    >
      <TextField
        value={id}
        onChange={(event) => {
          setId(event.target.value);
          setValidationError("");
        }}
        label="Employee ID"
        placeholder="Enter an employee ID"
        fullWidth
        error={!!validationError}
        helperText={validationError}
        inputProps={{ inputMode: "numeric" }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Typography
                aria-hidden
                color="primary"
                sx={{ fontSize: 22, lineHeight: 1 }}
              >
                ⌕
              </Typography>
            </InputAdornment>
          ),
        }}
      />
      <Button
        type="submit"
        variant="contained"
        disabled={isLoading || !id.trim()}
        sx={{ minWidth: 86 }}
      >
        {isLoading ? "Searching..." : "Search"}
      </Button>
      <Button
        type="button"
        variant="outlined"
        onClick={() => {
          setId("");
          setValidationError("");
          onClear();
        }}
        disabled={!id}
        sx={{ minWidth: 76 }}
      >
        Clear
      </Button>
    </Stack>
  );
}
