import { getApiErrorMessage, getApiErrorStatus } from "./apiError";

describe("apiError", () => {
  it("reads status and a structured API message", () => {
    const error = { status: 404, data: { message: "Employee not found." } };

    expect(getApiErrorStatus(error)).toBe(404);
    expect(getApiErrorMessage(error, "Fallback")).toBe("Employee not found.");
  });

  it("uses an RTK serialized message when available", () => {
    expect(
      getApiErrorMessage({ message: "Request failed." }, "Fallback"),
    ).toBe("Request failed.");
  });

  it("returns the safe fallback for unknown errors", () => {
    expect(getApiErrorMessage({ status: "FETCH_ERROR" }, "Fallback")).toBe(
      "Fallback",
    );
    expect(getApiErrorStatus(new Error("Failure"))).toBeUndefined();
  });
});
