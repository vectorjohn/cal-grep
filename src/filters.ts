import { VEvent, VEventField } from "./types.js";

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
