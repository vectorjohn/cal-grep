import { Readable } from "node:stream";
import { text } from "node:stream/consumers";
import { Calendar, VEvent } from "./types.js";

function unfoldLines(raw: string): string[] {
  // RFC 5545: continuation lines start with a space or tab.
  // Join them to the previous line, then split on CRLF or LF.
  const unfolded = raw.replace(/\r?\n[ \t]/g, "");
  return unfolded.split(/\r?\n/).filter((line) => line.length > 0);
}

export async function parseCalendar(input: Readable): Promise<Calendar> {
  const raw = await text(input);
  const lines = unfoldLines(raw);

  const calendar: Calendar = {
    properties: new Map(),
    events: [],
  };

  let currentEvent: VEvent | null = null;

  for (const line of lines) {
    if (line === "BEGIN:VCALENDAR") {
      continue;
    } else if (line === "END:VCALENDAR") {
      break;
    } else if (line === "BEGIN:VEVENT") {
      currentEvent = { properties: new Map() };
    } else if (line === "END:VEVENT") {
      if (currentEvent) {
        calendar.events.push(currentEvent);
        currentEvent = null;
      }
    } else {
      const colonIndex = line.indexOf(":");
      if (colonIndex === -1) continue;
      const key = line.substring(0, colonIndex);
      const value = line.substring(colonIndex + 1);

      if (currentEvent) {
        currentEvent.properties.set(key, value);
      } else {
        calendar.properties.set(key, value);
      }
    }
  }

  return calendar;
}
