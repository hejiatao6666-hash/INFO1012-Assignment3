# Studyline: requirement and evidence map

This guide maps the assignment specifications to the project files and the evidence used to check them. File references identify where a feature can be inspected; a screenshot illustrates one state and does not replace testing the live interaction.

Project: **Studyline** · Author: **He Jiatao** · Course: **INFO1012 — Information Technology Systems**

Repository: <https://github.com/hejiatao6666-hash/INFO1012-Assignment3>

## Connected pages and home page

| Specification | Implementation | Evidence or check |
| --- | --- | --- |
| Multiple connected pages | [Home](../src/html/index.html), [My tasks](../src/html/tasks.html), [Development](../src/html/blog.html), [Ethics & privacy](../src/html/ethics.html) | Follow all four navigation links from each page; check that the current page is marked in navigation. |
| Main heading showing the application name | `h1#app-title` in [home HTML](../src/html/index.html) | [Home desktop screenshot](../assets/screenshots/home-desktop.jpg). |
| At least three relevant images | Three local photographs in [assets/images](../assets/images), used by [home HTML](../src/html/index.html) | Study desk, writing and books photographs. Sources are listed in [credits](../assets/CREDITS.md). |
| A button to change or cycle images | `#next-image` and thumbnail controls, handled by [home.js](../src/js/home.js) | Select **Next image** three times and check that image one returns. Select each thumbnail and check the image, alternative text, caption and selected state. |
| About the App | `#about-app-title` section in [home HTML](../src/html/index.html) | Purpose, organisational benefit and specific supported features. |
| About Me | `#about-me-title` section in [home HTML](../src/html/index.html) | Personal introduction, current studies, interests and a stated study routine. |
| Professional, consistent CSS | Shared [style.css](../src/css/style.css), shared navigation/footer markup | [Home desktop](../assets/screenshots/home-desktop.jpg), [task desktop](../assets/screenshots/tasks-desktop.jpg), and [task mobile](../assets/screenshots/tasks-mobile.jpg). |

## Task manager and JavaScript

| Specification | Implementation | Evidence or check |
| --- | --- | --- |
| Basic login with at least one username and password | Login form in [tasks.html](../src/html/tasks.html); session handling in [tasks.js](../src/js/tasks.js) | [Login screenshot](../assets/screenshots/login.jpg). Use `student` / `Study2026!`; reject blank or incorrect credentials. Open the task page directly in a fresh session and confirm that the workspace remains hidden. |
| Create a task with title, course code/name, due date, description and notes | `#task-form` and its labelled fields in [tasks.html](../src/html/tasks.html); submit handler and `validateTask` in [tasks.js](../src/js/tasks.js) | Create a task and verify every saved field in the list. [Desktop evidence](../assets/screenshots/tasks-desktop.jpg). Notes are optional; the other fields are required. |
| Update and save an existing task | `editingId`, `updateTaskById`, edit event handler and save handler in [tasks.js](../src/js/tasks.js) | Edit title, course and date; save and check the same task. Check that changing date order does not edit a different task. |
| Cancel an edit safely | `#cancel-edit` and `resetEditor` in [tasks.js](../src/js/tasks.js) | Change a field, select **Cancel editing**, and verify that the saved record is unchanged. |
| Delete with a confirmation dialog | Native `dialog#delete-dialog` in [tasks.html](../src/html/tasks.html) and its close handler in [tasks.js](../src/js/tasks.js) | [Delete confirmation](../assets/screenshots/delete-confirmation.jpg). **Keep task** and Escape preserve the task; **Delete task** removes it. |
| View all tasks in an organised format | `renderTasks` and `orderTasks` in [tasks.js](../src/js/tasks.js); ordered task list in [tasks.html](../src/html/tasks.html) | All saved fields appear; tasks are ordered by due date. [Desktop](../assets/screenshots/tasks-desktop.jpg) and [mobile](../assets/screenshots/tasks-mobile.jpg) evidence. |
| Validate required fields and provide errors | `validateTask`, `setTaskErrors`, form submission and login checks in [tasks.js](../src/js/tasks.js) | Submit blank or whitespace-only required fields; check field-specific errors and first-error focus. Review the validation cases in [tests](../tests/task-logic.test.cjs). |
| Reject invalid dates | `isRealDate` in [tasks.js](../src/js/tasks.js) | Tests cover impossible dates and Gregorian leap-year boundaries. Past real dates remain allowed for overdue work. |
| Validate input length and course code | Limits and course-code checks in [tasks.js](../src/js/tasks.js); corresponding `maxlength` attributes in [tasks.html](../src/html/tasks.html) | Title 100; code 20; course name 120; description/notes 1,000. Course codes are saved in uppercase. |
| Current date and time at the bottom | Footer `<time data-clock>` in [tasks.html](../src/html/tasks.html); [common.js](../src/js/common.js) | Scroll to the footer and observe the seconds updating. Formatting uses the device's local time zone. |
| Preserve tasks after refresh | `readTasks` and `saveTasks` in [tasks.js](../src/js/tasks.js) | Refresh and log in again if needed; task details remain in the same browser profile and origin. |
| Explain decisions and logic in code | Comments near calendar validation, stable identifiers, sorting, storage, rendering, gallery and clock behaviour | Read [tasks.js](../src/js/tasks.js), [home.js](../src/js/home.js), [common.js](../src/js/common.js), HTML and [CSS](../src/css/style.css). |

## Project plan and troubleshooting blog

