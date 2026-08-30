import { z } from "zod";

export const LOCATION_MAX_LENGTH = 80;
const locationSchema = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required.`)
    .min(2, `${label} must be at least 2 characters.`)
    .max(
      LOCATION_MAX_LENGTH,
      `${label} cannot exceed ${LOCATION_MAX_LENGTH} characters.`,
    )
    .regex(
      /^\p{L}[\p{L}\s.'-]*$/u,
      `${label} can contain letters, spaces, apostrophes, hyphens, or periods only.`,
    );

export const employeeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(80, "Name cannot exceed 80 characters.")
    .regex(
      /^\p{L}[\p{L}\s.'-]*$/u,
      "Name can contain letters, spaces, apostrophes, hyphens, or periods only.",
    )
    .regex(
      /^\p{Lu}\p{Ll}*(?:[\s.'-]+\p{Lu}\p{Ll}*)*$/u,
      "Each name word must start with a capital letter and continue in lowercase.",
    ),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address.")
    .max(120, "Email cannot exceed 120 characters.")
    .regex(/^\P{Lu}*$/u, "Each word in the email address must be lowercase."),
  mobile: z
    .string()
    .trim()
    .regex(/^\d{10}$/, "Mobile must contain exactly 10 digits."),
  country: z.string().min(1, "Country is required."),
  state: locationSchema("State"),
  district: locationSchema("District"),
});

export type EmployeeFormValues = z.infer<typeof employeeSchema>;
