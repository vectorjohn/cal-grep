import { describe, it, expect } from "vitest";
import { parseArgs } from "./args.js";
import { WeekDay } from "./types.js";

describe("parseArgs", () => {
  it("should parse positional keywords", () => {
    const args = parseArgs(["hello", "world"]);

    expect(args.keywords).toEqual(["hello", "world"]);
    expect(args.invert).toBe(false);
    expect(args.days).toEqual([]);
    expect(args.help).toBe(false);
  });

  it("should parse -v flag", () => {
    const args = parseArgs(["-v", "CANCELLED"]);

    expect(args.invert).toBe(true);
    expect(args.keywords).toEqual(["CANCELLED"]);
  });

  it("should parse -h flag", () => {
    const args = parseArgs(["-h"]);

    expect(args.help).toBe(true);
  });

  it("should parse -d with abbreviated day names", () => {
    const args = parseArgs(["-d", "mon,wed,fri"]);

    expect(args.days).toEqual([
      WeekDay.MONDAY,
      WeekDay.WEDNESDAY,
      WeekDay.FRIDAY,
    ]);
  });

  it("should parse -d with full day names", () => {
    const args = parseArgs(["-d", "monday,friday"]);

    expect(args.days).toEqual([WeekDay.MONDAY, WeekDay.FRIDAY]);
  });

  it("should parse -d case insensitively", () => {
    const args = parseArgs(["-d", "MON,Wednesday,FRI"]);

    expect(args.days).toEqual([
      WeekDay.MONDAY,
      WeekDay.WEDNESDAY,
      WeekDay.FRIDAY,
    ]);
  });

  it("should throw on invalid day name", () => {
    expect(() => parseArgs(["-d", "mon,notaday"])).toThrow(
      'Invalid day: "notaday"',
    );
  });

  it("should throw when -d has no value", () => {
    expect(() => parseArgs(["-d"])).toThrow("-d requires");
  });

  it("should throw on unknown flag", () => {
    expect(() => parseArgs(["-z"])).toThrow("Unknown flag: -z");
  });

  it("should combine multiple flags and keywords", () => {
    const args = parseArgs(["-v", "-d", "tue,thu", "Bike Ride"]);

    expect(args.invert).toBe(true);
    expect(args.days).toEqual([WeekDay.TUESDAY, WeekDay.THURSDAY]);
    expect(args.keywords).toEqual(["Bike Ride"]);
  });
});
