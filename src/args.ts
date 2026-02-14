import { WeekDay } from "./types.js";

export interface ParsedArgs {
  keywords: string[];
  invert: boolean;
  days: WeekDay[];
  help: boolean;
}

const DAY_LOOKUP: Record<string, WeekDay> = {
  sun: WeekDay.SUNDAY,
  sunday: WeekDay.SUNDAY,
  mon: WeekDay.MONDAY,
  monday: WeekDay.MONDAY,
  tue: WeekDay.TUESDAY,
  tuesday: WeekDay.TUESDAY,
  wed: WeekDay.WEDNESDAY,
  wednesday: WeekDay.WEDNESDAY,
  thu: WeekDay.THURSDAY,
  thursday: WeekDay.THURSDAY,
  fri: WeekDay.FRIDAY,
  friday: WeekDay.FRIDAY,
  sat: WeekDay.SATURDAY,
  saturday: WeekDay.SATURDAY,
};

function parseDays(value: string): WeekDay[] {
  return value.split(",").map((raw) => {
    const key = raw.trim().toLowerCase();
    const day = DAY_LOOKUP[key];
    if (!day) {
      throw new Error(
        `Invalid day: "${raw.trim()}". Valid values: ${Object.keys(DAY_LOOKUP).join(", ")}`,
      );
    }
    return day;
  });
}

export function parseArgs(argv: string[]): ParsedArgs {
  const result: ParsedArgs = {
    keywords: [],
    invert: false,
    days: [],
    help: false,
  };

  let i = 0;
  while (i < argv.length) {
    const arg = argv[i];

    if (arg === "-v") {
      result.invert = true;
    } else if (arg === "-h") {
      result.help = true;
    } else if (arg === "-d") {
      i++;
      if (i >= argv.length) {
        throw new Error("-d requires a comma-separated list of days (e.g. mon,wed,fri)");
      }
      result.days = parseDays(argv[i]);
    } else if (!arg.startsWith("-")) {
      result.keywords.push(arg);
    } else {
      throw new Error(`Unknown flag: ${arg}`);
    }

    i++;
  }

  return result;
}
