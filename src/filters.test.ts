import { describe, it, expect } from "vitest";
import { createReadStream } from "node:fs";
import { resolve } from "node:path";
import { withKeyword } from "./filters.js";
import { parseCalendar } from "./ical-reader.js";
import { VEvent, VEventField } from "./types.js";

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
