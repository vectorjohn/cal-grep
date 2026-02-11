import { describe, it, expect } from "vitest";
import { createReadStream } from "node:fs";
import { resolve } from "node:path";
import { parseCalendar } from "./ical-reader.js";

function fixtureStream() {
  return createReadStream(
    resolve(__dirname, "test_data", "shift-calendar.ics"),
    { encoding: "utf-8" },
  );
}

describe("parseCalendar", () => {
  it("should parse calendar-level properties", async () => {
    const calendar = await parseCalendar(fixtureStream());

    expect(calendar.properties.get("VERSION")).toBe("2.0");
    expect(calendar.properties.get("METHOD")).toBe("PUBLISH");
    expect(calendar.properties.get("X-WR-CALNAME")).toBe(
      "Shift Community Calendar",
    );
  });

  it("should parse all 279 events", async () => {
    const calendar = await parseCalendar(fixtureStream());

    expect(calendar.events.length).toBe(279);
  });

  it("should parse event properties correctly", async () => {
    const calendar = await parseCalendar(fixtureStream());
    const first = calendar.events[0];

    expect(first.properties.get("UID")).toBe("event-22726@shift2bikes.org");
    expect(first.properties.get("STATUS")).toBe("CANCELLED");
    expect(first.properties.get("DTSTART")).toBe("20260113T030000Z");
  });

  it("should unfold continuation lines", async () => {
    const calendar = await parseCalendar(fixtureStream());
    const first = calendar.events[0];
    const summary = first.properties.get("SUMMARY")!;

    // The summary spans multiple lines in the file but should be joined
    expect(summary).toContain("Mellow Mondays");
    expect(summary).not.toContain("\n");
  });
});
