export interface VEvent {
  properties: Map<string, string>;
}

export interface Calendar {
  properties: Map<string, string>;
  events: VEvent[];
}
