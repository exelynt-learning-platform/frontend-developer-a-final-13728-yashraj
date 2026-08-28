import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Country, Employee, EmployeeInput } from "../types/employee.types";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  "https://669b3f09276e45187d34eb4e.mockapi.io/api/v1";

export const employeeApi = createApi({
  reducerPath: "employeeApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ["Employee", "Country"],
  endpoints: (builder) => ({
    getEmployees: builder.query<Employee[], void>({
      query: () => "/employee",
      providesTags: ["Employee"],
    }),
    getEmployeeById: builder.query<Employee, string>({
      query: (id) => `/employee/${id}`,
    }),
    createEmployee: builder.mutation<Employee, EmployeeInput>({
      query: (body) => ({ url: "/employee", method: "POST", body }),
      invalidatesTags: ["Employee"],
    }),
    updateEmployee: builder.mutation<
      Employee,
      { id: string; body: EmployeeInput }
    >({
      query: ({ id, body }) => ({
        url: `/employee/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Employee"],
    }),
    deleteEmployee: builder.mutation<void, string>({
      query: (id) => ({ url: `/employee/${id}`, method: "DELETE" }),
      invalidatesTags: ["Employee"],
    }),
    getCountries: builder.query<Country[], void>({
      query: () => "/country",
      providesTags: ["Country"],
    }),
  }),
});

export const {
  useGetEmployeesQuery,
  useLazyGetEmployeeByIdQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
  useGetCountriesQuery,
} = employeeApi;
