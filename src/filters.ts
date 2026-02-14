import { VEvent, VEventField, WeekDay } from "./types.js";

const TEXT_FIELDS: VEventField[] = [VEventField.SUMMARY, VEventField.DESCRIPTION];

export function withKeyword(keyword: string): (event: VEvent) => boolean {
  const lowerKeyword = keyword.toLowerCase();

  return (event: VEvent) => {
    for (const field of TEXT_FIELDS) {
      const value = event.properties.get(field);
      if (value && value.toLowerCase().includes(lowerKeyword)) {
        return true;
      }
    }
    return false;
  };
}

const DAY_INDEX: Record<WeekDay, number> = {
  [WeekDay.SUNDAY]: 0,
  [WeekDay.MONDAY]: 1,
  [WeekDay.TUESDAY]: 2,
  [WeekDay.WEDNESDAY]: 3,
  [WeekDay.THURSDAY]: 4,
  [WeekDay.FRIDAY]: 5,
  [WeekDay.SATURDAY]: 6,
};

function parseICalTimestamp(value: string): Date {
  // Handles formats like 20260113T030000Z or 20260113T030000
  const year = parseInt(value.substring(0, 4));
  const month = parseInt(value.substring(4, 6)) - 1;
  const day = parseInt(value.substring(6, 8));
  const hour = parseInt(value.substring(9, 11));
  const minute = parseInt(value.substring(11, 13));
  const second = parseInt(value.substring(13, 15));

  if (value.endsWith("Z")) {
    return new Date(Date.UTC(year, month, day, hour, minute, second));
  }
  return new Date(year, month, day, hour, minute, second);
}

export function onDays(days: WeekDay[]): (event: VEvent) => boolean {
  const dayNumbers = new Set(days.map((d) => DAY_INDEX[d]));

  return (event: VEvent) => {
    const dtstart = event.properties.get(VEventField.DTSTART);
    if (!dtstart) return false;

    const date = parseICalTimestamp(dtstart);
    return dayNumbers.has(date.getDay());
  };
}
