import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm, useWatch } from "react-hook-form";
import type { Control } from "react-hook-form";
import { ErrorState } from "../../../components/common/AsyncState";
import type { Country, Employee } from "../types/employee.types";
import {
  employeeSchema,
  LOCATION_MAX_LENGTH,
  type EmployeeFormValues,
} from "../schemas/employeeSchema";

interface EmployeeTextFieldProps {
  control: Control<EmployeeFormValues>;
  name: keyof EmployeeFormValues;
  label: string;
  type?: string;
}

function EmployeeTextField({
  control,
  name,
  label,
  type = "text",
}: EmployeeTextFieldProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          type={type}
          label={label}
          fullWidth
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
          inputProps={
            name === "mobile"
              ? { inputMode: "numeric", maxLength: 10 }
              : name === "state" || name === "district"
                ? { inputMode: "text", maxLength: LOCATION_MAX_LENGTH }
                : undefined
          }
        />
      )}
    />
  );
}

interface CountrySelectFieldProps {
  control: Control<EmployeeFormValues>;
  options: string[];
}

function CountrySelectField({ control, options }: CountrySelectFieldProps) {
  return (
    <Controller
      name="country"
      control={control}
      render={({ field, fieldState }) => (
        <FormControl fullWidth error={!!fieldState.error}>
          <InputLabel>Country</InputLabel>
          <Select {...field} label="Country">
            <MenuItem value="">
              <em>Select country</em>
            </MenuItem>
            {options.map((option) => (
              <MenuItem value={option} key={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>{fieldState.error?.message}</FormHelperText>
        </FormControl>
      )}
    />
  );
}

interface Props {
  employee?: Employee | null;
  countries: Country[];
  isSaving: boolean;
  error?: string;
  countriesLoading?: boolean;
  countriesError?: boolean;
  onRetryCountries?: () => void;
  onSubmit: (values: EmployeeFormValues) => void;
  onCancel: () => void;
}

export function EmployeeForm({
  employee,
  countries,
  isSaving,
  error,
  countriesLoading = false,
  countriesError = false,
  onRetryCountries,
  onSubmit,
  onCancel,
}: Props) {
  const { control, handleSubmit } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    mode: "onChange",
    defaultValues: {
      name: employee?.name ?? "",
      email: employee?.email ?? "",
      mobile: employee?.mobile ?? "",
      country: employee?.country ?? "",
      state: employee?.state ?? "",
      district: employee?.district ?? "",
    },
  });
  const [name, email] = useWatch({
    control,
    name: ["name", "email"],
  });
  const isNameAndEmailValid =
    employeeSchema.shape.name.safeParse(name).success &&
    employeeSchema.shape.email.safeParse(email).success;
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <DialogTitle sx={{ pb: 1 }}>
        <Stack gap={0.5}>
          <Typography variant="overline" color="primary.main">
            Employee directory
          </Typography>
          <Typography variant="h6" component="h2">
            {employee ? "Edit Employee" : "Add Employee"}
          </Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack gap={2} sx={{ pt: 1 }}>
          <Stack direction={{ xs: "column", sm: "row" }} gap={2}>
            <EmployeeTextField control={control} name="name" label="Name" />
            <EmployeeTextField
              control={control}
              name="email"
              label="Email"
              type="email"
            />
          </Stack>
          <Stack direction={{ xs: "column", sm: "row" }} gap={2}>
            <EmployeeTextField control={control} name="mobile" label="Mobile" />
            <CountrySelectField
              control={control}
              options={countries.map((item) => item.country)}
            />
          </Stack>
          <Stack direction={{ xs: "column", sm: "row" }} gap={2}>
            <EmployeeTextField control={control} name="state" label="State" />
            <EmployeeTextField
              control={control}
              name="district"
              label="District"
            />
          </Stack>
          {countriesLoading && (
            <Alert severity="info">Loading countries...</Alert>
          )}
          {countriesError && (
            <ErrorState
              message="Unable to load countries."
              onRetry={onRetryCountries}
            />
          )}
          {error && (
            <Alert
              severity="error"
              action={
                <Button color="inherit" type="submit" disabled={isSaving}>
                  Try again
                </Button>
              }
            >
              {error}
            </Alert>
          )}
        </Stack>
      </DialogContent>
      <DialogActions
        sx={{
          px: 3,
          pb: 2,
          flexDirection: { xs: "column-reverse", sm: "row" },
          "& > :not(style)": { width: { xs: "100%", sm: "auto" } },
        }}
      >
        <Button onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={isSaving || !isNameAndEmailValid}
        >
          {isSaving ? "Saving..." : employee ? "Save Changes" : "Add Employee"}
        </Button>
      </DialogActions>
    </form>
  );
}
