import { Readable } from "node:stream";
import { Calendar } from "./types.js";

function foldLine(line: string): string {
  // RFC 5545: lines longer than 75 octets should be folded with CRLF + space.
  const maxLen = 75;
  if (line.length <= maxLen) return line;

  const parts: string[] = [line.substring(0, maxLen)];
  let offset = maxLen;
  while (offset < line.length) {
    parts.push(" " + line.substring(offset, offset + maxLen - 1));
    offset += maxLen - 1;
  }
  return parts.join("\r\n");
}

export function writeCalendar(calendar: Calendar): Readable {
  const lines: string[] = [];

  lines.push("BEGIN:VCALENDAR");
  for (const [key, value] of calendar.properties) {
    lines.push(foldLine(`${key}:${value}`));
  }

  for (const event of calendar.events) {
    lines.push("BEGIN:VEVENT");
    for (const [key, value] of event.properties) {
      lines.push(foldLine(`${key}:${value}`));
    }
    lines.push("END:VEVENT");
  }

  lines.push("END:VCALENDAR");
  lines.push(""); // trailing newline

  return Readable.from(lines.join("\r\n"));
}
