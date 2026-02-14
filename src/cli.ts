#!/usr/bin/env node
import { pipeline } from "node:stream/promises";
import { main } from "./index.js";

const args = process.argv.slice(2);

// Non-flag arguments are treated as keyword filters (like grep)
const keywords = args.filter((arg) => !arg.startsWith("-"));

(async () => {
  const output = await main(process.stdin, keywords);
  await pipeline(output, process.stdout);
})();
