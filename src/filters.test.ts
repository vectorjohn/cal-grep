import { describe, it, expect } from "vitest";
import { createReadStream } from "node:fs";
import { resolve } from "node:path";
import { withKeyword, onDays } from "./filters.js";
import { parseCalendar } from "./ical-reader.js";
import { VEvent, VEventField, WeekDay } from "./types.js";

function makeEvent(fields: Partial<Record<VEventField, string>>): VEvent {
  const properties = new Map<string, string>();
  for (const [key, value] of Object.entries(fields)) {
    properties.set(key, value);
  }
  return { properties };
}

function fixtureStream() {
  return createReadStream(
    resolve(__dirname, "test_data", "shift-calendar.ics"),
    { encoding: "utf-8" },
  );
}

describe("withKeyword", () => {
  it("should match on SUMMARY (case insensitive)", () => {
    const event = makeEvent({ [VEventField.SUMMARY]: "Thursday Bike Ride" });

    expect(withKeyword("thursday")(event)).toBe(true);
    expect(withKeyword("THURSDAY")(event)).toBe(true);
    expect(withKeyword("bike")(event)).toBe(true);
  });

  it("should match on DESCRIPTION", () => {
    const event = makeEvent({
      [VEventField.SUMMARY]: "Morning Ride",
      [VEventField.DESCRIPTION]: "Meet at the park for a fun group ride",
    });

    expect(withKeyword("park")(event)).toBe(true);
  });

  it("should return false when keyword is not found", () => {
    const event = makeEvent({
      [VEventField.SUMMARY]: "Thursday Bike Ride",
      [VEventField.DESCRIPTION]: "A fun ride",
    });

    expect(withKeyword("friday")(event)).toBe(false);
  });

  it("should return false for events with no text fields", () => {
    const event = makeEvent({ [VEventField.UID]: "123" });

    expect(withKeyword("123")(event)).toBe(false);
  });

  it("should work with Array.filter on real data", async () => {
    const calendar = await parseCalendar(fixtureStream());
    const beavertonEvents = calendar.events.filter(withKeyword("Beaverton"));

    expect(beavertonEvents.length).toBeGreaterThan(0);
    for (const event of beavertonEvents) {
      const summary = event.properties.get(VEventField.SUMMARY) ?? "";
      const description = event.properties.get(VEventField.DESCRIPTION) ?? "";
      const combined = (summary + " " + description).toLowerCase();
      expect(combined).toContain("beaverton");
    }
  });
});

describe("onDays", () => {
  it("should match events on the specified day", () => {
    // 2026-01-13 is a Tuesday (local time, no Z suffix)
    const event = makeEvent({ [VEventField.DTSTART]: "20260113T120000" });

    expect(onDays([WeekDay.TUESDAY])(event)).toBe(true);
  });

  it("should not match events on other days", () => {
    // 2026-01-13 is a Tuesday (local time)
    const event = makeEvent({ [VEventField.DTSTART]: "20260113T120000" });

    expect(onDays([WeekDay.MONDAY])(event)).toBe(false);
    expect(onDays([WeekDay.WEDNESDAY])(event)).toBe(false);
  });

  it("should match when event falls on any of the specified days", () => {
    // 2026-01-13 is a Tuesday (local time)
    const event = makeEvent({ [VEventField.DTSTART]: "20260113T120000" });

    expect(onDays([WeekDay.MONDAY, WeekDay.TUESDAY, WeekDay.WEDNESDAY])(event)).toBe(true);
  });

  it("should return false for events without DTSTART", () => {
    const event = makeEvent({ [VEventField.SUMMARY]: "No date" });

    expect(onDays([WeekDay.MONDAY])(event)).toBe(false);
  });

  it("should work with Array.filter on real data", async () => {
    const calendar = await parseCalendar(fixtureStream());
    const mondayEvents = calendar.events.filter(onDays([WeekDay.MONDAY]));

    expect(mondayEvents.length).toBeGreaterThan(0);
    expect(mondayEvents.length).toBeLessThan(calendar.events.length);
  });
});
