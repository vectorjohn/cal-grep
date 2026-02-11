import { describe, it, expect } from "vitest";
import { createReadStream } from "node:fs";
import { resolve } from "node:path";
import { text } from "node:stream/consumers";
import { parseCalendar } from "./ical-reader.js";
import { writeCalendar } from "./ical-writer.js";

function fixtureStream() {
  return createReadStream(
    resolve(__dirname, "test_data", "shift-calendar.ics"),
    { encoding: "utf-8" },
  );
}

describe("writeCalendar", () => {
  it("should produce valid ical structure", async () => {
    const calendar = await parseCalendar(fixtureStream());
    const output = await text(writeCalendar(calendar));

    expect(output).toMatch(/^BEGIN:VCALENDAR/);
    expect(output).toMatch(/END:VCALENDAR\r?\n?$/);
  });

  it("should include all events", async () => {
    const calendar = await parseCalendar(fixtureStream());
    const output = await text(writeCalendar(calendar));

    const eventCount = (output.match(/BEGIN:VEVENT/g) || []).length;
    expect(eventCount).toBe(279);
  });

  it("should preserve calendar properties", async () => {
    const calendar = await parseCalendar(fixtureStream());
    const output = await text(writeCalendar(calendar));

    expect(output).toContain("VERSION:2.0");
    expect(output).toContain("METHOD:PUBLISH");
  });

  it("should fold long lines", async () => {
    const calendar = await parseCalendar(fixtureStream());
    const output = await text(writeCalendar(calendar));
    const lines = output.split("\r\n");

    // Unfolded lines (not continuation lines) should be <= 75 chars
    for (const line of lines) {
      if (!line.startsWith(" ")) {
        expect(line.length).toBeLessThanOrEqual(75);
      }
    }
  });
});
