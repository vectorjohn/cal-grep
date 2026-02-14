import { Readable } from "node:stream";
import { parseCalendar } from "./ical-reader.js";
import { writeCalendar } from "./ical-writer.js";
import { withKeyword } from "./filters.js";

export async function main(
  input: Readable,
  keywords: string[] = [],
): Promise<Readable> {
  const calendar = await parseCalendar(input);

  if (keywords.length > 0) {
    for (const keyword of keywords) {
      calendar.events = calendar.events.filter(withKeyword(keyword));
    }
  }

  return writeCalendar(calendar);
}
