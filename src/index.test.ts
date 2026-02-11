import { describe, it, expect, vi } from "vitest";
import { createReadStream } from "node:fs";
import { resolve } from "node:path";
import { main } from "./index.js";

describe("main", () => {
  it("should read a calendar stream and output its content", async () => {
    const fixturePath = resolve(__dirname, "test_data", "shift-calendar.ics");
    const stream = createReadStream(fixturePath, { encoding: "utf-8" });

    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    await main(stream);

    expect(logSpy).toHaveBeenCalledOnce();
    const output = logSpy.mock.calls[0][0] as string;
    expect(output.length).toBeGreaterThan(0);
    expect(output).toContain("BEGIN:VCALENDAR");

    logSpy.mockRestore();
  });
});
