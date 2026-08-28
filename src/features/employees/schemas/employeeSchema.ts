import { z } from "zod";

export const employeeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(80, "Name cannot exceed 80 characters."),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address.")
    .max(120, "Email cannot exceed 120 characters."),
  mobile: z
    .string()
    .trim()
    .regex(/^\d{10}$/, "Mobile must contain exactly 10 digits."),
  country: z.string().min(1, "Country is required."),
  state: z.string().min(1, "State is required."),
  district: z.string().min(1, "District is required."),
});

export type EmployeeFormValues = z.infer<typeof employeeSchema>;
