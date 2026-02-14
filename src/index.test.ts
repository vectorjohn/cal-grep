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

  it("should filter events by keyword", async () => {
    const output = await main(fixtureStream(), ["Beaverton"]);
    const filtered = await parseCalendar(output);

    expect(filtered.events.length).toBeGreaterThan(0);
    expect(filtered.events.length).toBeLessThan(279);

    for (const event of filtered.events) {
      const summary = event.properties.get("SUMMARY") ?? "";
      const description = event.properties.get("DESCRIPTION") ?? "";
      const combined = (summary + " " + description).toLowerCase();
      expect(combined).toContain("beaverton");
    }
  });

  it("should apply multiple keywords as AND filters", async () => {
    const output = await main(fixtureStream(), ["Beaverton", "Happy Hour"]);
    const filtered = await parseCalendar(output);

    expect(filtered.events.length).toBeGreaterThan(0);
    for (const event of filtered.events) {
      const summary = event.properties.get("SUMMARY") ?? "";
      const description = event.properties.get("DESCRIPTION") ?? "";
      const combined = (summary + " " + description).toLowerCase();
      expect(combined).toContain("beaverton");
      expect(combined).toContain("happy hour");
    }
  });
});
