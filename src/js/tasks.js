/* Validate with pure functions; update the interface only after browser storage succeeds. */
(function () {
  "use strict";

  const STORAGE_KEY = "studyline.tasks.v1";
  const SESSION_KEY = "studyline.demo-session";
  const LIMITS = { title: 100, courseCode: 20, courseName: 120, description: 1000, notes: 1000 };

  function isRealDate(value) {
    // Date.parse can normalise 30 February into March instead of rejecting an impossible date.
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const [year, month, day] = value.split("-").map(Number);
    if (year < 1 || month < 1 || month > 12 || day < 1) return false;
    const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return day <= days[month - 1];
  }

  function validateTask(raw) {
    const data = {};
    const errors = {};
    for (const [field, limit] of Object.entries(LIMITS)) {
      data[field] = typeof raw[field] === "string" ? raw[field].trim() : "";
      // Normalise before checking length: Unicode case conversion can increase the character count.
      if (field === "courseCode") data[field] = data[field].toUpperCase();
      // Format-only text can look empty even when trim() leaves a non-empty string.
      const hasVisibleText = /[^\s\p{Cf}]/u.test(data[field]);
      if (field !== "notes" && !hasVisibleText) errors[field] = "This field is required. Enter visible text.";
      else if (data[field].length > limit) errors[field] = `Use ${limit} characters or fewer.`;
      else if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(data[field])) {
        errors[field] = "Remove unsupported control characters.";
      }
    }
    if (data.courseCode && !errors.courseCode && !/^[A-Z0-9][A-Z0-9 -]*$/.test(data.courseCode)) {
      errors.courseCode = "Use letters, numbers, spaces or hyphens for the course code.";
    }
    data.dueDate = typeof raw.dueDate === "string" ? raw.dueDate.trim() : "";
    if (!isRealDate(data.dueDate)) errors.dueDate = "Enter a real due date, including the day, month and year.";
    return { data, errors, valid: Object.keys(errors).length === 0 };
  }

  function orderTasks(tasks) {
    // ISO calendar dates sort lexically. Copy first so display sorting cannot mutate stored order.
    return [...tasks].sort((a, b) => a.dueDate.localeCompare(b.dueDate) || a.title.localeCompare(b.title) || a.id.localeCompare(b.id));
  }

  function updateTaskById(tasks, id, data) {
    // A stable id prevents the displayed sort order from changing which task is edited.
    if (!tasks.some(task => task.id === id)) throw new Error("The task no longer exists.");
    return tasks.map(task => task.id === id ? { ...data, id } : task);
  }

  function localDateKey(now = new Date()) {
    return `${String(now.getFullYear()).padStart(4, "0")}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  }

  const logic = { isRealDate, validateTask, orderTasks, updateTaskById, localDateKey };
  if (typeof module !== "undefined" && module.exports) module.exports = logic;
  if (typeof document === "undefined") return;

  const byId = id => document.getElementById(id);
  const loginSection = byId("login-section");
  const taskSection = byId("task-section");
  const taskForm = byId("task-form");
  const loginForm = byId("login-form");
  const list = byId("task-list");
  const dialog = byId("delete-dialog");
  let tasks = [];
  let editingId = null;
  let deletingId = null;
  let deleteTrigger = null;
  let storageReady = true;

  function notice(message) {
    byId("storage-message").textContent = message;
    byId("storage-message").hidden = !message;
  }

  function readTasks() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed = saved === null ? [] : JSON.parse(saved);
      if (!Array.isArray(parsed)) throw new Error("Unexpected saved data.");
      const ids = new Set();
      for (const task of parsed) {
        if (!task || typeof task.id !== "string" || !task.id || ids.has(task.id) || !validateTask(task).valid) {
          throw new Error("Invalid saved task.");
        }
        ids.add(task.id);
      }
      storageReady = true;
      notice("");
      return parsed;
    } catch (error) {
      // Preserve unreadable saved data rather than overwriting it with an empty list.
      storageReady = false;
      notice("Saved tasks could not be read. Your stored data has not been overwritten. Check browser storage permissions or use a fresh browser profile for this demonstration.");
      return [];
    }
  }

  function saveTasks(nextTasks) {
    if (!storageReady) return false;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextTasks));
      tasks = nextTasks;
      notice("");
      return true;
    } catch (error) {
      notice("Your changes could not be saved. Check this browser's storage permission or available space, then try again. The form has been kept.");
      return false;
    }
  }

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function renderTasks() {
    list.replaceChildren();
    const ordered = orderTasks(tasks);
    byId("empty-state").hidden = ordered.length !== 0;
    byId("task-count").textContent = `${ordered.length} ${ordered.length === 1 ? "task" : "tasks"}`;
    for (const task of ordered) {
      const item = element("li", "task-item");
      const heading = element("div", "task-item-heading");
      heading.append(element("h3", "", task.title));
      const time = element("time", "due-date", task.dueDate);
      time.dateTime = task.dueDate;
      heading.append(time);
      item.append(heading, element("p", "task-course", `${task.courseCode} · ${task.courseName}`));
      const state = task.dueDate < localDateKey() ? "Overdue" : task.dueDate === localDateKey() ? "Due today" : "Upcoming";
      item.append(element("p", `task-state${state === "Overdue" ? " is-overdue" : ""}`, state));
      const details = element("dl", "task-details");
      details.append(element("dt", "", "Description"), element("dd", "", task.description));
      details.append(element("dt", "", "Additional notes"), element("dd", "", task.notes || "No additional notes."));
      item.append(details);
      const actions = element("div", "task-actions");
      for (const [action, label] of [["edit", "Edit"], ["delete", "Delete"]]) {
        const button = element("button", `button ${action === "delete" ? "button-danger-outline" : "button-secondary"}`, label);
        button.type = "button";
        button.dataset.action = action;
        button.dataset.id = task.id;
        button.setAttribute("aria-label", `${label} task: ${task.title}`);
        actions.append(button);
      }
      item.append(actions);
      list.append(item);
    }
  }

  function setTaskErrors(errors) {
    for (const field of [...Object.keys(LIMITS), "dueDate"]) {
      const input = taskForm.elements.namedItem(field);
      byId(`${field}-error`).textContent = errors[field] || "";
      if (errors[field]) input.setAttribute("aria-invalid", "true");
      else input.removeAttribute("aria-invalid");
    }
  }

  function resetEditor() {
    editingId = null;
    taskForm.reset();
    setTaskErrors({});
    byId("editor-heading").textContent = "Add a study task";
    byId("save-task").textContent = "Add task";
    byId("cancel-edit").hidden = true;
  }

  function showWorkspace(focus) {
    loginSection.hidden = true;
    taskSection.hidden = false;
    byId("logout-button").hidden = false;
    tasks = readTasks();
    renderTasks();
    if (focus) byId("task-title").focus();
  }

  loginForm.addEventListener("submit", event => {
    event.preventDefault();
    const username = byId("username").value.trim();
    const password = byId("password").value;
    const errors = {
      username: !username ? "Enter the demonstration username." : username.length > 80 ? "Use 80 characters or fewer." : "",
      password: !password ? "Enter the demonstration password." : password.length > 128 ? "Use 128 characters or fewer." : ""
    };
    for (const field of ["username", "password"]) {
      byId(`${field}-error`).textContent = errors[field];
      if (errors[field]) byId(field).setAttribute("aria-invalid", "true");
      else byId(field).removeAttribute("aria-invalid");
    }
    byId("login-message").textContent = "";
    const invalid = Object.keys(errors).find(field => errors[field]);
    if (invalid) return byId(invalid).focus();
    if (username !== "student" || password !== "Study2026!") {
      byId("login-message").textContent = "The username or password is incorrect. Check the demonstration login details below.";
      byId("password").focus();
      return;
    }
    try {
      // Store only a demonstration session marker, never the password.
      sessionStorage.setItem(SESSION_KEY, "student");
      loginForm.reset();
      showWorkspace(true);
    } catch (error) {
      byId("login-message").textContent = "This browser cannot save a login session. Allow browser storage and try again.";
    }
  });

  byId("logout-button").addEventListener("click", () => {
    sessionStorage.removeItem(SESSION_KEY);
    resetEditor();
    list.replaceChildren();
    tasks = [];
    byId("task-message").textContent = "";
    taskSection.hidden = true;
    loginSection.hidden = false;
    byId("logout-button").hidden = true;
    byId("username").focus();
  });

  taskForm.addEventListener("submit", event => {
    event.preventDefault();
    byId("task-message").textContent = "";
    const raw = Object.fromEntries(new FormData(taskForm).entries());
    const result = validateTask(raw);
    setTaskErrors(result.errors);
    if (!result.valid) {
      taskForm.elements.namedItem(Object.keys(result.errors)[0]).focus();
      byId("task-message").textContent = "Task not saved. Check the highlighted fields.";
      return;
    }
    // Read the current list before writing so another tab's added tasks are not lost.
    const current = readTasks();
    let next;
    if (editingId) {
      try {
        next = updateTaskById(current, editingId, result.data);
      } catch (error) {
        byId("task-message").textContent = "This task was removed in another tab. Cancel editing and add it as a new task if needed.";
        return;
      }
    } else {
      const id = typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      next = [...current, { id, ...result.data }];
    }
    const wasEditing = editingId !== null;
    if (saveTasks(next)) {
      resetEditor();
      renderTasks();
      byId("task-message").textContent = wasEditing ? "Task updated and saved in this browser." : "Task added and saved in this browser.";
      byId("task-title").focus();
    }
  });

  byId("cancel-edit").addEventListener("click", () => {
    resetEditor();
    byId("task-message").textContent = "Editing cancelled. The saved task has not changed.";
    byId("task-title").focus();
  });

  list.addEventListener("click", event => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    const task = tasks.find(item => item.id === button.dataset.id);
    if (!task) return;
    if (button.dataset.action === "edit") {
      editingId = task.id;
      for (const field of [...Object.keys(LIMITS), "dueDate"]) taskForm.elements.namedItem(field).value = task[field];
      setTaskErrors({});
      byId("editor-heading").textContent = "Edit study task";
      byId("save-task").textContent = "Save changes";
      byId("cancel-edit").hidden = false;
      byId("task-message").textContent = `Editing “${task.title}”. Save changes to update this task.`;
      byId("task-title").focus();
    } else {
      deletingId = task.id;
      deleteTrigger = button;
      byId("delete-description").textContent = `“${task.title}” will be deleted.`;
      dialog.returnValue = "";
      dialog.showModal();
    }
  });

  dialog.addEventListener("close", () => {
    if (dialog.returnValue === "delete" && deletingId) {
      const current = readTasks();
      if (saveTasks(current.filter(task => task.id !== deletingId))) {
        if (editingId === deletingId) resetEditor();
        renderTasks();
        byId("task-message").textContent = "Task deleted from this browser.";
      }
    }
    deletingId = null;
    if (deleteTrigger && deleteTrigger.isConnected) deleteTrigger.focus();
    else byId("list-heading").focus();
    deleteTrigger = null;
  });

  window.addEventListener("storage", event => {
    if (event.key === STORAGE_KEY && !taskSection.hidden) {
      tasks = readTasks();
      renderTasks();
      byId("task-message").textContent = "The task list was refreshed after a change in another tab.";
    }
  });

  try {
    if (sessionStorage.getItem(SESSION_KEY) === "student") showWorkspace(false);
  } catch (error) {
    byId("login-message").textContent = "Browser storage is unavailable. Allow storage to use this demonstration.";
  }
})();
