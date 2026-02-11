#!/usr/bin/env node
import { pipeline } from "node:stream/promises";
import { main } from "./index.js";

(async () => {
  const output = await main(process.stdin);
  await pipeline(output, process.stdout);
})();
