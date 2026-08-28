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

  return (
    <Stack
      component="form"
      direction={{ xs: "column", sm: "row" }}
      gap={1.5}
      onSubmit={(event) => {
        event.preventDefault();
        if (id.trim()) onSearch(id.trim());
      }}
    >
      <TextField
        value={id}
        onChange={(event) => setId(event.target.value)}
        label="Employee ID"
        placeholder="Enter an employee ID"
        fullWidth
        inputProps={{ inputMode: "text" }}
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
