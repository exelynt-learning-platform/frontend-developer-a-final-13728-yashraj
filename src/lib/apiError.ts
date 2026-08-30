import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";

export type ApiError = FetchBaseQueryError | SerializedError;

export function getApiErrorStatus(error: unknown): number | undefined {
  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof error.status === "number"
  ) {
    return error.status;
  }

  return undefined;
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (typeof error !== "object" || error === null) return fallback;

  if (
    "data" in error &&
    typeof error.data === "object" &&
    error.data !== null
  ) {
    if ("message" in error.data && typeof error.data.message === "string") {
      return error.data.message;
    }
  }

  if ("message" in error && typeof error.message === "string") {
    return error.message;
  }

  return fallback;
}
