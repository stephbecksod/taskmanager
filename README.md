# Task Manager

A simple, local task manager web application built with vanilla HTML, CSS, and JavaScript. Features persistent storage using localStorage, drag-and-drop task reordering, and a clean, responsive interface.

**Status**: ✅ Fully functional - All core features implemented and tested
**Last Updated**: December 15, 2025

## Features

- **Add Tasks**: Quickly add tasks with categories
- **Organize by Category**: Tasks are grouped by category (Personal, Work, Shopping)
- **Drag-and-Drop Reordering**: Reorder tasks within categories by dragging
- **Smart Completion**: 3-second delay when checking off tasks (can undo during this time)
- **Two-Tab Interface**:
  - **To-Do Tab**: View and manage active tasks
  - **Completed Tab**: View completed tasks grouped by day
- **Inline Editing**: Click any task to edit it
- **Delete Tasks**: Delete button appears when editing (with confirmation)
- **Persistent Storage**: All data saved locally in your browser
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Quick Start

1. Open `index.html` in your web browser
2. Start adding tasks!

### Using a Local Server (Optional)

If you prefer to run a local server:

```bash
# Python 3
python -m http.server 8000

# Node.js (requires http-server)
npx http-server

# PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## How to Use

### Adding Tasks
1. Type your task in the input field
2. Select a category from the dropdown
3. Click "Add Task" or press Enter

### Completing Tasks
1. Click the checkbox next to a task
2. The task will be marked complete with strikethrough
3. You have 3 seconds to uncheck if you made a mistake
4. After 3 seconds, the task moves to the Completed tab

### Editing Tasks
1. Click on the task title to enter edit mode
2. The delete button (✕) will appear
3. Edit the text as needed
4. Press Enter or click outside to save
5. Press Escape to cancel

### Deleting Tasks
1. Click on a task to enter edit mode
2. Click the ✕ button
3. Confirm the deletion

### Reordering Tasks
- Drag and drop tasks within the same category to reorder them

### Viewing Completed Tasks
- Click the "Completed" tab to see all completed tasks
- Tasks are grouped by day (Today, Yesterday, specific dates)
- Most recent completions appear first

## Technical Details

- **Framework**: None (Vanilla JavaScript)
- **Styling**: Pico CSS + custom styles
- **Storage**: localStorage
- **Data Persistence**: Automatic (no manual saving required)

## Browser Compatibility

Works in all modern browsers that support:
- localStorage
- HTML5 Drag and Drop API
- ES6 JavaScript

## Data Storage

All data is stored locally in your browser's localStorage. Your tasks will persist across browser sessions but are specific to:
- The browser you're using
- The domain/file path where the app is accessed

### Clearing Data

To reset all tasks, you can:
1. Clear your browser's localStorage for this site
2. Open browser console and run: `localStorage.clear()`

## Project Structure

```
task_manager/
├── index.html              # Main application page
├── css/
│   └── styles.css         # Custom styles
├── js/
│   ├── storage.js         # localStorage management
│   ├── taskManager.js     # Task business logic
│   ├── ui.js              # UI rendering and events
│   └── app.js             # Application initialization
├── README.md              # This file
└── task_manager_project_plan.md  # Detailed implementation plan
```

## Contributing

This is a personal project, but feel free to fork and modify for your own use!

## Development Notes

### Recent Bug Fixes (Dec 15, 2025)
- ✅ Fixed delete button not responding to clicks (switched to mousedown with capture phase)
- ✅ Fixed task text layout (proper flexbox constraints)
- ✅ Fixed task card sizing (reverted excessive padding)

### Testing Status
All features have been manually tested and verified working:
- [x] Add tasks with Enter key and button
- [x] Toggle task completion with 3-second undo window
- [x] Task completion moves to Completed tab after delay
- [x] Tab switching between To-Do and Completed
- [x] Drag-and-drop reordering within categories
- [x] Inline editing (click task title)
- [x] Delete button appears in edit mode and works correctly
- [x] Delete confirmation dialog
- [x] Completed tab groups by day and orders correctly
- [x] Data persists after page refresh
- [x] Responsive layout on different screen sizes

### For Developers
See `claude.md` for:
- Critical findings and learnings
- Key technical decisions
- Git commit guidelines

See `task_manager_project_plan.md` for:
- Complete implementation plan
- Data model details
- Feature specifications

## License

Free to use and modify as needed.
