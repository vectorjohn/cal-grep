import { Readable } from "node:stream";
import { parseCalendar } from "./ical-reader.js";
import { writeCalendar } from "./ical-writer.js";

export async function main(input: Readable): Promise<Readable> {
  const calendar = await parseCalendar(input);
  return writeCalendar(calendar);
}
