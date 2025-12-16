# Task Manager Implementation Plan

## Overview
Build a simple, local task manager web application using vanilla HTML/CSS/JavaScript with localStorage for data persistence.

## Technology Stack
- **Frontend**: Vanilla HTML, CSS, JavaScript (no frameworks)
- **Styling**: Pico CSS (minimal, semantic CSS framework)
- **Storage**: localStorage API
- **Protocol**: Works with file:// or local HTTP server

## File Structure
```
task_manager/
├── index.html              # Main HTML structure
├── css/
│   ├── pico.min.css       # Pico CSS framework (download locally)
│   └── styles.css         # Custom styles
├── js/
│   ├── storage.js         # localStorage abstraction
│   ├── taskManager.js     # Core task management logic
│   ├── ui.js              # UI rendering and event handling
│   └── app.js             # Application initialization
└── README.md              # Documentation
```

## Data Model

### Task Object
```javascript
{
  id: "uuid-v4-string",
  title: "Task title",
  category: "Work",
  completed: false,
  createdAt: timestamp,
  completedAt: timestamp|null,
  order: 0
}
```

### localStorage Structure
```javascript
{
  tasks: [],
  categories: ["Personal", "Work", "Shopping"],
  settings: { defaultCategory: "Personal" }
}
```

## Core Features Implementation

### 1. Add Tasks
- Input field at top with category dropdown
- Generate UUID for new tasks
- Save to localStorage and update UI immediately
- Support Enter key and button click

### 2. Organize by Category
- Group tasks using Array.reduce()
- Display as collapsible category sections
- Show task count per category
- Sort tasks within category by order field

### 3. Reorder Tasks
- Implement drag-and-drop using HTML5 Drag and Drop API
- Visual feedback during drag (opacity, border indicators)
- Update order values when task is dropped in new position
- Works by dragging task to desired position within category
- Save and re-render on drop

### 4. Check Off Completion
- Checkbox interaction to toggle completed status
- When checked: set completedAt timestamp and save to localStorage
- Task remains visible for 3 seconds with visual styling (strikethrough, reduced opacity)
- During 3-second window: user can uncheck to cancel completion
- After 3 seconds: task disappears from To-Do tab and appears in Completed tab
- Use setTimeout to handle the 3-second delay and transition

### 5. Completed Tab
- Tab-based interface: "To-Do" tab and "Completed" tab
- Completed tab shows all completed tasks
- Order by completedAt timestamp (most recent first)
- Group tasks by day (e.g., "Today", "Yesterday", "Dec 12, 2025")
- Each day section shows tasks completed that day
- No motivational messages - clean, simple display

### 6. Edit Tasks
- Inline editing: click task title to make editable
- Allow editing title and category
- Save on blur or Enter, cancel on Escape
- When in edit mode: show delete button (X icon)
- Update localStorage

### 7. Delete Tasks
- Delete button (X icon) only visible during inline editing mode
- Clicking X shows confirmation dialog to prevent accidents
- On confirm: remove task from array and update localStorage
- Button hidden when not in edit mode

## UI Layout

### To-Do Tab View
```
┌─────────────────────────────────────┐
│       Task Manager                  │
│  [To-Do] [Completed]                │
├─────────────────────────────────────┤
│  [Add Task Input] [Category ▾]     │
│  [+ Add Task]                       │
├─────────────────────────────────────┤
│  ▼ Work (3 tasks)                   │
│    ☐ Task 1 (draggable)             │
│    ☐ Task 2 (draggable)             │
│                                     │
│  ▼ Personal (2 tasks)               │
│    ☐ Task 3 (draggable)             │
│    ☐ Task 4 (draggable)             │
└─────────────────────────────────────┘

Note: Clicking task title enables edit mode,
which shows [X] delete button
```

### Completed Tab View
```
┌─────────────────────────────────────┐
│       Task Manager                  │
│  [To-Do] [Completed]                │
├─────────────────────────────────────┤
│  ▼ Today                            │
│    ☑ Finished report                │
│    ☑ Replied to emails              │
│                                     │
│  ▼ Yesterday                        │
│    ☑ Grocery shopping               │
│                                     │
│  ▼ Dec 12, 2025                     │
│    ☑ Updated documentation          │
└─────────────────────────────────────┘
```

## Implementation Sequence

### Phase 1: Foundation (Files to create)
1. **index.html** - HTML skeleton with Pico CSS CDN link
2. **css/styles.css** - Custom task styling
3. **js/storage.js** - localStorage wrapper with error handling
4. **js/app.js** - Application initialization

