Calendar Pipe
=============

Takes an iCal file and lets you filter and modify it like grep or sed do.

Sometimes a big shared group event calendar might be full of stuff you may or may not be interested in. You may like to add it to your personal calendar, but it would obscure all your existing events with stuff that doesn't interest you.

## CLI Usage

```
cat calendar.ical | calpipe "Thursday" > filtered.ical
cat calendar.ical | calpipe -d monday,wednesday "standup" > filtered.ical
cat calendar.ical | calpipe -v "boring" > filtered.ical
```

- `-d <days>` — filter events by day of week (comma-separated)
- `-v` — invert the match
- `-h` — show help

## Library API

### Reader

`parseCalendar(input: Readable): Promise<Calendar>` — parses an iCal stream into a `Calendar` object.

### Writer

`writeCalendar(calendar: Calendar): Readable` — serializes a `Calendar` object back to iCal format.

### Filters

`withKeyword(keyword: string): (event: VEvent) => boolean` — returns a predicate that matches events whose SUMMARY or DESCRIPTION contains the keyword (case-insensitive).

`onDays(days: WeekDay[]): (event: VEvent) => boolean` — returns a predicate that matches events whose DTSTART falls on any of the given days.

### Types

```ts
interface Calendar {
  properties: Map<string, string>;
  events: VEvent[];
}

interface VEvent {
  properties: Map<string, string>;
}

enum VEventField {
  SUMMARY, DESCRIPTION, LOCATION, STATUS, UID,
  DTSTART, DTEND, CREATED, DTSTAMP, SEQUENCE, URL, CONTACT,
}

enum WeekDay {
  SUNDAY, MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY,
}
```

### Example

```ts
import { createReadStream } from "node:fs";
import { parseCalendar } from "calendar-pipe/ical-reader";
import { writeCalendar } from "calendar-pipe/ical-writer";
import { withKeyword, onDays } from "calendar-pipe/filters";
import { WeekDay } from "calendar-pipe/types";

const input = createReadStream("calendar.ical");
const calendar = await parseCalendar(input);

calendar.events = calendar.events
  .filter(withKeyword("standup"))
  .filter(onDays([WeekDay.MONDAY, WeekDay.WEDNESDAY, WeekDay.FRIDAY]));

const output = writeCalendar(calendar);
output.pipe(process.stdout);
```
