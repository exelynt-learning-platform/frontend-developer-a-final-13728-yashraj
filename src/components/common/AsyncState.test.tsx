import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ErrorState } from "./AsyncState";

describe("ErrorState", () => {
  it("runs the try-again callback when selected", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    render(
      <ErrorState message="Unable to load employees." onRetry={onRetry} />,
    );

    await user.click(screen.getByRole("button", { name: "Try again" }));

    expect(onRetry).toHaveBeenCalledOnce();
  });
});