### Phase 2: Core Task Management
5. **js/taskManager.js** - Task CRUD operations:
   - addTask(title, category)
   - toggleComplete(taskId)
   - deleteTask(taskId)
   - updateTask(taskId, updates)
   - getTasksByCategory()
   - generateUUID()

6. **js/ui.js** - UI rendering and events:
   - renderTasks()
   - renderCategory()
   - handleAddTask()
   - handleDelete()
   - bindEvents() with event delegation

### Phase 3: Advanced Features
7. **Task reordering** - Drag-and-drop with HTML5 API
8. **Inline editing** - Edit mode toggle, save, and show delete button
9. **Completed tab** - Tab switching, group by day, order by date
10. **3-second completion delay** - setTimeout logic to handle transition
11. **Category management** - Add/remove categories

### Phase 4: Polish
12. **Responsive design** - Mobile-friendly layout
13. **Accessibility** - ARIA labels, keyboard navigation
14. **Error handling** - localStorage quota, validation
15. **Visual polish** - Smooth transitions, drag feedback, tab styling

## Key Technical Decisions

1. **UUID Generation**: Use simple client-side UUID v4 generator (no external library)
2. **State Management**: Load from localStorage → modify → save → re-render pattern
3. **Event Handling**: Event delegation on document for dynamic elements
4. **Rendering**: Template literals with manual DOM manipulation (sufficient for this scale)
5. **CSS Framework**: Pico CSS for clean defaults without class bloat
6. **Responsive**: Mobile-first approach with touch-friendly drag targets
7. **Tab System**: Simple show/hide with CSS classes, no routing library needed
8. **Completion Delay**: Use setTimeout with task ID tracking to allow undo within 3 seconds
9. **Drag-and-Drop**: HTML5 native API (dragstart, dragover, drop events)

## Critical Files to Create/Modify

1. **index.html** - Tab structure (To-Do/Completed), Pico CSS integration, semantic HTML
2. **js/taskManager.js** - Business logic, data model, state management, completion delay handling
3. **js/storage.js** - localStorage abstraction with error handling
4. **js/ui.js** - Tab switching, DOM rendering, event delegation, drag-drop handling, edit mode
5. **js/app.js** - Initialize TaskManager and UI on DOMContentLoaded
6. **css/styles.css** - Tab styling, task appearance, edit mode states, drag-drop visual feedback, 3-second completion transition

## Testing Checklist
- [ ] Add task (Enter key and button)
- [ ] Toggle completion checkbox
- [ ] 3-second delay before task disappears (can uncheck during delay)
- [ ] Completed tasks appear in Completed tab
- [ ] Switch between To-Do and Completed tabs
- [ ] Drag-and-drop task reordering within categories
- [ ] Click task to enter edit mode
- [ ] Delete button (X) appears only in edit mode
- [ ] Delete with confirmation dialog
- [ ] Completed tab groups tasks by day
- [ ] Completed tab orders by date (most recent first)
- [ ] Page refresh (data persists)
- [ ] Mobile responsiveness (touch-friendly drag)
- [ ] 100+ tasks (performance)
- [ ] localStorage quota handling

## Success Criteria
- All tasks persist after page refresh
- Simple, clean UI using Pico CSS with tab navigation
- Tab switching works smoothly between To-Do and Completed views
- 3-second completion delay works correctly (can undo within window)
- Drag-and-drop reordering is smooth and intuitive
- Edit mode clearly shows delete option (X icon)
- Completed tab groups by day and orders correctly
- Works offline as local file
- Responsive on mobile and desktop
- All core features functional
- No external dependencies except Pico CSS

## Implementation Notes

### 3-Second Completion Behavior
When a user checks a task:
1. Checkbox becomes checked immediately
2. Task gets visual styling (strikethrough, fade)
3. completedAt timestamp is set and saved to localStorage
4. setTimeout is triggered for 3 seconds
5. During these 3 seconds:
   - User can uncheck the box to cancel completion
   - If unchecked: clear completedAt, clear timeout, remove styling
6. After 3 seconds (if not unchecked):
   - Task is removed from To-Do tab rendering
   - Task appears in Completed tab under appropriate day

### Tab System
- Two tabs: "To-Do" and "Completed"
- Active tab has different styling (highlight, underline, or Pico's active state)
- Switching tabs shows/hides corresponding content sections
- To-Do tab: shows incomplete tasks grouped by category
- Completed tab: shows completed tasks grouped by day (Today, Yesterday, specific dates)
- Add Task input only visible on To-Do tab
