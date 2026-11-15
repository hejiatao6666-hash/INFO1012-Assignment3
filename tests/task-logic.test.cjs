/* Node's built-in runner checks calendar boundaries, validation and stable-id updates. */
const test = require("node:test");
const assert = require("node:assert/strict");
const { isRealDate, validateTask, orderTasks, updateTaskById, localDateKey } = require("../src/js/tasks.js");

const valid = {
  title: "Complete Assignment 3", courseCode: "INFO1012", courseName: "Information Technology Systems",
  dueDate: "2026-11-15", description: "Test the study task manager.", notes: ""
};

test("calendar validation rejects impossible dates and handles Gregorian leap years", () => {
  for (const value of ["", "2026-02-29", "2026-02-30", "1900-02-29", "2026-04-31", "2026-00-01", "2026-13-01", "2026-01-00", "0000-01-01", "2026-1-01", "not-a-date"]) {
    assert.equal(isRealDate(value), false, value);
  }
  for (const value of ["2024-02-29", "2000-02-29", "2026-11-15", "0001-01-01", "9999-12-31"]) {
    assert.equal(isRealDate(value), true, value);
  }
});

test("required text rejects whitespace; notes remain optional; past dates are valid", () => {
  assert.equal(validateTask({ ...valid, dueDate: "2020-01-01" }).valid, true);
  for (const field of ["title", "courseCode", "courseName", "description"]) {
    const result = validateTask({ ...valid, [field]: "   " });
    assert.equal(result.valid, false, field);
    assert.ok(result.errors[field]);
  }
  assert.equal(validateTask({ ...valid, notes: "   " }).data.notes, "");
});

test("validation normalises text and rejects excessive length or control characters", () => {
  const result = validateTask({ ...valid, title: "  A task  ", courseCode: " info1012 " });
  assert.equal(result.data.title, "A task");
  assert.equal(result.data.courseCode, "INFO1012");
  assert.equal(validateTask({ ...valid, title: "x".repeat(101) }).valid, false);
  assert.equal(validateTask({ ...valid, notes: "x".repeat(1001) }).valid, false);
  assert.equal(validateTask({ ...valid, courseCode: "<script>" }).valid, false);
  assert.equal(validateTask({ ...valid, description: "bad\u0000text" }).valid, false);
});

test("course-code length is checked after case normalisation", () => {
  const result = validateTask({ ...valid, courseCode: "ß".repeat(20) });
  assert.equal(result.valid, false, "uppercasing must not bypass the 20-character limit");
  assert.ok(result.errors.courseCode);
});

test("required text cannot consist only of invisible formatting characters", () => {
  for (const field of ["title", "courseName", "description"]) {
    const result = validateTask({ ...valid, [field]: "\u200B" });
    assert.equal(result.valid, false, `${field} needs visible content`);
    assert.ok(result.errors[field]);
  }
  assert.equal(validateTask({ ...valid, title: "Review 👩‍💻 coding notes" }).valid, true,
    "a joiner within meaningful text must remain usable");
});

test("date ordering is stable and editing uses an id rather than the displayed index", () => {
  const tasks = [{ id: "later", ...valid, dueDate: "2026-12-01" }, { id: "earlier", ...valid, dueDate: "2026-11-01" }];
  assert.equal(orderTasks(tasks)[0].id, "earlier");
  assert.equal(tasks[0].id, "later", "display sorting does not mutate storage order");
  const updated = updateTaskById(tasks, "earlier", { ...valid, title: "Edited task" });
  assert.equal(updated.find(task => task.id === "earlier").title, "Edited task");
  assert.equal(updated.find(task => task.id === "later").title, valid.title);
  assert.throws(() => updateTaskById(tasks, "missing", valid), /no longer exists/);
});

test("local date key uses the browser calendar rather than a UTC conversion", () => {
  assert.equal(localDateKey(new Date(2026, 10, 15, 0, 5)), "2026-11-15");
  assert.equal(localDateKey(new Date(2026, 0, 1, 23, 59)), "2026-01-01");
});
