export enum VEventField {
  SUMMARY = "SUMMARY",
  DESCRIPTION = "DESCRIPTION",
  LOCATION = "LOCATION",
  STATUS = "STATUS",
  UID = "UID",
  DTSTART = "DTSTART",
  DTEND = "DTEND",
  CREATED = "CREATED",
  DTSTAMP = "DTSTAMP",
  SEQUENCE = "SEQUENCE",
  URL = "URL",
  CONTACT = "CONTACT",
}

export enum WeekDay {
  SUNDAY = "sunday",
  MONDAY = "monday",
  TUESDAY = "tuesday",
  WEDNESDAY = "wednesday",
  THURSDAY = "thursday",
  FRIDAY = "friday",
  SATURDAY = "saturday",
}

export interface VEvent {
  properties: Map<string, string>;
}

export interface Calendar {
  properties: Map<string, string>;
  events: VEvent[];
}
