import { Readable } from "node:stream";
import { text } from "node:stream/consumers";

export async function main(input: Readable): Promise<Readable> {
  const content = await text(input);
  return Readable.from(content);
}
