#!/usr/bin/env node
import { pipeline } from "node:stream/promises";
import { main } from "./index.js";
import { parseArgs } from "./args.js";

const HELP_TEXT = `Usage: calpipe [options] [keyword...]

Filter iCal events from stdin and output matching events to stdout.

Options:
  -v          Invert match (exclude matching events)
  -d DAYS     Filter by day of week (comma-separated, e.g. mon,wed,fri)
  -h          Show this help message

Examples:
  cat cal.ics | calpipe "Monday Ride"
  cat cal.ics | calpipe -v "CANCELLED"
  cat cal.ics | calpipe -d mon,wed,fri
  cat cal.ics | calpipe -d tuesday "Bike Ride"`;

const args = parseArgs(process.argv.slice(2));

if (args.help) {
  console.log(HELP_TEXT);
  process.exit(0);
}

(async () => {
  const output = await main(process.stdin, args);
  await pipeline(output, process.stdout);
})();
