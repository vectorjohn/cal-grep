import { describe, it, expect } from "vitest";
import { createReadStream } from "node:fs";
import { resolve } from "node:path";
import { text } from "node:stream/consumers";
import { main } from "./index.js";
import { parseCalendar } from "./ical-reader.js";

function fixtureStream() {
  return createReadStream(
    resolve(__dirname, "test_data", "shift-calendar.ics"),
    { encoding: "utf-8" },
  );
}

describe("main", () => {
  it("should round-trip a calendar preserving all events", async () => {
    const output = await main(fixtureStream());
    const roundTripped = await parseCalendar(output);

    expect(roundTripped.events.length).toBe(279);
    expect(roundTripped.properties.get("VERSION")).toBe("2.0");
  });

  it("should produce valid ical output", async () => {
    const output = await main(fixtureStream());
    const content = await text(output);

    expect(content).toContain("BEGIN:VCALENDAR");
    expect(content).toContain("END:VCALENDAR");
  });
});
