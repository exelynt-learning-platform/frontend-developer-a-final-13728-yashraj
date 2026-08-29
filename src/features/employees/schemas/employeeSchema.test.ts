import { employeeSchema } from "./employeeSchema";

describe("employeeSchema", () => {
  it("rejects required-field and email violations", () => {
    const result = employeeSchema.safeParse({
      name: "",
      email: "bad",
      mobile: "12",
      country: "",
      state: "",
      district: "",
    });
    expect(result.success).toBe(false);
  });

  it("accepts a valid employee form", () => {
    expect(
      employeeSchema.safeParse({
        name: "Ada Lovelace",
        email: "ada@example.com",
        mobile: "1234567890",
        country: "India",
        state: "Delhi",
        district: "New Delhi",
      }).success,
    ).toBe(true);
  });

  it("rejects names containing digits or unsupported symbols", () => {
    const validValues = {
      name: "Ada Lovelace",
      email: "ada@example.com",
      mobile: "1234567890",
      country: "India",
      state: "Delhi",
      district: "New Delhi",
    };

    expect(
      employeeSchema.safeParse({ ...validValues, name: "Ada123" }).success,
    ).toBe(false);
    expect(
      employeeSchema.safeParse({ ...validValues, name: "Ada@Lovelace" })
        .success,
    ).toBe(false);
  });

  it("rejects non-text and overlong state or district values", () => {
    const baseValues = {
      name: "Ada Lovelace",
      email: "ada@example.com",
      mobile: "1234567890",
      country: "India",
      state: "Delhi",
      district: "New Delhi",
    };

    expect(
      employeeSchema.safeParse({ ...baseValues, state: "Delhi 2" }).success,
    ).toBe(false);
    expect(
      employeeSchema.safeParse({
        ...baseValues,
        district: "D".repeat(81),
      }).success,
    ).toBe(false);
  });

  it("accepts common geographic punctuation in state and district", () => {
    expect(
      employeeSchema.safeParse({
        name: "Ada Lovelace",
        email: "ada@example.com",
        mobile: "1234567890",
        country: "India",
        state: "St. John's-West",
        district: "New Delhi",
      }).success,
    ).toBe(true);
  });
});
