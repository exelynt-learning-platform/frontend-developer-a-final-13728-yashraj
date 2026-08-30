export const EMPLOYEES_PER_PAGE = 5;

export const PAGE_SIZE_OPTIONS = [5, 10, 20] as const;

export const EMPLOYEE_TABLE_COLUMNS = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "mobile", label: "Mobile" },
  { key: "country", label: "Country" },
] as const;
