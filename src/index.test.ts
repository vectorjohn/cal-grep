import { describe, it, expect } from "vitest";
import { createReadStream } from "node:fs";
import { resolve } from "node:path";
import { text } from "node:stream/consumers";
import { main } from "./index.js";

describe("main", () => {
  it("should read a calendar stream and return it as a readable", async () => {
    const fixturePath = resolve(__dirname, "test_data", "shift-calendar.ics");
    const stream = createReadStream(fixturePath, { encoding: "utf-8" });

    const output = await main(stream);
    const content = await text(output);

    expect(content.length).toBeGreaterThan(0);
    expect(content).toContain("BEGIN:VCALENDAR");
  });
});
