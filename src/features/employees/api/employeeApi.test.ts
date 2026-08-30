// @vitest-environment node
import { store } from "../../../app/store";
import { API_BASE_URL, employeeApi } from "./employeeApi";
import { http, HttpResponse } from "msw";
import { server } from "../../../tests/setup";

describe("employeeApi", () => {
  beforeEach(() => {
    store.dispatch(employeeApi.util.resetApiState());
  });
  it("loads employees through the RTK Query endpoint", async () => {
    const result = await store.dispatch(
      employeeApi.endpoints.getEmployees.initiate(),
    );
    expect(result.data?.[0]).toMatchObject({
      name: "Ada Lovelace",
      country: "India",
    });
  });

  it("loads countries through the RTK Query endpoint", async () => {
    server.use(
      http.get(`${API_BASE_URL}/country`, () =>
        HttpResponse.json([{ id: "1", country: "India" }]),
      ),
    );
    const result = await store.dispatch(
      employeeApi.endpoints.getCountries.initiate(),
    );

    expect(result.data).toEqual([{ id: "1", country: "India" }]);
  });

  it("supports create, update, and delete mutations", async () => {
    server.use(
      http.post(`${API_BASE_URL}/employee`, async () =>
        HttpResponse.json({ id: "2", name: "Grace Hopper" }, { status: 201 }),
      ),
      http.put(`${API_BASE_URL}/employee/2`, async () =>
        HttpResponse.json({
          id: "2",
          name: "Grace Hopper",
          email: "grace@example.com",
        }),
      ),
      http.delete(
        `${API_BASE_URL}/employee/2`,
        () => new HttpResponse(null, { status: 204 }),
      ),
    );
    const input = {
      name: "Grace Hopper",
      email: "grace@example.com",
      mobile: "1234567890",
      country: "India",
      state: "Delhi",
      district: "New Delhi",
    };
    expect(
      (
        await store.dispatch(
          employeeApi.endpoints.createEmployee.initiate(input),
        )
      ).data,
    ).toMatchObject({ name: "Grace Hopper" });
    expect(
      (
        await store.dispatch(
          employeeApi.endpoints.updateEmployee.initiate({
            id: "2",
            body: input,
          }),
        )
      ).data,
    ).toMatchObject({ email: "grace@example.com" });
    expect(
      "error" in
        (await store.dispatch(
          employeeApi.endpoints.deleteEmployee.initiate("2"),
        )),
    ).toBe(false);
  });

  it("exposes API failures instead of treating them as empty data", async () => {
    server.use(
      http.get(`${API_BASE_URL}/employee`, () =>
        HttpResponse.json({ message: "failure" }, { status: 500 }),
      ),
    );
    const result = await store.dispatch(
      employeeApi.endpoints.getEmployees.initiate(),
    );
    expect("error" in result).toBe(true);
  });

  it("exposes country API failures", async () => {
    server.use(
      http.get(`${API_BASE_URL}/country`, () =>
        HttpResponse.json({ message: "failure" }, { status: 500 }),
      ),
    );
    const result = await store.dispatch(
      employeeApi.endpoints.getCountries.initiate(),
    );

    expect("error" in result).toBe(true);
  });
});
