import { http, HttpResponse } from "msw";
import { API_BASE_URL } from "../features/employees/api/employeeApi";

export const handlers = [
  http.get(`${API_BASE_URL}/employee`, () =>
    HttpResponse.json([
      {
        id: "1",
        name: "Ada Lovelace",
        email: "ada@example.com",
        mobile: "1234567890",
        country: "India",
        state: "Delhi",
        district: "New Delhi",
      },
    ]),
  ),
];
