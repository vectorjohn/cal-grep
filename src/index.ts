import { Readable } from "node:stream";
import { parseCalendar } from "./ical-reader.js";
import { writeCalendar } from "./ical-writer.js";
import { withKeyword, onDays } from "./filters.js";
import { ParsedArgs } from "./args.js";
import { VEvent } from "./types.js";

export { parseCalendar } from "./ical-reader.js";
export { writeCalendar } from "./ical-writer.js";
export { withKeyword, onDays } from "./filters.js";
export { parseArgs } from "./args.js";
export type { ParsedArgs } from "./args.js";
export { VEventField, WeekDay } from "./types.js";
export type { VEvent, Calendar } from "./types.js";

export async function main(
  input: Readable,
  args?: ParsedArgs,
): Promise<Readable> {
  const calendar = await parseCalendar(input);

  if (args) {
    let predicate = (event: VEvent) => {
      for (const keyword of args.keywords) {
        if (!withKeyword(keyword)(event)) return false;
      }
      if (args.days.length > 0) {
        if (!onDays(args.days)(event)) return false;
      }
      return true;
    };

    if (args.invert) {
      const original = predicate;
      predicate = (event) => !original(event);
    }

    calendar.events = calendar.events.filter(predicate);
  }

  return writeCalendar(calendar);
}
