Calendar Grep
=============

Takes an ical file and lets you filter and modify it like grep or sed do.

Sometimes a big shared group event calendar might be full of stuff you may or may not be interested in. You may like to add it to your personal calendar, but it would obscure all your existing events with stuff that doesn't interest you.

**Example:**
```
cat my_complicated_mess_calendar.ical |calgrep "Thursday" > events_with_Thursday.ical
```

