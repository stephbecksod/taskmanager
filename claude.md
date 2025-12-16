# Claude Reference File

## Project Status (Last Updated: 2025-12-15)

### ✅ Completed Features
- Task CRUD operations (Create, Read, Update, Delete)
- Category-based organization
- Drag-and-drop reordering within categories
- 3-second completion delay with undo capability
- Two-tab interface (To-Do and Completed)
- Completed tasks grouped by day (most recent first)
- Inline editing (click task title)
- Delete button (X) visible only in edit mode
- Persistent localStorage
- Responsive design

### 🐛 Bugs Fixed
1. **Delete button not working** - Fixed by using `mousedown` event with capture phase instead of `click`
2. **Task text layout cramped** - Fixed flexbox properties and delete button sizing
3. **Task cards too large** - Reverted padding changes, kept word-wrap

### 🔍 Known Issues
- None currently identified

### 📋 Future Enhancements (Not Yet Implemented)
- Dark mode
- Task priorities
- Due dates
- Search/filter
- Export/import data
- Recurring tasks

## Key Technical Decisions

### 1. UUID Generation
Use simple client-side UUID v4 generator (no external library)

### 2. State Management
Load from localStorage → modify → save → re-render pattern

### 3. Event Handling
Event delegation on document for dynamic elements

### 4. Rendering
Template literals with manual DOM manipulation (sufficient for this scale)

### 5. CSS Framework
Pico CSS for clean defaults without class bloat

### 6. Responsive Design
Mobile-first approach with touch-friendly drag targets

### 7. Tab System
Simple show/hide with CSS classes, no routing library needed

### 8. Completion Delay
Use setTimeout with task ID tracking to allow undo within 3 seconds

### 9. Drag-and-Drop
HTML5 native API (dragstart, dragover, drop events)

## Data Model Reference

### Task Object Structure
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

## Critical Implementation Behaviors

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

### Edit Mode
- Click task title to enter edit mode
- Delete button (X icon) only appears during edit mode
- Save on blur or Enter, cancel on Escape
- Confirmation dialog before deletion

### Drag-and-Drop
- Only method for reordering tasks (no up/down arrows)
- Visual feedback during drag (opacity, border indicators)
- Update order values when task is dropped in new position
- Works by dragging task to desired position within category

## Critical Findings & Learnings

### Delete Button Issue (RESOLVED)
**Problem**: Delete button in edit mode wasn't responding to clicks, even though it was visible and in the DOM.

**Root Cause**: The `blur` event on contentEditable elements fires before `click` events, causing the edit mode to exit before the delete click could be processed.

**Solution**: Changed from `click` event to `mousedown` event with capture phase:
```javascript
document.addEventListener('mousedown', (e) => {
  const deleteButton = e.target.closest('.task-delete');
  if (deleteButton) {
    e.preventDefault();
    e.stopPropagation();
    // handle delete
  }
}, true); // true = capture phase
```

**Why This Works**:
- `mousedown` fires before `blur`
- Capture phase (third parameter = true) catches event before it reaches target
- Using `e.target.closest('.task-delete')` catches clicks on button OR children (like the ✕ text)

**Key Lesson**: When dealing with contentEditable and buttons, use `mousedown` with capture phase to avoid blur interference.

### CSS Display vs Visibility
**Finding**: Elements with `visibility: hidden` cannot receive pointer events, even though they occupy space.

**Solution**: Use `display: none` / `display: block` for hiding/showing interactive elements instead of `opacity` or `visibility`.

### Flexbox Text Layout
**Finding**: Flex items need proper constraints to expand correctly:
- `flex-shrink: 0` on fixed-width items (checkbox, buttons)
- `flex-grow: 1` on expanding items (task text)
- `flex-basis: 0` to ensure equal distribution

## Git Commit Guidelines

CRITICAL: When committing to GitHub:
- All commits are authored by Steph
- NO references to "Claude Code", "AI-generated", "with assistance from Claude", or any AI tool mentions
- Commit messages describe what was changed, not how it was created
- Keep messages professional and clear