| Specification | Implementation | Evidence or check |
| --- | --- | --- |
| Research Agile and explain relevant choices | [Development page](../src/html/blog.html) | Inspect the Agile discussion, its project-specific reasoning and linked sources. |
| Clearly structured three-week plan in a table | [Development page](../src/html/blog.html) | The proposed plan covers Planning, Analysis, Design, Implementation, and Testing and Maintenance. A proposed schedule is distinguished from actual development history. |
| At least two development errors | Troubleshooting records in [Development page](../src/html/blog.html) | Each record should identify the actual failed check, cause, repair and verification. |
| Discovery date/time, error screenshot and faulty code for each error | [Development page](../src/html/blog.html) | [Issue 1 before](../assets/screenshots/issue-1-before.jpg), [Issue 2 before](../assets/screenshots/issue-2-before.jpg), and the adjacent dated descriptions and code blocks. |
| Resolution date/time, working screenshot and corrected code for each error | [Development page](../src/html/blog.html) | [Issue 1 after](../assets/screenshots/issue-1-after.jpg), [Issue 2 after](../assets/screenshots/issue-2-after.jpg), and the adjacent dated explanations and corrected code. |
| Explain causes, fixes and references | [Development page](../src/html/blog.html) | Check the explanation and source links for each record rather than relying on the screenshots alone. |
| Correctly formatted code snippets | `<pre><code>` blocks in [Development page](../src/html/blog.html) | Check indentation, escaping and readability at desktop and mobile widths. |

## Ethics and privacy

| Specification | Implementation | Evidence or check |
| --- | --- | --- |
| Discuss ethical data use | [Ethics & privacy](../src/html/ethics.html) | Specific discussion of limited collection, clear feedback, user control and responsible treatment of task content. |
| Discuss data privacy | [Ethics & privacy](../src/html/ethics.html) and browser-storage notices on [My tasks](../src/html/tasks.html) | Explain local task storage, session storage, deletion, shared-device exposure and the absence of server upload. |
| Give implemented examples | [tasks.js](../src/js/tasks.js) | Validation before saving, text-only rendering, confirmation before deletion, and a demonstration session marker rather than a saved password. |
| Reflect accurately on limitations | [Ethics & privacy](../src/html/ethics.html) and [README data handling](../README.md#data-handling-and-limitations) | State that storage is not encrypted, logout does not delete tasks, and front-end credentials do not provide production authentication. |
| Use relevant research | References on [Ethics & privacy](../src/html/ethics.html) | OWASP guidance supports the discussion of browser storage, without claiming formal certification or full legal compliance. |

## Repository, Markdown and submission

| Specification | Implementation or location | Check |
| --- | --- | --- |
| Separate folders for HTML, CSS and JavaScript | [src/html](../src/html), [src/css](../src/css), [src/js](../src/js) | All four pages load their CSS and scripts successfully from the supplied structure. |
| Project title, description, installation/run and usage instructions | [README](../README.md) | Follow the instructions from a newly extracted ZIP. No application package installation is required. |
| Screenshot of the task page and its features | [README](../README.md) and [screenshots](../assets/screenshots) | Screenshots cover home desktop/mobile, login, task desktop/mobile views and deletion confirmation. |
| Credits and a chosen licence | [README credits](../README.md#credits-and-references), [image credits](../assets/CREDITS.md), [MIT licence](../LICENSE) | The original code licence is distinguished from the photographs' original terms. |
| Repository URL in the submitted ZIP | Repository URL at the start of [README](../README.md) | Verify the final URL opens the intended repository and that this README is present in the downloaded archive. |
| Final repository files and ZIP match | Final pushed repository and its downloaded archive | Push the final changes, download **Code → Download ZIP**, inspect the archive and upload that archive under the assignment notice labelled **“updated 15/11/2026”**. |

## Verification record and remaining review

Run the independent task-logic checks with:

```sh
node --test tests/task-logic.test.cjs
```

**Recorded on 15 November 2026:** all **7 of 7** task-logic tests passed. The following browser checks also passed:

| Area | Observed checks |
| --- | --- |
| Access and validation | The unauthenticated task page showed the login interface; an incorrect password was rejected; the sample account opened the workspace. Every required task field produced an error when omitted. Uppercase expansion beyond the course-code limit and an invisible-only title were rejected. |
| Task creation and editing | Two tasks were created and ordered by due date. Editing one task's date reordered that task while leaving the other unchanged. Cancelling an edit preserved the saved value. |
| Persistence and deletion | Saved tasks survived refresh. **Keep task** and Escape preserved the selected task; confirmed deletion removed only that task. Logout followed by login retained the saved tasks. |
| Text rendering | Sample `<img>` and `<script>` content appeared as text, without creating those DOM elements. |
| Gallery and clock | **Next image** cycled from 2/3 to 3/3 to 1/3; thumbnail selection also worked. The footer clock updated each second. |
| Narrow screens | Home and tasks were checked at a 390-pixel viewport with no horizontal page overflow. See [home mobile](../assets/screenshots/home-mobile.jpg) and [tasks mobile](../assets/screenshots/tasks-mobile.jpg). |

Local integration review also passed for the development and privacy pages, navigation between all four pages, the privacy-section link, and local file and image links. All four pages were reviewed at desktop and 390-pixel mobile widths. The input boundaries were darkened for contrast, and the four evidence images reserve their dimensions during loading. Screenshots document observed states; Canvas upload is a separate submission step.
