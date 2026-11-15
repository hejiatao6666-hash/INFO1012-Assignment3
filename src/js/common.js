"use strict";

// The footer uses the device's local time; no location or network request is needed.
function updateClock() {
  const now = new Date();
  const formatted = new Intl.DateTimeFormat("en-AU", {
    weekday: "short", day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit", timeZoneName: "short"
  }).format(now);
  document.querySelectorAll("[data-clock]").forEach(function (clock) {
    clock.dateTime = now.toISOString();
    clock.textContent = formatted;
  });
}
updateClock();
setInterval(updateClock, 1000);
