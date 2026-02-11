import { Readable } from "node:stream";
import { text } from "node:stream/consumers";

export async function main(input: Readable): Promise<void> {
  const content = await text(input);
  console.log(content);
}
